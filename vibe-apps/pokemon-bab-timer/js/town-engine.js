// 포켓몬 동네 (Pokemon Town) 인터랙티브 도트 필드 엔진
// 제미나이 생성 고화질 레트로 도트 마을 맵 렌더러 + 안전 이동 영역 한정
class TownEngine {
  constructor(canvasContainerId) {
    this.container = document.getElementById(canvasContainerId);
    this.canvas = null;
    this.ctx = null;
    this.entities = [];
    this.images = new Map();
    this.currentGen = 1;
    this.animationFrameId = null;
    this.lastTime = 0;
    this.selectedEntity = null;
    this.isDragging = false;
    this.dragOffset = { x: 0, y: 0 };
    this.onPokemonClickCallback = null;

    // 제미나이 생성 고화질 레트로 픽셀 마을 맵 배경
    this.bgImage = new Image();
    this.bgImage.src = 'img/town_bg.jpg';

    this.initCanvas();
  }

  initCanvas() {
    if (!this.container) return;
    // 기존 자식(인사 토스트)은 남겨 두고 캔버스만 맨 앞에 추가
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'town-canvas';
    this.container.prepend(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    this.resizeCanvas();
    // 화면 회전·전체 화면·탭 전환으로 크기가 바뀌면 다시 맞춤
    if (window.ResizeObserver) {
      new ResizeObserver(() => this.resizeCanvas()).observe(this.container);
    } else {
      window.addEventListener('resize', () => this.resizeCanvas());
    }

    this.setupInteractions();
    this.startLoop();
  }

  resizeCanvas() {
    if (!this.canvas || !this.container) return;
    const rect = this.container.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return; // 숨겨진 탭
    const prevW = this.width, prevH = this.height;
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.width = rect.width;
    this.height = rect.height;
    // 크기가 바뀌면 포켓몬 위치를 같은 비율로 옮겨 마당 안에 머물게
    if (prevW && prevH && (prevW !== this.width || prevH !== this.height)) {
      const sx = this.width / prevW, sy = this.height / prevH;
      for (const ent of this.entities) {
        ent.x *= sx; ent.y *= sy; ent.targetX *= sx; ent.targetY *= sy;
      }
    }
    // 마을 크기에 맞춰 포켓몬 크기 조절
    this.spriteSize = Math.round(Math.max(44, Math.min(76, Math.min(this.width, this.height) * 0.13)));
  }

  setGeneration(gen) {
    this.currentGen = gen;
  }

  // 포켓몬이 다닐 수 있는 넓은 중앙 광장 & 흙길 안전 영역 (외곽 건물/울타리 안쪽)
  getWalkableBounds() {
    const w = this.width || 600;
    const h = this.height || 400;
    return {
      minX: w * 0.16,
      maxX: w * 0.84,
      minY: h * 0.22,
      maxY: h * 0.82
    };
  }

  isPositionWalkable(x, y) {
    const b = this.getWalkableBounds();
    return (x >= b.minX && x <= b.maxX && y >= b.minY && y <= b.maxY);
  }

  getRandomWalkablePos() {
    const b = this.getWalkableBounds();
    return {
      x: b.minX + Math.random() * (b.maxX - b.minX),
      y: b.minY + Math.random() * (b.maxY - b.minY)
    };
  }

  syncPokemon(pokemonList) {
    const existingMap = new Map();
    this.entities.forEach(e => existingMap.set(e.instanceId, e));

    this.entities = pokemonList.map(item => {
      if (existingMap.has(item.instanceId)) {
        const ent = existingMap.get(item.instanceId);
        ent.pokemon = item;
        if (!this.isPositionWalkable(ent.x, ent.y)) {
          const safe = this.getRandomWalkablePos();
          ent.x = safe.x;
          ent.y = safe.y;
          ent.targetX = safe.x;
          ent.targetY = safe.y;
        }
        return ent;
      }

      const spawnPos = this.getRandomWalkablePos();
      const ent = {
        instanceId: item.instanceId,
        pokemon: item,
        x: spawnPos.x,
        y: spawnPos.y,
        targetX: spawnPos.x,
        targetY: spawnPos.y,
        size: 52,
        facing: Math.random() > 0.5 ? 1 : -1,
        state: 'idle',
        stateTimer: 1 + Math.random() * 2,
        jumpOffset: 0,
        heartTimer: 0
      };

      this.preloadImage(item.id);
      return ent;
    });
  }

  preloadImage(pokemonId) {
    if (this.images.has(pokemonId)) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = getPokemonAnimatedGifUrl(pokemonId);
    img.onerror = () => {
      img.src = getPokemonPixelSpriteUrl(pokemonId);
    };
    this.images.set(pokemonId, img);
  }

  setupInteractions() {
    const getPos = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    const handlePointerDown = (pos) => {
      const sorted = [...this.entities].sort((a, b) => b.y - a.y);
      for (const ent of sorted) {
        const dist = Math.hypot(ent.x - pos.x, (ent.y - ent.jumpOffset) - pos.y);
        if (dist <= (this.spriteSize || ent.size) * 0.7) {
          this.selectedEntity = ent;
          this.isDragging = true;
          this.dragOffset = { x: ent.x - pos.x, y: ent.y - pos.y };
          ent.state = 'happy';
          ent.heartTimer = 1.8;
          ent.jumpOffset = 16;
          sounds.playCry(ent.pokemon.id);
          if (this.onPokemonClickCallback) {
            this.onPokemonClickCallback(ent.pokemon);
          }
          break;
        }
      }
    };

    const handlePointerMove = (pos) => {
      if (this.isDragging && this.selectedEntity) {
        const b = this.getWalkableBounds();
        const nx = Math.max(b.minX, Math.min(b.maxX, pos.x + this.dragOffset.x));
        const ny = Math.max(b.minY, Math.min(b.maxY, pos.y + this.dragOffset.y));
        this.selectedEntity.x = nx;
        this.selectedEntity.y = ny;
        this.selectedEntity.targetX = nx;
        this.selectedEntity.targetY = ny;
      }
    };

    const handlePointerUp = () => {
      if (this.isDragging && this.selectedEntity) {
        if (!this.isPositionWalkable(this.selectedEntity.x, this.selectedEntity.y)) {
          const safe = this.getRandomWalkablePos();
          this.selectedEntity.x = safe.x;
          this.selectedEntity.y = safe.y;
          this.selectedEntity.targetX = safe.x;
          this.selectedEntity.targetY = safe.y;
        }
      }
      this.isDragging = false;
      this.selectedEntity = null;
    };

    this.canvas.addEventListener('mousedown', (e) => handlePointerDown(getPos(e)));
    window.addEventListener('mousemove', (e) => {
      if (this.isDragging) handlePointerMove(getPos(e));
    });
    window.addEventListener('mouseup', handlePointerUp);

    this.canvas.addEventListener('touchstart', (e) => handlePointerDown(getPos(e)), { passive: true });
    window.addEventListener('touchmove', (e) => {
      if (this.isDragging) handlePointerMove(getPos(e));
    }, { passive: true });
    window.addEventListener('touchend', handlePointerUp);
  }

  update(dt) {
    for (const ent of this.entities) {
      if (ent === this.selectedEntity && this.isDragging) continue;

      ent.stateTimer -= dt;
      if (ent.heartTimer > 0) ent.heartTimer -= dt;
      if (ent.jumpOffset > 0) ent.jumpOffset = Math.max(0, ent.jumpOffset - dt * 60);

      // AI 상태
      if (ent.stateTimer <= 0) {
        if (ent.state === 'idle') {
          if (Math.random() < 0.5) {
            const newTarget = this.getRandomWalkablePos();
            ent.state = 'walking';
            ent.stateTimer = 2.5 + Math.random() * 3.5;
            ent.targetX = newTarget.x;
            ent.targetY = newTarget.y;
            ent.facing = ent.targetX > ent.x ? 1 : -1;
          } else {
            ent.state = 'idle';
            ent.stateTimer = 2 + Math.random() * 4;
            if (Math.random() < 0.3) ent.facing = -ent.facing;
          }
        } else if (ent.state === 'walking' || ent.state === 'happy') {
          ent.state = 'idle';
          ent.stateTimer = 2 + Math.random() * 3;
          ent.jumpOffset = 0;
        }
      }

      // 이동
      if (ent.state === 'walking') {
        const dx = ent.targetX - ent.x;
        const dy = ent.targetY - ent.y;
        const dist = Math.hypot(dx, dy);

        if (dist > 6) {
          const speed = 30;
          ent.x += (dx / dist) * speed * dt;
          ent.y += (dy / dist) * speed * dt;
          ent.facing = dx >= 0 ? 1 : -1;
          ent.jumpOffset = Math.abs(Math.sin(Date.now() / 140)) * 6;
        } else {
          ent.state = 'idle';
          ent.stateTimer = 2;
          ent.jumpOffset = 0;
        }
      }
    }
  }

  draw() {
    if (!this.ctx) return;
    const w = this.width || 600;
    const h = this.height || 400;

    this.ctx.clearRect(0, 0, w, h);

    // 1. 제미나이 생성 고화질 픽셀 맵 배경 그리기
    this.drawBackground(w, h);

    // 2. 포켓몬 정렬 렌더링
    const sorted = [...this.entities].sort((a, b) => a.y - b.y);
    for (const ent of sorted) {
      this.drawPokemon(ent);
    }
  }

  drawBackground(w, h) {
    const ctx = this.ctx;
    if (this.bgImage && this.bgImage.complete && this.bgImage.naturalWidth > 0) {
      // 픽셀아트 맵을 캔버스 전체에 선명하게 렌더링
      const img = this.bgImage;
      const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const nw = img.naturalWidth * scale;
      const nh = img.naturalHeight * scale;
      const nx = (w - nw) / 2;
      const ny = (h - nh) / 2;

      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, nx, ny, nw, nh);

      // 세대별 은은한 대기 색감
      const tints = {
        1: 'rgba(46, 204, 113, 0.03)',
        2: 'rgba(230, 126, 34, 0.08)',
        3: 'rgba(52, 152, 219, 0.08)',
        4: 'rgba(155, 89, 182, 0.08)',
        5: 'rgba(52, 73, 94, 0.06)',
        6: 'rgba(253, 121, 168, 0.08)',
        7: 'rgba(241, 196, 15, 0.08)',
        8: 'rgba(108, 92, 231, 0.08)',
        9: 'rgba(231, 76, 60, 0.07)'
      };
      if (tints[this.currentGen]) {
        ctx.fillStyle = tints[this.currentGen];
        ctx.fillRect(0, 0, w, h);
      }
    } else {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#a8e6cf');
      grad.addColorStop(1, '#78c850');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }
  }

  drawPokemon(ent) {
    const ctx = this.ctx;
    const img = this.images.get(ent.pokemon.id);
    const size = this.spriteSize || ent.size;
    const px = ent.x;
    const py = ent.y - ent.jumpOffset;

    // 발밑 그림자
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(ent.x, ent.y + 4, size * 0.35, size * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 스프라이트
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.save();
      ctx.translate(px, py);
      if (ent.facing === -1) {
        ctx.scale(-1, 1);
      }
      ctx.drawImage(img, -size / 2, -size / 2, size, size);
      ctx.restore();
    } else {
      ctx.save();
      ctx.fillStyle = '#ff4757';
      ctx.beginPath();
      ctx.arc(px, py, size * 0.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(ent.pokemon.name.slice(0, 2), px, py);
      ctx.restore();
    }

    // 이름표
    ctx.save();
    ctx.font = '12px "Jua", sans-serif';
    const nameText = ent.pokemon.name;
    const tw = ctx.measureText(nameText).width;
    const tagY = py - size / 2 - 10;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
    ctx.strokeStyle = 'rgba(45, 52, 54, 0.15)';
    ctx.beginPath();
    ctx.roundRect(px - tw / 2 - 6, tagY - 8, tw + 12, 16, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#2d3436';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(nameText, px, tagY + 1);
    ctx.restore();

    // 하트 반응
    if (ent.heartTimer > 0) {
      ctx.save();
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      const heartY = py - size / 2 - 26 - (1.8 - ent.heartTimer) * 12;
      ctx.globalAlpha = Math.min(1, ent.heartTimer);
      ctx.fillText('💖', px, heartY);
      ctx.restore();
    }
  }

  startLoop() {
    const loop = (timestamp) => {
      if (!this.lastTime) this.lastTime = timestamp;
      const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
      this.lastTime = timestamp;

      this.update(dt);
      this.draw();

      this.animationFrameId = requestAnimationFrame(loop);
    };
    this.animationFrameId = requestAnimationFrame(loop);
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}

/**
 * 초등 한국사 메타버스 - 국사편찬위원회 공인 6대 시대별 정밀 역사 지도 미니맵 엔진
 * 고조선 198개 실측 해안선 + 삼국/남북국/고려/조선 시대별 공인 영토 판도 컬러 블록
 */

import { KOREA_CONFIG, KOREA_NORTH_POLYGON, KOREA_SOUTH_POLYGON, HISTORICAL_TERRITORIES } from './korea_polygon.js';

export class HistoryMinimap {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d');

    this.width = this.canvas.width;
    this.height = this.canvas.height;

    this.currentEra = null;
    this.playerWorldPos = { x: 0, z: 0, rotY: 0 };

    this.scale = 0.58;
  }

  setEra(era) {
    this.currentEra = era;
    this.draw();
  }

  updatePlayer(worldX, worldZ, rotY) {
    this.playerWorldPos.x = worldX;
    this.playerWorldPos.z = worldZ;
    this.playerWorldPos.rotY = rotY;
    this.draw();
  }

  worldToCanvas(wx, wz) {
    const cx = this.width * 0.50;
    const cy = this.height * 0.42;

    return {
      x: cx + wx * 1.55,
      y: cy + wz * 1.45
    };
  }

  gridToCanvas(gx, gy) {
    const dx = (gx - KOREA_CONFIG.centerX) * this.scale;
    const dy = (gy - KOREA_CONFIG.centerY) * this.scale;

    const cx = this.width * 0.50;
    const cy = this.height * 0.38;

    return {
      x: cx + dx,
      y: cy + dy
    };
  }

  draw() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    ctx.clearRect(0, 0, w, h);

    // 1. 고지도풍 바다 배경
    const oceanGrad = ctx.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w / 1.8);
    oceanGrad.addColorStop(0, '#5ab1b4');
    oceanGrad.addColorStop(1, '#347e82');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, w, h);

    // 격자 위도/경도 미세 선
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    for (let x = 20; x < w; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 20; y < h; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    ctx.save();

    // 2. 한반도 기본 대지 (고조선 게임 원본 198개 실측 좌표)
    ctx.fillStyle = '#94cca0';
    ctx.strokeStyle = '#276c52';
    ctx.lineWidth = 1.8;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    // 북부 및 요동 만주
    ctx.beginPath();
    KOREA_NORTH_POLYGON.forEach((pt, idx) => {
      const c = this.gridToCanvas(pt[0], pt[1]);
      if (idx === 0) ctx.moveTo(c.x, c.y);
      else ctx.lineTo(c.x, c.y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 중남부 삼남
    ctx.beginPath();
    KOREA_SOUTH_POLYGON.forEach((pt, idx) => {
      const c = this.gridToCanvas(pt[0], pt[1]);
      if (idx === 0) ctx.moveTo(c.x, c.y);
      else ctx.lineTo(c.x, c.y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 3. 🏛️ 공신력 있는 시대별 역사 영토 판도 (컬러 블록 & 국경선)
    const eraId = this.currentEra ? this.currentEra.id : 'gojoseon';
    const territoryData = HISTORICAL_TERRITORIES[eraId];

    if (territoryData && territoryData.factions) {
      territoryData.factions.forEach(faction => {
        // 영토 폴리곤 채우기
        ctx.fillStyle = `${faction.color}65`;
        ctx.strokeStyle = faction.borderColor;
        ctx.lineWidth = 2.0;

        ctx.beginPath();
        faction.points.forEach((pt, idx) => {
          const c = this.gridToCanvas(pt[0], pt[1]);
          if (idx === 0) ctx.moveTo(c.x, c.y);
          else ctx.lineTo(c.x, c.y);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // 진영 도읍 마커 & 라벨
        if (faction.capital) {
          const cap = this.gridToCanvas(faction.capital.gx, faction.capital.gy);
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(cap.x, cap.y, 3.8, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = faction.borderColor;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.font = 'bold 8.5px "Gowun Dodum", sans-serif';
          ctx.fillStyle = '#11291f';
          ctx.shadowColor = '#ffffff';
          ctx.shadowBlur = 3;
          ctx.fillText(faction.capital.name.split(' ')[0], cap.x + 5, cap.y + 3);
          ctx.shadowBlur = 0;
        }
      });

      // 고려시대 천리장성 방어벽 렌더링
      if (territoryData.cheolliWall) {
        ctx.strokeStyle = '#c2410c';
        ctx.lineWidth = 3.0;
        ctx.beginPath();
        territoryData.cheolliWall.forEach((pt, idx) => {
          const c = this.gridToCanvas(pt[0], pt[1]);
          if (idx === 0) ctx.moveTo(c.x, c.y);
          else ctx.lineTo(c.x, c.y);
        });
        ctx.stroke();
      }
    }

    // 4. 부속 도서 (제주도, 울릉도, 독도)
    const jeju = this.gridToCanvas(140, 290);
    ctx.fillStyle = '#94cca0';
    ctx.strokeStyle = '#276c52';
    ctx.beginPath();
    ctx.ellipse(jeju.x, jeju.y, 8, 4.5, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    const ulleung = this.gridToCanvas(230, 210);
    ctx.beginPath();
    ctx.arc(ulleung.x, ulleung.y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 독도 (명칭 표기)
    const dokdo = this.gridToCanvas(248, 212);
    ctx.beginPath();
    ctx.arc(dokdo.x, dokdo.y, 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.font = 'bold 8.5px "Gowun Dodum", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.shadowBlur = 3;
    ctx.fillText('독도', dokdo.x + 4, dokdo.y + 3);
    ctx.shadowBlur = 0;

    // 백두산 마커
    const baekdu = this.gridToCanvas(191.5, 91.5);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(baekdu.x, baekdu.y, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#224433';
    ctx.stroke();

    // 5. 플레이어 실시간 위치 (펄스 + 나침반 포인터)
    const p = this.worldToCanvas(this.playerWorldPos.x, this.playerWorldPos.z);

    // 펄스 링
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.75)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 9, 0, Math.PI * 2);
    ctx.stroke();

    // 플레이어 핀
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.6;
    ctx.stroke();

    ctx.restore();
  }
}

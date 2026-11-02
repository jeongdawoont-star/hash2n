/**
 * 초등 한국사 메타버스 - 고품질 3D 렌더링 & 지형/오브젝트/미니맵 엔진
 * 빌리지 앱 수준의 정교한 지형, 소나무, 전통 가옥, 디테일 랜드마크
 */

import { HISTORICAL_ERAS } from './historical_data.js';

export class HistoryMetaverseEngine {
  constructor(container, uiCallbacks) {
    this.container = container;
    this.uiCallbacks = uiCallbacks;

    this.currentEraId = 'gojoseon';
    this.currentEra = HISTORICAL_ERAS[this.currentEraId];

    this.scene = null;
    this.camera = null;
    this.renderer = null;

    // 플레이어
    this.player = null;
    this.moveSpeed = 16.0;
    this.keys = {};

    // 씬 내 오브젝트 그룹
    this.terrainGroup = new THREE.Group();
    this.bordersGroup = new THREE.Group();
    this.natureGroup = new THREE.Group(); // 소나무, 바위, 초가집, 돌담
    this.landmarksGroup = new THREE.Group();
    this.npcsGroup = new THREE.Group();
    this.resourcesGroup = new THREE.Group();
    this.constructionGroup = new THREE.Group();
    this.modernOverlayGroup = new THREE.Group();

    // 상호작용 가능한 대상
    this.interactables = [];
    this.nearestInteractable = null;

    // 타임슬립 나침반 모드
    this.isCompassMode = false;

    // 조명 & 안개
    this.dirLight = null;
    this.hemiLight = null;

    // 미니맵 엔진
    this.minimap = null;

    this.clock = new THREE.Clock();

    this.init();
  }

  setMinimap(minimap) {
    this.minimap = minimap;
    if (this.minimap) {
      this.minimap.setEra(this.currentEra);
    }
  }

  init() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    // 1. 씬 & 안개
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.currentEra.skyColor);
    this.scene.fog = new THREE.FogExp2(this.currentEra.fogColor, 0.011);

    // 2. 쿼터뷰 카메라
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 600);
    this.camera.position.set(0, 32, 38);
    this.camera.lookAt(0, 0, 0);

    // 3. 렌더러
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;
    this.container.appendChild(this.renderer.domElement);

    // 4. 조명
    this.setupLighting();

    // 5. 그룹 등록
    this.scene.add(this.terrainGroup);
    this.scene.add(this.bordersGroup);
    this.scene.add(this.natureGroup);
    this.scene.add(this.landmarksGroup);
    this.scene.add(this.npcsGroup);
    this.scene.add(this.resourcesGroup);
    this.scene.add(this.constructionGroup);
    this.scene.add(this.modernOverlayGroup);

    // 6. 플레이어 생성
    this.createPlayer();

    // 7. 현재 시대 환경 구축
    this.loadEra(this.currentEraId);

    // 8. 이벤트 바인딩
    this.bindEvents();

    // 9. 렌더 루프 시작
    this.animate();
  }

  setupLighting() {
    this.hemiLight = new THREE.HemisphereLight(0xfffaea, 0x486b53, 0.95);
    this.hemiLight.position.set(0, 60, 0);
    this.scene.add(this.hemiLight);

    this.dirLight = new THREE.DirectionalLight(0xfffae0, 1.35);
    this.dirLight.position.set(40, 60, 30);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 2048;
    this.dirLight.shadow.mapSize.height = 2048;
    this.dirLight.shadow.camera.near = 10;
    this.dirLight.shadow.camera.far = 190;
    this.dirLight.shadow.camera.left = -75;
    this.dirLight.shadow.camera.right = 75;
    this.dirLight.shadow.camera.top = 75;
    this.dirLight.shadow.camera.bottom = -75;
    this.dirLight.shadow.bias = -0.0004;
    this.scene.add(this.dirLight);

    // 부드러운 림라이트 (반대편에서 들어오는 보조광)
    const rimLight = new THREE.DirectionalLight(0xa5d8ff, 0.45);
    rimLight.position.set(-40, 30, -30);
    this.scene.add(rimLight);
  }

  createPlayer() {
    const group = new THREE.Group();

    // 그림자 받침
    const shadowGeo = new THREE.CircleGeometry(0.85, 16);
    const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.25 });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = 0.05;
    group.add(shadowMesh);

    // 1. 하체 (한복 바지 & 혜/신발)
    const legL = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.16, 0.6, 8),
      new THREE.MeshStandardMaterial({ color: 0x22483d, roughness: 0.7 })
    );
    legL.position.set(-0.2, 0.3, 0);
    group.add(legL);

    const legR = legL.clone();
    legR.position.x = 0.2;
    group.add(legR);

    // 2. 도포 몸체 (전통 옥색 도포)
    const coatGeo = new THREE.CylinderGeometry(0.38, 0.65, 1.15, 12);
    const coatMat = new THREE.MeshStandardMaterial({ color: 0x3d8d73, roughness: 0.45 });
    const coat = new THREE.Mesh(coatGeo, coatMat);
    coat.position.y = 0.95;
    coat.castShadow = true;
    group.add(coat);

    // 도포 옷고름/전대 (허리띠)
    const sashGeo = new THREE.CylinderGeometry(0.42, 0.45, 0.15, 12);
    const sashMat = new THREE.MeshStandardMaterial({ color: 0xc44536, roughness: 0.3 });
    const sash = new THREE.Mesh(sashGeo, sashMat);
    sash.position.y = 0.95;
    group.add(sash);

    // 3. 머리 & 얼굴
    const headGeo = new THREE.SphereGeometry(0.48, 16, 16);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xffdfc4, roughness: 0.6 });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 1.85;
    head.castShadow = true;
    group.add(head);

    // 4. 갓 (정교한 말총 갓)
    const hatBrim = new THREE.Mesh(
      new THREE.CylinderGeometry(0.95, 0.95, 0.03, 16),
      new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.25 })
    );
    hatBrim.position.y = 2.22;
    group.add(hatBrim);

    const hatCrown = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.42, 0.55, 16),
      new THREE.MeshStandardMaterial({ color: 0x1f1f1f, roughness: 0.3 })
    );
    hatCrown.position.y = 2.52;
    hatCrown.castShadow = true;
    group.add(hatCrown);

    // 갓끈 (턱밑으로 내려오는 비즈 끈)
    const ribbonGeo = new THREE.TorusGeometry(0.35, 0.02, 8, 16, Math.PI);
    const ribbonMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b });
    const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat);
    ribbon.position.set(0, 1.85, 0);
    ribbon.rotation.x = Math.PI / 2;
    group.add(ribbon);

    group.position.set(0, 0, 8);
    this.scene.add(group);
    this.player = group;
  }

  loadEra(eraId) {
    this.currentEraId = eraId;
    this.currentEra = HISTORICAL_ERAS[eraId];
    if (!this.currentEra) return;

    // 씬 색감 갱신
    this.scene.background.set(this.currentEra.skyColor);
    this.scene.fog.color.set(this.currentEra.fogColor);

    // 기존 요소 클리어
    this.clearGroup(this.terrainGroup);
    this.clearGroup(this.bordersGroup);
    this.clearGroup(this.natureGroup);
    this.clearGroup(this.landmarksGroup);
    this.clearGroup(this.npcsGroup);
    this.clearGroup(this.resourcesGroup);
    this.clearGroup(this.constructionGroup);
    this.clearGroup(this.modernOverlayGroup);
    this.interactables = [];

    // 1. 버텍스 컬러링 적용된 고급 지형
    this.buildDetailedTerrain();

    // 2. 시대별 3D 발광 국경선
    this.buildTerritoryBorders();

    // 3. 빌리지 감성의 소나무/초가집/자연물 군락
    this.buildVillageNatureAndHouses();

    // 4. 정교한 한국 전통 랜드마크
    this.buildDetailedLandmarks();

    // 5. 역사 인물 NPC 배치
    this.buildNPCs();

    // 6. 자원 노드 배치
    this.buildResources();

    // 7. 협동 복원소
    this.buildConstructionSite();

    // 8. 현대 오버레이
    this.buildModernOverlay();

    // 플레이어 위치 초기화
    this.player.position.set(0, 0, 5);

    // 미니맵 갱신
    if (this.minimap) {
      this.minimap.setEra(this.currentEra);
    }

    if (this.uiCallbacks && this.uiCallbacks.onEraLoaded) {
      this.uiCallbacks.onEraLoaded(this.currentEra);
    }
  }

  clearGroup(group) {
    while (group.children.length > 0) {
      const obj = group.children[0];
      group.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
        else obj.material.dispose();
      }
    }
  }

  buildDetailedTerrain() {
    const sizeX = 130;
    const sizeZ = 160;
    const segX = 80;
    const segZ = 95;

    const terrainGeo = new THREE.PlaneGeometry(sizeX, sizeZ, segX, segZ);
    terrainGeo.rotateX(-Math.PI / 2);

    const pos = terrainGeo.attributes.position;
    const count = pos.count;

    // 버텍스 컬러 배열 (RGB)
    const colors = new Float32Array(count * 3);

    // 팔레트 색상
    const cSand = new THREE.Color(0xdfd4aa);
    const cGrassLow = new THREE.Color(0x81c784);
    const cGrassMid = new THREE.Color(0x66bb6a);
    const cHighland = new THREE.Color(0x4e8d53);
    const cRock = new THREE.Color(0x78848f);
    const cSnow = new THREE.Color(0xf8fafc);

    for (let i = 0; i < count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);

      let y = 0;

      // 1. 백두산 & 개마고원 (북동쪽)
      const distBaekdu = Math.hypot(x - 22, z + 40);
      if (distBaekdu < 28) {
        y += Math.cos((distBaekdu / 28) * (Math.PI / 2)) * 10.8;
      }

      // 2. 묘향산 (북서쪽)
      const distMyohyang = Math.hypot(x + 15, z + 25);
      if (distMyohyang < 18) {
        y += Math.cos((distMyohyang / 18) * (Math.PI / 2)) * 6.5;
      }

      // 3. 태백산맥 (동해안을 따라 뻗은 척추)
      const distTaebaek = Math.abs(x - 18) + Math.abs(z - 10) * 0.2;
      if (distTaebaek < 18 && z > -25 && z < 40) {
        y += Math.sin((1 - distTaebaek / 18) * (Math.PI / 2)) * 5.2;
      }

      // 4. 지리산 (남부)
      const distJiri = Math.hypot(x - 4, z - 28);
      if (distJiri < 16) {
        y += Math.cos((distJiri / 16) * (Math.PI / 2)) * 5.2;
      }

      // 자연스러운 기복 노이즈
      y += Math.sin(x * 0.15) * Math.cos(z * 0.16) * 0.95;

      // 해안선 침강
      const edgeDist = Math.max(Math.abs(x) / (sizeX * 0.48), Math.abs(z) / (sizeZ * 0.48));
      if (edgeDist > 0.8) {
        y -= (edgeDist - 0.8) * 14;
      }

      pos.setY(i, y);

      // 버텍스 컬러 산출
      let vColor = new THREE.Color();
      if (y < 0.2) {
        vColor.lerpColors(cSand, cGrassLow, Math.max(0, y / 0.2));
      } else if (y < 3.0) {
        vColor.lerpColors(cGrassLow, cGrassMid, (y - 0.2) / 2.8);
      } else if (y < 6.0) {
        vColor.lerpColors(cGrassMid, cHighland, (y - 3.0) / 3.0);
      } else if (y < 8.5) {
        vColor.lerpColors(cHighland, cRock, (y - 6.0) / 2.5);
      } else {
        vColor.lerpColors(cRock, cSnow, Math.min(1, (y - 8.5) / 2.0));
      }

      colors[i * 3] = vColor.r;
      colors[i * 3 + 1] = vColor.g;
      colors[i * 3 + 2] = vColor.b;
    }

    terrainGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.82,
      metalness: 0.05,
      flatShading: true
    });

    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.receiveShadow = true;
    this.terrainGroup.add(terrainMesh);

    // 맑고 투명한 에메랄드 바다
    const oceanGeo = new THREE.PlaneGeometry(380, 380);
    oceanGeo.rotateX(-Math.PI / 2);
    const oceanMat = new THREE.MeshStandardMaterial({
      color: 0x48a8aa,
      roughness: 0.15,
      metalness: 0.2,
      transparent: true,
      opacity: 0.82
    });
    const ocean = new THREE.Mesh(oceanGeo, oceanMat);
    ocean.position.y = -0.8;
    this.terrainGroup.add(ocean);
  }

  buildVillageNatureAndHouses() {
    // 1. 한국 전통 소나무 (Korean Pine Trees) 군락 28개
    const pineLocations = [
      { x: -12, z: -14, s: 1.1 }, { x: -8, z: -20, s: 0.9 }, { x: 14, z: -8, s: 1.2 },
      { x: 18, z: -12, s: 0.85 }, { x: -16, z: 8, s: 1.0 }, { x: -20, z: 12, s: 1.3 },
      { x: 12, z: 10, s: 1.1 }, { x: 16, z: 18, s: 0.95 }, { x: -4, z: 22, s: 1.05 },
      { x: 2, z: 26, s: 1.25 }, { x: -28, z: -2, s: 1.0 }, { x: 26, z: 4, s: 1.15 },
      { x: 10, z: -32, s: 1.4 }, { x: 16, z: -28, s: 1.1 }, { x: -22, z: -22, s: 1.0 },
      { x: -5, z: 35, s: 1.2 }, { x: -12, z: 32, s: 0.9 }
    ];

    pineLocations.forEach(loc => {
      const tree = this.createKoreanPineTree();
      tree.position.set(loc.x, 0, loc.z);
      tree.scale.setScalar(loc.s);
      this.natureGroup.add(tree);
    });

    // 2. 전통 초가집 (Thatched-Roof Cottages) 민가 군락 5채
    const houseLocations = [
      { x: 8, z: -3, rot: 0.2 },
      { x: 12, z: -1, rot: -0.4 },
      { x: -14, z: 16, rot: 0.5 },
      { x: -18, z: 18, rot: -0.1 },
      { x: 6, z: 14, rot: 1.2 }
    ];

    houseLocations.forEach(h => {
      const house = this.createThatchedHouse();
      house.position.set(h.x, 0, h.z);
      house.rotation.y = h.rot;
      this.natureGroup.add(house);
    });

    // 3. 전통 돌담길 및 장독대
    this.createStoneWallsAndJars();
  }

  createKoreanPineTree() {
    const group = new THREE.Group();

    // 굽이치는 갈색 나무 줄기
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x543d2b, roughness: 0.85 });
    const trunkLow = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.36, 1.8, 8), trunkMat);
    trunkLow.position.set(0, 0.9, 0);
    trunkLow.rotation.z = 0.08;
    trunkLow.castShadow = true;
    group.add(trunkLow);

    const trunkHigh = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.28, 1.6, 8), trunkMat);
    trunkHigh.position.set(0.12, 2.3, 0);
    trunkHigh.rotation.z = -0.14;
    trunkHigh.castShadow = true;
    group.add(trunkHigh);

    // 3단 우산형 솔잎 층 (Pine Foliage Clusters)
    const pineMat = new THREE.MeshStandardMaterial({
      color: 0x276749,
      roughness: 0.7,
      flatShading: true
    });

    const f1 = new THREE.Mesh(new THREE.ConeGeometry(1.6, 1.0, 7), pineMat);
    f1.position.set(0.2, 2.2, 0);
    f1.castShadow = true;
    group.add(f1);

    const f2 = new THREE.Mesh(new THREE.ConeGeometry(1.3, 0.9, 7), pineMat);
    f2.position.set(-0.1, 2.8, 0.1);
    f2.castShadow = true;
    group.add(f2);

    const f3 = new THREE.Mesh(new THREE.ConeGeometry(0.9, 0.8, 7), pineMat);
    f3.position.set(0.1, 3.4, -0.05);
    f3.castShadow = true;
    group.add(f3);

    return group;
  }

  createThatchedHouse() {
    const group = new THREE.Group();

    // 기단
    const base = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 0.3, 2.4),
      new THREE.MeshStandardMaterial({ color: 0x8a857a, roughness: 0.8 })
    );
    base.position.y = 0.15;
    base.receiveShadow = true;
    group.add(base);

    // 흙벽 (황토벽)
    const wall = new THREE.Mesh(
      new THREE.BoxGeometry(2.8, 1.4, 2.0),
      new THREE.MeshStandardMaterial({ color: 0xc89868, roughness: 0.85 })
    );
    wall.position.y = 1.0;
    wall.castShadow = true;
    group.add(wall);

    // 격자 창호문
    const door = new THREE.Mesh(
      new THREE.PlaneGeometry(0.7, 1.0),
      new THREE.MeshStandardMaterial({ color: 0x3d271d, roughness: 0.5 })
    );
    door.position.set(0, 0.9, 1.01);
    group.add(door);

    // 둥근 볏짚 초가지붕 (따뜻한 노란 황토빛)
    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(2.3, 1.1, 4),
      new THREE.MeshStandardMaterial({ color: 0xdfb15b, roughness: 0.9 })
    );
    roof.position.y = 2.2;
    roof.rotation.y = Math.PI / 4;
    roof.scale.set(1.1, 1.0, 0.9);
    roof.castShadow = true;
    group.add(roof);

    return group;
  }

  createStoneWallsAndJars() {
    // 장독대 (항아리 옹기 4개)
    const jarGroup = new THREE.Group();
    jarGroup.position.set(10.5, 0, -4);

    const jarPlatform = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.15, 1.2),
      new THREE.MeshStandardMaterial({ color: 0x77736b })
    );
    jarPlatform.position.y = 0.08;
    jarGroup.add(jarPlatform);

    const jarMat = new THREE.MeshStandardMaterial({ color: 0x332219, roughness: 0.3 });
    [-0.4, 0.4].forEach(jx => {
      [-0.2, 0.2].forEach(jz => {
        const jar = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), jarMat);
        jar.position.set(jx, 0.28, jz);
        jar.scale.set(1.0, 1.25, 1.0);
        jarGroup.add(jar);
      });
    });
    this.natureGroup.add(jarGroup);
  }

  buildDetailedLandmarks() {
    this.currentEra.landmarks.forEach(lm => {
      const group = new THREE.Group();
      group.position.set(lm.x, 0, lm.z);

      if (lm.type === 'capital' || lm.type === 'city' || lm.type === 'fortress') {
        // 1. 화강암 돌계단 & 이중 기단
        const baseLow = new THREE.Mesh(
          new THREE.BoxGeometry(5.2, 0.4, 5.2),
          new THREE.MeshStandardMaterial({ color: 0x9da39e, roughness: 0.7 })
        );
        baseLow.position.y = 0.2;
        baseLow.receiveShadow = true;
        group.add(baseLow);

        const baseHigh = new THREE.Mesh(
          new THREE.BoxGeometry(4.2, 0.35, 4.2),
          new THREE.MeshStandardMaterial({ color: 0xb5bbb6, roughness: 0.6 })
        );
        baseHigh.position.y = 0.55;
        baseHigh.receiveShadow = true;
        group.add(baseHigh);

        // 2. 붉은 단청 기둥 (4개 모퉁이)
        const pillarMat = new THREE.MeshStandardMaterial({ color: 0xa83226, roughness: 0.4 });
        [[-1.6, -1.6], [1.6, -1.6], [-1.6, 1.6], [1.6, 1.6]].forEach(pos => {
          const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 2.2, 8), pillarMat);
          pillar.position.set(pos[0], 1.8, pos[1]);
          pillar.castShadow = true;
          group.add(pillar);
        });

        // 3. 중심 목재 벽체 및 문
        const centerWall = new THREE.Mesh(
          new THREE.BoxGeometry(3.0, 2.0, 3.0),
          new THREE.MeshStandardMaterial({ color: 0x8b3223, roughness: 0.5 })
        );
        centerWall.position.y = 1.7;
        centerWall.castShadow = true;
        group.add(centerWall);

        // 4. 화려한 팔작기와지붕 (처마 곡선)
        const roofLow = new THREE.Mesh(
          new THREE.ConeGeometry(3.4, 1.2, 4),
          new THREE.MeshStandardMaterial({ color: 0x222d38, roughness: 0.35 })
        );
        roofLow.position.y = 3.3;
        roofLow.rotation.y = Math.PI / 4;
        roofLow.castShadow = true;
        group.add(roofLow);

        const roofTop = new THREE.Mesh(
          new THREE.ConeGeometry(2.4, 0.9, 4),
          new THREE.MeshStandardMaterial({ color: 0x182029, roughness: 0.3 })
        );
        roofTop.position.y = 4.0;
        roofTop.rotation.y = Math.PI / 4;
        roofTop.castShadow = true;
        group.add(roofTop);

        // 5. 처마 밑 발광 청사초롱 등불
        const lanternMat = new THREE.MeshStandardMaterial({
          color: 0xef4444,
          emissive: 0xffaa44,
          emissiveIntensity: 0.8
        });
        const lantern = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.4, 8), lanternMat);
        lantern.position.set(0, 2.4, 1.7);
        group.add(lantern);
      } else {
        // 탑 / 성역 / 비석
        const monumentBase = new THREE.Mesh(
          new THREE.BoxGeometry(2.8, 0.4, 2.8),
          new THREE.MeshStandardMaterial({ color: 0x828984, roughness: 0.8 })
        );
        monumentBase.position.y = 0.2;
        group.add(monumentBase);

        const monumentBody = new THREE.Mesh(
          new THREE.CylinderGeometry(0.9, 1.2, 3.2, 8),
          new THREE.MeshStandardMaterial({ color: 0xa9a295, roughness: 0.7 })
        );
        monumentBody.position.y = 1.8;
        monumentBody.castShadow = true;
        group.add(monumentBody);
      }

      // 라벨
      const label = this.createTextSprite(`${lm.icon} ${lm.name}`, '#1b3b2e', '#ffffff');
      label.position.y = 5.2;
      group.add(label);

      this.landmarksGroup.add(group);
    });
  }

  buildTerritoryBorders() {
    if (!this.currentEra.territoryBoundary) return;

    const points = this.currentEra.territoryBoundary.map(p => new THREE.Vector3(p.x, 1.2, p.z));
    const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
    const lineMat = new THREE.LineDashedMaterial({
      color: new THREE.Color(this.currentEra.themeColor),
      dashSize: 2.5,
      gapSize: 1.2,
      linewidth: 3
    });

    const borderLine = new THREE.Line(lineGeo, lineMat);
    borderLine.computeLineDistances();
    this.bordersGroup.add(borderLine);

    points.forEach((pt, idx) => {
      if (idx % 2 === 0) {
        const pillarGeo = new THREE.CylinderGeometry(0.25, 0.35, 2.2, 8);
        const pillarMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(this.currentEra.themeColor),
          emissive: new THREE.Color(this.currentEra.themeColor).multiplyScalar(0.45)
        });
        const pillar = new THREE.Mesh(pillarGeo, pillarMat);
        pillar.position.set(pt.x, 1.1, pt.z);
        this.bordersGroup.add(pillar);
      }
    });
  }

  buildNPCs() {
    this.currentEra.npcs.forEach(npc => {
      const group = new THREE.Group();
      group.position.set(npc.x, 0, npc.z);

      const shadow = new THREE.Mesh(
        new THREE.CircleGeometry(0.75, 16),
        new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.2 })
      );
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.y = 0.04;
      group.add(shadow);

      // NPC 몸체
      const body = new THREE.Mesh(
        new THREE.CylinderGeometry(0.42, 0.6, 1.4, 16),
        new THREE.MeshStandardMaterial({ color: new THREE.Color(npc.color), roughness: 0.5 })
      );
      body.position.y = 0.95;
      body.castShadow = true;
      group.add(body);

      // 머리
      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.48, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0xffe2c4, roughness: 0.6 })
      );
      head.position.y = 1.95;
      head.castShadow = true;
      group.add(head);

      // 관모
      const hat = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.45, 0.45, 16),
        new THREE.MeshStandardMaterial({ color: 0x1e2621, roughness: 0.3 })
      );
      hat.position.y = 2.4;
      group.add(hat);

      // 이름표
      const label = this.createTextSprite(`💬 ${npc.name} (${npc.role})`, '#1b3b2e', '#f4faf6');
      label.position.y = 3.4;
      group.add(label);

      this.npcsGroup.add(group);

      this.interactables.push({
        type: 'npc',
        data: npc,
        position: new THREE.Vector3(npc.x, 0, npc.z),
        object: group
      });
    });
  }

  buildResources() {
    this.currentEra.resources.forEach(res => {
      const group = new THREE.Group();
      group.position.set(res.x, 0, res.z);

      const gem = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.75, 0),
        new THREE.MeshStandardMaterial({
          color: new THREE.Color(res.color),
          roughness: 0.25,
          metalness: 0.4,
          emissive: new THREE.Color(res.color).multiplyScalar(0.25)
        })
      );
      gem.position.y = 0.95;
      gem.castShadow = true;
      group.add(gem);

      group.userData.gemMesh = gem;

      const label = this.createTextSprite(`${res.icon} ${res.name}`, '#443720', '#fff9e8');
      label.position.y = 2.5;
      group.add(label);

      this.resourcesGroup.add(group);

      this.interactables.push({
        type: 'resource',
        data: res,
        position: new THREE.Vector3(res.x, 0, res.z),
        object: group
      });
    });
  }

  buildConstructionSite() {
    const site = this.currentEra.constructionSite;
    if (!site) return;

    const group = new THREE.Group();
    group.position.set(site.x, 0, site.z);

    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(3.6, 4.2, 0.6, 16),
      new THREE.MeshStandardMaterial({ color: 0x8a928b, roughness: 0.8 })
    );
    base.position.y = 0.3;
    base.receiveShadow = true;
    group.add(base);

    if (site.stage === 0) {
      const frame = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 1.4, 2.2),
        new THREE.MeshStandardMaterial({ color: 0xc49a6c, wireframe: true })
      );
      frame.position.y = 1.3;
      group.add(frame);
    } else if (site.stage === 1) {
      const pillar = new THREE.Mesh(
        new THREE.CylinderGeometry(1.3, 1.5, 2.8, 8),
        new THREE.MeshStandardMaterial({ color: 0xb58e65, roughness: 0.6 })
      );
      pillar.position.y = 1.8;
      pillar.castShadow = true;
      group.add(pillar);
    } else {
      const full = new THREE.Mesh(
        new THREE.CylinderGeometry(1.7, 1.9, 4.2, 8),
        new THREE.MeshStandardMaterial({
          color: 0xd9a84e,
          roughness: 0.3,
          metalness: 0.5,
          emissive: 0x443311
        })
      );
      full.position.y = 2.4;
      full.castShadow = true;
      group.add(full);
    }

    const stageText = site.stage === 2 ? '✨ [완공]' : `🔨 [복원중 ${site.stage + 1}/2단계]`;
    const label = this.createTextSprite(`🏛️ ${site.name} ${stageText}`, '#633c16', '#ffeed6');
    label.position.y = 4.4;
    group.add(label);

    this.constructionGroup.add(group);

    this.interactables.push({
      type: 'construction',
      data: site,
      position: new THREE.Vector3(site.x, 0, site.z),
      object: group
    });
  }

  buildModernOverlay() {
    const modernCities = [
      { name: "현대 서울특별시 (경복궁·한강)", x: -10, z: -2, icon: "🏢" },
      { name: "현대 평양직할시 (대동강)", x: -15, z: 20, icon: "🏙️" },
      { name: "현대 경상북도 경주시 (불국사)", x: 24, z: 24, icon: "🏛️" },
      { name: "현대 전라남도 완도군 (청해진)", x: -26, z: 35, icon: "⚓" },
      { name: "대한민국 독도 (동해)", x: 40, z: 12, icon: "🇰🇷" }
    ];

    modernCities.forEach(city => {
      const group = new THREE.Group();
      group.position.set(city.x, 1.5, city.z);

      const pin = new THREE.Mesh(
        new THREE.SphereGeometry(0.6, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0x991b1b })
      );
      group.add(pin);

      const label = this.createTextSprite(`${city.icon} ${city.name}`, '#ffffff', '#dc2626');
      label.position.y = 2.4;
      group.add(label);

      this.modernOverlayGroup.add(group);
    });

    this.modernOverlayGroup.visible = false;
  }

  toggleCompassMode() {
    this.isCompassMode = !this.isCompassMode;
    this.modernOverlayGroup.visible = this.isCompassMode;
    return this.isCompassMode;
  }

  advanceConstructionStage() {
    const site = this.currentEra.constructionSite;
    if (!site || site.stage >= 2) return false;

    site.stage += 1;
    this.clearGroup(this.constructionGroup);
    this.buildConstructionSite();
    return true;
  }

  createTextSprite(text, textColor = '#17362a', bgColor = '#ffffff') {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = bgColor;
    ctx.strokeStyle = 'rgba(0,0,0,0.14)';
    ctx.lineWidth = 4;
    this.roundRect(ctx, 16, 20, 480, 88, 44);
    ctx.fill();
    ctx.stroke();

    ctx.font = 'bold 34px "Gowun Dodum", sans-serif';
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 256, 66);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(4.8, 1.2, 1);
    return sprite;
  }

  roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  bindEvents() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      if (e.code === 'KeyE') {
        this.triggerInteraction();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    window.addEventListener('resize', () => {
      const width = this.container.clientWidth;
      const height = this.container.clientHeight;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    });
  }

  triggerInteraction() {
    if (!this.nearestInteractable) return;
    if (this.uiCallbacks && this.uiCallbacks.onInteract) {
      this.uiCallbacks.onInteract(this.nearestInteractable);
    }
  }

  updatePlayer(delta) {
    if (!this.player) return;

    let moveX = 0;
    let moveZ = 0;

    if (this.keys['KeyW'] || this.keys['ArrowUp']) moveZ -= 1;
    if (this.keys['KeyS'] || this.keys['ArrowDown']) moveZ += 1;
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) moveX -= 1;
    if (this.keys['KeyD'] || this.keys['ArrowRight']) moveX += 1;

    const inputLen = Math.hypot(moveX, moveZ);
    if (inputLen > 0) {
      moveX /= inputLen;
      moveZ /= inputLen;

      this.player.position.x += moveX * this.moveSpeed * delta;
      this.player.position.z += moveZ * this.moveSpeed * delta;

      const targetAngle = Math.atan2(moveX, moveZ);
      this.player.rotation.y = THREE.MathUtils.lerp(this.player.rotation.y, targetAngle, 12 * delta);

      const stepBounce = Math.abs(Math.sin(this.clock.getElapsedTime() * 14)) * 0.18;
      this.player.position.y = stepBounce;
    } else {
      this.player.position.y = THREE.MathUtils.lerp(this.player.position.y, 0, 8 * delta);
    }

    // 미니맵에 플레이어 위치 실시간 동기화!
    if (this.minimap) {
      this.minimap.updatePlayer(this.player.position.x, this.player.position.z, this.player.rotation.y);
    }

    // 카메라 위치 보간
    if (this.isCompassMode) {
      this.camera.position.x = THREE.MathUtils.lerp(this.camera.position.x, 0, 4 * delta);
      this.camera.position.y = THREE.MathUtils.lerp(this.camera.position.y, 90, 4 * delta);
      this.camera.position.z = THREE.MathUtils.lerp(this.camera.position.z, 2, 4 * delta);
      this.camera.lookAt(0, 0, 0);
    } else {
      const targetCamX = this.player.position.x;
      const targetCamZ = this.player.position.z + 32;
      this.camera.position.x = THREE.MathUtils.lerp(this.camera.position.x, targetCamX, 6 * delta);
      this.camera.position.y = THREE.MathUtils.lerp(this.camera.position.y, 32, 6 * delta);
      this.camera.position.z = THREE.MathUtils.lerp(this.camera.position.z, targetCamZ, 6 * delta);
      this.camera.lookAt(this.player.position.x, 1.2, this.player.position.z);
    }
  }

  checkInteractions() {
    if (!this.player) return;
    const playerPos = this.player.position;
    let closest = null;
    let minDistance = 5.5;

    for (const item of this.interactables) {
      const dist = playerPos.distanceTo(item.position);
      if (dist < minDistance) {
        minDistance = dist;
        closest = item;
      }
    }

    if (closest !== this.nearestInteractable) {
      this.nearestInteractable = closest;
      if (this.uiCallbacks && this.uiCallbacks.onNearInteractableChange) {
        this.uiCallbacks.onNearInteractableChange(this.nearestInteractable);
      }
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = Math.min(this.clock.getDelta(), 0.1);
    const elapsedTime = this.clock.getElapsedTime();

    this.updatePlayer(delta);
    this.checkInteractions();

    this.resourcesGroup.children.forEach((grp, idx) => {
      if (grp.userData.gemMesh) {
        grp.userData.gemMesh.position.y = 0.95 + Math.sin(elapsedTime * 2.5 + idx) * 0.15;
        grp.userData.gemMesh.rotation.y += 1.2 * delta;
      }
    });

    this.renderer.render(this.scene, this.camera);
  }
}

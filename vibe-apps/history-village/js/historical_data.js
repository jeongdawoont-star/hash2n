/**
 * 초등 한국사 메타버스 - 6대 시대별 완전 데이터베이스
 * 교육과정: 초등학교 5학년 2학기 사회과 한국사
 */

export const HISTORICAL_ERAS = {
  gojoseon: {
    id: "gojoseon",
    name: "고조선 시대",
    period: "기원전 2333년 ~ 기원전 108년",
    themeColor: "#48ae89",
    skyColor: "#c2ebd3",
    groundColor: "#8ec49b",
    ambientLight: "#ffffff",
    fogColor: "#d3f2e1",
    subtitle: "청동기 문명과 최초의 민족 국가",
    centerName: "아사달 (단군왕검)",
    modernComparison: "현재의 평양·구월산 및 요동반도 일대",

    // 시대별 영토 경계선 (요동반도 ~ 한반도 북서부)
    territoryBoundary: [
      { x: -45, z: -35 },
      { x: -10, z: -40 },
      { x: 25, z: -30 },
      { x: 20, z: 0 },
      { x: -5, z: 15 },
      { x: -35, z: 10 },
      { x: -45, z: -15 },
      { x: -45, z: -35 }
    ],

    landmarks: [
      { name: "아사달 성역", x: 0, z: -10, type: "capital", icon: "🏛️", desc: "단군왕검이 세운 고조선의 첫 도읍" },
      { name: "왕검성 (대동강)", x: -15, z: 20, type: "city", icon: "🏯", desc: "고조선의 후기 도읍이자 철기 문화 중심지" },
      { name: "백두산 신단수", x: 25, z: -35, type: "mountain", icon: "🏔️", desc: "환웅이 하늘에서 내려와 신시를 연 성스러운 산" },
      { name: "요동 국경 방어선", x: -40, z: -20, type: "border", icon: "🛡️", desc: "연나라와 대등하게 맞선 북방 영토" }
    ],

    // 복원해야 할 시대의 상징 랜드마크 (단계별 성장)
    constructionSite: {
      id: "gojoseon_monument",
      name: "8조법 비석 & 탁자식 고인돌",
      x: 14,
      z: 8,
      required: { bronze: 3, stone: 4 },
      current: { bronze: 0, stone: 0 },
      stage: 0, // 0: 터 닦기, 1: 골조/석재 운반, 2: 완공
      desc: "사람의 생명과 노동력, 사유 재산을 보호하는 8조법을 새긴 비석"
    },

    resources: [
      { id: "bronze", name: "청동 원석", icon: "⛏️", color: "#cda365", x: -10, z: -25, amount: 1 },
      { id: "stone", name: "거친 석재", icon: "🪨", color: "#8a9a86", x: 20, z: 2, amount: 1 },
      { id: "herb", name: "신비한 마늘과 쑥", icon: "🌿", color: "#95d58d", x: 12, z: -18, amount: 1 },
      { id: "pottery", name: "미송리식 토기 점토", icon: "🏺", color: "#b37b56", x: -22, z: -5, amount: 1 }
    ],

    npcs: [
      {
        id: "dangun",
        name: "단군왕검",
        role: "고조선의 건국자",
        x: 0,
        z: -6,
        color: "#f5a742",
        emoji: "👑",
        dialogue: "널리 인간을 이롭게 하라는 '홍익인간'의 뜻으로 나라를 세웠느니라. 백성들이 서로 돕고 화목하게 지내도록 8조법을 세우려 하니 자원을 모아 함께 비석을 세워보자꾸나.",
        quiz: {
          question: "고조선의 건국 이념으로, '널리 인간 세상을 이롭게 한다'는 뜻의 말은 무엇일까요?",
          options: ["홍익인간", "화랑도", "팔관회", "훈민정음"],
          answer: 0,
          explanation: "단군왕검은 '홍익인간(弘益人間)'의 정신을 바탕으로 우리 민족 최초의 국가인 고조선을 세웠습니다."
        }
      },
      {
        id: "ungnyeo",
        name: "웅녀",
        role: "인내와 지혜의 어머니",
        x: 8,
        z: -14,
        color: "#8d6e53",
        emoji: "🐻",
        dialogue: "동굴 속에서 쑥과 마늘을 먹으며 백 날 동안 지극한 정성을 다했답니다. 어려운 일도 참고 견디면 반드시 큰 결실을 맺는 법이지요.",
        quiz: {
          question: "고조선의 영역과 문화를 증명하는 대표적인 청동기 시대 유물은 무엇일까요?",
          options: ["빗살무늬 토기", "비파형 동검", "금동대향로", "상감청자"],
          answer: 1,
          explanation: "비파형 동검과 탁자식 고인돌, 미송리식 토기는 고조선의 독자적인 문화 범위를 보여주는 대표 유물입니다."
        }
      }
    ],

    objective: "청동 원석과 석재를 채집하여 '8조법 비석 & 고인돌'을 완공하세요!"
  },

  three_kingdoms: {
    id: "three_kingdoms",
    name: "삼국시대",
    period: "기원전 1세기 ~ 7세기",
    themeColor: "#3b82f6",
    skyColor: "#c7dcff",
    groundColor: "#7fab8e",
    ambientLight: "#ffffff",
    fogColor: "#d9e8ff",
    subtitle: "한강 유역을 차지하기 위한 영웅들의 격돌",
    centerName: "한강 유역 (아차산성)",
    modernComparison: "서울 광진구 아차산 보루 및 송파구 풍납토성",

    territoryBoundary: [
      { x: -45, z: -50 },
      { x: 30, z: -45 },
      { x: 35, z: 35 },
      { x: 10, z: 45 },
      { x: -30, z: 25 },
      { x: -45, z: -10 },
      { x: -45, z: -50 }
    ],

    landmarks: [
      { name: "고구려 평양성", x: -10, z: -35, type: "capital", icon: "🦅", desc: "장수왕이 남하 정책을 펼치며 천도한 도읍" },
      { name: "백제 한성(위례성)", x: -10, z: -2, type: "capital", icon: "🏯", desc: "근초고왕이 전성기를 누렸던 한강 유역 수도" },
      { name: "신라 서라벌(경주)", x: 24, z: 24, type: "capital", icon: "👑", desc: "진흥왕이 삼국 통일의 발판을 마련한 천년 도읍" },
      { name: "김해 금관가야", x: 10, z: 38, type: "city", icon: "🛡️", desc: "우수한 철기 문화와 해상 교역의 중심지" }
    ],

    constructionSite: {
      id: "three_kingdoms_fortress",
      name: "한강 아차산 보루 & 첨성대",
      x: 0,
      z: 5,
      required: { iron: 3, silk: 3 },
      current: { iron: 0, silk: 0 },
      stage: 0,
      desc: "삼국이 한강 유역을 감시하고 지키기 위해 축조한 돌 요새와 천문대"
    },

    resources: [
      { id: "iron", name: "가야 철광석", icon: "⛓️", color: "#61738a", x: 8, z: 30, amount: 1 },
      { id: "silk", name: "백제 비단", icon: "🧶", color: "#e391b4", x: -18, z: 4, amount: 1 },
      { id: "gold", name: "신라 사금", icon: "✨", color: "#fcd34d", x: 28, z: 15, amount: 1 }
    ],

    npcs: [
      {
        id: "gwanggaeto",
        name: "광개토대왕",
        role: "대륙을 호령한 고구려 태왕",
        x: -8,
        z: -30,
        color: "#c2410c",
        emoji: "🏹",
        dialogue: "영락의 기상으로 북방의 드넓은 벌판을 개척하였노라! 고구려의 기개는 물러섬이 없으니 너희도 당당한 기상을 가슴에 품어라.",
        quiz: {
          question: "고구려의 전성기를 이끌며 북쪽의 광활한 만주 영토를 개척한 정복 군주는 누구일까요?",
          options: ["광개토대왕", "근초고왕", "진흥왕", "온조왕"],
          answer: 0,
          explanation: "광개토대왕은 활발한 영토 확장을 통해 고구려를 동북아 최강국으로 만들었습니다."
        }
      },
      {
        id: "jinheung",
        name: "진흥왕",
        role: "신라의 전성기를 연 군주",
        x: 18,
        z: 18,
        color: "#d97706",
        emoji: "👑",
        dialogue: "화랑들을 육성하고 마침내 한강 유역을 차지하여 신라의 비상을 이루었도다. 국경을 둘러보고 순수비를 세워 태평성대를 기원하리라.",
        quiz: {
          question: "삼국시대에 각 나라가 한강 유역을 차지하려고 치열하게 다툰 가장 중요한 이유는 무엇일까요?",
          options: [
            "비옥한 농토와 중국과의 편리한 교류 물길",
            "사계절 눈이 내려 스키를 탈 수 있어서",
            "황금이 가장 많이 매장되어 있어서",
            "험한 바위산으로 둘러싸여 숨기 좋아서"
          ],
          answer: 0,
          explanation: "한강 유역은 농경이 발달하고 서해를 통해 중국의 선진 문물을 수용하기에 가장 유리한 전략 요충지였습니다."
        }
      }
    ],

    objective: "철광석과 비단을 모아 한강을 지키는 '아차산 보루'를 복원하세요!"
  },

  north_south: {
    id: "north_south",
    name: "발해·통일신라",
    period: "698년 ~ 926년",
    themeColor: "#8b5cf6",
    skyColor: "#dcd2ff",
    groundColor: "#7e9f8f",
    ambientLight: "#ffffff",
    fogColor: "#e6e0ff",
    subtitle: "남쪽의 신라와 북쪽의 해동성국 발해",
    centerName: "청해진 (완도) / 서라벌",
    modernComparison: "전라남도 완도군 장보고 유적지 및 경주 불국사",

    territoryBoundary: [
      { x: -45, z: -55 },
      { x: 35, z: -50 },
      { x: 35, z: -5 },
      { x: -45, z: -5 },
      { x: -45, z: -55 }
    ],

    landmarks: [
      { name: "발해 상경 용천부", x: -5, z: -45, type: "capital", icon: "🏯", desc: "주작대로와 웅장한 궁궐을 갖춘 발해의 수도" },
      { name: "신라 금성(경주)", x: 20, z: 25, type: "capital", icon: "🛕", desc: "불국사와 석굴암이 꽃핀 찬란한 불교 문화의 중심" },
      { name: "완도 청해진 본영", x: -26, z: 35, type: "harbor", icon: "⛵", desc: "장보고가 해적을 소탕하고 세운 해상 무역 기지" }
    ],

    constructionSite: {
      id: "north_south_ship",
      name: "청해진 무역선 & 불국사 석탑",
      x: -15,
      z: 28,
      required: { fur: 3, pearl: 3 },
      current: { fur: 0, pearl: 0 },
      stage: 0,
      desc: "동아시아 바다를 누비던 청해진 상선과 석가탑"
    },

    resources: [
      { id: "fur", name: "발해 담비 모피", icon: "🦊", color: "#a16207", x: -12, z: -38, amount: 1 },
      { id: "pearl", name: "완도 진주와 소금", icon: "🦪", color: "#67e8f9", x: -24, z: 28, amount: 1 },
      { id: "granite", name: "토함산 화강암", icon: "🗿", color: "#94a3b8", x: 22, z: 18, amount: 1 }
    ],

    npcs: [
      {
        id: "daejoyeong",
        name: "대조영 (고왕)",
        role: "발해를 건국한 영웅",
        x: -5,
        z: -38,
        color: "#4338ca",
        emoji: "🦅",
        dialogue: "동모산 기슭에서 고구려의 얼을 되살려 발해를 세웠노라! 당나라조차 우리를 '바다 동쪽의 번영한 나라(해동성국)'라 칭송하였도다.",
        quiz: {
          question: "고구려가 멸망한 후 유민들을 이끌고 발해를 건국하여 고구려를 계승한 인물은 누구일까요?",
          options: ["대조영", "장보고", "궁예", "문무왕"],
          answer: 0,
          explanation: "대조영은 고구려 유민과 말갈족을 이끌고 698년 발해를 건국했습니다."
        }
      },
      {
        id: "jangbogo",
        name: "장보고",
        role: "동아시아 해상왕",
        x: -22,
        z: 32,
        color: "#0891b2",
        emoji: "⛵",
        dialogue: "완도에 청해진을 설치하고 바다의 해적을 소탕하여 신라·당·일본을 잇는 평화로운 해상 무역길을 열었소. 바다를 품는 자가 세상을 얻는 법이지요!",
        quiz: {
          question: "신라 흥덕왕 때 완도에 청해진을 설치하여 해적을 물리치고 동아시아 해상 무역을 장악한 인물은 누구일까요?",
          options: ["장보고", "원효", "의상", "최치원"],
          answer: 0,
          explanation: "장보고는 완도 청해진을 거점으로 신라, 당, 일본을 연결하는 해상 무역 네트워크를 완성했습니다."
        }
      }
    ],

    objective: "담비 모피와 바다 진주를 수집하여 청해진의 '무역 상선'을 건조하세요!"
  },

  later_three_kingdoms: {
    id: "later_three_kingdoms",
    name: "후삼국시대",
    period: "892년 ~ 936년",
    themeColor: "#ec4899",
    skyColor: "#fed7e2",
    groundColor: "#89a888",
    ambientLight: "#ffffff",
    fogColor: "#fce7f3",
    subtitle: "분열의 혼란을 넘어 새로운 통합으로",
    centerName: "송악 / 철원 만월대",
    modernComparison: "개성 만월대 및 강원도 철원 궁예도성 터",

    territoryBoundary: [
      { x: -30, z: -25 },
      { x: 25, z: -20 },
      { x: 30, z: 35 },
      { x: -25, z: 35 },
      { x: -30, z: -25 }
    ],

    landmarks: [
      { name: "후고구려 철원성", x: 0, z: -25, type: "capital", icon: "🦅", desc: "궁예가 나라 이름을 태봉으로 바꾸고 옮겨간 수도" },
      { name: "후백제 완산주", x: -20, z: 15, type: "capital", icon: "🏯", desc: "견훤이 백제의 부흥을 외치며 세운 수도 (전주)" },
      { name: "신라 쇠락한 경주", x: 22, z: 22, type: "capital", icon: "🍂", desc: "천년의 영화를 뒤로하고 혼란에 휩싸인 신라" }
    ],

    constructionSite: {
      id: "later_three_granary",
      name: "민생 구호 창고 (흑창)",
      x: 0,
      z: -8,
      required: { basalt: 3, grain: 3 },
      current: { basalt: 0, grain: 0 },
      stage: 0,
      desc: "전란에 지친 백성들에게 봄철 곡식을 빌려주는 구호 제도"
    },

    resources: [
      { id: "basalt", name: "철원 현무암", icon: "🧱", color: "#475569", x: 2, z: -20, amount: 1 },
      { id: "grain", name: "백성 구호 곡식", icon: "🌾", color: "#eab308", x: 8, z: 2, amount: 1 },
      { id: "paper", name: "전주 닥나무", icon: "🎋", color: "#65a30d", x: -16, z: 10, amount: 1 }
    ],

    npcs: [
      {
        id: "wanggeon",
        name: "왕건 (태조)",
        role: "포용과 융합의 통합 군주",
        x: -2,
        z: -14,
        color: "#059669",
        emoji: "👑",
        dialogue: "오랜 전란으로 신음하는 백성들을 구제하고, 신라와 후백제, 나아가 멸망한 발해의 유민까지 포용하여 하나 된 나라를 열어야 하느니라.",
        quiz: {
          question: "후삼국의 분열을 수습하고 발해 유민까지 포용하여 민족의 재통일을 달성하고 고려를 건국한 인물은 누구일까요?",
          options: ["왕건", "궁예", "견훤", "견훤의 아들 신검"],
          answer: 0,
          explanation: "왕건은 포용 정책을 통해 신라를 평화적으로 흡수하고 후백제를 통합하여 후삼국 통일을 이룩했습니다."
        }
      }
    ],

    objective: "현무암과 곡식을 모아 백성을 돕는 '흑창(구호 창고)'을 세우세요!"
  },

  goryeo: {
    id: "goryeo",
    name: "고려시대",
    period: "918년 ~ 1392년",
    themeColor: "#0ea5e9",
    skyColor: "#bae6fd",
    groundColor: "#75a38a",
    ambientLight: "#ffffff",
    fogColor: "#e0f2fe",
    subtitle: "푸른 비색 청자와 찬란한 팔만대장경",
    centerName: "개경 만월대 / 벽란도",
    modernComparison: "개성 황궁 터 및 인천 강화도 고려궁지",

    territoryBoundary: [
      { x: -35, z: -40 },
      { x: 20, z: -35 },
      { x: 30, z: 35 },
      { x: -25, z: 35 },
      { x: -35, z: -40 }
    ],

    landmarks: [
      { name: "수도 개경 만월대", x: -8, z: -18, type: "capital", icon: "🏯", desc: "고려 500년 왕조의 정궁" },
      { name: "국제무역항 벽란도", x: -24, z: -8, type: "harbor", icon: "⛵", desc: "아라비아 상인이 왕래하며 '코리아(Korea)'를 알린 항구" },
      { name: "강화도 대몽항쟁지", x: -24, z: 4, type: "fortress", icon: "🛡️", desc: "몽골 침략에 맞서 천도했던 호국의 섬" }
    ],

    constructionSite: {
      id: "goryeo_tripitaka",
      name: "팔만대장경판 & 고려청자 가마",
      x: 8,
      z: 14,
      required: { clay: 3, wood_block: 3 },
      current: { clay: 0, wood_block: 0 },
      stage: 0,
      desc: "외적을 물리치고자 하는 염원을 담아 글자마다 정성을 들인 대장경판"
    },

    resources: [
      { id: "clay", name: "비색 청자 백토", icon: "🏺", color: "#065f46", x: -4, z: 24, amount: 1 },
      { id: "wood_block", name: "자작나무 경판재", icon: "🪵", color: "#b45309", x: 12, z: 14, amount: 1 },
      { id: "ginseng", name: "개성 고려인삼", icon: "🌱", color: "#15803d", x: -14, z: -12, amount: 1 }
    ],

    npcs: [
      {
        id: "seohui",
        name: "서희",
        role: "담판으로 영토를 넓힌 명외교관",
        x: -16,
        z: -10,
        color: "#0369a1",
        emoji: "📜",
        dialogue: "무력으로 맞서기 전, 상대의 의도를 꿰뚫는 외교 담판으로 압록강 동쪽 280리의 강동 6주를 피 한 방울 없이 확보했지요!",
        quiz: {
          question: "거란의 1차 침입 때 소손녕과의 당당한 외교 담판을 통해 강동 6주를 획득한 고려의 인물은 누구일까요?",
          options: ["서희", "강감찬", "윤관", "최무선"],
          answer: 0,
          explanation: "서희는 고려가 고구려를 계승한 나라임을 설득하여 거란군을 스스로 물러나게 하고 강동 6주를 얻었습니다."
        }
      },
      {
        id: "choidoson",
        name: "최무선",
        role: "화약 무기로 왜구를 격퇴한 과학자",
        x: -22,
        z: 0,
        color: "#b91c1c",
        emoji: "💣",
        dialogue: "끈질긴 연구 끝에 우리 땅에서 화약 제조법을 완성했소. 진포 해전에서 화포로 왜선 500척을 격파하여 바다를 지켜냈지요!",
        quiz: {
          question: "왜구의 침략을 막기 위해 화통도감을 설치하고 화약과 화포를 만들어 진포대첩에서 대승을 거둔 인물은 누구일까요?",
          options: ["최무선", "문익점", "이성계", "김유신"],
          answer: 0,
          explanation: "최무선은 우리나라 최초로 화약을 발명하고 화포 무기를 개발해 진포 해전에서 왜구를 물리쳤습니다."
        }
      }
    ],

    objective: "청자 백토와 자작나무를 모아 '팔만대장경판'을 완성하세요!"
  },

  joseon: {
    id: "joseon",
    name: "조선시대",
    period: "1392년 ~ 1910년",
    themeColor: "#f59e0b",
    skyColor: "#fed7aa",
    groundColor: "#7da88c",
    ambientLight: "#ffffff",
    fogColor: "#ffedd5",
    subtitle: "백성을 사랑한 한글과 찬란한 과학 기술",
    centerName: "한양 육조거리 / 경복궁",
    modernComparison: "서울 광화문 광장, 경복궁 근정전 및 수원화성",

    territoryBoundary: [
      { x: -35, z: -48 },
      { x: 15, z: -48 },
      { x: 30, z: 35 },
      { x: -25, z: 35 },
      { x: -35, z: -48 }
    ],

    landmarks: [
      { name: "한양 경복궁 근정전", x: -6, z: -2, type: "capital", icon: "🏯", desc: "조선 왕조의 으뜸 법궁" },
      { name: "수원화성 화서문", x: -8, z: 12, type: "fortress", icon: "🏰", desc: "정약용의 거중기를 활용해 축조한 과학적 성곽" },
      { name: "통제영 한산도 앞바다", x: 8, z: 36, type: "sea", icon: "🐢", desc: "이순신 장군이 학익진으로 대승을 거둔 승첩지" }
    ],

    constructionSite: {
      id: "joseon_turtle_ship",
      name: "훈민정음 반포 정자 & 거북선",
      x: 0,
      z: 18,
      required: { hanji: 3, timber: 3 },
      current: { hanji: 0, timber: 0 },
      stage: 0,
      desc: "백성을 위해 지은 훈민정음 해례본과 구국의 거북선"
    },

    resources: [
      { id: "brass", name: "측우기 주조 놋쇠", icon: "🌧️", color: "#ca8a04", x: -8, z: -10, amount: 1 },
      { id: "hanji", name: "훈민정음 닥한지", icon: "📜", color: "#e2e8f0", x: 2, z: -2, amount: 1 },
      { id: "timber", name: "거북선용 튼튼한 적송", icon: "🌲", color: "#166534", x: 6, z: 28, amount: 1 }
    ],

    npcs: [
      {
        id: "sejong",
        name: "세종대왕",
        role: "백성을 지극히 사랑한 성군",
        x: -6,
        z: -6,
        color: "#b45309",
        emoji: "👑",
        dialogue: "백성이 제 뜻을 쉽게 펴지 못함을 가엾게 여겨 스물여덟 자의 새 글자를 만들었노라. 집현전 학사들과 힘을 모아 훈민정음 해례본을 펴내자꾸나.",
        quiz: {
          question: "세종대왕이 백성들이 글을 쉽게 배우고 쓸 수 있도록 만든 우리나라 고유의 문자는 무엇일까요?",
          options: ["훈민정음 (한글)", "이두", "향찰", "한문"],
          answer: 0,
          explanation: "세종대왕은 1443년 백성을 사랑하는 마음으로 훈민정음을 창제하고 1446년에 반포하였습니다."
        }
      },
      {
        id: "yisunsin",
        name: "이순신 장군",
        role: "바다를 지킨 구국의 영웅",
        x: 6,
        z: 32,
        color: "#1e3a8a",
        emoji: "⚓",
        dialogue: "신에게는 아직 열두 척의 배가 남아 있사옵니다. 죽기를 각오하고 싸우면 반드시 살 길이 열릴 것이니, 나라를 지키는 일에 마음을 모으라!",
        quiz: {
          question: "임진왜란 당시 세계 최초의 철갑선으로 평가받는 거북선을 이끌고 한산도대첩과 명량대첩 등에서 나라를 구한 장군은 누구일까요?",
          options: ["이순신", "권율", "김시민", "곽재우"],
          answer: 0,
          explanation: "이순신 장군은 탁월한 전술과 거북선을 활용해 왜군의 보급로를 차단하고 나라를 구했습니다."
        }
      }
    ],

    objective: "닥한지와 적송을 모아 '훈민정음 정자 & 거북선'을 완성하세요!"
  }
};

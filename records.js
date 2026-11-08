// ================================================================
// 해시브라운 코딩 기록소 · 아카이브 데이터
// ================================================================
//
// 📌 새 기록 추가 방법
//   1. img/ 폴더에 원본 이미지 파일 추가 (어떤 포맷/크기도 OK)
//   2. 아래 템플릿 블록을 통째로 복사
//   3. RECORDS = [ 바로 아래에 붙여넣고 내용만 채우기
//   4. 저장 → 커밋 → 푸시
//      ↳ GitHub Actions가 자동으로 img/ → img-re/ AVIF 변환 & records.js 경로 수정
//
// ┌──────────────────── 새 기록 템플릿 (복사해서 사용) ─────────────────────┐
//
//   {
//     title: "제목을 입력하세요",
//     desc: "설명을 입력하세요\n두 번째 줄은 \\n으로 줄바꿈",
//     tags: "태그1, 태그2, 태그3",
//     category: "class-tools | games | automation | etc",
//     link: "https://연결할-링크-주소",
//     image: "img-re/파일명.avif",
//   },
//
// └─────────────────────────────────────────────────────────────────────────┘
//
// 🤖 이미지 자동 최적화: .github/workflows/optimize-images.yml
//    img/ 에 원본을 넣고 푸시하면 Actions가 img-re/ 에 150KB 이하 AVIF 생성
//
// ================================================================

export const RECORDS = [

  // ▼ 여기에 새 기록을 붙여넣으세요 (최신 항목을 맨 위에) ▼

  {
    title: "이세계골프",
    desc: "마법사·늑대 수인·드워프 등 7종족이 저마다의 능력으로 치는 도트 골프 게임이다. 손가락으로 직접 스윙하고, 혼자 쳐도 다른 사람의 실제 기록이 옆 타석에서 함께 라운딩한다.",
    tags: "golf, pixel, threejs, 3d, multiplayer, swing, games",
    category: "games",
    link: "./vibe-apps/isekai-golf/",
    image: "img-re/isekai-golf.avif",
  },

  {
    title: "AI 어드벤트 캘린더",
    desc: "산타 할아버지께 보낼 편지를 쓰면 크리스마스까지 관련 이미지와 덕담, 운세를 열어볼 수 있는 디지털 어드밴트 캘린더이다.",
    tags: "christmas, advent-calendar, threejs, 3d, kids, fortune, games",
    category: "games",
    link: "./vibe-apps/ai-advent/",
    image: "img-re/ai-advent.avif",
  },

  {
    title: "새야 새야 · 1894~1945",
    desc: "동학농민운동부터 광복까지 16턴 동안 나라와 백성을 지키는 도트 역사 디펜스 게임이다.",
    tags: "history, korean-history, independence, quiz, roguelike, pixel, games",
    category: "games",
    link: "./vibe-apps/saeya-saeya.html",
    image: "img-re/saeya-saeya.avif",
  },

  {
    title: "미미의 영어 레벨 체크",
    desc: "STAR Reading 형식을 따른 가정용 영어 읽기 레벨 체크다(유치원~12학년). 맞히면 어려워지고 틀리면 쉬워진다.",
    tags: "english, reading, star-reading, level-test, kids, class-tools",
    category: "class-tools",
    link: "./vibe-apps/mimi-english/",
    image: "img-re/mimi-english.avif",
  },

  {
    title: "도박의 덫 - LAST BET",
    desc: "친구의 메시지 한 통에서 시작되는 불법도박 예방 교육 시뮬레이션이다. 실제 돈은 쓰지 않는다.",
    tags: "gambling, prevention, simulation, education, class-tools",
    category: "class-tools",
    link: "./lastbet/",
    image: "img-re/lastbet.avif",
  },

  {
    title: "별헌터",
    desc: "밤하늘을 찍으면 센서로 별자리와 행성 위치를 계산해 겹쳐 보여주는 별 관찰 앱이다.",
    tags: "science, astronomy, constellation, camera, class-tools",
    category: "class-tools",
    link: "./vibe-apps/star-hunter.html",
    image: "img-re/star-hunter.avif",
  },

  {
    title: "박자게임 메이커",
    desc: "낱말을 넣으면 목소리와 음악을 박자에 맞춘 세로 영상을 만드는 도구다. Gemini API 키가 필요하다.",
    tags: "rhythm, word, video, gemini, class-tools",
    category: "class-tools",
    link: "./vibe-apps/beat-game-maker.html",
    image: "img-re/beat-game-maker.avif",
  },

  {
    title: "포켓몬수학",
    desc: "문제를 풀어 몬스터볼을 열고 도감을 채우는 1학년 수학 게임이다.",
    tags: "math, kids, pokemon, pomodoro, timer, pixel, games",
    category: "games",
    link: "./vibe-apps/pokemon-math/",
    image: "img-re/pokemon-math.avif",
  },

  {
    title: "톡톡 수콩마을",
    desc: "콩이와 함께 마을을 돌며 수 감각을 키우는 태블릿 터치 게임이다.",
    tags: "math, number-sense, kids, tablet, pixel, games",
    category: "games",
    link: "./vibe-apps/sukong-village.html",
    image: "img-re/sukong-village.avif",
  },

  {
    title: "지구 방위 · 에너지 문명",
    desc: "카드로 발전소와 방어 시설을 놓아 외계 침공을 막는 에너지·환경 도트 디펜스 게임이다.",
    tags: "energy, climate, recycling, environment, roguelike, pixel, games",
    category: "games",
    link: "./vibe-apps/earth-defense.html",
    image: "img-re/earth-defense.avif",
  },

  {
    title: "포켓몬 밥 타이머",
    desc: "정해진 시간 안에 밥을 다 먹으면 포켓몬이 나오는 어린이 식사 습관 타이머다.",
    tags: "meal, timer, pokemon, kids, habit, games",
    category: "games",
    link: "./vibe-apps/pokemon-bab-timer/",
    image: "img-re/pokemon-bab-timer.avif",
  },

  {
    title: "퍼스트클래스",
    desc: "우리 반을 비행기 일등석처럼 꾸민 자리배치·칭찬 점수판이다.",
    tags: "classroom, seating, score, praise, class-tools, first-class",
    category: "class-tools",
    link: "./vibe-apps/first-class.html",
    image: "img-re/first-class.avif",
  },

  {
    title: "붕당 - 전하, 결단하소서!",
    desc: "웹캠 앞에서 왕이 되어 손을 들어 붕당의 상소를 판결하는 역사 게임이다.",
    tags: "history, joseon, bungdang, game, mediapipe, webcam, motion, roguelike, korean-history",
    category: "games",
    link: "./vibe-apps/bungdang/bungdang.html",
    image: "img-re/bungdang.avif",
  },

  {
    title: "학급 매체 수업",
    desc: "메일, 메시지, 게시판을 학급에서 실제로 체험하는 5학년 매체 단원 수업 도구다.",
    tags: "media, education, elementary, email, message, board, classroom, class-tools",
    category: "class-tools",
    link: "./vibe-apps/class-media-lab.html",
    image: "img-re/class-media-lab.avif",
  },

  {
    title: "필사의 노력",
    desc: "손글씨를 정밀 진단해 6대 지표 점수와 맞춤 인증서를 발급하는 필사 도구다.\n도움: 정세훈 선생님",
    tags: "handwriting, calligraphy, education, ai, ocr, certificate, class-tools",
    category: "class-tools",
    link: "./vibe-apps/필사의노력.html",
    image: "img-re/pilsa.avif",
  },

  {
    title: "적토마가 되었다",
    desc: "삼국지 전장을 제자리에서 질주하는 모션 러닝 액션 게임이다. 키보드 모드와 4인 플레이도 된다.",
    tags: "game, threejs, mediapipe, motion, webcam, running, action, samgukji, redhare, multiplayer",
    category: "games",
    link: "./vibe-apps/jeoktoma.html",
    image: "img-re/jeoktoma.avif",
  },

  {
    title: "현대로 간 정약용을 키워라",
    desc: "현대로 타임슬립한 정약용을 훌륭한 인재로 키우는 육성 시뮬레이션 게임이다.",
    tags: "history, simulation, pixel, game, dasan, jeongyagyong",
    category: "games",
    link: "./vibe-apps/dasan-game.html",
    image: "img-re/dasan-game.avif",
  },

  {
    title: "철학자 월드컵",
    desc: "동서양 철학자 36명이 삶과 사회의 난제를 두고 AI 토론을 벌이는 토너먼트 시뮬레이션이다.",
    tags: "philosophy, tournament, AI, gemini, claude, debate, education",
    category: "games",
    link: "./vibe-apps/philosopher-worldcup.html",
    image: "img-re/philosopher-worldcup.avif",
  },

  {
    title: "영조를 설득하라",
    desc: "세손이 되어 뒤주에 갇힌 사도세자를 살려 달라고 영조를 설득하는 AI 역사 시뮬레이션이다. 무료 API 키가 필요하다.",
    tags: "history, joseon, persuasion, AI, gemini, simulation, korean-history",
    category: "games",
    link: "./vibe-apps/yeongjo-1762.html",
    image: "img-re/yeongjo-1762.avif",
  },

  {
    title: "영상 연습 오버레이 · 동작 연습 도구",
    desc: "기준 영상과 내 웹캠을 겹치거나 나란히 놓고 비교하는 동작 연습 도구다.",
    tags: "video, overlay, split-screen, golf, dance, practice, analysis",
    category: "class-tools",
    link: "./vibe-apps/golf-swing-trainer.html",
    image: "img-re/golf-swing-trainer.avif",
  },

  {
    title: "수박깨기",
    desc: "눈을 감고 진동과 소리로 위치를 찾아 수박을 깨는 여름 미니게임이다.",
    tags: "game, summer, sound, vibration",
    category: "games",
    link: "./vibe-apps/watermelon_smash.html",
    image: "img-re/watermelon_smash.avif",
  },

  {
    title: "모기사냥",
    desc: "스마트폰으로 모기를 잡는 게임 앱이다. 앱인토스에 출시됐다. [바로가기](https://minion.toss.im/5W2f6ywp)",
    tags: "game, mosquito, catch, clicker",
    category: "games",
    link: "./vibe-apps/mosquito-sniper.html",
    image: "img-re/mosquito_hunt.avif",
  },

  {
    title: "멀티 룰렛",
    desc: "행사나 저녁 메뉴를 정할 때 쓰는 여러 칸 룰렛이다.",
    tags: "class-tools, roulette, random, fun",
    category: "class-tools",
    link: "./vibe-apps/Multi-roulette.html",
    image: "img-re/multi-roulette.avif",
  },

  {
    title: "이미지 영상 제작기",
    desc: "여러 장의 사진을 화면비에 맞춰 배치하고 전환 효과를 넣어 MP4 영상으로 만드는 도구다.",
    tags: "video, image, transition, slideshow, ffmpeg",
    category: "automation",
    link: "./vibe-apps/image-video-maker.html",
    image: "img-re/image-video-maker.avif",
  },

  {
    title: "한글자",
    desc: "문구를 넣으면 종이 한 장에 한 글자씩 크게 출력해 주는 배너용 웹앱이다.",
    tags: "print, classroom, banner, tool",
    category: "class-tools",
    link: "./vibe-apps/한글자.html",
    image: "img-re/hangulja.avif",
  },

  {
    title: "나의 악보집",
    desc: "기타 코드와 가사를 함께 보며 자동 스크롤로 연주하는 웹 악보집이다.",
    tags: "guitar, chord, band, songbook",
    category: "games",
    link: "./밴드공연 악보/songbook.html",
    image: "img-re/22.avif",
  },

  {
    title: "돈병풍 메이커",
    desc: "도안·문구·금액을 골라 PDF로 출력해 조립하는 용돈 돈병풍 도구다.",
    tags: "diy, craft, unplugged",
    category: "etc",
    link: "./vibe-apps/donbyeongpung_v3.html",
    image: "img-re/21.avif",
  },

  {
    title: "보드게임 메이커",
    desc: "도블, 빙고, 사다리와 뱀 같은 수업용 보드게임판과 카드를 AI와 만들어 출력하는 도구다. 현재 기능 보수 중이다.",
    tags: "codex, boardgame, unplugged",
    category: "games",
    link: "./boardgame_maker/boardgame-maker.html",
    image: "img-re/20.avif",
  },

  {
    title: "속담 그림 퀴즈",
    desc: "그림을 직접 그리며 저학년 속담의 상황과 뜻을 익히는 퀴즈다.\n[샘플 그림 데이터 다운로드](./vibe-apps/속담그림퀴즈_백업데이터.json)",
    tags: "gemini",
    category: "class-tools",
    link: "./vibe-apps/속담그림퀴즈.html",
    image: "img-re/19.avif",
  },

  {
    title: "학급 라디오",
    desc: "아이들이 QR로 보낸 사연을 교실 컴퓨터가 자동으로 읽어 주고 방송하는 학급 라디오다.",
    tags: "claude, firebase",
    category: "class-tools",
    link: "./vibe-apps/radio.html",
    image: "img-re/18.avif",
  },

  {
    title: "랜덤 짝뽑기",
    desc: "랜덤 짝을 뽑고 친해지기 활동을 골라 주는 점심시간 짝 활동 도구다.",
    tags: "codex",
    category: "class-tools",
    link: "./vibe-apps/pair-draw.html",
    image: "img-re/17.avif",
  },

  {
    title: "바탕화면 선긋기 매니저",
    desc: "바탕화면 아이콘 영역을 자동으로 찾아 테두리와 라벨을 그려 주는 무설치 정리 유틸리티다.",
    tags: "gemini, opencv",
    category: "automation",
    link: "https://jeongdawoont-star.github.io/wallpaper_line",
    image: "img-re/16.avif",
  },

  {
    title: "아이 아침 플래너",
    desc: "아침에 할 일을 하나씩 체크하며 등교 준비를 돕는 아이용 플래너다.",
    tags: "copilot",
    category: "class-tools",
    link: "./vibe-apps/Child%20Morning.html",
    image: "img-re/15.avif",
  },

  {
    title: "두근두근 보물찾기",
    desc: "고전 지뢰찾기를 응용한 2인용 보물찾기 게임이다.",
    tags: "gemini",
    category: "games",
    link: "./vibe-apps/find-tresure.html",
    image: "img-re/14.avif",
  },

  {
    title: "도블 메이커",
    desc: "직접 넣은 그림과 사진으로 하는 도블 스타일 짝 맞추기 게임이다.",
    tags: "gemini",
    category: "games",
    link: "./vibe-apps/doble-maker.html",
    image: "img-re/13.avif",
  },

  {
    title: "충역 - 왜란의 그림자",
    desc: "진행자와 실물 카드 없이 태블릿 1대로 10명까지 하는 임진왜란판 마피아 게임이다.",
    tags: "claude, gemini",
    category: "games",
    link: "./vibe-apps/Choong-Yeok-the-Loyalty-and-Traitor-web.html",
    image: "img-re/12.avif",
  },

  {
    title: "바이브코딩하는 만화",
    desc: "바이브 코딩에 대한 생각을 그린 만화다.",
    tags: "",
    category: "etc",
    link: "https://www.instagram.com/p/DWy1CxMGgf9/?igsh=MTE0dXZncTRiM3Vtag==",
    image: "img-re/11.avif",
  },

  {
    title: "학생 과제 트랙커 (데모)",
    desc: "학생이 태블릿에서 과제를 체크하면 교사 엑셀에 기록되는 과제 확인 도구다.",
    tags: "copilot",
    category: "class-tools",
    link: "./vibe-apps/student-tracker-demo.html",
    image: "img-re/10.avif",
  },

  {
    title: "엑셀 한글 사전",
    desc: "호치민 학생들의 어휘 학습을 돕는 엑셀 한글 사전·어휘 카드 도구다. 사용 전 사전 설정이 필요하다.",
    tags: "copilot",
    category: "automation",
    link: "https://docs.google.com/spreadsheets/u/0/d/17jj3yravBhx2R8nkGo84Di9i7XOPsG7bkypkwUYT8OI/copy?authuser=0",
    image: "img-re/9.avif",
  },

  {
    title: "학급 사건 조사서 (데모)",
    desc: "학생 입력을 AI가 분석해 지도 내용과 학부모 안내 문자를 써 주는 학급 사건 기록 도구다.",
    tags: "gemini, firebase",
    category: "class-tools",
    link: "./vibe-apps/songsabot.html",
    image: "img-re/8.avif",
  },

  {
    title: "받아쓰기 음성 생성기",
    desc: "받아쓰기 급수표 글자만 넣으면 음성을 만들어 주는 도구다.",
    tags: "",
    category: "automation",
    link: "./vibe-apps/%EB%B0%9B%EC%95%84%EC%93%B0%EA%B8%B0%20Studio.html",
    image: "img-re/7.avif",
  },

  {
    title: "주간학습/알림장 자동화 (데모)",
    desc: "내용을 한꺼번에 넣으면 알림장과 주간학습 엑셀을 자동으로 만들어 주는 도구다.",
    tags: "",
    category: "automation",
    link: "./vibe-apps/weekly-notice-automation.html",
    image: "img-re/6.avif",
  },

  {
    title: "미술 조형요소 자동수업",
    desc: "조형요소와 조형원리를 음성과 함께 설명하는 미술 수업 세트다.",
    tags: "claude",
    category: "automation",
    link: "./vibe-apps/%EC%A1%B0%ED%98%95%EC%9A%94%EC%86%8C%20%EC%8A%AC%EB%9D%BC%EC%9D%B4%EB%93%9C.html",
    image: "img-re/5.avif",
  },

  {
    title: "사회 공개수업 활동자료 (5학년 날씨와 기후)",
    desc: "5학년 날씨와 기후 단원의 학습지와 퀴즈를 html로 만든 공개수업 자료다.",
    tags: "gemini",
    category: "automation",
    link: "./vibe-apps/%EC%82%AC%ED%9A%8C%EA%B3%B5%EA%B0%9C%EC%88%98%EC%97%85%EB%8C%80%EB%B3%B8.html",
    image: "img-re/4.avif",
  },

  {
    title: "덧뺄셈 진화게임",
    desc: "덧셈 뺄셈을 풀수록 알에서 여러 동물로 진화하는 셈 게임이다.",
    tags: "",
    category: "games",
    link: "https://claude.ai/public/artifacts/5853c966-42fa-4d66-9664-aad266340014",
    image: "img-re/3.avif",
  },

  {
    title: "영어게임 워드 워",
    desc: "한 키보드로 둘이 겨루는 영단어 대전 게임이다.",
    tags: "",
    category: "games",
    link: "https://hash2n.my.canva.site/wordwar",
    image: "img-re/2.avif",
  },

  {
    title: "코딩 기록 시작",
    desc: "만든 작품을 올리기 시작한 첫 기록이다.",
    tags: "",
    category: "etc",
    link: "https://www.instagram.com/p/DWjF75eGruc/?img_index=18&igsh=MXBlaXh1dWp3a3g2Zw==",
    image: "img-re/1.avif",
  },

];

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
    title: "나의 악보집",
    desc: "기타 코드와 가사를 함께 볼 수 있는 웹 악보집이다.\n자동 스크롤, 코드 운지법 다이어그램 표시, 유튜브 연동을 지원한다.\n나만의 악보를 직접 추가하여 연주에 활용할 수 있다.",
    tags: "guitar, chord, band, songbook",
    category: "games",
    link: "#",
    image: "img-re/22.avif",
  },

  {
    title: "돈병풍 메이커",
    desc: "생신 용돈 드리기 위해 알아보다가\n구매 대신 셀프로 만들어 드렸다.\n4종 도안 및 문구 수정 가능.\n금액 조절 가능. PDF 출력 후 조립하면 된다.",
    tags: "diy, craft, unplugged",
    category: "etc",
    link: "./vibe-apps/donbyeongpung_v3.html",
    image: "img-re/21.avif",
  },

  {
    title: "보드게임 메이커",
    desc: "언플러그드 상황에서도 AI와 함께\n실물 보드게임을 만들 수 있도록 제작하였다.\n도블, 빙고, 사다리와 뱀 등 수업용 게임판과 카드를\n바로 출력해 사용할 수 있게 하는 도구다.\n\n현재 기능 보수중.",
    tags: "codex, boardgame, unplugged",
    category: "games",
    link: "./boardgame_maker/boardgame-maker.html",
    image: "img-re/20.avif",
  },

  {
    title: "속담 그림 퀴즈",
    desc: "저학년 속담을 익혀야 하는 아이를 위해 만들었다.\n그림으로 직접 그리면서 속담의 상황을 느끼고\n의미를 더 잘 이해하는 것 같다.\n\n[샘플 그림 데이터 다운로드](./vibe-apps/속담그림퀴즈_백업데이터.json)",
    tags: "gemini",
    category: "class-tools",
    link: "./vibe-apps/속담그림퀴즈.html",
    image: "img-re/19.avif",
  },

  {
    title: "학급 라디오",
    desc: "아이들이 QR로 각자 사연을 넣으면\n파이어베이스를 통해 서버에 모이고\n교실컴에서 재생을 한 번만 누르면\n자동으로 사연을 읽어주고 재생까지 해준다.\n설정된 시간 안에 사연을 균등하게 방송하고\n마지막엔 명언이나 속담 등으로 마무리한다.",
    tags: "claude, firebase",
    category: "class-tools",
    link: "./vibe-apps/radio.html",
    image: "img-re/18.avif",
  },

  {
    title: "랜덤 짝뽑기",
    desc: "아이들이 친구들과 친해질 수 있는 방법으로\n랜덤짝을 뽑아 점심시간 활동하기를 추천해서\n만들어주었다.\nPNG로 저장 후 띄워놓기 가능.\n친해지기 활동 100개 정도 넣어놨다.",
    tags: "codex",
    category: "class-tools",
    link: "./vibe-apps/pair-draw.html",
    image: "img-re/17.avif",
  },

  {
    title: "바탕화면 선긋기 매니저",
    desc: "지저분한 바탕화면 아이콘을 깔끔하게 묶어 준다.\nOpenCV를 활용해 아이콘 배치 영역을 자동으로 감지하여\n바탕화면에 예쁜 테두리와 라벨을 그려주는 무설치 유틸리티다.",
    tags: "gemini, opencv",
    category: "automation",
    link: "https://jeongdawoont-star.github.io/wallpaper_line",
    image: "img-re/16.avif",
  },

  {
    title: "아이 아침 플래너",
    desc: "등교 준비가 힘든 아이를 위해 만들었다.\n아침에 해야할 일들을 입력하면\n체크박스로 하나씩 체크하면서 준비할 수 있다.\n하루 미션 완료 시 고양이가 자동으로 집에 들어온다.",
    tags: "copilot",
    category: "class-tools",
    link: "./vibe-apps/Child%20Morning.html",
    image: "img-re/15.avif",
  },

  {
    title: "두근두근 보물찾기",
    desc: "보물찾기를 좋아하는 아이를 위해 만들었다.\n고전 지뢰찾기를 응용함.\n2인 플레이 하다보면 시간이 금방 간다.",
    tags: "gemini",
    category: "games",
    link: "./vibe-apps/find-tresure.html",
    image: "img-re/14.avif",
  },

  {
    title: "도블 메이커",
    desc: "아이랑 게임하려고 만들었다.\n실제 도블과는 다르지만 직접 그림과 사진을 넣는 것이 포인트.\n끌어 놓아야 매칭이 된다.",
    tags: "gemini",
    category: "games",
    link: "./vibe-apps/doble-maker.html",
    image: "img-re/13.avif",
  },

  {
    title: "충역 - 왜란의 그림자",
    desc: "임진왜란판 레지스탕스 아발론.\n진화된 마피아 게임이라고 생각하면 된다.\n보드게임을 진행자 없이, 실물 카드 없이 할 수 있게 개조했다.\n토요한글학교에서 아이들과 하려고 제작.\n태블릿1대로 10명까지 플레이 가능.\n모바일 크롬에서 잘 됨",
    tags: "claude, gemini",
    category: "games",
    link: "./vibe-apps/Choong-Yeok-the-Loyalty-and-Traitor-web.html",
    image: "img-re/12.avif",
  },

  {
    title: "바이브코딩하는 만화",
    desc: "내가 생각하는 바이브 코딩\n아직 제작 수준 미달이라\n혼자먹긴 맛있는데\n남한테 팔순없는 수준\n해썹인증같은거 못받음",
    tags: "",
    category: "etc",
    link: "https://www.instagram.com/p/DWy1CxMGgf9/?igsh=MTE0dXZncTRiM3Vtag==",
    image: "img-re/11.avif",
  },

  {
    title: "학생 과제 트랙커 (데모)",
    desc: "나는 이게 너무 쓸모있다.\n15년간 종이 명렬표에 과제 체크하던걸 셀프 터치로 바꿨다.\n애들이 탭에 체크하면 내 엑셀에 기록된다.",
    tags: "copilot",
    category: "class-tools",
    link: "./vibe-apps/student-tracker-demo.html",
    image: "img-re/10.avif",
  },

  {
    title: "엑셀 한글 사전",
    desc: "호치민 학생들의 어휘능력 향상을 돕기위해 개발.\n(은)사실 내가 수업할때 편하려고 제작.\n외부 api 2개정도 구해다 놓으면 굉장히 편리한 사전이 된다.\n어휘학습카드도 제작되고.\n아직 인가전이라 [고급]눌러서 동의해야함.\n사전설정 필수. 해적판 아님.",
    tags: "copilot",
    category: "automation",
    link: "https://docs.google.com/spreadsheets/u/0/d/17jj3yravBhx2R8nkGo84Di9i7XOPsG7bkypkwUYT8OI/copy?authuser=0",
    image: "img-re/9.avif",
  },

  {
    title: "학급 사건 조사서 (데모)",
    desc: "막대한 학급 송사를 처리하려고 만들었다\n\n학생 입력-서버 기록-AI 분석\n학생에겐 지도내용을\n학부모에겐 안내문자를 써줌\n누가 기록도 되고\n자동으로 폰에 메시지로 넘어옴",
    tags: "gemini, firebase",
    category: "class-tools",
    link: "./vibe-apps/songsabot.html",
    image: "img-re/8.avif",
  },

  {
    title: "받아쓰기 음성 생성기",
    desc: "받아쓰기 급수표는 있는데 음성은 없다니\n교사의 목을 아껴주기 위해 만들었다\n텍스트만 넣으면 음성 생성 가능",
    tags: "",
    category: "automation",
    link: "./vibe-apps/%EB%B0%9B%EC%95%84%EC%93%B0%EA%B8%B0%20Studio.html",
    image: "img-re/7.avif",
  },

  {
    title: "주간학습/알림장 자동화 (데모)",
    desc: "학년부장 업무 중\n매일 알림장\n매주 주간학습 엑셀로 만들어 공유하기\n매번 새시트 만들고 내용쓰기 번거로워\n몽땅 때려넣고 클릭만 하면\n자동 생성되게 만들었다\n\n제작툴: gemini",
    tags: "",
    category: "automation",
    link: "./vibe-apps/weekly-notice-automation.html",
    image: "img-re/6.avif",
  },

  {
    title: "미술 조형요소 자동수업",
    desc: "조형요소와 조형원리를 설명해주고\n어떻게 표현하는지 알려주는 수업세트\n음성도 출력된다",
    tags: "claude",
    category: "automation",
    link: "./vibe-apps/%EC%A1%B0%ED%98%95%EC%9A%94%EC%86%8C%20%EC%8A%AC%EB%9D%BC%EC%9D%B4%EB%93%9C.html",
    image: "img-re/5.avif",
  },

  {
    title: "사회 공개수업 활동자료 (5학년 날씨와 기후)",
    desc: "교육과정 개정되면서 자료가 하나도 없어서\nhtml로 학습지랑 퀴즈 자료 만들었다",
    tags: "gemini",
    category: "automation",
    link: "./vibe-apps/%EC%82%AC%ED%9A%8C%EA%B3%B5%EA%B0%9C%EC%88%98%EC%97%85%EB%8C%80%EB%B3%B8.html",
    image: "img-re/4.avif",
  },

  {
    title: "덧뺄셈 진화게임",
    desc: "외식하러 갔다가 지루해 하는 딸을 위해\n즉석으로 만들어준 셈게임\n알에서부터 온갖 동물로 진화한다\n\n제작툴: 클로드",
    tags: "",
    category: "games",
    link: "https://claude.ai/public/artifacts/5853c966-42fa-4d66-9664-aad266340014",
    image: "img-re/3.avif",
  },

  {
    title: "영어게임 워드 워",
    desc: "바이브코딩 첫 시험작\n영단어로 하는 브롤스타즈\n컴퓨터실 감성으로 1키보드 2P 지원\n제작툴: Canva",
    tags: "",
    category: "games",
    link: "https://hash2n.my.canva.site/wordwar",
    image: "img-re/2.avif",
  },

  {
    title: "코딩 기록 시작",
    desc: "만든 작품들을 올려보려 합니다",
    tags: "",
    category: "etc",
    link: "https://www.instagram.com/p/DWjF75eGruc/?img_index=18&igsh=MXBlaXh1dWp3a3g2Zw==",
    image: "img-re/1.avif",
  },

];

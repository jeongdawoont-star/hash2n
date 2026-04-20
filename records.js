// ================================================================
// 해시 코딩 기록소 · 아카이브 데이터
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
//     link: "https://연결할-링크-주소",
//     image: "img/파일명.jpg",
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
    title: "도블 메이커",
    desc: "아이랑 게임하려고 만들었다.\n실제 도블과는 다르지만 직접 그림과 사진을 넣는 것이 포인트.\n끌어 놓아야 매칭이 된다.",
    tags: "gemini",
    link: "https://jeongdawoont-star.github.io/hash2n/vibe-apps/doble-maker.html",
    image: "img/13.png",
  },

  {
    title: "충역 - 왜란의 그림자",
    desc: "임진왜란판 레지스탕스 아발론.\n진화된 마피아 게임이라고 생각하면 된다.\n보드게임을 진행자 없이, 실물 카드 없이 할 수 있게 개조했다.\n토요한글학교에서 아이들과 하려고 제작.\n태블릿1대로 10명까지 플레이 가능.\n모바일 크롬에서 잘 됨",
    tags: "claude, gemini",
    link: "http://jeongdawoont-star.github.io/hash2n/vibe-apps/Choong-Yeok-the-Loyalty-and-Traitor.html",
    image: "img-re/12.avif",
  },

  {
    title: "바이브코딩하는 만화",
    desc: "내가 생각하는 바이브 코딩\n아직 제작 수준 미달이라\n혼자먹긴 맛있는데\n남한테 팔순없는 수준\n해썹인증같은거 못받음",
    tags: "",
    link: "https://www.instagram.com/p/DWy1CxMGgf9/?igsh=MTE0dXZncTRiM3Vtag==",
    image: "img-re/11.avif",
  },

  {
    title: "학생 과제 트랙커 (데모)",
    desc: "나는 이게 너무 쓸모있다.\n15년간 종이 명렬표에 과제 체크하던걸 셀프 터치로 바꿨다.\n애들이 탭에 체크하면 내 엑셀에 기록된다.",
    tags: "copilot",
    link: "https://jeongdawoont-star.github.io/hash2n/vibe-apps/student-tracker-demo.html",
    image: "img-re/10.avif",
  },

  {
    title: "엑셀 한글 사전",
    desc: "호치민 학생들의 어휘능력 향상을 돕기위해 개발.\n(은)사실 내가 수업할때 편하려고 제작.\n외부 api 2개정도 구해다 놓으면 굉장히 편리한 사전이 된다.\n어휘학습카드도 제작되고.\n아직 인가전이라 [고급]눌러서 동의해야함.\n사전설정 필수. 해적판 아님.",
    tags: "copilot",
    link: "https://docs.google.com/spreadsheets/u/0/d/17jj3yravBhx2R8nkGo84Di9i7XOPsG7bkypkwUYT8OI/copy?authuser=0",
    image: "img-re/9.avif",
  },

  {
    title: "학급 사건 조사서 (데모)",
    desc: "막대한 학급 송사를 처리하려고 만들었다\n\n학생 입력-서버 기록-AI 분석\n학생에겐 지도내용을\n학부모에겐 안내문자를 써줌\n누가 기록도 되고\n자동으로 폰에 메시지로 넘어옴",
    tags: "gemini, firebase",
    link: "https://jeongdawoont-star.github.io/hash2n/vibe-apps/songsabot.html",
    image: "img-re/8.avif",
  },

  {
    title: "받아쓰기 음성 생성기",
    desc: "받아쓰기 급수표는 있는데 음성은 없다니\n교사의 목을 아껴주기 위해 만들었다\n텍스트만 넣으면 음성 생성 가능",
    tags: "",
    link: "https://jeongdawoont-star.github.io/hash2n/vibe-apps/%EB%B0%9B%EC%95%84%EC%93%B0%EA%B8%B0%20Studio.html",
    image: "img-re/7.avif",
  },

  {
    title: "주간학습/알림장 자동화 (데모)",
    desc: "학년부장 업무 중\n매일 알림장\n매주 주간학습 엑셀로 만들어 공유하기\n매번 새시트 만들고 내용쓰기 번거로워\n몽땅 때려넣고 클릭만 하면\n자동 생성되게 만들었다\n\n제작툴: gemini",
    tags: "",
    link: "https://jeongdawoont-star.github.io/hash2n/vibe-apps/weekly-notice-automation.html",
    image: "img-re/6.avif",
  },

  {
    title: "미술 조형요소 자동수업",
    desc: "조형요소와 조형원리를 설명해주고\n어떻게 표현하는지 알려주는 수업세트\n음성도 출력된다",
    tags: "claude",
    link: "https://jeongdawoont-star.github.io/hash2n/vibe-apps/%EC%A1%B0%ED%98%95%EC%9A%94%EC%86%8C%20%EC%8A%AC%EB%9D%BC%EC%9D%B4%EB%93%9C.html",
    image: "img-re/5.avif",
  },

  {
    title: "사회 공개수업 활동자료 (5학년 날씨와 기후)",
    desc: "교육과정 개정되면서 자료가 하나도 없어서\nhtml로 학습지랑 퀴즈 자료 만들었다",
    tags: "gemini",
    link: "https://jeongdawoont-star.github.io/hash2n/vibe-apps/%EC%82%AC%ED%9A%8C%EA%B3%B5%EA%B0%9C%EC%88%98%EC%97%85%EB%8C%80%EB%B3%B8.html",
    image: "img-re/4.avif",
  },

  {
    title: "덧뺄셈 진화게임",
    desc: "외식하러 갔다가 지루해 하는 딸을 위해\n즉석으로 만들어준 셈게임\n알에서부터 온갖 동물로 진화한다\n\n제작툴: 클로드",
    tags: "",
    link: "https://claude.ai/public/artifacts/5853c966-42fa-4d66-9664-aad266340014",
    image: "img-re/3.avif",
  },

  {
    title: "영어게임 워드 워",
    desc: "바이브코딩 첫 시험작\n영단어로 하는 브롤스타즈\n컴퓨터실 감성으로 1키보드 2P 지원\n제작툴: Canva",
    tags: "",
    link: "https://hash2n.my.canva.site/wordwar",
    image: "img-re/2.avif",
  },

  {
    title: "코딩 기록 시작",
    desc: "만든 작품들을 올려보려 합니다",
    tags: "",
    link: "https://www.instagram.com/p/DWjF75eGruc/?img_index=18&igsh=MXBlaXh1dWp3a3g2Zw==",
    image: "img-re/1.avif",
  },

];

/* ═══════════════════════════════════════════════════════════
   스포츠 토토 실경기 DB — betedu(gambling-prevention-app.jsx)에서 그대로 추출
   필드: home, away, league, note, oddsHome, oddsDraw(축구만), oddsAway, result, score
   ═══════════════════════════════════════════════════════════ */

const SPORTS_DB = {
    soccer: [

  { home:"파리 생제르맹",   away:"인터 밀란",      league:"챔피언스리그", note:"24-25 결승", oddsHome:2.10, oddsDraw:3.50, oddsAway:3.40, result:"home", score:"5-0" },
  { home:"맨체스터 시티",   away:"레알 마드리드",  league:"챔피언스리그", note:"22-23 4강",  oddsHome:1.70, oddsDraw:4.00, oddsAway:4.50, result:"home", score:"4-0" },
  { home:"나폴리",          away:"리버풀",         league:"챔피언스리그", note:"22-23 조별", oddsHome:2.60, oddsDraw:3.60, oddsAway:2.50, result:"home", score:"4-1" },
  { home:"아스널",          away:"레알 마드리드",  league:"챔피언스리그", note:"24-25 8강",  oddsHome:2.30, oddsDraw:3.50, oddsAway:2.90, result:"home", score:"3-0" },
  { home:"도르트문트",      away:"바르셀로나",     league:"챔피언스리그", note:"24-25 8강",  oddsHome:3.20, oddsDraw:3.80, oddsAway:2.10, result:"home", score:"3-1" },
  { home:"인터 밀란",       away:"바이에른 뮌헨",  league:"챔피언스리그", note:"24-25 8강",  oddsHome:3.00, oddsDraw:3.50, oddsAway:2.30, result:"draw", score:"2-2" },
  { home:"아스톤 빌라",     away:"파리 생제르맹",  league:"챔피언스리그", note:"24-25 8강",  oddsHome:3.40, oddsDraw:3.70, oddsAway:2.00, result:"home", score:"3-2" },
  { home:"레알 마드리드",   away:"파리 생제르맹",  league:"챔피언스리그", note:"21-22 16강", oddsHome:2.20, oddsDraw:3.60, oddsAway:3.00, result:"home", score:"3-1" },
  { home:"레알 마드리드",   away:"도르트문트",     league:"챔피언스리그", note:"23-24 결승", oddsHome:1.90, oddsDraw:3.70, oddsAway:3.90, result:"home", score:"2-0" },
  { home:"맨체스터 시티",   away:"인터 밀란",      league:"챔피언스리그", note:"22-23 결승", oddsHome:1.65, oddsDraw:3.70, oddsAway:5.50, result:"home", score:"1-0" },
  { home:"레알 마드리드",   away:"리버풀",         league:"챔피언스리그", note:"21-22 결승", oddsHome:2.90, oddsDraw:3.30, oddsAway:2.40, result:"home", score:"1-0" },
  { home:"바이에른 뮌헨",   away:"라치오",         league:"챔피언스리그", note:"23-24 16강", oddsHome:1.40, oddsDraw:4.80, oddsAway:7.00, result:"home", score:"3-0" },
],
    baseball: [

  { home:"LG 트윈스",     away:"KT 위즈",       league:"KBO 리그", note:"23 시즌",  oddsHome:1.75, oddsAway:2.05, result:"home", score:"6-3" },
  { home:"삼성 라이온즈", away:"KIA 타이거즈",  league:"KBO 리그", note:"24 시즌",  oddsHome:2.05, oddsAway:1.75, result:"away", score:"2-5" },
  { home:"SSG 랜더스",    away:"두산 베어스",   league:"KBO 리그", note:"23 시즌",  oddsHome:1.85, oddsAway:1.95, result:"away", score:"4-7" },
  { home:"NC 다이노스",   away:"키움 히어로즈", league:"KBO 리그", note:"24 시즌",  oddsHome:1.70, oddsAway:2.10, result:"home", score:"5-3" },
  { home:"한화 이글스",   away:"롯데 자이언츠", league:"KBO 리그", note:"25 시즌",  oddsHome:1.90, oddsAway:1.90, result:"home", score:"8-6" },
  { home:"KT 위즈",       away:"삼성 라이온즈", league:"KBO 리그", note:"24 시즌",  oddsHome:1.95, oddsAway:1.85, result:"away", score:"1-2" },
  { home:"KIA 타이거즈",  away:"두산 베어스",   league:"KBO 리그", note:"24 시즌",  oddsHome:1.65, oddsAway:2.20, result:"home", score:"9-4" },
  { home:"한화 이글스",   away:"NC 다이노스",   league:"KBO 리그", note:"25 시즌",  oddsHome:1.95, oddsAway:1.85, result:"away", score:"5-7" },
  { home:"SSG 랜더스",    away:"KT 위즈",       league:"KBO 리그", note:"22 시즌",  oddsHome:1.80, oddsAway:2.00, result:"home", score:"6-3" },
  { home:"롯데 자이언츠", away:"키움 히어로즈", league:"KBO 리그", note:"23 시즌",  oddsHome:1.88, oddsAway:1.92, result:"home", score:"5-4" },
  { home:"LG 트윈스",     away:"한화 이글스",   league:"KBO 리그", note:"25 시즌",  oddsHome:1.60, oddsAway:2.30, result:"home", score:"10-2" },
  { home:"키움 히어로즈", away:"두산 베어스",   league:"KBO 리그", note:"22 시즌",  oddsHome:2.10, oddsAway:1.72, result:"home", score:"3-1" },
],
    basketball: [

  { home:"오클라호마시티 썬더", away:"인디애나 페이서스",   league:"NBA", note:"24-25 파이널 G7", oddsHome:1.55, oddsAway:2.45, result:"home", score:"103-91" },
  { home:"인디애나 페이서스",   away:"오클라호마시티 썬더", league:"NBA", note:"24-25 파이널 G1", oddsHome:2.60, oddsAway:1.50, result:"home", score:"111-110" },
  { home:"오클라호마시티 썬더", away:"인디애나 페이서스",   league:"NBA", note:"24-25 파이널 G2", oddsHome:1.50, oddsAway:2.60, result:"home", score:"123-107" },
  { home:"보스턴 셀틱스",       away:"댈러스 매버릭스",     league:"NBA", note:"23-24 파이널 G1", oddsHome:1.45, oddsAway:2.80, result:"home", score:"107-89" },
  { home:"댈러스 매버릭스",     away:"보스턴 셀틱스",       league:"NBA", note:"23-24 파이널 G4", oddsHome:2.10, oddsAway:1.72, result:"home", score:"122-84" },
  { home:"덴버 너기츠",         away:"마이애미 히트",       league:"NBA", note:"22-23 파이널 G1", oddsHome:1.50, oddsAway:2.60, result:"home", score:"104-93" },
  { home:"마이애미 히트",       away:"덴버 너기츠",         league:"NBA", note:"22-23 파이널 G2", oddsHome:2.20, oddsAway:1.68, result:"home", score:"111-108" },
  { home:"보스턴 셀틱스",       away:"골든스테이트 워리어스", league:"NBA", note:"21-22 파이널 G6", oddsHome:1.80, oddsAway:2.00, result:"away", score:"90-103" },
  { home:"LA 레이커스",         away:"덴버 너기츠",         league:"NBA", note:"23-24 정규",      oddsHome:1.95, oddsAway:1.85, result:"home", score:"119-108" },
  { home:"밀워키 벅스",         away:"보스턴 셀틱스",       league:"NBA", note:"23-24 정규",      oddsHome:2.05, oddsAway:1.75, result:"home", score:"116-110" },
  { home:"필라델피아 76ers",    away:"뉴욕 닉스",           league:"NBA", note:"24-25 정규",      oddsHome:1.90, oddsAway:1.90, result:"away", score:"105-112" },
  { home:"클리블랜드 캐벌리어스", away:"인디애나 페이서스",  league:"NBA", note:"24-25 정규",      oddsHome:1.60, oddsAway:2.30, result:"home", score:"120-114" },
],
    volleyball: [

  { home:"현대캐피탈",     away:"대한항공",       league:"V-리그 남", note:"24-25 챔프", oddsHome:1.95, oddsAway:1.85, result:"home", score:"3-0" },
  { home:"흥국생명",       away:"정관장",         league:"V-리그 여", note:"24-25 챔프", oddsHome:1.65, oddsAway:2.25, result:"home", score:"3-1" },
  { home:"한국도로공사",   away:"흥국생명",       league:"V-리그 여", note:"22-23 챔프", oddsHome:2.20, oddsAway:1.68, result:"home", score:"3-2" },
  { home:"대한항공",       away:"우리카드",       league:"V-리그 남", note:"23-24 시즌", oddsHome:1.55, oddsAway:2.40, result:"home", score:"3-1" },
  { home:"현대건설",       away:"흥국생명",       league:"V-리그 여", note:"23-24 챔프", oddsHome:1.85, oddsAway:1.95, result:"home", score:"3-0" },
  { home:"삼성화재",       away:"OK저축은행",     league:"V-리그 남", note:"24-25 시즌", oddsHome:2.05, oddsAway:1.75, result:"away", score:"2-3" },
  { home:"GS칼텍스",       away:"IBK기업은행",    league:"V-리그 여", note:"23-24 시즌", oddsHome:1.90, oddsAway:1.90, result:"home", score:"3-2" },
  { home:"우리카드",       away:"한국전력",       league:"V-리그 남", note:"24-25 시즌", oddsHome:1.60, oddsAway:2.30, result:"home", score:"3-1" },
  { home:"KB손해보험",     away:"현대캐피탈",     league:"V-리그 남", note:"24-25 시즌", oddsHome:2.40, oddsAway:1.55, result:"away", score:"1-3" },
  { home:"정관장",         away:"페퍼저축은행",   league:"V-리그 여", note:"23-24 시즌", oddsHome:1.75, oddsAway:2.05, result:"home", score:"3-2" },
  { home:"대한항공",       away:"삼성화재",       league:"V-리그 남", note:"23-24 시즌", oddsHome:1.45, oddsAway:2.70, result:"home", score:"3-0" },
  { home:"현대건설",       away:"한국도로공사",   league:"V-리그 여", note:"24-25 시즌", oddsHome:1.80, oddsAway:2.00, result:"home", score:"3-1" },
],
};

import { useEffect, useMemo, useRef, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { AdMob, RewardAdPluginEvents } from '@capacitor-community/admob'

const isNative = Capacitor.isNativePlatform()

// AdMob Configuration
// Replace ADMOB_REWARDED_AD_ID with your actual Rewarded Ad Unit ID from AdMob console before building release AAB!
const ADMOB_REWARDED_AD_ID = 'ca-app-pub-5900212892693406/2542739177'
// ⚠️ 테스트 광고 모드: 실기기 광고 검증용. 릴리즈(AAB) 빌드 전 반드시 false로 되돌릴 것!
const ADMOB_IS_TESTING = true

type PotatoHitMap = {
  src: string
  width: number
  height: number
  alpha: Uint8ClampedArray
  bounds: { left: number; right: number; top: number; bottom: number }
}

type PotatoHitInfo = {
  hit: boolean
  centerX: number
  centerY: number
  radius: number
}

const TRANSLATIONS: Record<string, string> = {
  // Title
  '돌아온 감자 키우기': 'Growing Potato',
  '시작하기': 'Start Game',

  // Pig warning (돼지 접근 경고)
  '보살핌': 'Care',
  '꿀꿀... 심심한 감자는 내 사료가 되지~': 'Oink... a neglected potato becomes my feed~',
  '꿀꿀! 보살핌이 부족한 감자 냄새가 나는데?': 'Oink! I smell a potato that needs more care!',
  '꿀꿀!! 이대로면 수확 날에 내가 먹어버린다!': 'OINK!! Keep this up and I eat it on harvest day!',
  '돼지가 포기하고 돌아갔습니다! 이제 사료가 될 걱정은 없어요.': 'The pig gave up and left! No more feed worries.',
  '확인': 'OK',
  '도감': 'Scrapbook',
  '업적': 'Achievements',
  '랭킹': 'Ranking',
  '설정': 'Settings',
  '종료': 'Exit',
  '오프닝 영상': 'Opening Video',
  
  // Stats
  '무게': 'Weight',
  '크기': 'Size',
  '모양': 'Shape',
  '영양가': 'Nutrients',
  '면역력': 'Immunity',
  '단단함': 'Hardness',

  // Slots & Actions
  '아침': 'Morning',
  '점심': 'Afternoon',
  '저녁': 'Evening',
  '양분': 'Feed',
  '수분': 'Water',
  '휴식': 'Rest',
  '운동': 'Exercise',
  '광합성': 'Solar',
  '일정': 'Plan',
  '진행': 'Go',
  
  // Skills
  '양분먹기': 'Eat Nutrients',
  '물마시기': 'Drink Water',
  '뒹굴거리기': 'Roll Around',
  '운동하기': 'Exercise',
  '자연 성장': 'Natural Growth',
  
  // Game UI
  '다회차': 'Clears',
  '성장 보너스': 'Growth Bonus',
  '상태': 'Status',
  '주차': 'Week',
  '일째': 'Day',
  '능력치': 'Stats',
  '추천': 'Recommended',
  '보너스': 'Bonus',
  '콤보': 'Combo',
  '현재 상태': 'Current Status',
  '오늘 계획': 'Plan',
  '계획 실행 제어': 'Plan Execution Controls',
  '재계획': 'Replan',
  '테이블': 'Table',
  '진행도': 'Progress',
  '비우기': 'Clear',
  '계획 비우기': 'Clear Plan',
  '타이틀로': 'Title Screen',
  '새 회차': 'New Game',
  '게임재개': 'Resume Game',
  '총 획득 업적': 'Total Achievements',
  '도감 완성률': 'Collection Rate',
  '도감 목록': 'Collection List',
  '엔딩 도감': 'Ending Collection',
  '미수집': 'Locked',
  '33종류의 감자를 모두 모아보세요': 'Collect all 33 kinds of potatoes',
  '귀여운 감자': 'Cute Potato',
  '새로운': 'New',
  '가로 모드 전용': 'Landscape Mode Only',
  '폰을 가로로 돌려서 진행하세요.': 'Please rotate your phone to landscape mode.',
  '화면을 터치하면 닫힙니다': 'Touch screen to close',
  '시스템 초기화 중...': 'Initializing system...',
  '서버 연결 및 보안 키 확인...': 'Checking server connection and security key...',
  'GitHub Pages에서 최신 핫픽스 패치 조회 중...': 'Checking the latest hotfix patch from GitHub Pages...',
  '핫픽스 모듈 다운로드 및 컴파일 완료!': 'Hotfix module downloaded and compiled!',
  '준비 완료!': 'Ready!',
  
  // Settings Modal
  '설정 변경': 'Settings',
  '소리 켜짐': 'Sound On',
  '소리 꺼짐': 'Sound Off',
  '한국어': 'Korean',
  '영어': 'English',
  '돌아가기': 'Close',
  '잠금': 'Lock',
  '카운트다운': 'Countdown',
  '수확의 날': 'Harvest Day',
  '감자 캐릭터': 'Potato Character',
  '점': 'pts',
  '초특가 감자칩 세트!': 'Special Potato Chip Set!',
  '바삭한 소리까지 맛있다! 지금 바로 밭에서 수확한 싱싱한 감자로 만든 해시 브라운 출시!': 'Even the crunch tastes great! Fresh hash browns made from potatoes harvested right from the field are out now!',
  '본 광고는 감자 협회 제공 모의 광고입니다': 'This mock ad is provided by the Potato Association',
  '광고 시청 완료!': 'Ad complete!',
  '건너뛰기 대기': 'Skip pending',
  '광고 건너뛰기': 'Skip Ad',

  // Exit Modal
  '감자 키우기 종료': 'Exit Game',
  '감자가 흙 속에서 곤히 자고 있어요.': 'The potato is sleeping soundly in the soil.',
  '정말 게임을 종료하시겠습니까?': 'Are you sure you want to exit?',
  '종료하기': 'Exit',

  // Seed Intro
  '씨감자 재능 슬롯': 'Seed Potato Talent Slot',
  '씨감자 준비': 'Seed Prep',
  '조각마다 타고난 재능이 달라요': 'Each seed piece has different talents',
  '감자는 보통 씨감자를 잘라 심습니다. 같은 감자에서 나온 조각도 밭에 들어가면 서로 다른 재능을 품고 자라납니다.': 'Potatoes are grown by cutting seeds. Pieces from the same potato will carry different natural potentials once in the field.',
  '감자 이름 지어주기': 'Name Your Potato',
  '예: 귀여운 감자 (미입력시 랜덤)': 'e.g. Potato (or random if blank)',
  '재능 슬롯 돌리기': 'Spin Talent Slot',
  '한번 더 돌리기': 'Spin Again',
  '재배 시작': 'Start Growing',
  '잭팟!': 'Jackpot! ',
  '재능이 크게 튀어나왔고 슬롯 기회가 1회 늘었습니다.': ' talent popped out! Slot count +1.',
  '씨감자의 타고난 재능이': 'The seed potato\'s natural talent woke up in ',
  '쪽으로 깨어났습니다.': '.',
  '돌리기': 'Spin',
  '시작': 'Start',

  // Tiers
  '특화 감자': 'Specialized Potato',
  '쌍둥 재능 감자': 'Twin Talent Potato',
  '삼색 성장 감자': 'Three-color Growth Potato',
  '균형 개성 감자': 'Balanced Potato',
  '거의 완성 감자': 'Almost Complete Potato',
  '완전체 감자': 'Perfect Potato',

  // Combos
  '다이어트 콤보': 'Diet Combo',
  '수분 충전': 'Hydro Charge',
  '운동 매니아': 'Workout Mania',
  '광합성 중독': 'Solar Addiction',
  '수면 부족': 'Sleep Deprived',
  '순환 밸런스 콤보': 'Cycle Balance Combo',
  '초록 엔진 콤보': 'Green Engine Combo',
  '뿌리 체력 콤보': 'Root Stamina Combo',
  '회복 트레이닝 콤보': 'Recovery Training Combo',
  '벌크업 콤보': 'Bulk-Up Combo',
  '웰빙 식단 콤보': 'Wellness Diet Combo',
  '든든한 뒹굴 콤보': 'Hearty Rolling Combo',
  '햇살 식사 콤보': 'Sun Meal Combo',
  '촉촉한 휴식 콤보': 'Moist Rest Combo',
  '수분 훈련 콤보': 'Water Training Combo',
  '자연 광합성 콤보': 'Natural Solar Combo',
  '느긋한 광합성 콤보': 'Lazy Solar Combo',
  '태양 단련 콤보': 'Sun Training Combo',

  // Hall of Fame
  '명예의 전당 (랭킹)': 'Hall of Fame (Ranking)',
  '명예의 전당': 'Hall of Fame',
  '저장된 기록이 없습니다.': 'No saved records found.',
  '이름': 'Name',
  '엔딩': 'Ending',
  '날짜': 'Date',
  '최종 성장도': 'Final Size',
  '점수순': 'By Score',
  '날짜순': 'By Date',
  '아직 기록이 없습니다.': 'No records found.',
  '첫 수확을 완료해보세요!': 'Complete your first harvest!',
  '종합': 'Total',

  // Ending Overlay
  '새로운 엔딩 획득!': 'New Ending Unlocked!',
  '크레딧 보기': 'View Credits',
  '요리 메모': 'Cooking Notes',
  '다시 키우기': 'Grow Again',
  '도감 보기': 'View Collection',
  '이전 엔딩': 'Prev Ending',
  '엔딩 목록': 'Collection List',
  '다음 엔딩': 'Next Ending',
  '엔딩 결과': 'Ending Result',
  '엔딩 다시보기': 'Ending Gallery',
  '엔딩 크레딧': 'Ending Credits',
  '엔딩 확인': 'View Ending',
  '감자 수확이 완료되었습니다! 엔딩 결과를 확인하시겠습니까?': 'Potato harvest complete! Would you like to view the ending?',
  '광고 시청 후 최종 엔딩을 감상하실 수 있습니다.': 'You can watch a short ad to view the final ending.',
  '광고 보고 엔딩 보기': 'Watch Ad & View Ending',
  '배경음악 켜짐': 'Music On',
  '배경음악 꺼짐': 'Music Off',
  '밀어서 광고 보고 엔딩 보기': 'Slide to watch ad & view ending',
  '취소 (타이틀로)': 'Cancel (Back to Title)',
  '평범한 재료로 만든 특별한 한 판': 'A special plate made from ordinary ingredients',
  '비 오는 날에 더 맛있는 이유는 뭘까요?': 'Why does it taste better on rainy days?',
  '이 기기 브라우저가 webm 코덱을 지원하지 않아 크레딧 재생이 실패했습니다.': 'This browser does not support webm codec. Video playback failed.',
  '오프닝 영상을 준비 중입니다.': 'Preparing opening video...',
  '/assets/original/opening.webm 파일을 추가해주세요.': 'Please add /assets/original/opening.webm file.',
  '수확의 시기가 다가왔습니다!': 'The harvest season has arrived!',
  '98일간의 정성 어린 보살핌 끝에 드디어 감자를 수확합니다.': 'After 98 days of loving care, we finally harvest the potato.',
  '두근두근... 과연 어떤 감자가 자라났을까요?': 'Thump, thump... what kind of potato did we grow?',
  '화면을 터치해서 계속': 'Touch screen to continue',
  '버튼을 오른쪽으로 밀어 선택하세요': 'Swipe the button to the right to choose',
  '오른쪽으로 밀어서 선택': 'Swipe right to select',
  '이제 아침, 점심, 저녁 계획을 골라보세요.': 'Now choose the morning, afternoon, and evening plans.',
  '아침, 점심, 저녁 슬롯을 모두 채워보세요.': 'Fill all morning, afternoon, and evening slots.',
  '계획 슬롯을 모두 비웠습니다.': 'All plan slots have been cleared.',
  '수확이 임박했다. 가장 강한 능력치에 운명의 가중치가 붙는다.': 'Harvest is near. Fate now favors your strongest stat.',
  '감자가 조용히 자라고 있다. 계획을 채우면 성장 방향이 뚜렷해진다.': 'The potato is growing quietly. Fill the plan to guide its growth.',
  '새 씨감자가 준비되었습니다. 슬롯으로 타고난 재능을 확인하고 이름을 정하세요.': 'A new seed potato is ready. Check its talents in the slot and give it a name.',
  '씨감자는 보통 감자를 여러 조각으로 나누어 심습니다. 같은 밭에서 태어나도 조각마다 타고난 재능은 조금씩 다릅니다.': 'Seed potatoes are usually cut into several pieces before planting. Even pieces from the same field can grow with slightly different talents.',
  '씨감자 재능 확인 대기': 'Waiting for seed talent check',

  // Status profile
  '수확 임박': 'Harvest Near',
  '전설 후보': 'Legend Candidate',
  '철벽 감자': 'Fortress Potato',
  '거대 감자': 'Giant Potato',
  '명품 감자': 'Premium Potato',
  '묵직한 감자': 'Heavy Potato',
  '쑥쑥 감자': 'Growing Potato',
  '반듯한 감자': 'Neat Potato',
  '알찬 감자': 'Rich Potato',
  '생존형 감자': 'Survivor Potato',
  '단단한 감자': 'Hard Potato',
  '모든 능력치가 위험할 만큼 높다': 'All stats are dangerously high',
  '면역력과 단단함이 강화되는 중': 'Immunity and hardness are strengthening',
  '무게와 크기가 주로 자라고 있다': 'Weight and size are growing most',
  '영양가와 모양이 조화를 이루는 중': 'Nutrients and shape are balancing well',

  // Action status messages
  '고소한 양분이 뿌리 끝까지 차곡차곡 쌓입니다.': 'Nutty nutrients build up all the way to the root tips.',
  '흙 속 맛있는 기운을 한입 크게 삼켰습니다.': 'The potato takes a big bite of tasty energy from the soil.',
  '묵직한 힘이 속살 사이사이에 천천히 번집니다.': 'A weighty strength slowly spreads through the potato.',
  '든든한 밥심으로 감자 몸통이 살짝 부풀었습니다.': 'A hearty meal makes the potato body puff up a little.',
  '작은 뿌리들이 양분을 찾아 바쁘게 움직입니다.': 'Tiny roots busily search for nutrients.',
  '포근한 흙맛을 먹고 오늘도 배가 든든합니다.': 'After tasting cozy soil, the potato feels full today.',
  '알찬 기운이 감자 속을 빈틈없이 채워갑니다.': 'Rich energy fills every corner inside the potato.',
  '달큰한 영양분이 조용히 저장고로 모입니다.': 'Sweet nutrients quietly gather in storage.',
  '먹은 만큼 자라겠다는 결심이 감자 속에서 꿈틀댑니다.': 'A promise to grow as much as it eats wiggles inside.',
  '흙 한가득 담긴 양분을 골라 먹으며 힘을 냅니다.': 'The potato gains strength by picking nutrients from the soil.',
  '시원한 물기가 뿌리 사이로 촉촉하게 퍼집니다.': 'Cool moisture spreads gently between the roots.',
  '목마른 감자가 물을 꿀꺽이며 생기를 되찾습니다.': 'The thirsty potato gulps water and regains energy.',
  '촉촉한 수분이 마른 틈을 부드럽게 채웁니다.': 'Moisture softly fills the dry gaps.',
  '물방울이 감자 주변을 맑게 씻어줍니다.': 'Water drops wash the area around the potato clean.',
  '흙이 촉촉해지자 감자가 한결 편안해 보입니다.': 'As the soil gets moist, the potato looks more comfortable.',
  '차분한 물기 덕분에 표면이 매끈하게 정돈됩니다.': 'Calm moisture smooths the potato surface.',
  '뿌리 끝에 닿은 물이 작은 활력을 깨웁니다.': 'Water touching the root tips wakes a small vitality.',
  '상쾌한 수분이 몸집을 살짝 부드럽게 키웁니다.': 'Fresh moisture gently grows the potato body.',
  '감자가 물맛을 음미하며 천천히 숨을 고릅니다.': 'The potato savors the water and slowly catches its breath.',
  '흙 속 물길이 열리며 성장 리듬이 안정됩니다.': 'Water paths open in the soil, steadying the growth rhythm.',
  '감자가 흙침대 위에서 느긋하게 몸을 굴립니다.': 'The potato leisurely rolls on its soil bed.',
  '살짝 뒹군 자리마다 포근한 흙냄새가 남습니다.': 'A cozy soil scent remains wherever it rolls.',
  '느긋한 휴식이 감자 속 긴장을 풀어줍니다.': 'A slow rest releases tension inside the potato.',
  '흙을 베개 삼아 잠깐 쉬며 기운을 모읍니다.': 'Using soil as a pillow, the potato rests and gathers energy.',
  '데굴데굴 움직인 뒤 편안한 표정으로 멈췄습니다.': 'After rolling around, it stops with a relaxed look.',
  '쉬는 동안 남은 영양분이 알맞게 정리됩니다.': 'Remaining nutrients settle neatly during the rest.',
  '감자가 몸을 둥글게 말고 조용히 회복합니다.': 'The potato curls up and quietly recovers.',
  '느린 굴림이 하루의 피로를 흙 속으로 덜어냅니다.': 'A slow roll lets the day\'s fatigue sink into the soil.',
  '포근한 흙이 감자를 받쳐주며 안정감을 줍니다.': 'Soft soil supports the potato and gives it comfort.',
  '잠깐의 빈둥거림이 의외로 좋은 성장을 만듭니다.': 'A short lazy spell surprisingly helps growth.',
  '감자가 땅속에서 힘껏 버티며 단단해집니다.': 'The potato braces underground and grows harder.',
  '작은 운동 끝에 표면이 한층 야무져 보입니다.': 'After a small workout, the surface looks sturdier.',
  '흙을 밀어내는 연습으로 뿌리에 힘이 붙습니다.': 'Pushing soil away gives strength to the roots.',
  '으라차차 움직이며 강한 감자 근성을 다집니다.': 'With determined movement, it builds potato grit.',
  '몸을 조였다 풀며 단단한 리듬을 익힙니다.': 'Tensing and relaxing, it learns a firm rhythm.',
  '땅속 체조 덕분에 감자의 중심이 바로잡힙니다.': 'Underground exercise straightens the potato\'s balance.',
  '흙의 압력을 견디며 씩씩한 기운을 키웁니다.': 'Enduring soil pressure builds brave energy.',
  '가벼운 운동 뒤 감자가 단단한 숨을 내쉽니다.': 'After light exercise, the potato exhales firmly.',
  '꾸준한 움직임이 감자의 버티는 힘을 올립니다.': 'Steady movement raises the potato\'s endurance.',
  '힘든 만큼 몸매가 조금 더 또렷해졌습니다.': 'The effort makes its shape a little clearer.',
  '따뜻한 햇살이 잎을 지나 감자에게 전해집니다.': 'Warm sunlight passes through leaves to the potato.',
  '맑은 빛이 초록 기운을 깨워 영양을 만듭니다.': 'Clear light wakes green energy and creates nutrients.',
  '햇빛 한 줌이 감자의 속을 밝게 데웁니다.': 'A handful of sunlight warmly brightens the potato inside.',
  '광합성 리듬에 맞춰 알찬 기운이 차오릅니다.': 'Rich energy rises with the photosynthesis rhythm.',
  '잎사귀가 빛을 모아 땅속 감자에게 보내줍니다.': 'Leaves gather light and send it to the potato below.',
  '부드러운 햇살 덕분에 감자가 생생해집니다.': 'Gentle sunshine makes the potato lively.',
  '빛 에너지가 조용히 저장되며 성장에 보탬이 됩니다.': 'Light energy is quietly stored and helps growth.',
  '밭 위의 햇볕이 감자 속 영양 창고를 채웁니다.': 'Sunlight above the field fills the potato\'s nutrient storage.',
  '따스한 낮빛이 감자의 하루를 산뜻하게 밀어줍니다.': 'Warm daylight gives the potato a fresh push.',
  '햇살을 받은 감자가 은근히 자신감을 얻습니다.': 'Bathed in sunlight, the potato quietly gains confidence.',

  // Event titles & Speakers
  '지렁이': 'Earthworm',
  '흙 속의 지렁이': 'Earthworm in the Soil',
  '성깔 있는 고구마': 'Stubborn Sweet Potato',
  '고구마': 'Sweet Potato',
  '땅강아지의 손톱 내기': 'Mole Cricket Claw Bet',
  '땅강아지': 'Mole Cricket',
  '자존심 강한 도라지': 'Proud Balloon Flower',
  '도라지': 'Bellflower',
  '웨앵웨앵 벌레 떼 습격': 'Swarm of Bugs Attack',
  '해충': 'Pests',
  '따뜻한 거름씨의 방문': 'Mr. Fertilizer\'s Visit',
  '거름': 'Fertilizer',
  '여름날의 시원한 소나기': 'Cool Summer Shower',
  '먹구름': 'Rain Cloud',
  '장난꾸러기 땅강아지': 'Playful Mole Cricket',
  '반짝이는 꼬마 돌멩이': 'Shiny Little Pebble',
  '꼬마 돌': 'Little Pebble',
  '농부의 특제 무공해 비료': 'Farmer\'s Organic Fertilizer',
  '농부': 'Farmer',
  '보름달 밤의 차가운 정취': 'Cool Vibe of Full Moon Night',
  '보름달': 'Full Moon',
  '옆자리 도라지의 방문': 'Visit from Neighbor Bellflower',
  '당근': 'Carrot',
  '고구마의 영양 레시피': 'Sweet Potato\'s Nutri Recipe',
  '고구마의 씨앗 선물': 'Sweet Potato\'s Seed Gift',
  '고구마와 영양 대결': 'Nutrients Showdown with Sweet Potato',
  '울고 있는 고구마': 'Crying Sweet Potato',
  '굴러오는 돌멩이': 'Rolling Stone',
  '돌멩이': 'Stone',
  '햇빛을 모으는 돌멩이': 'Stone Gathering Sunlight',
  '반짝돌': 'Shiny Stone',
  '돌멩이 아래의 비밀': 'Secret Under the Stone',
  '흙 속 속삭임': 'Whisper in Soil',
  '돌멩이 굴리기 내기': 'Stone Rolling Bet',
  '달빛이 강해지는 밤': 'Night of Stronger Moonlight',
  '달무리가 생긴 밤': 'Night of Moon Halo',
  '달이 이야기를 건넨다': 'Moon Talks',
  '구름에 가린 달': 'Moon Covered by Clouds',
  '진한 거름 냄새': 'Strong Fertilizer Smell',
  '흙 속 냄새': 'Smell in the Soil',
  '거름씨': 'Mr. Fertilizer',
  '거름씨의 맞춤 처방': 'Mr. Fertilizer\'s Prescription',
  '오래된 거름 더미 발견': 'Found Old Fertilizer Pile',
  '거름씨의 제안': 'Mr. Fertilizer\'s Trade Proposal',
  '도라지의 모양 비법': 'Bellflower\'s Shape Secret',
  '도라지와 크기 대결': 'Size Showdown with Bellflower',
  '아픈 도라지': 'Sick Bellflower',
  '지렁이의 흙길 공사': 'Earthworm\'s Path Work',
  '지렁이 달리기 경주': 'Earthworm Racing',
  '지렁이의 영양 선물': 'Earthworm\'s Nutrient Gift',
  '지렁이 무리의 습격': 'Swarm of Earthworms Attack',
  '지렁이 무리': 'Worms Swarm',
  '땅강아지의 터널 선물': 'Mole Cricket\'s Tunnel Gift',
  '땅강아지 레슬링 대회': 'Mole Cricket Wrestling',
  '땅강아지의 돌 선물': 'Mole Cricket\'s Stone Gift',

  // Event Messages & Choice Labels
  '"앗 비켜, 내 밭이라구!" 지렁이가 꿈틀대며 화를 냅니다! 흙 속 지름길을 두고 감자에게 비키라고 씩씩거리며 꼬리를 흔드네요.': '"Move away, this is my field!" The earthworm wriggles and gets angry! It wags its tail, demanding the potato make way in the soil shortcut.',
  '지렁이를 상대한다': 'Deal with Earthworm',
  '지렁이를 무시한다': 'Ignore Earthworm',
  '"바쁘니까 비켜줄게... 칫." 감자가 지렁이의 억지를 묵묵히 받아들이고 멀리 피해 돌아갑니다. 다행히 평화는 유지되었지만 지렁이가 고소하다는 듯 웃고 떠납니다.': '"I\'m busy, so I\'ll yield... hmph." The potato silently accepts the earthworm\'s stubbornness and walks away. Peace is kept, but the earthworm smirks and departs.',
  '"너 때문에 내 늘씬한 몸매가 구겨지잖아!" 옆자리의 고구마가 나타나 투덜거립니다. 밭이 너무 좁으니 저기 멀리 구석으로 비키라며 엉덩이로 슬쩍 밀어오네요.': '"My slender body is getting squeezed because of you!" The neighbor sweet potato complains. It pushes with its hips, telling you to move to the corner.',
  '고구마를 상대한다': 'Deal with Sweet Potato',
  '고구마를 무시한다': 'Ignore Sweet Potato',
  '"어휴 귀찮아, 나 그냥 여기 가만히 있을게..." 고구마를 그냥 무시한 채 구석에 가만히 웅크려 봅니다. 마음은 편하지만 조금 억울한 기분입니다.': '"Sigh, whatever. I\'ll just stay in the corner..." Ignoring the sweet potato, you crouch in the corner. You feel comfortable but slightly wronged.',
  '"헤이 감자 친구! 너 그렇게 말랑해서 이 거친 흙바닥에서 버티겠어?" 땅강아지가 날카로운 앞발을 번쩍이며 감자의 단단함을 시험해보는 힘내기를 걸어옵니다!': '"Hey potato friend! Do you think you can survive in this rough soil being so soft?" The mole cricket raises its sharp front claws and challenges you to a strength test!',
  '대결을 받아들인다': 'Accept Challenge',
  '내기를 거절한다': 'Refuse Bet',
  '"난 평화를 사랑하는 감자라고~ 대결은 사절이다!" 내기를 단호히 거절하고 한걸음 물러섭니다. 땅강아지가 코웃음을 치며 사라집니다.': '"I\'m a peace-loving potato~ Challenge declined!" You decline the bet and step back. The mole cricket snorts and runs off.',
  '"어머머, 그렇게 둥글넙적한 얼굴로 밭의 대표가 되겠다고?" 자존심 강한 도라지가 파란 꽃잎을 뽐내며 누가 더 수려하고 멋진 모양새인지 배틀을 신청합니다!': '"My goodness, you think you can represent the field with that round face?" The proud bellflower shows off its blue petals and challenges you to a beauty contest!',
  '외모 대결을 한다': 'Do Beauty Contest',
  '도라지를 상대하지 않는다': 'Ignore Bellflower',
  '"아름다움은 내면에서 나오는 법..." 도라지의 외모 부심을 사뿐히 무시하고 깊은 흙 속으로 시선을 돌립니다.': '"True beauty comes from within..." You gently ignore the bellflower\'s vanity and look deep into the soil.',
  '"웨앵웨앵~! 맛있고 부드러운 감자잎이다!" 밭 전체에 굶주린 해충들이 떼를 지어 몰려와 초록 잎사귀와 줄기를 갉아먹기 직전입니다!': '"Bzzzz~! Delicious and tender potato leaves!" Swarms of hungry pests rush to chew on your green leaves and stems!',
  '몸으로 버텨내기': 'Endure with Body',
  '일단 흙 속에 깊이 숨기': 'Hide Deep in Soil',
  '"일단 후퇴다! 흙더미 속으로 쏙!" 안전하게 흙 속에 깊이 파묻혀 지나가길 기다립니다. 안전하지만, 해를 받지 못해 광합성을 못 했습니다. 영양가 50 감소.': '"Retreat for now! Hide in the dirt!" Safely burying yourself in the soil to wait it out. It\'s safe, but you missed the sunlight. Nutrients decreased by 50.',
  '"안녕 꼬마 감자야! 요즘 흙 속의 양분이 몸에 골고루 잘 스며들고 있니?" 인자하고 구수한 거름씨가 다가와 감자의 영양 상태를 조심스레 챙겨줍니다.': '"Hello little potato! Are the nutrients in the soil spreading well through your body?" The kind Mr. Fertilizer approaches and cares for your nutritional state.',
  '상태를 솔직히 말한다': 'Speak Honestly',
  '바쁘다며 대화를 피한다': 'Avoid Conversation',
  '"계획 짜느라 좀 바빠요, 나중에 봐요!" 대화를 피한 채 쌀쌀맞게 굴어 거름씨가 상처를 받고 다른 채소에게 가버립니다.': '"I\'m busy planning, see you later!" Avoiding the talk coldly, Mr. Fertilizer feels hurt and goes to other vegetables.',
  '"쏴아아아-!" 갑자기 먹구름이 밭을 덮더니 시원하고 상쾌한 여름 소나기가 세차게 대지를 적시기 시작합니다!': '"Swoooosh-!" Suddenly dark clouds cover the field, and a refreshing summer shower begins to pour down!',
  '빗물을 맘껏 들이켠다': 'Drink Rainwater',
  '흙더미 뒤로 피한다': 'Hide Behind Dirt',
  '"캬아, 목마르던 참에 잘 됐다!" 빗물을 온몸으로 빨아들이며 마음껏 수분을 섭취해 몸집을 불렸으나 약간 말랑해졌습니다.': '"Ah, perfect timing! I was thirsty!" You absorb rainwater with all your body, growing in size but getting slightly softer.',
  '"비에 젖으면 모양새가 망가질 수 있어!" 단단한 돌멩이 뒤에 숨어 거센 비를 피하며 내실을 다집니다.': '"Getting wet might ruin my shape!" You hide behind a hard stone, avoiding the heavy rain to build inner strength.',
  '"헤이, 둥글둥글 감자 엉덩이 터치!" 장난기 가득한 땅강아지가 땅속에서 툭 튀어나와 엉덩이를 간지럽히며 메롱을 하고 달아납니다!': '"Hey, touch that round potato butt!" The playful mole cricket pops out of the ground, tickles your butt, sticks out its tongue, and runs away!',
  '화를 내며 쫓아낸다': 'Chase Away Angrily',
  '뒹굴러서 구멍을 메운다': 'Roll to Fill Holes',
  '"거기 서! 장난이 너무 지나치잖아!" 화를 내며 땅강아지를 끝까지 추격해 쫓아냈으나, 흙에 부딪혀 약간의 상처가 생겼습니다.': '"Stop there! That\'s too much!" You chase the mole cricket angrily, but got slightly scratched bumping into the soil.',
  '"히히, 간지러워라! 나도 데굴데굴~" 같이 땅바닥을 뒹굴거리며 헤집어놓은 구멍들을 메워 밭을 정돈했습니다.': '"Hehe, ticklish! Me too, rolling around~" You roll on the ground together, filling the holes and organizing the field.',
  '"저기... 혹시 심심하지 않아? 같이 얘기 나누자!" 흙 속 깊은 곳에 묻혀있던, 작고 단단하게 반짝이는 꼬마 돌멩이가 수줍게 인사를 해옵니다.': '"Excuse me... are you bored? Let\'s talk!" Buried deep in the soil, a tiny, hard, shiny pebble shyly greets you.',
  '돌 옆에서 굳건히 버티기': 'Stay Firm by Stone',
  '돌멩이를 조심스레 품기': 'Embrace Pebble Gently',
  '"오, 정말 단단하고 멋진 돌이네! 옆에 붙어있어야지." 돌멩이의 기운을 빌려 몸을 굳건히 세웠으나 눌림 흔적이 남았습니다.': '"Oh, what a hard and cool stone! I\'ll stay close." Borrowing the stone\'s vibe to stand firm, but it left pressure marks.',
  '"작고 귀엽구나, 내가 안아줄게!" 돌멩이를 폭 안아주며 흙 속의 따뜻한 온기와 영양을 고스란히 섭취했습니다.': '"So small and cute, I\'ll hug you!" You hug the pebble gently, absorbing the warm heat and nutrients from the soil.',
  '"요 녀석, 올해는 아주 실하게 영글어야 할 텐데!" 인자한 농부 할아버지가 콧노래를 부르며 특제 무공해 유기농 비료를 아낌없이 듬뿍 뿌려줍니다!': '"Hey there, you need to grow plump and ripe this year!" The kind farmer grandpa hums a song and generously sprinkles special organic fertilizer!',
  '비료를 욕심껏 다 삼킨다': 'Swallow All Greedily',
  '골고루 천천히 나누어 먹는다': 'Eat Slowly and Evenly',
  '"와! 맛있는 양분이 잔뜩이다!" 비료를 폭풍 흡입하여 엄청난 속도로 무게와 몸집을 불렸지만 모양이 많이 망가졌습니다.': '"Wow! So many delicious nutrients!" You swallow the fertilizer greedily, rapidly increasing weight and size, but ruining your shape.',
  '"천천히 꼭꼭 씹어 먹어야 체하지 않지!" 거름을 아껴가며 조심조심 고르게 섭취해 체력을 튼튼하게 다집니다.': '"Chew slowly to digest well!" You consume the compost carefully and evenly to build strong stamina.',
  '"조용한 밤, 감자야 잘 자렴..." 은은하고 차가운 보름달이 푸른 달빛의 커튼을 밭 전체에 포근하게 내려줍니다.': '"Quiet night, sleep tight potato..." The gentle, cool full moon lowers a curtain of blue moonlight over the field.',
  '달빛 아래 명상하기': 'Meditate Under Moon',
  '포근하게 꿀잠 자기': 'Sleep Soundly and Warm',
  '"달빛을 호흡하며 차분하게 정신일도..." 조용히 달빛 샤워를 하며 마음과 겉모양을 정갈하게 정돈했습니다.': '"Breathing in the moonlight, focusing mind..." You quietly take a moonlight shower, neatening your mind and appearance.',
  '"쿨쿨쿨... 밤에는 푹 자야 건강하지!" 폭신한 흙 침대에 누워 포근하게 꿀잠을 자며 피로를 풀었습니다.': '"Zzz... sleeping well at night is healthy!" Lying on the soft soil bed, you sleep soundly to relieve fatigue.',
  '"감자야! 오늘 날씨도 좋은데 흙 속에서 달리기 한판 어때?" 활기찬 이웃집 꼬마 도라지가 엉덩이를 흔들며 같이 운동하자고 달려옵니다!': '"Hey potato! The weather is nice, how about a run in the soil?" The lively neighboring kid bellflower wiggles its tail and runs over to exercise together!',
  '도라지와 함께 스트레칭': 'Stretch with Bellflower',
  '밤새 수다 떨며 놀기': 'Chat All Night long',
  '"좋아! 으라차차 스트레칭 시작!" 도라지와 손을 맞잡고 쭉쭉 늘려 몸 크기와 밸런스를 가꿨습니다.': '"Alright! Let\'s stretch together!" Holding hands with the bellflower, you stretch to improve your size and balance.',
  '"운동보단 수다가 최고지! 오늘 밤샘 토크 고?" 밤새 밭에 사는 벌레들 이야기로 꽃을 피우며 신나게 노닥거려 무게가 늘었지만 조금 피곤해졌습니다.': '"Chatting is way better than exercising! All-night talk tonight?" You chat all night about bugs in the field, gaining weight but getting tired.',
  '지렁이를 상대한다 (무게 350g 이상 필요)': 'Deal with Earthworm (Requires 350g Weight)',
  '고구마를 상대한다 (크기 550 이상 필요)': 'Deal with Sweet Potato (Requires 550 Size)',
  '대결을 받아들인다 (단단함 400 이상 필요)': 'Accept Challenge (Requires 400 Hardness)',
  '외모 대결을 한다 (모양 500 이상 필요)': 'Do Beauty Contest (Requires 500 Shape)',
  '"이봐, 감자! 나한테 특별 영양 흡수 비법이 있어. 우리 밭에서 제일 알찬 채소가 되는 비결이지!" 고구마가 주황빛 몸을 자랑스레 내밀며 비법을 전수해주겠다고 합니다.': '"Hey potato! I have a secret nutrient absorption method. It\'s the key to becoming the most plump vegetable here!" The sweet potato proudly presents its orange body.',
  '비법을 배운다': 'Learn the Secret',
  '필요 없다고 한다': 'Say You Don\'t Need It',
  '"고마워, 덕분에 영양 흡수가 확 달라졌어!" 고구마의 비법대로 영양 흡수 루틴을 바꿔 영양가와 면역력이 크게 올랐습니다.': '"Thanks, my nutrition absorption is totally different now!" Following the secret routine, Nutrients and Immunity increased greatly.',
  '"훗, 그래 나중에 후회하지 마." 고구마의 제안을 거절했습니다. 하지만 내 방식대로 하는 것도 나쁘지 않습니다.': '"Hmph, fine. Don\'t regret it later." You declined the offer. But doing it your way is also fine.',
  '"저기, 우리 씨앗 나눌까? 같이 심으면 밭이 풍성해질 텐데!" 고구마가 조그만 씨앗 꾸러미를 내밀며 수줍게 제안합니다.': '"Hey, shall we share seeds? Planting them together will enrich the field!" The sweet potato shyly proposes, holding a small package of seeds.',
  '씨앗을 받아 심는다': 'Accept Seeds and Plant',
  '정중히 거절한다': 'Decline Politely',
  '"와, 고마워! 같이 심으니 밭이 더 기름져졌어!" 씨앗을 함께 심자 흙 속의 영양이 풍부해져 무게와 크기가 늘었습니다.': '"Wow, thanks! Planting together made the soil rich!" Planting together enriched the soil, increasing weight and size.',
  '"아, 그래... 그럼 나 혼자 심을게." 씨앗을 거절하자 고구마가 쓸쓸히 돌아갑니다. 별다른 변화는 없었지만 왠지 아쉬운 기분입니다.': '"Ah, I see... I\'ll just plant alone then." The sweet potato walks back lonely. No change, but you feel slightly sorry.',
  '"두고 봐! 누가 더 알찬 채소인지 한번 겨뤄보자고!" 고구마가 두 팔을 걷어붙이며 영양 대결을 선언합니다. 과연 감자가 이길 수 있을까요?': '"Just wait! Let\'s see who is the more plump vegetable!" The sweet potato rolls up its sleeves and declares a nutrition battle. Can you win?',
  '슬쩍 자리를 피한다': 'Avoid the Spot Slyly',
  '"지지 않아!" 최선을 다해 맞붙었으나 고구마의 단 맛에 밀려 약간 주눅이 들었습니다. 하지만 오기가 생겨 단단함이 올랐습니다.': '"I won\'t lose!" You fight your best, but got slightly discouraged by the sweet potato\'s sweetness. However, you gained resolve, increasing Hardness.',
  '"아, 오늘은 좀 바빠서..." 대결을 피해 조용히 흙 속으로 숨었습니다. 체면이 좀 구겨졌지만 모양은 멀쩡합니다.': '"Ah, I\'m busy today..." You hide in the soil to avoid the duel. Lost some pride, but your shape is kept clean.',
  '"으앙... 밭에서 제일 못난 채소래..." 옆자리 고구마가 눈물을 뚝뚝 흘리며 울고 있습니다. 누군가에게 상처를 받은 모양입니다.': '"Waaaa... they said I\'m the ugliest vegetable..." The neighbor sweet potato is crying hard. It seems hurt by someone.',
  '따뜻하게 위로한다': 'Comfort Warmly',
  '모른 척 넘어간다': 'Ignore and Pass by',
  '"괜찮아, 넌 충분히 예쁜 고구마야!" 고구마를 진심으로 위로해줬습니다. 따뜻한 마음이 흘러들어 면역력과 모양이 올랐습니다.': '"It\'s okay, you are beautiful enough!" You comfort it sincerely. The warm heart flows in, increasing Immunity and Shape.',
  '"저도 바쁜데..." 고구마의 울음소리를 외면하고 지나쳤습니다. 조금 미안하지만 성장에 집중하기로 했습니다.': '"I\'m busy too..." You pass by the crying sweet potato. A bit sorry, but you focus on your growth.',
  '"두구두구두구..." 경사진 밭에서 돌멩이가 빠른 속도로 굴러오고 있습니다! 빗물에 쓸려 내려오는 것 같은데, 피할까요 막을까요?': '"Rumble rumble..." A stone is rolling down the slope rapidly! It seems washed down by rain. Will you dodge or block?',
  '몸으로 막아낸다': 'Block with Body',
  '재빨리 옆으로 피한다': 'Dodge to the Side Quickly',
  '"내가 막아주지!" 돌멩이의 충격을 단단한 몸으로 버텨냈습니다. 흠집이 좀 났지만 단단함이 크게 올랐습니다.': '"I will block it!" You endure the impact with your hard body. Got some scratches, but Hardness increased greatly.',
  '"잠깐만!" 민첩하게 피해 돌멩이가 지나가게 했습니다. 크기와 모양은 유지됐습니다.': '"Hold on!" Dodged agilely, letting the stone pass. Size and shape were maintained.',
  '"반짝반짝~" 수정처럼 투명한 돌멩이가 햇빛을 모아 감자 쪽으로 빛을 집중시키고 있습니다. 따뜻한 빛이 온몸을 포근하게 감쌉니다.': '"Twinkle twinkle~" A crystal-like shiny stone concentrates sunlight onto you. The warm light wraps your body.',
  '빛을 온몸으로 받는다': 'Bask in Light with Body',
  '너무 뜨거워 피한다': 'Avoid as It\'s Too Hot',
  '"따뜻해라!" 집중된 햇빛을 받아 광합성 효율이 높아져 영양가와 면역력이 크게 올랐습니다.': '"So warm!" Receiving the concentrated light improved photosynthesis, increasing Nutrients and Immunity greatly.',
  '"조금 강렬한 걸..." 빛이 너무 강해 피했습니다. 돌멩이가 아쉬워하며 빛을 끕니다.': '"A bit intense..." Dodged because the light was too hot. The stone turns off the light with disappointment.',
  '"스르르..." 이상하게 빛나는 돌멩이 아래에서 뭔가가 움직이는 것 같습니다. 작은 벌레인지, 숨겨진 영양분인지...?': '"Rustle..." Something seems to be moving under the oddly glowing stone. Is it a bug or hidden nutrients?',
  '조심스레 파본다': 'Dig Carefully',
  '그냥 지나친다': 'Just Pass by',
  '"오!" 돌멩이 아래에서 영양분이 풍부한 미생물 덩어리를 발견했습니다! 무게와 영양가가 확 올랐습니다.': '"Oh!" Found a nutrient-rich microbial lump under the stone! Weight and Nutrients increased sharply.',
  '"뭐가 있는 것 같기도 하고..." 괜히 건드렸다가 사고가 날 수 있으니 그냥 지나쳤습니다. 특별한 변화는 없었습니다.': '"Could be something..." Decided to pass by to avoid trouble. There was no special change.',
  '"나 좀 굴려줄 수 있어? 심심하단 말이야!" 꼬마 돌멩이가 데굴데굴 구르고 싶어하며 부탁합니다. 같이 굴리면 재미있을 것 같은데요!': '"Can you roll me? I\'m so bored!" The little stone requests, wanting to roll around. Rolling together sounds fun!',
  '신나게 같이 굴린다': 'Roll Together Happily',
  '무거워서 거절한다': 'Refuse as It\'s Heavy',
  '"데굴데굴 신나라!" 돌멩이와 함께 빙글빙글 구르며 놀았습니다. 신나게 운동한 덕에 크기와 단단함이 늘었습니다.': '"Rolling is fun!" Rolled around with the pebble. Thanks to the fun exercise, Size and Hardness increased.',
  '"미안, 나 좀 무거워..." 정중히 거절하자 돌멩이가 혼자 터벅터벅 굴러갑니다. 대신 그 자리에서 고요히 집중해 모양이 정돈됐습니다.': '"Sorry, I\'m a bit heavy..." Declined politely, and the pebble rolls away alone. Instead, meditating on the spot neatened your shape.',
  '"오늘 밤은 달빛이 유독 강하구나..." 보름달이 평소보다 훨씬 강렬하게 빛나며 밭 전체를 환하게 비추고 있습니다. 식물들이 술렁거립니다.': '"Moonlight is exceptionally strong tonight..." The full moon shines brighter than usual, lighting up the field. Plants are excited.',
  '달빛으로 광합성한다': 'Photosynthesize under Moonlight',
  '너무 밝아서 잠을 잔다': 'Sleep as It\'s Too Bright',
  '"밤에도 광합성이 된다고?!" 강렬한 달빛을 이용해 야간 광합성을 성공적으로 마쳤습니다. 영양가와 크기가 올랐습니다.': '"Photosynthesis at night?!" Successfully carried out night photosynthesis using strong moonlight. Nutrients and Size increased.',
  '"불 좀 꺼줘..." 달빛이 너무 밝아 잠을 설쳤지만, 포근한 달빛 속에 누워 단단함은 조금 올랐습니다.': '"Turn off the light..." Barely slept due to the brightness, but lying in the cozy moonlight increased Hardness slightly.',
  '"오늘 밤은 달무리가 생긴 밤... 무언가 좋은 일이 생길 징조일지도." 보름달 주변에 신비로운 빛의 고리가 생겼습니다. 달이 속삭입니다.': '"A halo formed around the moon tonight... could be a sign of good fortune." A mysterious ring of light formed around the moon. The moon whispers.',
  '"오늘 밤은 달무리가 생겼구나... 무언가 좋은 일이 생길 징조일지도." 보름달 주변에 신비로운 빛의 고리가 생겼습니다. 달이 속삭입니다.': '"A halo formed around the moon tonight... could be a sign of good fortune." A mysterious ring of light formed around the moon. The moon whispers.',
  '달무리 아래 명상한다': 'Meditate under Moon Halo',
  '불길해서 흙 속으로 간다': 'Hide in Soil as It\'s Eerie',
  '"신비로운 에너지가..." 달무리의 특별한 에너지를 받아 모양과 면역력이 고르게 올랐습니다.': '"Mysterious energy..." Receiving the special energy of the halo improved Shape and Immunity evenly.',
  '"왠지 무섭잖아..." 달무리가 불길하게 느껴져 흙 속 깊이 파고들었습니다. 안전하지만 기회를 놓쳤습니다.': '"A bit scary..." Feeling eerie, you dug deep into the soil. Safe, but you missed the chance.',
  '"나는 매달 모양이 바뀌지만 언제나 같은 나야. 너도 그렇게 자라렴." 보름달이 조용한 달빛으로 감자에게 이야기를 건넵니다.': '"I change shape every month, but I\'m always the same me. Grow up like that." The moon speaks with quiet moonlight.',
  '달의 말을 귀 기울여 듣는다': 'Listen Carefully to Moon',
  '달이 말을 하다니 무섭다': 'Scared of Talking Moon',
  '"...고마워, 달아." 달의 이야기에서 성장의 의미를 깨달았습니다. 모든 능력치가 골고루 조금씩 성장했습니다.': '"...Thank you, Moon." Realized the meaning of growth from the moon\'s talk. All stats grew slightly and evenly.',
  '"으...달이 말을 해?" 달의 말이 무서워 귀를 막았습니다. 달이 조용해졌고 평범한 밤이 됐습니다.': '"Uh... moon is talking?" Blocked ears in fear. The moon fell silent, and it became an ordinary night.',
  '"잠깐... 구름이 나를 가리네." 환했던 보름달이 두꺼운 구름에 가려졌습니다. 어두워진 밭에서 감자는 무엇을 해야 할지 고민합니다.': '"Wait... clouds are blocking me." The bright moon gets covered by thick clouds. The potato wonders what to do in the dark.',
  '구름이 걷힐 때까지 기다린다': 'Wait for Clouds to Clear',
  '어두우니 일찍 잔다': 'Go to Sleep Early',
  '"이윽고 달이 다시 나타났어!" 꾹 참고 기다리자 구름이 걷히고 달빛이 다시 쏟아졌습니다. 단단함과 면역력이 올랐습니다.': '"Finally the moon appeared again!" Waiting patiently paid off as the clouds cleared and light poured down. Hardness and Immunity increased.',
  '"이런 날은 일찍 자는 게 최고지." 어둠을 틈타 일찍 잠들어 충분한 휴식을 취했습니다. 무게와 영양가가 늘었습니다.': '"Going to bed early is the best on dark days." Slept early in the dark to take a full rest. Weight and Nutrients increased.',
  '"오늘은 특별히 진한 냄새가 나는 퇴비를 갖고 왔어! 냄새는 좀 독하지만 효과는 최고라구!" 거름씨가 강렬한 냄새의 퇴비를 흔들며 자랑합니다.': '"I brought exceptionally strong-smelling compost today! Smells toxic but works best!" Mr. Fertilizer brags, shaking the compost.',
  '참고 영양분을 흡수한다': 'Absorb Nutrients Bearing Smell',
  '냄새가 너무 심해 거절한다': 'Refuse due to Strong Smell',
  '"으윽... 하지만 효과는 진짜야!" 냄새를 참고 퇴비를 흡수했습니다. 영양가와 무게가 크게 올랐습니다.': '"Ugh... but it really works!" Endured the smell and absorbed the compost. Nutrients and Weight increased greatly.',
  '"미안, 오늘 패스..." 냄새를 못 참고 거절했습니다. 거름씨가 무안해하며 돌아갑니다.': '"Sorry, not today..." Refused due to the smell. Mr. Fertilizer goes back embarrassed.',
  '"미안, 오늘은 패스..." 냄새를 못 참고 거절했습니다. 거름씨가 무안해하며 돌아갑니다.': '"Sorry, not today..." Refused due to the smell. Mr. Fertilizer goes back embarrassed.',
  '"너 얼굴을 보니까 단단함이 좀 부족한 것 같은데? 내가 딱 맞는 특제 미네랄 처방을 해줄게!" 거름씨가 꼼꼼히 살펴보더니 처방전을 꺼냅니다.': '"Looking at you, you lack Hardness. I\'ll give you the perfect custom mineral prescription!" Mr. Fertilizer examines you and takes out a note.',
  '처방을 받아들인다': 'Accept Prescription',
  '스스로 해결하겠다고 한다': 'Solve by Yourself',
  '"오, 역시 전문가!" 맞춤 미네랄 처방을 받아 단단함과 면역력이 크게 올랐습니다.': '"Oh, an expert indeed!" Accepted prescription, increasing Hardness and Immunity greatly.',
  '"저는 제 방식이 있어요!" 처방을 거부하고 혼자 해결하기로 했습니다. 오기가 생겨 모양이 정돈됐습니다.': '"I have my own way!" Refused prescription. Gained pride, and your shape was neatened.',
  '"...음? 여기 오래된 거름 더미가 묻혀있네." 흙 속에서 오래전에 묻힌 낡은 거름 더미를 발견했습니다. 냄새는 덜하지만 영양이 농축돼 있을지도 모릅니다.': '"...Hm? Old compost pile is buried here." Found an old compost pile. Smells less, but nutrients might be concentrated.',
  '조심히 흡수해본다': 'Absorb Carefully',
  '오래된 것 같아 포기한다': 'Give up as It\'s Old',
  '"오래됐지만 영양은 그대로네!" 숙성된 거름에서 농축된 영양분을 흡수해 영양가와 무게가 크게 올랐습니다.': '"Old but still rich!" Absorbed concentrated nutrients from the aged compost, increasing Nutrients and Weight greatly.',
  '"좀 찜찜한데..." 오래된 거름이라 혹시 모를 독성이 걱정돼 포기했습니다. 현명한 판단이었습니다.': '"A bit suspicious..." Gave up fearing toxicity. A wise decision indeed.',
  '"우리 서로 교환 어때? 나한테 흙을 좀 나눠주면 내가 특급 영양분을 줄게!" 거름씨가 물물교환을 제안합니다. 나쁜 거래는 아닌 것 같습니다.': '"How about a trade? Give me some soil, and I\'ll give you premium nutrients!" Mr. Fertilizer proposes a barter. Doesn\'t sound bad.',
  '교환을 수락한다': 'Accept Trade',
  '교환을 거절한다': 'Refuse Trade',
  '"좋아, 교환하자!" 흙을 나눠준 대가로 고농도 영양분을 받았습니다. 크기가 약간 줄었지만 영양가가 크게 올랐습니다.': '"Great, let\'s trade!" Traded soil for high-concentration nutrients. Size decreased slightly, but Nutrients increased greatly.',
  '"내 흙은 소중해!" 교환을 거절하고 흙을 지켰습니다. 거름씨가 아쉬워하며 돌아갑니다.': '"My soil is precious!" Refused trade. Mr. Fertilizer returns disappointed.',
  '"나처럼 예쁜 모양을 갖고 싶지 않아? 사실 비법이 있거든." 도라지가 파란 꽃잎을 가다듬으며 모양 관리 비법을 공유하겠다고 합니다.': '"Don\'t you want a pretty shape like mine? Actually, I have a secret." Bellflower preens its blue petals and offers shape tips.',
  '내 방식이 있다고 한다': 'Say I Have My Own Way',
  '"오, 이렇게 하면 되는 거야?" 도라지의 모양 관리 비법을 실천해 모양이 크게 좋아지고 크기도 늘었습니다.': '"Oh, that\'s how you do it?" Practiced shape secret, greatly improving Shape and increasing Size.',
  '"나는 나만의 스타일이 있어." 도라지의 제안을 거절하고 내 방식을 고수했습니다. 단단함이 조금 올랐습니다.': '"I have my own style." Refused offer, sticking to your way. Hardness increased slightly.',
  '"어디 한번 봐봐, 내가 더 크지?" 도라지가 폼 나게 몸을 쭉 뻗어 키를 재자고 합니다. 과연 감자가 더 클까요?': '"Look here, aren\'t I taller?" Bellflower stretches out its body to measure height. Are you taller?',
  '키 대결을 한다': 'Measure Height',
  '도라지가 더 크다고 인정한다': 'Admit Bellflower is Taller',
  '"으라차차!" 최선을 다해 크기를 키웠습니다. 대결 덕분에 크기와 모양이 좋아졌습니다.': '"Hrgh!" Tried your best to grow. Thanks to the showdown, Size and Shape improved.',
  '"넌 진짜 크구나..." 도라지의 크기에 감탄하며 양보했습니다. 대신 면역력을 키우는 데 집중했습니다.': '"You are really tall..." Admired and conceded. Instead, focused on building Immunity.',
  '"저기... 나 오늘 좀 힘드네. 흙이 너무 건조해서 뿌리가 아파." 평소에는 도도했던 도라지가 시들시들한 모습으로 도움을 요청합니다.': '"Excuse me... I\'m struggling today. The soil is too dry, making my roots hurt." The usually proud bellflower requests help witheringly.',
  '물기를 나눠준다': 'Share Moisture',
  '모른 척한다': 'Pretend Not to See',
  '"고마워, 덕분에 살았어!" 수분을 나눠줘 도라지가 되살아났습니다. 보답으로 면역력 비법을 알려줘 면역력이 크게 올랐습니다.': '"Thanks, you saved me!" Shared water, reviving the bellflower. In return, it shared an immunity tip, greatly increasing Immunity.',
  '"나도 바쁜걸..." 도라지를 외면하고 지나쳤습니다. 찜찜하지만 내 성장에 집중했습니다.': '"I\'m busy too..." Ignored the bellflower. Felt guilty but focused on your own growth.',
  '"흠흠, 새 흙길을 뚫어줄게! 뿌리가 더 깊이 내려갈 수 있도록!" 지렁이가 꿈틀꿈틀 땅을 파며 감자를 위한 통로를 만들어 주겠다고 합니다.': '"Ahem, I\'ll dig a new path! So your roots can go deeper!" The earthworm wriggles, offering to dig a pathway for you.',
  '감사히 이용한다': 'Use with Gratitude',
  '"오, 뿌리가 쑥쑥 내려가!" 지렁이가 뚫어준 길을 따라 뿌리가 깊이 내려가 무게와 크기가 크게 올랐습니다.': '"Oh, roots are going deep!" Roots went deep along the path, increasing Weight and Size greatly.',
  '"아, 괜찮아요..." 지렁이의 제안을 거절했습니다. 지렁이가 서운해하며 다른 곳으로 갑니다.': '"Ah, no thanks..." Declined offer. The earthworm walks away disappointed.',
  '"꿈틀꿈틀 달리기 시합 어때? 흙 속 100m 경주야!" 지렁이가 의외로 진지한 표정으로 달리기 시합을 제안합니다. 과연 감자가 따라갈 수 있을까요?': '"How about a wriggling race? A 100m race in soil!" The earthworm proposes a race seriously. Can you catch up?',
  '시합에 참가한다': 'Participate in Race',
  '사양한다': 'Decline',
  '"꿈틀꿈틀!" 지렁이와 함께 흙 속을 누비며 경주를 펼쳤습니다. 모양이 좀 흐트러졌지만 크기와 단단함이 올랐습니다.': '"Wriggle wriggle!" Raced in the soil with the earthworm. Shape got slightly ruined, but Size and Hardness increased.',
  '"나는 달리기를 잘 못해서..." 경주를 사양하고 제자리에서 꾸준히 성장했습니다. 영양가가 조금 올랐습니다.': '"I\'m not good at running..." Declined race. Grown steadily on the spot. Nutrients increased slightly.',
  '"내가 먹은 낙엽이랑 흙을 소화한 거야. 최고급 영양 선물이라구!" 지렁이가 정성스럽게 만든 영양 덩어리를 선물로 내밀며 수줍어합니다.': '"I digested fallen leaves and soil. It\'s a premium nutrient gift!" The earthworm shyly presents a lump of nutrients.',
  '감사히 받는다': 'Accept with Gratitude',
  '지렁이가 먹은 거라 망설인다': 'Hesitate because Worm Ate it',
  '"와, 고마워 지렁아!" 지렁이가 준 영양 덩어리를 흡수해 영양가와 무게가 올랐습니다.': '"Wow, thanks worm!" Absorbed the nutrients, increasing Nutrients and Weight.',
  '"음... 솔직히 좀..." 지렁이의 선물을 거절했습니다. 지렁이가 눈물을 보이며 자기 것 먹으러 갑니다.': '"Um... honestly..." Declined gift. The earthworm sheds tears and leaves to eat it itself.',
  '"꿈틀꿈틀꿈틀!" 갑자기 수십 마리의 지렁이 무리가 밭을 가득 채우며 몰려왔습니다! 다들 배가 고픈 모양입니다.': '"Wriggle wriggle!" Suddenly dozens of earthworms swarm the field! They all seem hungry.',
  '흙을 나눠주며 달랜다': 'Calm Them Sharing Soil',
  '단단하게 버텨낸다': 'Endure Hardening Shell',
  '"먹어, 먹어!" 지렁이들에게 흙을 나눠주며 달래자 지렁이들이 고마워하며 도로 파고 들어갔습니다. 면역력이 올랐습니다.': '"Eat up!" Shared soil to calm them, and they return underground happily. Immunity increased.',
  '"내 자리다!" 껍질을 단단하게 굳혀 지렁이들의 습격을 버텨냈습니다. 단단함이 크게 올랐지만 모양이 좀 뒤틀렸습니다.': '"My place!" Hardened shell to endure the swarm. Hardness increased greatly, but Shape got slightly warped.',
  '"나 터널 파는 건 자신 있거든! 네 뿌리 밑에 터널 파줄까? 물 빠짐도 좋아지고 공기도 잘 통할 거야!" 땅강아지가 날카로운 앞발로 파보는 시늉을 합니다.': '"I\'m confident in digging tunnels! Shall I dig one under your roots? Drainage and air flow will improve!" The mole cricket mimics digging.',
  '터널을 파달라고 한다': 'Ask to Dig Tunnel',
  '뿌리가 다칠까봐 거절한다': 'Refuse Fearing Root Damage',
  '"오, 틈새 공기가 잘 통해!" 땅강아지가 뚫어준 터널 덕분에 통기성이 좋아져 면역력과 영양가가 올랐습니다.': '"Oh, air flows well!" Good air flow from the tunnel increased Immunity and Nutrients.',
  '"오, 숨쉬기 편해졌어!" 땅강아지가 뚫어준 터널 덕분에 통기성이 좋아져 면역력과 영양가가 올랐습니다.': '"Oh, breathing got easier!" The tunnel improved airflow, increasing Immunity and Nutrients.',
  '"조심히 거절할게..." 뿌리가 다칠 것을 우려해 거절했습니다. 땅강아지가 이해하며 다른 밭으로 갑니다.': '"I\'ll decline..." Refused fearing root damage. The mole cricket understands and leaves.',
  '"자, 흙바닥 레슬링 시합이다! 3초 안에 상대를 쓰러뜨리면 이기는 거야!" 땅강아지가 이두박근을 과시하며 레슬링 대회를 선언합니다.': '"Alright, soil wrestling match! Down opponent in 3 seconds to win!" The mole cricket shows off its biceps and declares a match.',
  '레슬링을 한다': 'Do Wrestling',
  '영리하게 피한다': 'Dodge Cleverly',
  '"이얍!" 온 힘을 다해 겨뤘습니다. 지긴 했지만 전력을 다한 덕에 단단함과 무게가 올랐습니다.': '"Hya!" Fought with all power. Lost, but efforts increased Hardness and Weight.',
  '"레슬링보다는 두뇌 싸움이지." 레슬링 대신 땅강아지를 요리조리 피해 면역력을 길렀습니다.': '"Brain over brawn!" Dodged the mole cricket instead, building Immunity.',
  '"이거 내가 아끼던 건데... 너한테 줄게. 단단해지는 데 도움이 될 거야." 땅강아지가 반짝이는 작은 돌을 조심스레 내밀며 선물합니다.': '"This is my favorite... for you. It will help you get hard." The mole cricket shyly presents a shiny little stone.',
  '소중히 받는다': 'Accept Carefully',
  '괜찮다며 사양한다': 'Decline Politely',
  '"고마워, 땅강아지야!" 돌을 곁에 두자 신기하게도 단단함이 크게 올랐습니다. 게다가 면역력도 덩달아 올랐습니다.': '"Thanks, mole cricket!" Keeping the stone increased Hardness and Immunity greatly.',
  '"아니야, 네가 가져." 선물을 정중히 돌려줬습니다. 땅강아지가 감사해하며 앞발로 땅을 갈아줬습니다. 영양가가 올랐습니다.': '"No, you keep it." Returned gift politely. The mole cricket plows soil in gratitude, increasing Nutrients.',

  // Event result messages (deal)
  '지렁이와의 대결에서 무거운 몸집으로 승리해 지렁이 인형을 획득했습니다! (지렁이: 내가 주는 선물이니 사양말라구!)': 'Defeated earthworm using heavy weight and obtained Earthworm Toy! (Worm: It\'s my gift, don\'t decline!)',
  '지렁이가 감자를 얕보고 흙을 다 파헤쳐 몸뚱이를 튕겨냈습니다! (지렁이: 살이나 찌우렴!) 무게가 100g 증가했습니다.': 'The earthworm looked down on you, dug up the soil, and bounced you away! (Worm: Go gain weight!) Weight increased by 100g.',
  '고구마를 힘으로 밀어내고 고구마 인형을 획득했습니다! (고구마: 형님으로 모시겠구마!)': 'Pushed sweet potato with power and obtained Sweet Potato Toy! (Yam: I\'ll respect you, bro!)',
  '고구마에게 밭 구석으로 힘껏 밀려나 몸에 흠집이 났습니다. 모양이 120 감소했습니다.': 'Pushed into the corner of the field by sweet potato, getting scratched. Shape decreased by 120.',
  '땅강아지의 날카로운 발톱을 단단한 몸으로 막아내고 손톱 인형을 획득했습니다! (땅강아지: 당신께 경의를 표합니다.)': 'Blocked mole cricket\'s sharp claws with hard body and obtained Mole Cricket Toy! (Cricket: Respect to you.)',
  '땅강아지의 앞발 공격에 몸 곳곳에 생채기가 났습니다! 크기 20, 무게 20, 모양 20 감소.': 'Scratched all over by mole cricket\'s claws! Size 20, Weight 20, Shape 20 decreased.',
  '도라지와의 외모 배틀에서 승리해 도라지꽃 인형을 획득했습니다! (도라지: 특별히 주는 선물이야!)': 'Won beauty battle against bellflower and obtained Bellflower Toy! (Bellflower: A special gift for you!)',
  '도라지에게 외모 팩트 폭행을 당했습니다! 대신 쓴 도라지 즙을 마셔 면역력이 100 증가했습니다.': 'Devastated by bellflower\'s facts about looks! Instead, drank bitter juice, increasing Immunity by 100.',
  '강인한 면역력 덕분에 벌레 떼의 습격에도 아무런 피해를 입지 않고 버텨냈습니다!': 'Thanks to strong Immunity, survived the bug swarm attack without any damage!',
  '벌레들에게 몸을 처참히 갉아먹혔습니다! 무게 125, 크기 125, 모양 25, 면역력 25, 영양가 25 감소.': 'Terribly eaten away by bugs! Weight, Size 125 decreased. Shape, Immunity, Nutrients 25 decreased.',
  '거름씨와 건강하게 인사를 나눴습니다. (거름: 딱 봐도 건강해 보여! 다른 채소에게 가볼게.)': 'Exchanged healthy greetings with Mr. Fertilizer. (Fertilizer: You look healthy! I will go to other vegetables.)',
  '영양 부족 진단을 받고 거름씨의 양분을 듬뿍 받아들였습니다! 영양가 100 증가.': 'Diagnosed with malnutrition, absorbed Mr. Fertilizer\'s nutrients! Nutrients increased by 100.',
  '장식 인형을 터치하여 무게이(가) 1 증가했습니다!': 'Touched toy, Weight increased by 1!',
  '장식 인형을 터치하여 크기이(가) 1 증가했습니다!': 'Touched toy, Size increased by 1!',
  '장식 인형을 터치하여 단단함이(가) 1 증가했습니다!': 'Touched toy, Hardness increased by 1!',
  '장식 인형을 터치하여 모양이(가) 1 증가했습니다!': 'Touched toy, Shape increased by 1!',
  '장식 인형을 터치하여 면역력이(가) 1 증가했습니다!': 'Touched toy, Immunity increased by 1!',
  '장식 인형을 터치하여 영양가이(가) 1 증가했습니다!': 'Touched toy, Nutrients increased by 1!',
  // === Ending Screen Translations (33 Endings: Titles, Taglines, Stories, Questions) ===
  '해시브라운': 'Hash Brown',
  '바삭하고 고소한 아침의 단짝': 'Crispy and Savory Morning Sidekick',
  '케첩파인가요, 머스터드파인가요?': 'Are you team ketchup or team mustard?',
  '당신이 정성껏 키운 감자는 잘 자라서 해시브라운이 되었습니다. 해시브라운은 제작자의 캐릭터 이름입니다. 맛있지만 많이 먹으면 느끼할 수 있습니다. 혼자 먹는 것보다 햄버거, 콜라와 먹으면 더 좋아요. 당신의 감자는 꿈을 이루었네요. 축하드립니다.': 'The potato you grew with love has successfully become a Hash Brown. Hash Brown is also the developer\'s character name. It\'s delicious, but can feel greasy if you eat too much. It goes best when paired with a hamburger and cola rather than eating alone. Your potato has fulfilled its dream! Congratulations.',
  '감자탕': 'Gamjatang',
  '얼큰하고 칼칼한 국물 속의 주역': 'The Star of Spicy and Savory Soup',
  '볶음밥은 빼놓을 수 없겠죠?': 'Can\'t miss the fried rice at the end, right?',
  '당신이 정성껏 키운 감자는 잘 자라서 감자탕이 되었습니다. 감자탕은 다양한 영양소가 많이 들어있습니다. 감자탕의 감자는 채소 감자가 아니라지만 그런게 뭐 중요할까요. 맛만 있으면 그만이죠.': 'The potato you grew with love has successfully become Gamjatang. Gamjatang contains many rich nutrients. Some say the "gamja" in Gamjatang doesn\'t stand for potato, but does that really matter? As long as it tastes delicious, that\'s all that counts.',
  '감자칩': 'Potato Chips',
  '바삭바삭 손이 가요 손이 가': 'Crunchy Bites, Can\'t Stop Reaching For It',
  '짭짤한 오리지널이 좋나요, 어니언이 좋나요?': 'Do you prefer salted original or sour cream & onion?',
  '당신이 정성껏 키운 감자는 잘 자라서 감자칩이 되었습니다. 감자칩은 세계에서 사랑받는 간식 중 하나죠. 여러분이 좋아하는 감자칩은 무엇인가요?': 'The potato you grew with love has successfully become Potato Chips. Potato chips are one of the most beloved snacks globally. What kind of potato chips do you like?',
  '감자옹심이': 'Potato Ongsimi',
  '강원도의 정취를 담은 쫄깃한 한 그릇': 'A Chewy Bowl Full of Gangwon Vibe',
  '옹심이의 쫀득함을 좋아하시나요?': 'Do you love the unique chewiness of Ongsimi?',
  '당신이 정성껏 키운 감자는 잘 자라서 감자옹심이가 되었습니다. 강원도의 감자옹심이가 특히 유명하죠. 푹 익어서 투명한 빛깔을 내는 감자옹심이. 먹고싶네요.': 'The potato you grew with love has successfully become Potato Ongsimi. Gangwon Province is particularly famous for its potato Ongsimi. Seeing the thoroughly cooked, translucent Ongsimi makes me crave some now.',
  '감자조림': 'Braised Potatoes',
  '단짠단짠 밥도둑 반찬계의 클래식': 'The Sweet and Salty Side Dish Classic',
  '뜨끈한 하얀 쌀밥 준비되셨나요?': 'Is your steaming bowl of white rice ready?',
  '당신이 정성껏 키운 감자는 잘 자라서 감자조림이 되었습니다. 호불호가 갈리지 않는 밥반찬계의 베스트셀러. 너무 많이 먹으면 짤 수 있어요.': 'The potato you grew with love has successfully become Braised Potatoes. It\'s a crowd-pleasing bestseller among home side dishes. Just be careful, it might taste salty if you eat too much of it.',
  '감자볶음': 'Stir-Fried Potatoes',
  '아삭하고 고소한 일상의 단골 반찬': 'A Crisp and Savory Daily Meal Regular',
  '당근과 감자채, 최강의 조합이죠?': 'Carrots and shredded potatoes, a legendary duo, right?',
  '당신이 정성껏 키운 감자는 잘 자라서 감자볶음이 되었습니다. 식탁 위 반찬계의 영원한 친구. 도시락 반찬으로도 좋죠. 당근과 피망이 잘 어울려요.': 'The potato you grew with love has successfully become Stir-Fried Potatoes. A lifelong friend on our dining tables and a classic lunchbox option. Carrots and bell peppers pair beautifully with it.',
  '감자핫도그': 'Potato Hot Dog',
  '설탕 솔솔 뿌린 바삭함의 극치': 'Ultimate Crispy Crunch Sprinkled with Sugar',
  '설탕을 묻히나요, 케첩만 바르나요?': 'Do you roll it in sugar, or just squeeze ketchup?',
  '당신이 정성껏 키운 감자는 잘 자라서 감자핫도그가 되었습니다. 그냥 핫도그도 맛있는데 감자튀김이 들어간 핫도그라니. 미국사람들도 엄청 좋아한다네요. 도깨비 방망이처럼 생겼죠?': 'The potato you grew with love has successfully become a Potato Hot Dog. Standard hot dogs are great, but one coated in french fries is even better. Apparently, even people in the US are crazy about it. Doesn\'t it look like a spiked club?',
  '감자샐러드': 'Potato Salad',
  '부드럽고 달콤한 샌드위치의 단짝': 'The Soft and Sweet Sandwich Best Friend',
  '모닝빵 사이에 넣어 드실래요?': 'Would you like to spread it inside a dinner roll?',
  '당신이 정성껏 키운 감자는 잘 자라서 감자샐러드가 되었습니다. 샐러드계의 트로이카. 고구마, 단호박과 함께 최고의 인기를 누리죠. 기름진 갈비와 먹으면 잘 어울린다고 하네요. 만들기도 어렵지 않아요.': 'The potato you grew with love has successfully become Potato Salad. Part of the salad triumvirate, enjoying top popularity alongside sweet potato and pumpkin. It is said to pair wonderfully with greasy short ribs. Plus, it\'s very easy to make!',
  '감자국': 'Potato Soup',
  '따뜻하게 마음을 녹여주는 맑고 개운한 맛': 'A Clean and Heartwarming Cozy Taste',
  '겨울철에 생각나는 뜨끈한 맛일까요?': 'Is it that hot steaming soup you crave in winter?',
  '당신이 정성껏 키운 감자는 잘 자라서 감자국이 되었습니다. 계란풀고 파송송 썰어넣은 뜨끈한 감자국 한그릇 어떠세요? 벌써 몸이 스르르 풀리는 기분이네요.': 'The potato you grew with love has successfully become Potato Soup. How about a warm bowl of potato soup with whisked eggs and chopped scallions? Just thinking of it makes my body relax.',
  '치즈웨지감자': 'Cheese Wedge Potatoes',
  '치즈가 쭉쭉 늘어나는 두툼한 맥주 안주': 'Thick Potato Wedges with Stretchy Cheese for Beer',
  '치즈와 감자의 조화, 어떠신가요?': 'What do you think about the harmony of cheese and potato?',
  '당신이 정성껏 키운 감자는 잘 자라서 치즈웨지감자가 되었습니다. 두툼하게 썰어 튀긴 감자 위에 고소한 치즈를 아낌없이 얹어서 만들었어요. 감자들이 이불을 덮은것 같아요. 치즈와 감자의 궁합은 최고네요.': 'The potato you grew with love has successfully become Cheese Wedge Potatoes. Made by slicing potatoes thickly, frying them, and generously topping them with savory cheese. It looks like the potatoes are tucked under a cozy cheese blanket. Truly a match made in heaven.',
  '감자 스프': 'Potato Soup',
  '부드럽고 크리미하게 아침을 여는 맛': 'A Smooth and Creamy Start to Your Morning',
  '바삭한 크루통을 올려볼까요?': 'Shall we top it with some crunchy croutons?',
  '당신이 정성껏 키운 감자는 잘 자라서 감자 스프가 되었습니다. 고소하고 달콤한 감자스프. 후추를 뿌려 먹어도 맛있어요. 홀로 있어도 빛나지만 앞장서서 누군가를 빛내게 해주는 친구지요.': 'The potato you grew with love has successfully become Potato Soup. A savory and smooth cream soup. It tastes wonderful with a dash of black pepper. It shines on its own, but it\'s a friend that excels at highlighting others.',
  '감자그라탕': 'Potato Gratin',
  '치즈와 베이컨을 얹어 오븐에 노릇하게 구운 요리': 'Baked Golden in the Oven with Cheese and Bacon',
  '뜨거우니까 조심해서 드세요!': 'It\'s hot, so blow on it before eating!',
  '당신이 정성껏 키운 감자는 잘 자라서 감자그라탕이 되었습니다. 감자가 치즈와 만나 한데 섞여 뜨거운 오븐에서 하나가 되었네요. 갓 나온 그라탕을 한술 크게 떠서 입에 넣으면 정말 뜨거우니 조심하세요.': 'The potato you grew with love has successfully become Potato Gratin. The potato and cheese joined forces and melted together inside a hot oven. Be careful when taking a big spoonful of freshly baked gratin, as it\'s extremely hot!',
  '회오리감자': 'Tornado Potato',
  '돌리고 돌려 만드는 축제 길거리의 황제': 'The King of Spiral Street Food',
  '치즈 가루를 아낌없이 뿌려드릴까요?': 'Shall we dust it generously with cheese powder?',
  '당신이 정성껏 키운 감자는 잘 자라서 회오리감자가 되었습니다. 특이한 모양만큼 맛있는 회오리감자. 유원지에 놀러가서 먹으면 사진도 찍어 추억을 남길 수 있죠.': 'The potato you grew with love has successfully become a Tornado Potato. As delicious as its spiral shape is unique. Buying one at an amusement park is the perfect way to take photos and create fun memories.',
  '알감자조림': 'Braised Baby Potatoes',
  '동글동글 한 입 크기의 짭조름한 매력': 'Salty and Chewy Bite-Sized Baby Potatoes',
  '간장에 달콤하게 졸인 반찬 좋아하시나요?': 'Do you like side dishes braised sweet in soy sauce?',
  '당신이 정성껏 키운 감자는 잘 자라서 알감자조림이 되었습니다. 작고 동글동글한 알감자를 양념에 푹 졸여서 만들었어요. 한입에 쏙 넣고 먹으면 밥과 정말 잘 어울려요.': 'The potato you grew with love has successfully become Braised Baby Potatoes. Made by braising tiny, round baby potatoes deeply in seasoning. Popping them whole into your mouth makes them a perfect companion for rice.',
  '알감자 버터구이': 'Butter-Roasted Baby Potatoes',
  '휴게소 필수 코스, 버터 향 가득한 유혹': 'A Must-Have Rest Area Treat Rich with Butter Aroma',
  '알감자를 휴게소에서 빼놓을 수 없죠?': 'Can\'t skip the baby potatoes at the highway rest stop, right?',
  '당신이 정성껏 키운 감자는 잘 자라서 알감자 버터구이가 되었습니다. 고속도로 휴게소에 가면 사먹고 싶어지는 알감자 버터구이. 설탕도 어울리고 소금도 어울려요. 한입에 넣으면 뜨거우니 조심해서 식혀드세요.': 'The potato you grew with love has successfully become Butter-Roasted Baby Potatoes. The classic rest stop treat that calls your name on highway trips. It goes great with both sugar and salt. Be careful, they\'re scorching hot inside, so let them cool down a bit.',
  '감자밥': 'Potato Rice',
  '양념장 슥슥 비벼 먹는 소박하지만 든든한 밥상': 'A Simple yet Filling Meal Mixed with Seasoned Soy Sauce',
  '달래간장 넣고 비비면 어떨까요?': 'How about mixing it with wild chive soy sauce?',
  '당신이 정성껏 키운 감자는 잘 자라서 감자밥이 되었습니다. 강원도에서 주로 먹는 감자밥은 밥을 지을때 감자를 같이 넣어 만들어요. 갓 지은 감자밥에 간장양념을 넣고 슥슥 비벼 먹으면 다른 반찬이 필요 없지요.': 'The potato you grew with love has successfully become Potato Rice. A Gangwon Province specialty made by cooking potatoes right along with the rice. Stirring seasoned soy sauce into a hot bowl of potato rice is so satisfying you won\'t need any other side dish.',
  '감자뇨끼': 'Potato Gnocchi',
  '이탈리아의 감성을 담은 부드러운 파스타': 'Soft Pasta Packed with Italian Heritage',
  '부드럽고 크리미한 소스가 어울릴까요?': 'Would a soft and creamy sauce fit it?',
  '당신이 정성껏 키운 감자는 잘 자라서 감자뇨끼가 되었습니다. 감자뇨끼(뇨키)는 이탈리아의 요리에요. 감자와 밀가루로 만든 반죽을 한입크기로 익혀 소스를 얹어 먹으면 정말 부드럽고 맛있어요.': 'The potato you grew with love has successfully become Potato Gnocchi. Gnocchi is a classic Italian pasta. Made by forming dough from potato and flour, boiling it in bite-sized pieces, and serving it with sauce. It is wonderfully soft and delicious.',
  '감자크로켓': 'Potato Croquette',
  '겉바속촉 한 입 깨물면 고소함이 톡톡': 'Crispy Outside, Soft Inside, Bursting with Savory Flavor',
  '속 재료로 치즈를 가득 넣어볼까요?': 'Shall we pack the inside full of cheese?',
  '당신이 정성껏 키운 감자는 잘 자라서 감자크로켓이 되었습니다. 으깬 감자에 햄과 치즈 등을 섞어 기름에 튀겨 만들었어요.': 'The potato you grew with love has successfully become a Potato Croquette. Made by mixing mashed potato with ham and cheese, then deep-frying it. How could something like that not taste amazing?',
  '감자튀김': 'French Fries',
  '모두에게 사랑받는 영원한 패스트푸드': 'The Eternal Globally Beloved Fast Food',
  '세트 메뉴에서 감튀 사이즈 업 하시나요?': 'Do you size up your fries in a combo meal?',
  '당신이 정성껏 키운 감자는 잘 자라서 감자튀김이 되었습니다. 세트메뉴의 조연처럼 느껴지지만 감자튀김만 먹어도 정말 맛있답니다. 감자의 크기와 소금량에 따라 맛도 다양해요.': 'The potato you grew with love has successfully become French Fries. Though often viewed as a supporting character in combo meals, fries are a delicious star on their own. Their flavor varies greatly depending on the thickness and saltiness.',
  '감자전분': 'Potato Starch',
  '어떤 요리든 쫀득하게 만들어주는 마법의 가루': 'The Magic Powder that Makes Any Dish Chewy',
  '전분 가루로 쫄깃한 부침개 만들어볼까요?': 'Shall we make a chewy pancake with starch powder?',
  '당신이 정성껏 키운 감자는 잘 자라서 감자전분이 되었습니다. 감자가 고운 가루가 되었네요. 자신을 작게 만들고 나면 어떤 요리도 될 수 있고 어느 요리에나 어울리게 되죠.': 'The potato you grew with love has successfully become Potato Starch. The potato has turned into a fine powder. By breaking itself down completely, it gains the power to transform into any dish and blend in anywhere.',
  '매시드 포테이토': 'Mashed Potato',
  '입안에서 사르르 녹아내리는 부드러움': 'Softness that Melts Right in Your Mouth',
  '스테이크 사이드 메뉴로 최고 아닐까요?': 'Isn\'t it the absolute best side dish for steak?',
  '당신이 정성껏 키운 감자는 잘 자라서 매시드 포테이토가 되었습니다. 잔뜩 으깨졌지만 그래서 더 부드럽고 맛도 좋아요. 설탕, 소금 가리지 않고 어울리지요.': 'The potato you grew with love has successfully become Mashed Potato. It has been thoroughly mashed, but that\'s what makes it incredibly smooth and delicious. It pairs perfectly with both sugar and salt.',
  '연구실 실험용 감자': 'Lab Test Potato',
  '인류의 과학 발전을 위한 위대한 한 걸음': 'A Great Step for Humanity\'s Scientific Advance',
  '인류의 과학 발전에 기여하게 되어 기쁜가요?': 'Are you glad to contribute to human science?',
  '당신이 정성껏 키운 감자는 잘 자라서 연구실 실험용 감자가 되었습니다. 저런, 감자에게 가해지는 무자비한 실험이 비록 지켜보는 것 조차 고통스럽겠지만 인류에게는 큰 도움이 될 것입니다.': 'The potato you grew with love has successfully become a Lab Test Potato. Oh dear, while watching the ruthless experiments performed on this potato might be painful, it will undoubtedly contribute greatly to human progress.',
  '학교 실습용 감자': 'School Practice Potato',
  '학생들의 호기심 가득한 보랏빛 첫 실험': 'Students\' First Purple Experiment Full of Curiosity',
  '스포이드로 용액을 떨어뜨리던 기억 나시나요?': 'Do you remember dropping solution with a pipette?',
  '당신이 정성껏 키운 감자는 잘 자라서 학교 실습용 감자가 되었습니다. 저런, 학생들이 스포이드로 아이오딘용액을 뿌리고 있네요. 감자의 얼굴이 보랏빛으로 질렸네요. 녹말 성분이 용액에 반응한거라고요? 아무렴 어떤가요 학생들이 실험을 하며 즐거워 하는데요.': 'The potato you grew with love has successfully become a School Practice Potato. Oh my, the students are squeezing iodine solution onto the potato. Look, the potato\'s face has turned purple in shock! They say it\'s just the starch reacting to the solution, but who cares? The students are having a blast experimenting.',
  '군감자': 'Roasted Potato',
  '동치미 국물 한 모금 같이 마실래요?': 'Would you like a sip of radish water kimchi with it?',
  '당신이 정성껏 키운 감자는 잘 자라서 군감자가 되었습니다. 군감자는 감자를 가장 쉽고 맛있게 먹을 수 있는 방법이죠. 재를 이리저리 털어내고 껍질을 벗겨 호호 불어 먹으면 정말 맛있어요.': 'The potato you grew with love has successfully become a Roasted Potato. Roasting is one of the simplest and most delicious ways to eat a potato. Dusting off the ash, peeling back the skin, and blowing on it makes it taste spectacular.',
  '찐감자': 'Steamed Potato',
  '포슬포슬 뜨거울 때 한 입 먹는 순수한 매력': 'Pure Appeal of Fluffy Hot Bites',
  '당신이 정성껏 키운 감자는 잘 자라서 찐감자가 되었습니다. 찐감자는 불과 물만 있으면 쉽게 만들 수 있죠. 소금 and 설탕 무엇이든 잘 어울려요.': 'The potato you grew with love has successfully become a Steamed Potato. Steamed potatoes are easily made with just fire and water. They pair beautifully with both salt and sugar.',
  '감자전': 'Potato Pancake',
  '당신이 정성껏 키운 감자는 잘 자라서 감자전이 되었습니다. 부추와 고추를 넣고 자글자글 기름에 부쳐 낸 감자전. 감자는 채썰어도 맛있고 갈아도 맛있어요.': 'The potato you grew with love has successfully become a Potato Pancake. Frying a grated potato in sizzling oil with some chives and chili pepper makes a delicious pancake. Potatoes taste great whether they\'re shredded or grated.',
  '재배용 씨감자': 'Seed Potato',
  '당신이 정성껏 키운 감자는 잘 자라서 재배용 씨감자가 되었습니다. 비록 이번 생에 꿈을 이루지는 못했지만 자신의 몸을 네 조각으로 나눠 미래의 꿈을 향해 다시 도전하겠지요.': 'The potato you grew with love has successfully become a Seed Potato. Though it couldn\'t fully realize its dream in this life, it will split itself into four pieces to challenge its future dreams once again in the soil.',
  '세계에서 가장 작은 감자': 'World\'s Smallest Potato',
  '당신이 정성껏 키운 감자는 잘 자라서 세계에서 가장 작은 감자가 되었습니다. 지름이 동전만한 초소형 감자, 기네스북에도 올라 화제가 되었네요. 조심하세요, 너무 작아 날아갈지도 몰라요.': 'The potato you grew with love has successfully become the World\'s Smallest Potato. A micro potato the size of a coin, which even made headlines in the Guinness World Records. Be careful, it\'s so tiny it might blow away!',
  '세계에서 가장 큰 감자': 'World\'s Largest Potato',
  '당신이 정성껏 키운 감자는 잘 자라서 세계에서 가장 큰 감자가 되었습니다. 어떻게 이렇게 키우셨어요? 자동차보다 큰 감자라니 기네스북에도 올랐네요. 수백명이 먹어도 배부르겠어요.': 'The potato you grew with love has successfully become the World\'s Largest Potato. How on earth did you grow it this big? A potato larger than a car, landing it straight in the Guinness World Records! It would feed hundreds of people.',
  '돼지 사료': 'Pig Feed',
  '돼지 친구들이 맛있게 먹어주었겠죠?': 'Did our pig friends enjoy eating it?',
  '안타깝네요. 당신이 키운 감자는 돼지 사료가 되었습니다. 너무 골고루 잘 키우려고 해서 그런걸까요? 감자는 돼지의 한입 식사가 되었네요. 감자의 일생은 돼지의 삼겹살이 되기 위해 태어난 것일까요? 감자가 당신을 애타게 부르고 있네요. 살려주세요.': 'What a pity. The potato you grew has ended up as pig feed. Was it because you tried too hard to grow it too evenly? The potato became a single bite for a pig. Was its destiny just to become pork belly? The potato is crying out to you. Save me!',
  '감자떡': 'Potato Rice Cake',
  '강원도 전분으로 만든 쫀득쫄깃 전통 간식': 'A Chewy Gangwon Specialty Made with Starch',
  '반투명하고 쫄깃쫄깃한 식감 좋아하시나요?': 'Do you love the translucent, chewy texture?',
  '당신이 정성껏 키운 감자는 잘 자라서 감자떡이 되었습니다. 강원도의 전통 떡인 감자떡은 감자전분을 송편처럼 빚어 만들어요. 팥도 들어있고 콩도 들어있지요. 반투명하게 속이 비치는 것 같지 않나요? 쫄깃한 감자떡 드셔보세요.': 'The potato you grew with love has successfully become a Potato Rice Cake. A Gangwon Province classic made by shaping potato starch like Songpyeon. It is filled with red bean or beans. Doesn\'t the skin look beautiful and translucent? Give this chewy rice cake a try.',
  '하늘의 구름': 'Cloud in the Sky',
  '두둥실 바람 타고 자유로이 흐르는 구름': 'A Cloud Floating Freely on the Wind',
  '두둥실 흘러가는 저 구름은 감자 구름일까요?': 'Is that cloud floating up there a potato cloud?',
  '당신이 정성껏 키운 감자는 하늘의 구름이 되었습니다. 감자의 능력치가 0이라니! 세상에 존재하지 않는 감자로 만들었군요. 두둥실 하늘로 올라가 키워준 당신을 언제까지나 지켜보겠다고 하네요.': 'The potato you grew with love has turned into a cloud in the sky. Zero stats! You managed to grow a potato that doesn\'t physically exist. Floating up to the sky, it says it will look down and watch over you forever.',
  '감자 포카치아': 'Potato Focaccia',
  '향긋한 허브와 올리브를 얹은 담백한 이탈리안 브레드': 'Light Italian Bread Topped with Fragrant Herbs and Olives',
  '발사믹 식초와 올리브유에 찍어 먹어볼까요?': 'Shall we dip it in balsamic vinegar and olive oil?',
  '당신이 정성껏 키운 감자는 잘 자라서 감자 포카치아가 되었습니다. 포카치아는 감자를 갈아 넣은 반죽으로 만든 빵이에요. 올리브와 만나 더 맛있어졌네요. 발사믹식초와 올리브유에 찍어먹으면 정말 고소해요.': 'The potato you grew with love has successfully become Potato Focaccia. Focaccia is a bread made from dough mixed with grated potato. It becomes even more delicious when baked with olives. Dipping it in balsamic vinegar and olive oil is incredibly savory.',
}

function translate(text: string, lang: 'ko' | 'en'): string {
  if (lang === 'ko') return text
  if (!text) return ''
  
  const trimmed = text.trim()
  if (TRANSLATIONS[trimmed]) return TRANSLATIONS[trimmed]

  const translateStatList = (value: string) => value
    .split(/\s*,\s*/)
    .map((stat) => translate(stat, 'en'))
    .join(', ')
  
  // Dynamic formats via Regex
  const weekMatch = trimmed.match(/^(\d+)주차$/)
  if (weekMatch) {
    return `Week ${weekMatch[1]}`
  }
  
  const dayMatch = trimmed.match(/^(\d+)일째$/)
  if (dayMatch) {
    return `Day ${dayMatch[1]}`
  }

  const dayStartMatch = trimmed.match(/^Day (\d+) 시작\. 현재 계획이 계속 진행됩니다\.$/)
  if (dayStartMatch) {
    return `Day ${dayStartMatch[1]} starts. The current plan continues.`
  }

  const adWatchingMatch = trimmed.match(/^광고 시청 중\.\.\. \((\d+)초 남음\)$/)
  if (adWatchingMatch) {
    return `Watching ad... (${adWatchingMatch[1]}s left)`
  }

  const totalClearsMatch = trimmed.match(/^총 (\d+)회 클리어$/)
  if (totalClearsMatch) {
    return `Total ${totalClearsMatch[1]} Clears`
  }

  const seedJackpotLongMatch = trimmed.match(/^잭팟! (.+?) 재능이 크게 튀어나왔고 슬롯 기회가 1회 늘었습니다\. (.+)$/)
  if (seedJackpotLongMatch) {
    return `Jackpot! ${translate(seedJackpotLongMatch[1], 'en')} talent burst out, and slot chance +1. ${translate(seedJackpotLongMatch[2], 'en')}`
  }

  const seedJackpotMatch = trimmed.match(/^잭팟! (.+?) 재능이 크게 튀어나왔고 슬롯 기회가 1회 늘었습니다\.$/)
  if (seedJackpotMatch) {
    return `Jackpot! ${translate(seedJackpotMatch[1], 'en')} talent burst out, and slot chance +1.`
  }

  const seedTalentLongMatch = trimmed.match(/^씨감자의 타고난 재능이 (.+?) 쪽으로 깨어났습니다\. (.+)$/)
  if (seedTalentLongMatch) {
    return `The seed potato's natural talents woke toward ${translateStatList(seedTalentLongMatch[1])}. ${translate(seedTalentLongMatch[2], 'en')}`
  }

  const seedTalentMatch = trimmed.match(/^씨감자의 타고난 재능이 (.+?) 쪽으로 깨어났습니다\.$/)
  if (seedTalentMatch) {
    return `The seed potato's natural talents woke toward ${translateStatList(seedTalentMatch[1])}.`
  }

  const growStartMatch = trimmed.match(/^(.+) 재배 시작!$/)
  if (growStartMatch) {
    return `${growStartMatch[1]} growing started!`
  }

  const emptyNameMatch = trimmed.match(/^이름을 비워두어 "(.+?)" 이름을 받았습니다\.$/)
  if (emptyNameMatch) {
    return `No name entered, so "${emptyNameMatch[1]}" was chosen.`
  }

  const emptyNameLongMatch = trimmed.match(/^이름을 비워두어 "(.+?)" 이름을 받았습니다\. (.+)$/)
  if (emptyNameLongMatch) {
    return `No name entered, so "${emptyNameLongMatch[1]}" was chosen. ${translate(emptyNameLongMatch[2], 'en')}`
  }

  const talentWeekMatch = trimmed.match(/^(.+?) 재능이 잘 받는 (\d+)주차입니다\.$/)
  if (talentWeekMatch) {
    return `${translate(talentWeekMatch[1], 'en')} talent grows well in Week ${talentWeekMatch[2]}.`
  }

  const talentWeekLongMatch = trimmed.match(/^(.+?) 재능이 잘 받는 (\d+)주차입니다\. (.+)$/)
  if (talentWeekLongMatch) {
    return `${translate(talentWeekLongMatch[1], 'en')} talent grows well in Week ${talentWeekLongMatch[2]}. ${translate(talentWeekLongMatch[3], 'en')}`
  }

  const namedStartLongMatch = trimmed.match(/^(.+?) 재배 시작! (.+)$/)
  if (namedStartLongMatch) {
    return `${namedStartLongMatch[1]} growing started! ${translate(namedStartLongMatch[2], 'en')}`
  }

  const planSlotMatch = trimmed.match(/^(.+?)에 (.+?) 배치 완료$/)
  if (planSlotMatch) {
    const slot = translate(planSlotMatch[1], 'en')
    const action = translate(planSlotMatch[2], 'en')
    return `Placed ${action} in ${slot}`
  }

  const actionStatusMatch = trimmed.match(/^(아침|점심|저녁) (.+?): (.+)$/)
  if (actionStatusMatch) {
    const slot = translate(actionStatusMatch[1], 'en')
    const action = translate(actionStatusMatch[2], 'en')
    const message = translate(actionStatusMatch[3], 'en')
    return `${slot} ${action}: ${message}`
  }

  const statFateMatch = trimmed.match(/^(.+?) 쪽으로 운명이 기울고 있다$/)
  if (statFateMatch) {
    return `Fate is leaning toward ${translate(statFateMatch[1], 'en')}`
  }

  const statEndingMatch = trimmed.match(/^(.+?) 계열 엔딩에 가까워지는 중$/)
  if (statEndingMatch) {
    return `Getting closer to a ${translate(statEndingMatch[1], 'en')} type ending`
  }

  const seedLogMatch = trimmed.match(/^씨감자 슬롯: (.+)$/)
  if (seedLogMatch) {
    return `Seed slot: ${seedLogMatch[1].split('/').map((stat) => translate(stat, 'en')).join('/')}`
  }

  const touchComboLogMatch = trimmed.match(/^터치콤보 (\d+)$/)
  if (touchComboLogMatch) {
    return `Touch combo ${touchComboLogMatch[1]}`
  }

  const runStartLogMatch = trimmed.match(/^회차 (\d+) 시작$/)
  if (runStartLogMatch) {
    return `Run ${runStartLogMatch[1]} started`
  }

  const toyLogMatch = trimmed.match(/^장식 터치: (.+?) \+1$/)
  if (toyLogMatch) {
    return `Toy touch: ${translate(toyLogMatch[1], 'en')} +1`
  }

  const toyTouchMatch = trimmed.match(/^장식 인형을 터치하여 (.+?)이\(가\) 1 증가했습니다!$/)
  if (toyTouchMatch) {
    const stat = translate(toyTouchMatch[1], 'en')
    return `Touched toy, increasing ${stat} by 1!`
  }

  const harvestEndMatch = trimmed.match(/^수확 완료! 이번 감자는 "(.+?)" 엔딩으로 기록됐다\.$/)
  if (harvestEndMatch) {
    return `Harvest Complete! This potato was recorded as "${harvestEndMatch[1]}" ending.`
  }
  
  const recMatch = trimmed.match(/^(\d+)주차 추천 능력은 (.+?)입니다\..*$/)
  if (recMatch) {
    const wk = recMatch[1]
    const statName = translate(recMatch[2], 'en')
    return `Week ${wk} recommended stat: ${statName}. Matches gain bonus growth!`
  }

  const eventStartMatch = trimmed.match(/^(.+) 발생! 선택에 따라 성장 방향이 바뀐다\.$/)
  if (eventStartMatch) {
    return `${translate(eventStartMatch[1], 'en')} appeared! Your choice will change the growth direction.`
  }

  const touchComboMatch = trimmed.match(/^(.+?) 터치콤보 (\d+)콤보, 시간 속도 x([\d.]+)$/)
  if (touchComboMatch) {
    return `${translate(touchComboMatch[1], 'en')} Touch combo ${touchComboMatch[2]}, time speed x${touchComboMatch[3]}`
  }

  const testModeMatch = trimmed.match(/^테스트 모드: "(.+?)" 엔딩을 바로 확인합니다\.$/)
  if (testModeMatch) {
    return `Test mode: checking the "${translate(testModeMatch[1], 'en')}" ending now.`
  }

  const turnPlanMatch = trimmed.match(/^Turn (\d+): (Morning|Afternoon|Evening) (.+)$/)
  if (turnPlanMatch) {
    const day = turnPlanMatch[1]
    const slot = turnPlanMatch[2]
    const action = translate(turnPlanMatch[3], 'en')
    return `Turn ${day}: ${slot} ${action}`
  }

  const turnNatMatch = trimmed.match(/^Turn (\d+): 자연 성장$/)
  if (turnNatMatch) {
    return `Turn ${turnNatMatch[1]}: Natural Growth`
  }

  const endLogMatch = trimmed.match(/^엔딩 획득: (.+)$/)
  if (endLogMatch) {
    return `Unlocked Ending: ${endLogMatch[1]}`
  }

  const eventLogMatch = trimmed.match(/^돌발 이벤트: (.+)$/)
  if (eventLogMatch) {
    return `Sudden Event: ${translate(eventLogMatch[1], 'en')}`
  }
  
  return text
}

const TOTAL_TURNS = 98
const SEARCH_PARAMS = new URLSearchParams(window.location.search)
const FAST_TEST_MODE = SEARCH_PARAMS.has('fast')
const AUTO_ENDING_TEST = FAST_TEST_MODE && SEARCH_PARAMS.has('ending')
const AUTO_COLLECTION_TEST = FAST_TEST_MODE && SEARCH_PARAMS.has('collection')
const AUTO_GAME_TEST = FAST_TEST_MODE && SEARCH_PARAMS.has('game')
const TURN_MS = 100
const NORMAL_TICKS_PER_DAY = 600000 / (TOTAL_TURNS * TURN_MS)
const FAST_TICKS_PER_DAY = 6
const HARVEST_RUSH_TURN = 84
const SAVE_KEY = 'potato-remake-classic-v2'
const RECORDS_KEY = 'potato-remake-records-v1'
const TOUCH_COMBO_MAX = 100
const TOUCH_COMBO_DECAY_MS = 4000
const WEEK_LENGTH_DAYS = 7
const SEED_REEL_COUNT = 5
const CLEAR_BONUS_MULTIPLIER_PER_CLEAR = 0.01
const CLEAR_BONUS_MULTIPLIER_CAP = 0.2
const PIG_FEED_CARE_THRESHOLD = 30

const TOUCH_PHRASES = ['하하', '간지러워', '하지마', '히히', '아야', '쿡쿡', '간질간질', '웃기잖아', '그러지마', '살살해', '이러지마', '웃겨', '깔깔', '히야', '기분좋아', '헤헤', '이거뭐야', '엣', '야', '앗', '헉', '뭐야', '쉿', '좀!', '아이구', '살살', '조심해', '기분좋다', '으흐흐', '감자라구요']
const ROLL_PHRASES = ['어지러워', '빙글', '씽씽', '돌아', '뱅뱅', '빙빙', '흔들려', '어질어질', '이러지마', '그만', '멈춰', '도는중', '휙휙', '으아', '왜이래', '멈춰줘', '돌고있어', '으어', '야야', '버텨', '힘들어', '슝슝', '쌩쌩', '아이고', '헉', '으악', '빙글빙글', '와', '신나', '웩']
const TOUCH_PHRASES_EN = ['Haha', 'Tickles!', 'Stop it', 'Hehe', 'Ouch', 'Poke', 'Tickly', 'That tickles', 'Nooo', 'Gently', 'Not that', 'Funny!', 'Giggle', 'Hiya', 'Feels good', 'Hehe', 'What is this?', 'Eh?', 'Hey!', 'Ack!', 'Whoa', 'What?', 'Shh', 'Hey!', 'Oops', 'Easy', 'Careful', 'Nice', 'Hehehe', 'I am a potato!']
const ROLL_PHRASES_EN = ['Dizzy!', 'Spin', 'Zoom', 'Rolling', 'Round!', 'Whirl', 'Wobble', 'So dizzy', 'Nooo', 'Stop', 'Stop!', 'Spinning', 'Whoosh', 'Aaa!', 'Why?', 'Stop me', 'Still spinning', 'Uhh', 'Hey hey', 'Hold on', 'Tired', 'Zoom zoom', 'Fast!', 'Oh no', 'Whoa', 'Aaaah', 'Round and round', 'Wow', 'Fun!', 'Ugh']

const STAT_KEYS = ['gram', 'large', 'shape', 'nutri', 'regist', 'hard'] as const
const PLAN_SLOTS = ['morning', 'afternoon', 'evening'] as const

type StatKey = (typeof STAT_KEYS)[number]
type PlanSlot = (typeof PLAN_SLOTS)[number]
type ActionKind = 'eat' | 'drink' | 'dgdg' | 'exercise' | 'solar'

type GameStats = Record<StatKey, number>

type StatRange = Partial<Record<StatKey, [number, number]>>

type Skill = {
  id: string
  name: string
  action: ActionKind
  ranges: StatRange
  buttonImage: string
  positionClass: string
}

type EventChoice = {
  id: string
  label: string
  result: string
  effects: StatRange
  tone: 'good' | 'bad'
}

type ActiveEvent = {
  id: string
  title: string
  speaker: string
  message: string
  choices: EventChoice[]
  image?: string
}

type Ending = {
  id: string
  imageIndex: number
  tier: number
  statKeys: StatKey[]
  title: string
  hint: string
  story: string
}

type RunRecord = {
  id: number
  name: string
  endingTitle: string
  stats: GameStats
  savedAt: number
}

type AchievementCopy = {
  ko: string
  en: string
}

type AchievementContext = {
  game: GameState
  records: RunRecord[]
  totalClears: number
  unlockedCount: number
  eventSeenTotal: number
}

type AchievementDefinition = {
  id: string
  word: AchievementCopy
  title: AchievementCopy
  hint: AchievementCopy
  test: (context: AchievementContext) => boolean
}

type EndingResult = {
  endingId: string
  imageIndex: number
  title: string
  hint: string
  tier: number
  statKeys: StatKey[]
  score: number
  isNew: boolean
  story: string
}

type Combo = {
  id: string
  name: string
  multiplier: number
  boostedStats: StatKey[]
  colorClass: string
}

type SeedSlot = {
  results: StatKey[]
  jackpot: boolean
  rerolls: number
  rolled: boolean
}

type GameState = {
  day: number
  bonus: number
  stats: GameStats
  initialStats?: GameStats
  plan: Record<PlanSlot, string | null>
  planCursor: number
  resolvingDay: boolean
  touchCombo: number
  touchComboUpdatedAt: number
  weekIndex: number
  weekFocusStat: StatKey
  seedSlot: SeedSlot
  touchMood: 'idle' | 'smile' | 'roll'
  dragPower: number
  actionPlayback: {
    kind: ActionKind
    frames: string[]
    frameIndex: number
    loopCount: number
  } | null
  currentMessage: string
  messageLockedUntil: number
  eventLog: string[]
  activeEvent: ActiveEvent | null
  eventSeen: Record<string, number>
  lastEventTurn: number
  harvestFocus: StatKey | null
  currentEnding: EndingResult | null
  unlockedEndingIds: string[]
  endingSeenCount: Record<string, number>
  lastEndingId: string | null
  screen: 'title' | 'intro' | 'game' | 'harvest' | 'ending' | 'collection'
  collectionReturnScreen: 'title' | 'intro' | 'game' | 'harvest' | 'ending'
  runCount: number
  careCount: number
  potatoName: string
  unlockedSlotsCount: number
  toys: Record<string, boolean>
  recordSaved: boolean
  combo100Duration: number
  combo100MaxDuration: number
  combo100ReachedAt: number | null
}

const STAT_LABELS: Record<StatKey, string> = {
  gram: '무게',
  large: '크기',
  shape: '모양',
  nutri: '영양가',
  regist: '면역력',
  hard: '단단함',
}

const STAT_HINT_ICONS: Record<StatKey, string> = {
  gram: '⚖️',
  large: '📏',
  shape: '✨',
  nutri: '🍽️',
  regist: '🛡️',
  hard: '🧱',
}

const PLAN_LABELS: Record<PlanSlot, string> = {
  morning: '아침',
  afternoon: '점심',
  evening: '저녁',
}

const STAT_ENDING_WORDS: Record<StatKey, string> = {
  gram: '묵직',
  large: '거대',
  shape: '반듯',
  nutri: '알찬',
  regist: '강인',
  hard: '단단',
}

const TIER_TITLES: Record<number, string> = {
  1: '특화 감자',
  2: '쌍둥 재능 감자',
  3: '삼색 성장 감자',
  4: '균형 개성 감자',
  5: '거의 완성 감자',
  6: '완전체 감자',
}

const ACTION_LABELS: Record<ActionKind, string> = {
  eat: '양분',
  drink: '수분',
  dgdg: '휴식',
  exercise: '운동',
  solar: '광합성',
}

const ACTION_STATUS_MESSAGES: Record<ActionKind, string[]> = {
  eat: [
    '고소한 양분이 뿌리 끝까지 차곡차곡 쌓입니다.',
    '흙 속 맛있는 기운을 한입 크게 삼켰습니다.',
    '묵직한 힘이 속살 사이사이에 천천히 번집니다.',
    '든든한 밥심으로 감자 몸통이 살짝 부풀었습니다.',
    '작은 뿌리들이 양분을 찾아 바쁘게 움직입니다.',
    '포근한 흙맛을 먹고 오늘도 배가 든든합니다.',
    '알찬 기운이 감자 속을 빈틈없이 채워갑니다.',
    '달큰한 영양분이 조용히 저장고로 모입니다.',
    '먹은 만큼 자라겠다는 결심이 감자 속에서 꿈틀댑니다.',
    '흙 한가득 담긴 양분을 골라 먹으며 힘을 냅니다.',
  ],
  drink: [
    '시원한 물기가 뿌리 사이로 촉촉하게 퍼집니다.',
    '목마른 감자가 물을 꿀꺽이며 생기를 되찾습니다.',
    '촉촉한 수분이 마른 틈을 부드럽게 채웁니다.',
    '물방울이 감자 주변을 맑게 씻어줍니다.',
    '흙이 촉촉해지자 감자가 한결 편안해 보입니다.',
    '차분한 물기 덕분에 표면이 매끈하게 정돈됩니다.',
    '뿌리 끝에 닿은 물이 작은 활력을 깨웁니다.',
    '상쾌한 수분이 몸집을 살짝 부드럽게 키웁니다.',
    '감자가 물맛을 음미하며 천천히 숨을 고릅니다.',
    '흙 속 물길이 열리며 성장 리듬이 안정됩니다.',
  ],
  dgdg: [
    '감자가 흙침대 위에서 느긋하게 몸을 굴립니다.',
    '살짝 뒹군 자리마다 포근한 흙냄새가 남습니다.',
    '느긋한 휴식이 감자 속 긴장을 풀어줍니다.',
    '흙을 베개 삼아 잠깐 쉬며 기운을 모읍니다.',
    '데굴데굴 움직인 뒤 편안한 표정으로 멈췄습니다.',
    '쉬는 동안 남은 영양분이 알맞게 정리됩니다.',
    '감자가 몸을 둥글게 말고 조용히 회복합니다.',
    '느린 굴림이 하루의 피로를 흙 속으로 덜어냅니다.',
    '포근한 흙이 감자를 받쳐주며 안정감을 줍니다.',
    '잠깐의 빈둥거림이 의외로 좋은 성장을 만듭니다.',
  ],
  exercise: [
    '감자가 땅속에서 힘껏 버티며 단단해집니다.',
    '작은 운동 끝에 표면이 한층 야무져 보입니다.',
    '흙을 밀어내는 연습으로 뿌리에 힘이 붙습니다.',
    '으라차차 움직이며 강한 감자 근성을 다집니다.',
    '몸을 조였다 풀며 단단한 리듬을 익힙니다.',
    '땅속 체조 덕분에 감자의 중심이 바로잡힙니다.',
    '흙의 압력을 견디며 씩씩한 기운을 키웁니다.',
    '가벼운 운동 뒤 감자가 단단한 숨을 내쉽니다.',
    '꾸준한 움직임이 감자의 버티는 힘을 올립니다.',
    '힘든 만큼 몸매가 조금 더 또렷해졌습니다.',
  ],
  solar: [
    '따뜻한 햇살이 잎을 지나 감자에게 전해집니다.',
    '맑은 빛이 초록 기운을 깨워 영양을 만듭니다.',
    '햇빛 한 줌이 감자의 속을 밝게 데웁니다.',
    '광합성 리듬에 맞춰 알찬 기운이 차오릅니다.',
    '잎사귀가 빛을 모아 땅속 감자에게 보내줍니다.',
    '부드러운 햇살 덕분에 감자가 생생해집니다.',
    '빛 에너지가 조용히 저장되며 성장에 보탬이 됩니다.',
    '밭 위의 햇볕이 감자 속 영양 창고를 채웁니다.',
    '따스한 낮빛이 감자의 하루를 산뜻하게 밀어줍니다.',
    '햇살을 받은 감자가 은근히 자신감을 얻습니다.',
  ],
}

const ORIGINAL_ENDING_KEYS: StatKey[][] = [
  ['large', 'shape', 'nutri', 'regist'],
  ['large', 'nutri', 'regist', 'hard'],
  ['large', 'shape', 'nutri', 'hard'],
  ['large', 'shape', 'regist', 'hard'],
  ['large', 'gram', 'nutri', 'regist'],
  ['large', 'gram', 'regist', 'hard'],
  ['large', 'gram', 'nutri', 'hard'],
  ['large', 'gram', 'shape', 'regist'],
  ['large', 'gram', 'shape', 'hard'],
  ['large', 'gram', 'shape', 'nutri'],
  ['gram', 'nutri', 'regist', 'hard'],
  ['gram', 'shape', 'regist', 'hard'],
  ['gram', 'shape', 'nutri', 'hard'],
  ['gram', 'shape', 'nutri', 'regist'],
  ['shape', 'nutri', 'regist', 'hard'],
  ['shape', 'regist'],
  ['nutri', 'regist'],
  ['nutri', 'hard'],
  ['shape', 'hard'],
  ['shape', 'nutri'],
  ['gram', 'regist'],
  ['large', 'regist'],
  ['regist', 'hard'],
  ['gram', 'hard'],
  ['large', 'hard'],
  ['large', 'shape'],
  ['large', 'nutri'],
  ['large'],
  ['large', 'gram'],
  ['gram', 'large', 'shape', 'nutri', 'regist', 'hard'],
  ['gram', 'shape'],
  ['hard'],
  ['gram', 'nutri'],
]

function getEndingTitle(statKeys: StatKey[]): string {
  const words = statKeys.map((key) => STAT_ENDING_WORDS[key])
  const tierTitle = TIER_TITLES[statKeys.length] || '감자 엔딩'

  if (words.length <= 2) {
    return `${words.join('')} ${tierTitle}`
  }

  return `${words.slice(0, 2).join(' ')} 외${words.length - 2} ${tierTitle}`
}

function getEndingHint(statKeys: StatKey[], imageIndex: number): string {
  if (imageIndex === 32) return '⚠️ 성장 중 하나가 크게 무너진 엔딩'
  return statKeys.map((key) => `${STAT_HINT_ICONS[key]} ${STAT_LABELS[key]}`).join('  ·  ')
}

const SKILLS: Skill[] = [
  {
    id: 'feed',
    name: '양분먹기',
    action: 'eat',
    ranges: { gram: [3, 12], large: [2, 8], regist: [1, 6], shape: [-4, -1] },
    buttonImage: '/assets/original/bttn1.png',
    positionClass: 'skill-feed',
  },
  {
    id: 'water',
    name: '물마시기',
    action: 'drink',
    ranges: { shape: [3, 10], large: [2, 8], hard: [-4, -1] },
    buttonImage: '/assets/original/bttn2.png',
    positionClass: 'skill-water',
  },
  {
    id: 'roll',
    name: '뒹굴거리기',
    action: 'dgdg',
    ranges: { gram: [2, 9], nutri: [2, 8], large: [-3, -1] },
    buttonImage: '/assets/original/bttn3.png',
    positionClass: 'skill-roll',
  },
  {
    id: 'power',
    name: '운동하기',
    action: 'exercise',
    ranges: { hard: [3, 10], regist: [2, 8], shape: [1, 5], gram: [-5, -1], nutri: [-4, -1] },
    buttonImage: '/assets/original/bttn4.png',
    positionClass: 'skill-power',
  },
  {
    id: 'photo',
    name: '광합성',
    action: 'solar',
    ranges: { nutri: [3, 10], hard: [2, 7], regist: [-4, -1] },
    buttonImage: '/assets/original/bttn5.png',
    positionClass: 'skill-photo',
  },
]

function getPositiveStats(skill: Skill): StatKey[] {
  return STAT_KEYS.filter((key) => {
    const range = skill.ranges[key]
    return range ? (range[0] + range[1]) / 2 > 0 : false
  })
}

function getActiveCombo(plan: Record<PlanSlot, string | null>, unlockedSlotsCount: number): Combo | null {
  const activeSkills = PLAN_SLOTS.slice(0, unlockedSlotsCount)
    .map((slot) => getSkill(plan[slot]))
    .filter((skill): skill is Skill => Boolean(skill))

  if (activeSkills.length < 2) return null

  const duplicate = activeSkills.find((skill) => activeSkills.filter((item) => item.id === skill.id).length >= 2)
  if (duplicate) {
    const count = activeSkills.filter((skill) => skill.id === duplicate.id).length
    return {
      id: `stacked_${duplicate.id}`,
      name: `${duplicate.name} ${count}연속 콤보`,
      multiplier: count >= 3 ? 1.72 : 1.42,
      boostedStats: getPositiveStats(duplicate),
      colorClass: 'combo-stacked',
    }
  }

  const actions = activeSkills.map((skill) => skill.action)
  const has = (action: ActionKind) => actions.includes(action)

  const rules: Array<Combo & { actions: ActionKind[] }> = [
    {
      id: 'golden_balance',
      name: '순환 밸런스 콤보',
      actions: ['solar', 'exercise', 'dgdg'],
      multiplier: 1.25,
      boostedStats: ['gram', 'large', 'shape', 'nutri', 'regist', 'hard'],
      colorClass: 'combo-golden',
    },
    {
      id: 'green_engine',
      name: '초록 엔진 콤보',
      actions: ['eat', 'drink', 'solar'],
      multiplier: 1.24,
      boostedStats: ['large', 'nutri', 'shape'],
      colorClass: 'combo-growth',
    },
    {
      id: 'root_fitness',
      name: '뿌리 체력 콤보',
      actions: ['drink', 'exercise', 'dgdg'],
      multiplier: 1.24,
      boostedStats: ['shape', 'hard', 'regist'],
      colorClass: 'combo-iron',
    },
    {
      id: 'hardcore_training',
      name: '회복 트레이닝 콤보',
      actions: ['exercise', 'dgdg'],
      multiplier: 1.35,
      boostedStats: ['hard', 'regist'],
      colorClass: 'combo-training',
    },
    {
      id: 'bulk_up',
      name: '벌크업 콤보',
      actions: ['eat', 'exercise'],
      multiplier: 1.35,
      boostedStats: ['gram', 'hard'],
      colorClass: 'combo-bulk',
    },
    {
      id: 'wellbeing_diet',
      name: '웰빙 식단 콤보',
      actions: ['eat', 'drink'],
      multiplier: 1.3,
      boostedStats: ['gram', 'shape'],
      colorClass: 'combo-diet',
    },
    {
      id: 'snack_nap',
      name: '든든한 뒹굴 콤보',
      actions: ['eat', 'dgdg'],
      multiplier: 1.28,
      boostedStats: ['gram', 'nutri'],
      colorClass: 'combo-relax',
    },
    {
      id: 'sunny_meal',
      name: '햇살 식사 콤보',
      actions: ['eat', 'solar'],
      multiplier: 1.28,
      boostedStats: ['gram', 'nutri'],
      colorClass: 'combo-growth',
    },
    {
      id: 'mud_bath',
      name: '촉촉한 휴식 콤보',
      actions: ['drink', 'dgdg'],
      multiplier: 1.28,
      boostedStats: ['shape', 'nutri'],
      colorClass: 'combo-refresh',
    },
    {
      id: 'aqua_training',
      name: '수분 훈련 콤보',
      actions: ['drink', 'exercise'],
      multiplier: 1.28,
      boostedStats: ['shape', 'hard'],
      colorClass: 'combo-sculpt',
    },
    {
      id: 'photosynthesis',
      name: '자연 광합성 콤보',
      actions: ['solar', 'drink'],
      multiplier: 1.3,
      boostedStats: ['nutri', 'shape'],
      colorClass: 'combo-photosynthesis',
    },
    {
      id: 'full_relaxation',
      name: '느긋한 광합성 콤보',
      actions: ['dgdg', 'solar'],
      multiplier: 1.3,
      boostedStats: ['nutri', 'regist'],
      colorClass: 'combo-relax',
    },
    {
      id: 'sunny_training',
      name: '태양 단련 콤보',
      actions: ['solar', 'exercise'],
      multiplier: 1.3,
      boostedStats: ['hard', 'nutri'],
      colorClass: 'combo-iron',
    },
  ]

  return rules.find((rule) => rule.actions.every(has)) ?? null
}

const UI_SOUNDS = [
  '/assets/original/sound/sound1.wav',
  '/assets/original/sound/sound2.wav',
  '/assets/original/sound/sound3.wav',
  '/assets/original/sound/sound4.wav',
  '/assets/original/sound/sound5.wav',
  '/assets/original/sound/sound6.wav',
  '/assets/original/sound/sound7.wav',
  '/assets/original/sound/sound8.wav',
]
const GOOD_SOUND = '/assets/original/sound/goodpt.wav'
const SLEEP_SOUND = '/assets/original/sound/sleep.wav'
const BGM_TRACKS = [
  '/assets/original/sound/ayoonsong1.wav',
  '/assets/original/sound/ayoonsong2.wav',
]
const BAD_SOUND = '/assets/original/sound/badpt.wav'
const OK_SOUND = '/assets/original/sound/soundok.wav'
const NO_SOUND = '/assets/original/sound/soundno.wav'
const APPLAUSE_SOUND = '/assets/original/sound/applause.wav'
const ALL_SOUNDS = [...UI_SOUNDS, GOOD_SOUND, BAD_SOUND, OK_SOUND, NO_SOUND, APPLAUSE_SOUND]
const soundCache = new Map<string, HTMLAudioElement>()

// UI 클릭 효과음을 순서대로 번갈아 재생 (같은 소리 반복 방지)
let uiSoundCursor = 0
function playMenuClickSound(volume = 0.86): void {
  const pool = [OK_SOUND, ...UI_SOUNDS]
  playSound(pool[uiSoundCursor % pool.length], volume)
  uiSoundCursor += 1
}

const INITIAL_STATE: GameState = {
  day: 1,
  bonus: 0,
  stats: {
    gram: 181,
    large: 179,
    shape: 83,
    nutri: 85,
    regist: 55,
    hard: 61,
  },
  initialStats: {
    gram: 181,
    large: 179,
    shape: 83,
    nutri: 85,
    regist: 55,
    hard: 61,
  },
  plan: {
    morning: null,
    afternoon: null,
    evening: null,
  },
  planCursor: 0,
  resolvingDay: false,
  touchCombo: 0,
  touchComboUpdatedAt: Date.now(),
  weekIndex: 1,
  weekFocusStat: 'gram',
  seedSlot: {
    results: ['gram', 'large', 'shape', 'nutri', 'regist'],
    jackpot: false,
    rerolls: 0,
    rolled: false,
  },
  touchMood: 'idle',
  dragPower: 0,
  actionPlayback: null,
  currentMessage: '돌아온 감자 키우기',
  messageLockedUntil: 0,
  eventLog: ['Day 1 시작'],
  activeEvent: null,
  eventSeen: {},
  lastEventTurn: 0,
  harvestFocus: null,
  currentEnding: null,
  unlockedEndingIds: [],
  endingSeenCount: {},
  lastEndingId: null,
  screen: 'title',
  collectionReturnScreen: 'title',
  runCount: 0,
  careCount: 0,
  potatoName: '귀여운 감자',
  unlockedSlotsCount: 3,
  toys: {
    worm: false,
    sweet: false,
    landdog: false,
    doraji: false,
  },
  recordSaved: false,
  combo100Duration: 0,
  combo100MaxDuration: 0,
  combo100ReachedAt: null,
}

const LEGACY_SKILL_REPLACEMENTS: Record<string, string> = {
  sleep: 'roll',
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

function getClearBonusCount(endingSeenCount: Record<string, number> | undefined, unlockedEndingIds: string[] = []): number {
  const seenTotal = Object.values(endingSeenCount ?? {}).reduce((sum, count) => {
    return sum + Math.max(0, Math.floor(Number(count) || 0))
  }, 0)
  return seenTotal > 0 ? seenTotal : unlockedEndingIds.length
}

function getClearBonusGrowthMultiplier(clearCount: number): number {
  const bonusRate = Math.min(
    CLEAR_BONUS_MULTIPLIER_CAP,
    Math.max(0, clearCount) * CLEAR_BONUS_MULTIPLIER_PER_CLEAR
  )
  return 1 + bonusRate
}

function addCareCount(state: GameState, amount = 1): GameState {
  return { ...state, careCount: Math.max(0, Math.floor((state.careCount ?? 0) + amount)) }
}

function getActionStatusMessage(slot: PlanSlot, skill: Skill): string {
  return `${PLAN_LABELS[slot]} ${skill.name}: ${pickRandom(ACTION_STATUS_MESSAGES[skill.action])}`
}

const STATUS_HIGHLIGHT_TOKENS = [
  { text: '아침', className: 'dialog-token dialog-time dialog-time-morning' },
  { text: 'Morning', className: 'dialog-token dialog-time dialog-time-morning' },
  { text: '점심', className: 'dialog-token dialog-time dialog-time-afternoon' },
  { text: 'Afternoon', className: 'dialog-token dialog-time dialog-time-afternoon' },
  { text: '저녁', className: 'dialog-token dialog-time dialog-time-evening' },
  { text: 'Evening', className: 'dialog-token dialog-time dialog-time-evening' },
  ...SKILLS.map((skill) => ({
    text: skill.name,
    className: `dialog-token dialog-action dialog-action-${skill.action}`,
  })),
  ...SKILLS.map((skill) => ({
    text: TRANSLATIONS[skill.name] || skill.name,
    className: `dialog-token dialog-action dialog-action-${skill.action}`,
  })),
].sort((a, b) => b.text.length - a.text.length)

function splitDialogPhrases(message: string): string[] {
  const normalized = message.replace(/\s+/g, ' ').trim()
  if (!normalized) return ['']

  const sentences = normalized
    .replace(/([.!?。！？])\s+/g, '$1|')
    .replace(/(:)\s+/g, '$1|')
    .split('|')
    .map((part) => part.trim())
    .filter(Boolean)

  const phrases: string[] = []

  for (const sentence of sentences) {
    const words = sentence.split(' ')
    let current = ''

    for (const word of words) {
      const next = current ? `${current} ${word}` : word
      if (current && next.length > 15) {
        phrases.push(current)
        current = word
      } else {
        current = next
      }
    }

    if (current) phrases.push(current)
  }

  if (phrases.length > 1 && phrases[phrases.length - 1].length <= 5) {
    const tail = phrases.pop()
    phrases[phrases.length - 1] = `${phrases[phrases.length - 1]} ${tail}`
  }

  return phrases
}

function splitDialogSentences(message: string): string[] {
  const normalized = message.replace(/\s+/g, ' ').trim()
  if (!normalized) return ['']

  const parts = normalized.match(/[^.!?。！？]+[.!?。！？]+["')\]]?|[^.!?。！？]+$/g)
  return (parts ?? [normalized]).map((part) => part.trim()).filter(Boolean)
}

function renderHighlightedDialogText(text: string, keyPrefix: string) {
  const parts = []
  let cursor = 0
  let plainText = ''

  while (cursor < text.length) {
    const token = STATUS_HIGHLIGHT_TOKENS.find((item) => text.startsWith(item.text, cursor))

    if (!token) {
      plainText += text[cursor]
      cursor += 1
      continue
    }

    if (plainText) {
      parts.push(plainText)
      plainText = ''
    }

    parts.push(
      <span key={`${keyPrefix}-${cursor}-${token.text}`} className={token.className}>
        {token.text}
      </span>
    )
    cursor += token.text.length
  }

  if (plainText) parts.push(plainText)
  return parts
}

function renderDialogMessage(message: string, lang: 'ko' | 'en' = 'ko') {
  const translatedMessage = translate(message, lang)
  const shouldUseFullTranslation = lang === 'en' && translatedMessage !== message
  const displayMessage = shouldUseFullTranslation ? translatedMessage : message

  return splitDialogSentences(displayMessage).map((sentence, sentenceIndex) => (
    <span key={`${sentenceIndex}-${sentence}`} className="dialog-sentence">
      {splitDialogPhrases(sentence).map((phrase, phraseIndex) => (
        <span key={`${sentenceIndex}-${phraseIndex}-${phrase}`} className="dialog-phrase">
          {renderHighlightedDialogText(shouldUseFullTranslation ? phrase : translate(phrase, lang), `phrase-${sentenceIndex}-${phraseIndex}`)}
        </span>
      ))}
    </span>
  ))
}

function getRandomStat(): StatKey {
  return pickRandom([...STAT_KEYS])
}

const POTATO_ADJECTIVES = [
  '동글동글한', '울퉁불퉁한', '파릇파릇한', '노릇노릇한', '단단한', '물렁물렁한', '거대한', '앙증맞은',
  '단맛나는', '매콤한', '은밀한', '대담한', '성실한', '게으른', '용감한', '겁쟁이', '신비로운', '정열적인',
  '시크한', '도도한', '발랄한', '명랑한', '영리한', '바보같은', '뚱한', '해맑은', '순진한', '까칠한',
  '부드러운', '까만', '새하얀', '황금빛', '무지개빛', '얼룩덜룩', '잘생긴', '예쁜', '귀여운', '시큼한',
  '상큼한', '고소한', '매끄러운', '거친', '단단치 못한', '의욕넘치는', '의욕없는', '욕심많은', '소박한',
  '착한', '심술궂은', '욕쟁이', '우아한', '터프한', '감성적인', '이성적인', '열정적인', '냉정한',
  '뜨거운', '차가운', '온화한', '까다로운', '단순한', '복잡한', '비범한', '평범한', '고집센', '유연한',
  '날카로운', '둥글넙적', '길쭉길쭉', '미끈한', '통통한', '날씬한', '홀쭉한', '듬직한', '듬직치못한',
  '늠름한', '소심한', '대범한', '착실한', '똘똘한', '허당끼있는', '덜렁거리는', '꼼꼼한',
  '느긋한', '급한', '활기찬', '피곤한', '졸린', '쌩쌩한', '우울한', '행복한', '희망찬', '비관적인',
  '낙천적인', '용의주도', '대충하는', '완벽주의', '자유로운', '괴짜같은', '엉뚱한'
]

const POTATO_ADJECTIVES_EN = [
  'Round', 'Bumpy', 'Fresh Green', 'Golden', 'Firm', 'Squishy', 'Huge', 'Tiny Cute',
  'Sweet', 'Spicy', 'Secretive', 'Bold', 'Diligent', 'Lazy', 'Brave', 'Timid', 'Mystic', 'Passionate',
  'Chic', 'Proud', 'Bouncy', 'Cheerful', 'Clever', 'Silly', 'Grumpy', 'Bright', 'Innocent', 'Prickly',
  'Soft', 'Black', 'Snowy', 'Golden', 'Rainbow', 'Speckled', 'Handsome', 'Pretty', 'Cute', 'Sour',
  'Fresh', 'Nutty', 'Smooth', 'Rough', 'Not-So-Firm', 'Eager', 'Unmotivated', 'Greedy', 'Humble',
  'Kind', 'Mischievous', 'Potty-Mouthed', 'Elegant', 'Tough', 'Emotional', 'Rational', 'Fiery', 'Cool-Headed',
  'Hot', 'Cold', 'Gentle', 'Picky', 'Simple', 'Complicated', 'Extraordinary', 'Ordinary', 'Stubborn', 'Flexible',
  'Sharp', 'Round-Flat', 'Long', 'Sleek', 'Plump', 'Slim', 'Skinny', 'Reliable', 'Not-So-Reliable',
  'Dignified', 'Shy', 'Big-Hearted', 'Steady', 'Smart', 'Goofy', 'Clumsy', 'Careful',
  'Relaxed', 'Hasty', 'Energetic', 'Tired', 'Sleepy', 'Lively', 'Blue', 'Happy', 'Hopeful', 'Pessimistic',
  'Optimistic', 'Strategic', 'Loose', 'Perfectionist', 'Free-Spirited', 'Oddball', 'Quirky'
]

function getRandomPotatoName(): string {
  const adj = POTATO_ADJECTIVES[Math.floor(Math.random() * POTATO_ADJECTIVES.length)]
  return `${adj} 감자`
}

function getDisplayPotatoName(name: string, lang: 'ko' | 'en'): string {
  if (lang === 'ko') return name
  if (!name) return 'Cute Potato'

  const suffix = ' 감자'
  if (name.endsWith(suffix)) {
    const adjective = name.slice(0, -suffix.length)
    const index = POTATO_ADJECTIVES.indexOf(adjective)
    if (index >= 0) return `${POTATO_ADJECTIVES_EN[index] ?? adjective} Potato`
    if (adjective === '귀여운') return 'Cute Potato'
    return `${adjective} Potato`
  }

  if (name === '귀여운 감자') return 'Cute Potato'
  return name
}

function getLocalizedPhrase(kind: 'touch' | 'roll', lang: 'ko' | 'en'): string {
  const phrases = kind === 'touch'
    ? (lang === 'en' ? TOUCH_PHRASES_EN : TOUCH_PHRASES)
    : (lang === 'en' ? ROLL_PHRASES_EN : ROLL_PHRASES)
  return phrases[Math.floor(Math.random() * phrases.length)]
}

function createSeedSlot(): SeedSlot {
  return {
    results: STAT_KEYS.slice(0, SEED_REEL_COUNT),
    jackpot: false,
    rerolls: 0,
    rolled: false,
  }
}

function createFreshState(screen: GameState['screen'] = 'title'): GameState {
  const freshStats = {
    gram: 181,
    large: 179,
    shape: 83,
    nutri: 85,
    regist: 55,
    hard: 61,
  }
  return {
    ...INITIAL_STATE,
    stats: freshStats,
    initialStats: { ...freshStats },
    screen,
    collectionReturnScreen: screen === 'collection' ? 'title' : screen,
    potatoName: getRandomPotatoName(),
    resolvingDay: screen === 'game',
    touchCombo: 0,
    touchComboUpdatedAt: Date.now(),
    careCount: 0,
    weekIndex: 1,
    weekFocusStat: getRandomStat(),
    seedSlot: createSeedSlot(),
    plan: { morning: null, afternoon: null, evening: null },
    combo100Duration: 0,
    combo100MaxDuration: 0,
    combo100ReachedAt: null,
  }
}

// 세이브 데이터 방어: 능력치가 숫자가 아니거나 범위를 벗어나면 안전한 값으로 교정한다 (B2)
function sanitizeStats(input: unknown): GameStats {
  const source = (input && typeof input === 'object' ? input : {}) as Record<string, unknown>
  const result = {} as GameStats
  for (const key of STAT_KEYS) {
    const value = Number(source[key])
    result[key] = Number.isFinite(value) ? clamp(value, 0, 1600) : INITIAL_STATE.stats[key]
  }
  return result
}

function getWeekIndex(day: number): number {
  return Math.floor((Math.max(1, day) - 1) / WEEK_LENGTH_DAYS) + 1
}

function getActivePlanSlot(day: number, unlockedSlotsCount: number): PlanSlot {
  const fraction = (day - 1) % 1
  if (unlockedSlotsCount === 2) {
    return fraction < 0.5 ? 'morning' : 'afternoon'
  }
  return fraction < 0.33 ? 'morning' : fraction < 0.67 ? 'afternoon' : 'evening'
}

function splitIntoPages(text: string): string[] {
  if (!text) return []
  const blocks = text.split(/\n+/)
  const pages: string[] = []

  blocks.forEach((block) => {
    let rest = block.trim()
    while (rest.length > 0) {
      const MAX_PAGE_LEN = 42
      if (rest.length <= MAX_PAGE_LEN) {
        pages.push(rest)
        break
      }

      let splitIdx = -1
      for (let i = Math.min(MAX_PAGE_LEN, rest.length); i >= 15; i--) {
        const char = rest[i - 1]
        const nextChar = rest[i]
        if ((char === '.' || char === '!' || char === '?') && (!nextChar || nextChar === ' ')) {
          splitIdx = i
          break
        }
      }
      
      if (splitIdx === -1) {
        for (let i = Math.min(MAX_PAGE_LEN, rest.length); i >= 12; i--) {
          const char = rest[i - 1]
          if (char === ',' || char === ' ') {
            splitIdx = i
            break
          }
        }
      }
      
      if (splitIdx === -1) {
        splitIdx = Math.min(MAX_PAGE_LEN, rest.length)
      }

      pages.push(rest.slice(0, splitIdx).trim())
      rest = rest.slice(splitIdx).trim()
    }
  })

  return pages.filter(Boolean)
}

function getDecayedTouchCombo(state: GameState, now = Date.now()): number {
  const elapsed = Math.max(0, now - (state.touchComboUpdatedAt || now))
  if (elapsed < 500) return state.touchCombo
  const decayElapsed = elapsed - 500
  const decay = (decayElapsed / TOUCH_COMBO_DECAY_MS) * TOUCH_COMBO_MAX
  return clamp(state.touchCombo - decay, 0, TOUCH_COMBO_MAX)
}

function getTouchSpeedMultiplier(combo: number): number {
  return 1 + clamp(combo, 0, TOUCH_COMBO_MAX) / TOUCH_COMBO_MAX
}

function getGrowthStage(day: number): number {
  return clamp(Math.ceil(day / (TOTAL_TURNS / 10)), 1, 9)
}

function normalizeSkillId(skillId: string | null | undefined): string | null {
  if (!skillId) return null
  const normalized = LEGACY_SKILL_REPLACEMENTS[skillId] ?? skillId
  return SKILLS.some((skill) => skill.id === normalized) ? normalized : null
}

function normalizePlan(plan: Partial<Record<PlanSlot, string | null>> | undefined): GameState['plan'] {
  const next = { ...INITIAL_STATE.plan }
  for (const slot of PLAN_SLOTS) {
    next[slot] = normalizeSkillId(plan?.[slot])
  }
  return next
}

function getSkill(skillId: string | null): Skill | undefined {
  const normalized = normalizeSkillId(skillId)
  return normalized ? SKILLS.find((skill) => skill.id === normalized) : undefined
}

function buildActionFrames(stage: number, action: ActionKind): string[] {
  const imgStage = Math.min(stage, 9)
  const base = `/assets/original/potato${imgStage}`

  if (action === 'eat') return [`${base}_eat1.png`, `${base}_eat2.png`]
  if (action === 'drink') return [`${base}_drink1.png`, `${base}_drink2.png`]
  if (action === 'dgdg') return [`${base}_dgdg1.png`, `${base}_dgdg2.png`, `${base}_dgdg3.png`]
  if (action === 'exercise') return [`${base}_ex1.png`, `${base}_ex2.png`]
  if (action === 'solar') {
    return imgStage === 1 ? [`${base}_solar.png`] : [`${base}_solar1.png`, `${base}_solar2.png`]
  }

  return [`${base}_normal.png`]
}

function playSound(path: string, volume = 0.82): void {
  if ((window as any).gameAudioMuted) return
  const cached = soundCache.get(path)
  const audio = cached ? (cached.cloneNode() as HTMLAudioElement) : new Audio(path)
  audio.volume = volume
  void audio.play().catch(() => {
    // Ignore playback permission errors during development.
  })
}

function playOriginalButtonVoice(): void {
  playSound(pickRandom(UI_SOUNDS), 0.9)
}

function preloadSounds(): void {
  ALL_SOUNDS.forEach((path) => {
    const audio = new Audio(path)
    audio.preload = 'auto'
    soundCache.set(path, audio)
  })
}

function preloadImages(): void {
  const urls = [
    '/assets/original/mainbg.png',
    '/assets/original/back.png',
    '/assets/original/back_front.png',
    '/assets/original/tableback.png',
    '/assets/original/title.png',
    '/assets/original/title_eng.png',
    '/assets/original/gobttn.png',
    '/assets/original/nobttn.png',
    '/assets/original/tablebttn1.png',
    '/assets/original/tablebttn2.png',
    '/assets/original/toy_doraji.png',
    '/assets/original/toy_landdog.png',
    '/assets/original/toy_sweetpotato.png',
    '/assets/original/toy_worm.png',
    '/assets/original/start.png',
    '/assets/original/start2.png',
  ]

  for (let i = 1; i <= 9; i++) {
    urls.push(`/assets/original/potato${i}_normal.png`)
    urls.push(`/assets/original/potato${i}_eat1.png`)
    urls.push(`/assets/original/potato${i}_eat2.png`)
    urls.push(`/assets/original/potato${i}_drink1.png`)
    urls.push(`/assets/original/potato${i}_drink2.png`)
    urls.push(`/assets/original/potato${i}_dgdg1.png`)
    urls.push(`/assets/original/potato${i}_dgdg2.png`)
    urls.push(`/assets/original/potato${i}_dgdg3.png`)
    urls.push(`/assets/original/potato${i}_ex1.png`)
    urls.push(`/assets/original/potato${i}_ex2.png`)
    urls.push(`/assets/original/potato${i}_solar.png`)
    urls.push(`/assets/original/potato${i}_solar1.png`)
    urls.push(`/assets/original/potato${i}_solar2.png`)
    urls.push(`/assets/original/potato${i}_shock.png`)
    urls.push(`/assets/original/potato${i}_sleep.png`)
    urls.push(`/assets/original/title${i}.png`)
  }
  for (let i = 1; i <= 13; i++) urls.push(`/assets/original/memo${i}.png`)
  // potato10_normal.png does not exist; stage 10 reuses stage 9 normal image

  // Event images
  urls.push('/assets/original/worm1.png')
  urls.push('/assets/original/sweetpotato.png')
  urls.push('/assets/original/landdog.png')
  urls.push('/assets/original/doraji.png')
  urls.push('/assets/original/bug1.png')
  urls.push('/assets/original/dung1.png')
  urls.push('/assets/original/dung2.png')
  urls.push('/assets/original/bigstar.png')
  urls.push('/assets/original/good_icon.png')
  urls.push('/assets/original/bad_icon.png')
  for (let i = 1; i <= 6; i++) urls.push(`/assets/original/stat_icon${i}.png`)
  urls.push('/assets/original/moon.png')
  urls.push('/assets/original/stone.png')
  urls.push('/assets/original/reset.png')

  for (let i = 1; i <= 5; i++) {
    urls.push(`/assets/original/bttn${i}.png`)
    urls.push(`/assets/original/bttn${i}b.png`)
  }

  // Preload all ending icon assets (both default and hover states) and ending scene pictures
  for (let i = 1; i <= 33; i++) {
    urls.push(`/assets/original/end${i}.png`)
    urls.push(`/assets/original/end${i}b.png`)
    urls.push(`/assets/original/ending${i}.png`)
  }

  urls.forEach((url) => {
    const img = new Image()
    img.src = url
  })
}

function applySkillRanges(stats: GameStats, ranges: StatRange, multiplier = 1): { stats: GameStats; negatives: number } {
  const next = { ...stats }
  let negatives = 0

  for (const key of STAT_KEYS) {
    const range = ranges[key]
    if (!range) continue

    const delta = Math.round(randomInt(range[0], range[1]) * multiplier)
    if (delta < 0) negatives += 1
    next[key] = clamp(next[key] + delta, 0, 1600)
  }

  return { stats: next, negatives }
}

function rollSeedSlot(prevSlot: SeedSlot): { slot: SeedSlot; stats: StatRange; message: string } {
  const spentReroll = prevSlot.rolled ? 1 : 0
  const jackpot = Math.random() < 0.1
  const results = jackpot
    ? Array.from({ length: SEED_REEL_COUNT }, () => getRandomStat())
    : Array.from({ length: SEED_REEL_COUNT }, () => getRandomStat())

  if (jackpot) {
    const jackpotStat = getRandomStat()
    results.fill(jackpotStat)
  }

  const stats: StatRange = {}
  if (jackpot) {
    const target = results[0]
    stats[target] = [180, 220]
  } else {
    for (const stat of results) {
      const current = stats[stat] ?? [0, 0]
      stats[stat] = [current[0] + 18, current[1] + 32]
    }
  }

  const rerolls = Math.max(0, prevSlot.rerolls - spentReroll) + (jackpot ? 1 : 0)
  const slot = {
    results,
    jackpot,
    rerolls,
    rolled: true,
  }
  const message = jackpot
    ? `잭팟! ${STAT_LABELS[results[0]]} 재능이 크게 튀어나왔고 슬롯 기회가 1회 늘었습니다.`
    : `씨감자의 타고난 재능이 ${results.map((stat) => STAT_LABELS[stat]).join(', ')} 쪽으로 깨어났습니다.`

  return { slot, stats, message }
}

function getTopStats(stats: GameStats): StatKey[] {
  return [...STAT_KEYS].sort((a, b) => stats[b] - stats[a])
}

function getStatusProfile(stats: GameStats, day: number, initialStats?: GameStats): { title: string; hint: string } {
  const baseline = initialStats || stats
  const hasGrowth = STAT_KEYS.some((key) => stats[key] - baseline[key] > 5)

  const sortedKeys = [...STAT_KEYS].sort((a, b) => {
    if (hasGrowth) {
      return (stats[b] - baseline[b]) - (stats[a] - baseline[a])
    }
    return stats[b] - stats[a]
  })

  const [top, second] = sortedKeys
  const average = STAT_KEYS.reduce((sum, key) => sum + stats[key], 0) / STAT_KEYS.length

  if (day >= HARVEST_RUSH_TURN) {
    return { title: '수확 임박', hint: `${STAT_LABELS[top]} 쪽으로 운명이 기울고 있다` }
  }

  if (average >= 760) return { title: '전설 후보', hint: '모든 능력치가 위험할 만큼 높다' }

  const pair = `${top}-${second}`
  if (pair.includes('regist') && pair.includes('hard')) return { title: '철벽 감자', hint: '면역력과 단단함이 강화되는 중' }
  if (pair.includes('gram') && pair.includes('large')) return { title: '거대 감자', hint: '무게와 크기가 주로 자라고 있다' }
  if (pair.includes('nutri') && pair.includes('shape')) return { title: '명품 감자', hint: '영양가와 모양이 조화를 이루는 중' }

  const titles: Record<StatKey, string> = {
    gram: '묵직한 감자',
    large: '쑥쑥 감자',
    shape: '반듯한 감자',
    nutri: '알찬 감자',
    regist: '생존형 감자',
    hard: '단단한 감자',
  }

  return { title: titles[top], hint: `${STAT_LABELS[top]} 계열 엔딩에 가까워지는 중` }
}

const STAT_ACHIEVEMENT_COPY: Record<StatKey, { word: AchievementCopy; title: AchievementCopy }> = {
  gram: {
    word: { ko: '묵직', en: 'Weight' },
    title: { ko: '무게 단련', en: 'Weight Training' },
  },
  large: {
    word: { ko: '쑥쑥', en: 'Size' },
    title: { ko: '크기 성장', en: 'Size Growth' },
  },
  shape: {
    word: { ko: '반듯', en: 'Shape' },
    title: { ko: '모양 정돈', en: 'Shape Polish' },
  },
  nutri: {
    word: { ko: '알찬', en: 'Nutri' },
    title: { ko: '영양 저장', en: 'Nutrient Store' },
  },
  regist: {
    word: { ko: '강인', en: 'Immune' },
    title: { ko: '면역 강화', en: 'Immunity Boost' },
  },
  hard: {
    word: { ko: '단단', en: 'Hard' },
    title: { ko: '단단함 수련', en: 'Hardness Drill' },
  },
}

const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: 'seed_spin',
    word: { ko: '씨앗', en: 'Seed' },
    title: { ko: '재능 확인', en: 'Talent Check' },
    hint: { ko: '씨감자 슬롯을 한 번 돌리기', en: 'Spin the seed talent slot once' },
    test: ({ game }) => game.seedSlot.rolled,
  },
  {
    id: 'first_plan',
    word: { ko: '계획', en: 'Plan' },
    title: { ko: '오늘의 시작', en: 'First Plan' },
    hint: { ko: '첫 계획을 배치하거나 하루를 넘기기', en: 'Place a plan or pass the first day' },
    test: ({ game }) => Object.values(game.plan).some(Boolean) || game.day > 1.05,
  },
  {
    id: 'full_plan',
    word: { ko: '삼시', en: 'Triple' },
    title: { ko: '삼시세끼 계획', en: 'Full-Day Plan' },
    hint: { ko: '아침, 점심, 저녁 슬롯을 모두 채우기', en: 'Fill morning, afternoon, and evening' },
    test: ({ game }) => PLAN_SLOTS.every((slot) => Boolean(game.plan[slot])),
  },
  {
    id: 'week_2',
    word: { ko: '새싹', en: 'Sprout' },
    title: { ko: '2주차 진입', en: 'Week 2' },
    hint: { ko: '2주차까지 키우기', en: 'Reach Week 2' },
    test: ({ game }) => game.weekIndex >= 2 || game.day >= 8,
  },
  {
    id: 'week_4',
    word: { ko: '줄기', en: 'Stem' },
    title: { ko: '4주차 진입', en: 'Week 4' },
    hint: { ko: '4주차까지 키우기', en: 'Reach Week 4' },
    test: ({ game }) => game.weekIndex >= 4 || game.day >= 22,
  },
  {
    id: 'week_8',
    word: { ko: '잎사귀', en: 'Leaves' },
    title: { ko: '8주차 진입', en: 'Week 8' },
    hint: { ko: '8주차까지 키우기', en: 'Reach Week 8' },
    test: ({ game }) => game.weekIndex >= 8 || game.day >= 50,
  },
  {
    id: 'harvest_rush',
    word: { ko: '수확', en: 'Harvest' },
    title: { ko: '수확 임박', en: 'Harvest Near' },
    hint: { ko: '수확 임박 구간에 도달하기', en: 'Reach the harvest rush phase' },
    test: ({ game }) => game.day >= HARVEST_RUSH_TURN || game.screen === 'harvest' || game.screen === 'ending',
  },
  {
    id: 'first_harvest',
    word: { ko: '첫맛', en: 'First' },
    title: { ko: '첫 수확 완료', en: 'First Harvest' },
    hint: { ko: '엔딩을 한 번 기록하기', en: 'Record one ending' },
    test: ({ totalClears, records }) => totalClears >= 1 || records.length >= 1,
  },
  {
    id: 'clear_3',
    word: { ko: '세번', en: 'Three' },
    title: { ko: '3회 수확', en: '3 Harvests' },
    hint: { ko: '수확을 3회 완료하기', en: 'Complete 3 harvests' },
    test: ({ totalClears, records }) => totalClears >= 3 || records.length >= 3,
  },
  {
    id: 'clear_5',
    word: { ko: '다섯', en: 'Five' },
    title: { ko: '5회 수확', en: '5 Harvests' },
    hint: { ko: '수확을 5회 완료하기', en: 'Complete 5 harvests' },
    test: ({ totalClears, records }) => totalClears >= 5 || records.length >= 5,
  },
  {
    id: 'clear_10',
    word: { ko: '열번', en: 'Ten' },
    title: { ko: '10회 수확', en: '10 Harvests' },
    hint: { ko: '수확을 10회 완료하기', en: 'Complete 10 harvests' },
    test: ({ totalClears, records }) => totalClears >= 10 || records.length >= 10,
  },
  {
    id: 'collection_1',
    word: { ko: '도감', en: 'Book' },
    title: { ko: '도감 첫 장', en: 'First Page' },
    hint: { ko: '엔딩 도감 1종 수집', en: 'Collect 1 ending' },
    test: ({ unlockedCount }) => unlockedCount >= 1,
  },
  {
    id: 'collection_5',
    word: { ko: '다섯칸', en: 'Five' },
    title: { ko: '도감 5종', en: '5 Endings' },
    hint: { ko: '엔딩 도감 5종 수집', en: 'Collect 5 endings' },
    test: ({ unlockedCount }) => unlockedCount >= 5,
  },
  {
    id: 'collection_10',
    word: { ko: '열칸', en: 'Ten' },
    title: { ko: '도감 10종', en: '10 Endings' },
    hint: { ko: '엔딩 도감 10종 수집', en: 'Collect 10 endings' },
    test: ({ unlockedCount }) => unlockedCount >= 10,
  },
  {
    id: 'collection_20',
    word: { ko: '스물칸', en: 'Twenty' },
    title: { ko: '도감 20종', en: '20 Endings' },
    hint: { ko: '엔딩 도감 20종 수집', en: 'Collect 20 endings' },
    test: ({ unlockedCount }) => unlockedCount >= 20,
  },
  {
    id: 'collection_all',
    word: { ko: '완성', en: 'Complete' },
    title: { ko: '도감 완성', en: 'Complete Book' },
    hint: { ko: '엔딩 도감 33종 모두 수집', en: 'Collect all 33 endings' },
    test: ({ unlockedCount }) => unlockedCount >= 33,
  },
  {
    id: 'event_1',
    word: { ko: '만남', en: 'Meet' },
    title: { ko: '첫 돌발 이벤트', en: 'First Event' },
    hint: { ko: '돌발 이벤트 1회 경험', en: 'Experience 1 sudden event' },
    test: ({ eventSeenTotal }) => eventSeenTotal >= 1,
  },
  {
    id: 'event_5',
    word: { ko: '소문', en: 'Rumor' },
    title: { ko: '이벤트 5회', en: '5 Events' },
    hint: { ko: '돌발 이벤트 5회 경험', en: 'Experience 5 sudden events' },
    test: ({ eventSeenTotal }) => eventSeenTotal >= 5,
  },
  {
    id: 'event_10',
    word: { ko: '북적', en: 'Busy' },
    title: { ko: '이벤트 10회', en: '10 Events' },
    hint: { ko: '돌발 이벤트 10회 경험', en: 'Experience 10 sudden events' },
    test: ({ eventSeenTotal }) => eventSeenTotal >= 10,
  },
  {
    id: 'event_20',
    word: { ko: '축제', en: 'Fest' },
    title: { ko: '이벤트 20회', en: '20 Events' },
    hint: { ko: '돌발 이벤트 20회 경험', en: 'Experience 20 sudden events' },
    test: ({ eventSeenTotal }) => eventSeenTotal >= 20,
  },
  {
    id: 'toy_worm',
    word: { ko: '꿈틀', en: 'Worm' },
    title: { ko: '지렁이 인형', en: 'Earthworm Toy' },
    hint: { ko: '지렁이 인형 획득', en: 'Obtain the earthworm toy' },
    test: ({ game }) => Boolean(game.toys.worm),
  },
  {
    id: 'toy_sweet',
    word: { ko: '고구마', en: 'Sweet' },
    title: { ko: '고구마 인형', en: 'Sweet Potato Toy' },
    hint: { ko: '고구마 인형 획득', en: 'Obtain the sweet potato toy' },
    test: ({ game }) => Boolean(game.toys.sweet),
  },
  {
    id: 'toy_landdog',
    word: { ko: '앞발', en: 'Claw' },
    title: { ko: '땅강아지 인형', en: 'Mole Cricket Toy' },
    hint: { ko: '땅강아지 인형 획득', en: 'Obtain the mole cricket toy' },
    test: ({ game }) => Boolean(game.toys.landdog),
  },
  {
    id: 'toy_doraji',
    word: { ko: '보라꽃', en: 'Flower' },
    title: { ko: '도라지꽃 인형', en: 'Bellflower Toy' },
    hint: { ko: '도라지꽃 인형 획득', en: 'Obtain the bellflower toy' },
    test: ({ game }) => Boolean(game.toys.doraji),
  },
  {
    id: 'combo_30s',
    word: { ko: '유지30', en: 'Hold30' },
    title: { ko: '30초의 달인', en: '30s Master' },
    hint: { ko: '100콤보 30초 이상 유지', en: 'Maintain 100 combo for 30s+' },
    test: ({ game }) => (game.combo100MaxDuration || 0) >= 30,
  },
  {
    id: 'combo_60s',
    word: { ko: '유지60', en: 'Hold60' },
    title: { ko: '1분의 질주', en: '1min Rush' },
    hint: { ko: '100콤보 60초 이상 유지', en: 'Maintain 100 combo for 60s+' },
    test: ({ game }) => (game.combo100MaxDuration || 0) >= 60,
  },
  {
    id: 'combo_100s',
    word: { ko: '유지100', en: 'Hold100' },
    title: { ko: '100초의 기적', en: '100s Miracle' },
    hint: { ko: '100콤보 100초 이상 유지', en: 'Maintain 100 combo for 100s+' },
    test: ({ game }) => (game.combo100MaxDuration || 0) >= 100,
  },
  {
    id: 'seed_jackpot',
    word: { ko: '잭팟', en: 'Jackpot' },
    title: { ko: '재능 잭팟', en: 'Talent Jackpot' },
    hint: { ko: '씨감자 슬롯 잭팟 달성', en: 'Hit a seed slot jackpot' },
    test: ({ game }) => game.seedSlot.jackpot,
  },
  ...STAT_KEYS.flatMap((key) => {
    const copy = STAT_ACHIEVEMENT_COPY[key]
    return [
      {
        id: `${key}_500`,
        word: copy.word,
        title: copy.title,
        hint: {
          ko: `${STAT_LABELS[key]} 500 이상 달성`,
          en: `Raise ${copy.word.en} to 500+`,
        },
        test: ({ game }: AchievementContext) => game.stats[key] >= 500,
      },
      {
        id: `${key}_1000`,
        word: { ko: `${copy.word.ko}!`, en: `${copy.word.en}+` },
        title: {
          ko: `${copy.title.ko} 장인`,
          en: `${copy.title.en} Master`,
        },
        hint: {
          ko: `${STAT_LABELS[key]} 1000 이상 달성`,
          en: `Raise ${copy.word.en} to 1000+`,
        },
        test: ({ game }: AchievementContext) => game.stats[key] >= 1000,
      },
    ]
  }),
]

function getAchievementContext(game: GameState): AchievementContext {
  const records = loadRecords()
  return {
    game,
    records,
    totalClears: getClearBonusCount(game.endingSeenCount, game.unlockedEndingIds),
    unlockedCount: game.unlockedEndingIds.length,
    eventSeenTotal: Object.values(game.eventSeen ?? {}).reduce((sum, count) => sum + Math.max(0, Number(count) || 0), 0),
  }
}

function selectCopy(copy: AchievementCopy, lang: 'ko' | 'en'): string {
  return copy[lang]
}

const ORIGINAL_ENDING_TITLES: string[] = [
  '해시브라운',
  '감자탕',
  '감자칩',
  '감자옹심이',
  '감자조림',
  '감자볶음',
  '감자핫도그',
  '감자샐러드',
  '감자국',
  '치즈웨지감자',
  '감자 스프',
  '감자그라탕',
  '회오리감자',
  '알감자조림',
  '알감자 버터구이',
  '감자밥',
  '감자뇨끼',
  '감자크로켓',
  '감자튀김',
  '감자전분',
  '매시드 포테이토',
  '연구실 실험용 감자',
  '학교 실습용 감자',
  '군감자',
  '찐감자',
  '감자전',
  '재배용 씨감자',
  '세계에서 가장 작은 감자',
  '세계에서 가장 큰 감자',
  '돼지 사료',
  '감자떡',
  '하늘의 구름',
  '감자 포카치아',
]

const ORIGINAL_ENDING_TITLES_EN: string[] = [
  'Hash Brown',
  'Gamjatang',
  'Potato Chips',
  'Potato Ongsimi',
  'Braised Potatoes',
  'Stir-Fried Potatoes',
  'Potato Hot Dog',
  'Potato Salad',
  'Potato Soup',
  'Cheese Wedge Potatoes',
  'Potato Soup',
  'Potato Gratin',
  'Tornado Potato',
  'Braised Baby Potatoes',
  'Butter-Roasted Baby Potatoes',
  'Potato Rice',
  'Potato Gnocchi',
  'Potato Croquette',
  'French Fries',
  'Potato Starch',
  'Mashed Potato',
  'Lab Test Potato',
  'School Practice Potato',
  'Roasted Potato',
  'Steamed Potato',
  'Potato Pancake',
  'Seed Potato',
  'World Smallest Potato',
  'World Largest Potato',
  'Pig Feed',
  'Potato Rice Cake',
  'Cloud in the Sky',
  'Potato Focaccia',
]

const ORIGINAL_ENDING_STORIES: string[] = [
  '당신이 정성껏 키운 감자는 잘 자라서 해시브라운이 되었습니다. 해시브라운은 제작자의 캐릭터 이름입니다. 맛있지만 많이 먹으면 느끼할 수 있습니다. 혼자 먹는 것보다 햄버거, 콜라와 먹으면 더 좋아요. 당신의 감자는 꿈을 이루었네요. 축하드립니다.',
  '당신이 정성껏 키운 감자는 잘 자라서 감자탕이 되었습니다. 감자탕은 다양한 영양소가 많이 들어있습니다. 감자탕의 감자는 채소 감자가 아니라지만 그런게 뭐 중요할까요. 맛만 있으면 그만이죠.',
  '당신이 정성껏 키운 감자는 잘 자라서 감자칩이 되었습니다. 감자칩은 세계에서 사랑받는 간식 중 하나죠. 여러분이 좋아하는 감자칩은 무엇인가요? 오늘은 누워서 감자칩을 먹으며 느긋하게 휴식을 취해보는것은 어떨까요?',
  '당신이 정성껏 키운 감자는 잘 자라서 감자옹심이가 되었습니다. 강원도의 감자옹심이가 특히 유명하죠. 푹 익어서 투명한 빛깔을 내는 감자옹심이. 먹고싶네요. 여러분도 오늘 한끼는 감자옹심이를 드셔보는 것은 어떠세요?',
  '당신이 정성껏 키운 감자는 잘 자라서 감자조림이 되었습니다. 호불호가 갈리지 않는 밥반찬계의 베스트셀러. 너무 많이 먹으면 짤 수 있어요.',
  '당신이 정성껏 키운 감자는 잘 자라서 감자볶음이 되었습니다. 식탁 위 반찬계의 영원한 친구. 도시락 반찬으로도 좋죠. 당근과 피망이 잘 어울려요.',
  '당신이 정성껏 키운 감자는 잘 자라서 감자핫도그가 되었습니다. 그냥 핫도그도 맛있는데 감자튀김이 들어간 핫도그라니. 미국사람들도 엄청 좋아한다네요. 도깨비 방망이처럼 생겼죠? 오늘 간식은 감자핫도그 어떠세요?',
  '당신이 정성껏 키운 감자는 잘 자라서 감자샐러드가 되었습니다. 샐러드계의 트로이카. 고구마, 단호박과 함께 최고의 인기를 누리죠. 기름진 갈비와 먹으면 잘 어울린다고 하네요. 만들기도 어렵지 않아요.',
  '당신이 정성껏 키운 감자는 잘 자라서 감자국이 되었습니다. 계란풀고 파송송 썰어넣은 뜨끈한 감자국 한그릇 어떠세요? 벌써 몸이 스르르 풀리는 기분이네요.',
  '당신이 정성껏 키운 감자는 잘 자라서 치즈웨지감자가 되었습니다. 두툼하게 썰어 튀긴 감자 위에 고소한 치즈를 아낌없이 얹어서 만들었어요. 감자들이 이불을 덮은것 같아요. 치즈와 감자의 궁합은 최고네요.',
  '당신이 정성껏 키운 감자는 잘 자라서 감자 스프가 되었습니다. 고소하고 달콤한 감자스프. 후추를 뿌려 먹어도 맛있어요. 홀로 있어도 빛나지만 앞장서서 누군가를 빛내게 해주는 친구지요.',
  '당신이 정성껏 키운 감자는 잘 자라서 감자그라탕이 되었습니다. 감자가 치즈와 만나 한데 섞여 뜨거운 오븐에서 하나가 되었네요. 갓 나온 그라탕을 한술 크게 떠서 입에 넣으면 정말 뜨거우니 조심하세요.',
  '당신이 정성껏 키운 감자는 잘 자라서 회오리감자가 되었습니다. 특이한 모양만큼 맛있는 회오리감자. 유원지에 놀러가서 먹으면 사진도 찍어 추억을 남길 수 있죠. 여러분도 사진을 한번 찍어주는건 어떨까요?',
  '당신이 정성껏 키운 감자는 잘 자라서 알감자조림이 되었습니다. 작고 동글동글한 알감자를 양념에 푹 졸여서 만들었어요. 한입에 쏙 넣고 먹으면 밥과 정말 잘 어울려요.',
  '당신이 정성껏 키운 감자는 잘 자라서 알감자 버터구이가 되었습니다. 고속도로 휴게소에 가면 사먹고 싶어지는 알감자 버터구이. 설탕도 어울리고 소금도 어울려요. 한입에 넣으면 뜨거우니 조심해서 식혀드세요.',
  '당신이 정성껏 키운 감자는 잘 자라서 감자밥이 되었습니다. 강원도에서 주로 먹는 감자밥은 밥을 지을때 감자를 같이 넣어 만들어요. 갓 지은 감자밥에 간장양념을 넣고 슥슥 비벼 먹으면 다른 반찬이 필요 없지요.',
  '당신이 정성껏 키운 감자는 잘 자라서 감자뇨끼가 되었습니다. 감자뇨끼(뇨키)는 이탈리아의 요리에요. 감자와 밀가루로 만든 반죽을 한입크기로 익혀 소스를 얹어 먹으면 정말 부드럽고 맛있어요.',
  '당신이 정성껏 키운 감자는 잘 자라서 감자크로켓이 되었습니다. 으깬 감자에 햄과 치즈 등을 섞어 기름에 튀겨 만들었어요. 그러니 맛이 없을수 있겠어요?',
  '당신이 정성껏 키운 감자는 잘 자라서 감자튀김이 되었습니다. 세트메뉴의 조연처럼 느껴지지만 감자튀김만 먹어도 정말 맛있답니다. 감자의 크기와 소금량에 따라 맛도 다양해요.',
  '당신이 정성껏 키운 감자는 잘 자라서 감자전분이 되었습니다. 감자가 고운 가루가 되었네요. 자신을 작게 만들고 나면 어떤 요리도 될 수 있고 어느 요리에나 어울리게 되죠.',
  '당신이 정성껏 키운 감자는 잘 자라서 매시드 포테이토가 되었습니다. 잔뜩 으깨졌지만 그래서 더 부드럽고 맛도 좋아요. 설탕, 소금 가리지 않고 어울리지요.',
  '당신이 정성껏 키운 감자는 잘 자라서 연구실 실험용 감자가 되었습니다. 저런, 감자에게 가해지는 무자비한 실험이 비록 지켜보는 것 조차 고통스럽겠지만 인류에게는 큰 도움이 될 것입니다.',
  '당신이 정성껏 키운 감자는 잘 자라서 학교 실습용 감자가 되었습니다. 저런, 학생들이 스포이드로 아이오딘용액을 뿌리고 있네요. 감자의 얼굴이 보랏빛으로 질렸네요. 녹말 성분이 용액에 반응한거라고요? 아무렴 어떤가요 학생들이 실험을 하며 즐거워 하는데요.',
  '당신이 정성껏 키운 감자는 잘 자라서 군감자가 되었습니다. 군감자는 감자를 가장 쉽고 맛있게 먹을 수 있는 방법이죠. 재를 이리저리 털어내고 껍질을 벗겨 호호 불어 먹으면 정말 맛있어요.',
  '당신이 정성껏 키운 감자는 잘 자라서 찐감자가 되었습니다. 찐감자는 불과 물만 있으면 쉽게 만들 수 있죠. 소금과 설탕 무엇이든 잘 어울려요. 여름밤 찐감자와 수박, 행복한 추억이 떠오르지 않으세요?',
  '당신이 정성껏 키운 감자는 잘 자라서 감자전이 되었습니다. 부추와 고추를 넣고 자글자글 기름에 부쳐 낸 감자전. 감자는 채썰어도 맛있고 갈아도 맛있어요. 비오는 날에 더 맛있는 이유는 뭘까요?',
  '당신이 정성껏 키운 감자는 잘 자라서 재배용 씨감자가 되었습니다. 비록 이번 생에 꿈을 이루지는 못했지만 자신의 몸을 네 조각으로 나눠 미래의 꿈을 향해 다시 도전하겠지요.',
  '당신이 정성껏 키운 감자는 잘 자라서 세계에서 가장 작은 감자가 되었습니다. 지름이 동전만한 초소형 감자, 기네스북에도 올라 화제가 되었네요. 조심하세요, 너무 작아 날아갈지도 몰라요.',
  '당신이 정성껏 키운 감자는 잘 자라서 세계에서 가장 큰 감자가 되었습니다. 어떻게 이렇게 키우셨어요? 자동차보다 큰 감자라니 기네스북에도 올랐네요. 수백명이 먹어도 배부르겠어요.',
  '안타깝네요. 당신이 키운 감자는 돼지 사료가 되었습니다. 너무 골고루 잘 키우려고 해서 그런걸까요? 감자는 돼지의 한입 식사가 되었네요. 감자의 일생은 돼지의 삼겹살이 되기 위해 태어난 것일까요? 감자가 당신을 애타게 부르고 있네요. 살려주세요.',
  '당신이 정성껏 키운 감자는 잘 자라서 감자떡이 되었습니다. 강원도의 전통 떡인 감자떡은 감자전분을 송편처럼 빚어 만들어요. 팥도 들어있고 콩도 들어있지요. 반투명하게 속이 비치는 것 같지 않나요? 쫄깃한 감자떡 드셔보세요.',
  '당신이 정성껏 키운 감자는 하늘의 구름이 되었습니다. 감자의 능력치가 0이라니! 세상에 존재하지 않는 감자로 만들었군요. 두둥실 하늘로 올라가 키워준 당신을 언제까지나 지켜보겠다고 하네요.',
  '당신이 정성껏 키운 감자는 잘 자라서 감자 포카치아가 되었습니다. 포카치아는 감자를 갈아 넣은 반죽으로 만든 빵이에요. 올리브와 만나 더 맛있어졌네요. 발사믹식초와 올리브유에 찍어먹으면 정말 고소해요.',
]

function buildEndingTable(): Ending[] {
  return ORIGINAL_ENDING_KEYS.map((statKeys, index) => {
    const imageIndex = index + 1
    const id = `E${String(imageIndex).padStart(2, '0')}`

    return {
      id,
      imageIndex,
      tier: statKeys.length,
      statKeys,
      title: ORIGINAL_ENDING_TITLES[index] || getEndingTitle(statKeys),
      hint: getEndingHint(statKeys, imageIndex),
      story: ORIGINAL_ENDING_STORIES[index] || '',
    }
  })
}

const ENDING_TABLE = buildEndingTable()

const ENDING_TAGLINES: Record<string, string> = {
  E01: "바삭하고 고소한 아침의 단짝",
  E02: "얼큰하고 칼칼한 국물 속의 주역",
  E03: "바삭바삭 손이 가요 손이 가",
  E04: "강원도의 정취를 담은 쫄깃한 한 그릇",
  E05: "단짠단짠 밥도둑 반찬계의 클래식",
  E06: "아삭하고 고소한 일상의 단골 반찬",
  E07: "설탕 솔솔 뿌린 바삭함의 극치",
  E08: "부드럽고 달콤한 샌드위치의 단짝",
  E09: "따뜻하게 마음을 녹여주는 맑고 개운한 맛",
  E10: "치즈가 쭉쭉 늘어나는 두툼한 맥주 안주",
  E11: "부드럽고 크리미하게 아침을 여는 맛",
  E12: "치즈와 베이컨을 얹어 오븐에 노릇하게 구운 요리",
  E13: "돌리고 돌려 만드는 축제 길거리의 황제",
  E14: "동글동글 한 입 크기의 짭조름한 매력",
  E15: "휴게소 필수 코스, 버터 향 가득한 유혹",
  E16: "양념장 슥슥 비벼 먹는 소박하지만 든든한 밥상",
  E17: "이탈리아의 감성을 담은 부드러운 파스타",
  E18: "겉바속촉 한 입 깨물면 고소함이 톡톡",
  E19: "모두에게 사랑받는 영원한 패스트푸드",
  E20: "어떤 요리든 쫀득하게 만들어주는 마법의 가루",
  E21: "입안에서 사르르 녹아내리는 부드러움",
  E22: "인류의 과학 발전을 위한 위대한 한 걸음",
  E23: "학생들의 호기심 가득한 보랏빛 첫 실험",
  E24: "겨울철 손을 호호 불며 먹던 따끈한 추억",
  E25: "포슬포슬 뜨거울 때 한 입 먹는 순수한 매력",
  E26: "평범한 재료로 만든 특별한 한 판",
  E27: "새로운 생명을 품고 흙 속으로 돌아가는 여행자",
  E28: "동전보다 작지만 존재감 넘치는 기네스북 주인공",
  E29: "자동차만한 크기로 세상을 놀라게 한 거인",
  E30: "모두를 배부르게 하는 행복한 식사 시간",
  E31: "강원도 전분으로 만든 쫀득쫄깃 전통 간식",
  E32: "두둥실 바람 타고 자유로이 흐르는 구름",
  E33: "향긋한 허브와 올리브를 얹은 담백한 이탈리안 브레드",
}

const ENDING_QUESTIONS: Record<string, string> = {
  E01: "케첩파인가요, 머스터드파인가요?",
  E02: "볶음밥은 빼놓을 수 없겠죠?",
  E03: "짭짤한 오리지널이 좋나요, 어니언이 좋나요?",
  E04: "옹심이의 쫀득함을 좋아하시나요?",
  E05: "뜨끈한 하얀 쌀밥 준비되셨나요?",
  E06: "당근과 감자채, 최강의 조합이죠?",
  E07: "설탕을 묻히나요, 케첩만 바르나요?",
  E08: "모닝빵 사이에 넣어 드실래요?",
  E09: "겨울철에 생각나는 뜨끈한 맛일까요?",
  E10: "치즈와 감자의 조화, 어떠신가요?",
  E11: "바삭한 크루통을 올려볼까요?",
  E12: "뜨거우니까 조심해서 드세요!",
  E13: "치즈 가루를 아낌없이 뿌려드릴까요?",
  E14: "간장에 달콤하게 졸인 반찬 좋아하시나요?",
  E15: "알감자를 휴게소에서 빼놓을 수 없죠?",
  E16: "달래간장 넣고 비비면 어떨까요?",
  E17: "부드럽고 크리미한 소스가 어울릴까요?",
  E18: "속 재료로 치즈를 가득 넣어볼까요?",
  E19: "세트 메뉴에서 감튀 사이즈 업 하시나요?",
  E20: "전분 가루로 쫄깃한 부침개 만들어볼까요?",
  E21: "스테이크 사이드 메뉴로 최고 아닐까요?",
  E22: "인류의 과학 발전에 기여하게 되어 기쁜가요?",
  E23: "스포이드로 용액을 떨어뜨리던 기억 나시나요?",
  E24: "동치미 국물 한 모금 같이 마실래요?",
  E25: "설탕파인가요, 소금파인가요?",
  E26: "비 오는 날에 더 맛있는 이유는 뭘까요?",
  E27: "다음 생에는 어떤 감자로 태어날까요?",
  E28: "너무 작아서 한 입에 쏙 들어갈까요?",
  E29: "이 거대한 감자를 다 먹을 수 있을까요?",
  E30: "돼지 친구들이 맛있게 먹어주었겠죠?",
  E31: "반투명하고 쫄깃쫄깃한 식감 좋아하시나요?",
  E32: "두둥실 흘러가는 저 구름은 감자 구름일까요?",
  E33: "발사믹 식초와 올리브유에 찍어 먹어볼까요?",
}

function getEndingQuizDecor(endingId: string): { icon: string; accents: string[] } {
  if (['E02', 'E09', 'E11', 'E24'].includes(endingId)) {
    return { icon: '🍲', accents: ['♨️', '🥄', '♨️'] }
  }

  if (['E01', 'E03', 'E07', 'E10', 'E13', 'E19'].includes(endingId)) {
    return { icon: '🍟', accents: ['✨', '🧂', '✨'] }
  }

  if (['E05', 'E06', 'E14', 'E16', 'E20', 'E25', 'E31'].includes(endingId)) {
    return { icon: '🥢', accents: ['🍽️', '🌿', '🍽️'] }
  }

  if (['E08', 'E12', 'E17', 'E18', 'E21', 'E33'].includes(endingId)) {
    return { icon: '🍴', accents: ['🧀', '🫒', '🍞'] }
  }

  if (['E22', 'E23'].includes(endingId)) {
    return { icon: '🧪', accents: ['🔬', '⚗️', '🫧'] }
  }

  if (endingId === 'E26') {
    return { icon: '🌂', accents: ['💧', '💧', '💧'] }
  }

  if (endingId === 'E27') {
    return { icon: '🌱', accents: ['🌿', '🪴', '🌿'] }
  }

  if (endingId === 'E28') {
    return { icon: '🔍', accents: ['✨', '·', '✨'] }
  }

  if (endingId === 'E29') {
    return { icon: '🌍', accents: ['⭐', '✨', '⭐'] }
  }

  if (endingId === 'E30') {
    return { icon: '🐷', accents: ['🍽️', '🥔', '🍽️'] }
  }

  if (endingId === 'E32') {
    return { icon: '☁️', accents: ['💨', '☁️', '💨'] }
  }

  return { icon: '📌', accents: ['✦', '✦', '✦'] }
}

function formatStoryText(text: string): React.ReactNode[] {
  const highlightMap: Record<string, string> = {
    "부추": "#2e7d32",
    "고추": "#d32f2f",
    "치즈": "#ff9800",
    "베이컨": "#c2185b",
    "버터": "#fbc02d",
    "콜라": "#b71c1c",
    "햄버거": "#ff9800",
    "설탕": "#ff8f00",
    "소금": "#455a64",
    "밀가루": "#8d6e63",
    "전분": "#795548",
    "양념": "#d84315",
    "간장": "#3e2723",
    "당근": "#e65100",
    "피망": "#2e7d32",
    "팥": "#5d4037",
    "콩": "#33691e",
    "올리브": "#558b2f",
    "계란": "#ff8f00",
    "파": "#2e7d32"
  }

  const words = Object.keys(highlightMap).join("|")
  const regex = new RegExp(`(${words})`, "g")
  const parts = text.split(regex)

  return parts.map((part, index) => {
    if (highlightMap[part]) {
      return (
        <span key={index} style={{ color: highlightMap[part], fontWeight: "bold" }}>
          {part}
        </span>
      )
    }
    return part
  })
}

function getCleanStory(story: string): string {
  const sentences = story.match(/[^.!?]+[.!?]+/g)
  if (!sentences) return story
  const lastSentence = sentences[sentences.length - 1].trim()
  if (lastSentence.endsWith('?')) {
    return sentences.slice(0, -1).join(' ').trim()
  }
  return story
}


type EndingCoord = { x: number; y: number; w: number; h: number }
const ENDING_COORDS: Record<string, EndingCoord> = {
  E01: { x: 630, y: 447, w: 172, h: 135 },
  E02: { x: 419, y: 470, w: 199, h: 128 },
  E03: { x: 1060, y: 210, w: 152, h: 104 },
  E04: { x: 847, y: 392, w: 137, h: 128 },
  E05: { x: 230, y: 508, w: 142, h: 93 },
  E06: { x: 428, y: 374, w: 145, h: 96 },
  E07: { x: 296, y: 336, w: 126, h: 164 },
  E08: { x: 200, y: 235, w: 158, h: 123 },
  E09: { x: 700, y: 322, w: 141, h: 125 },
  E10: { x: 851, y: 238, w: 178, h: 158 },
  E11: { x: 800, y: 77, w: 150, h: 139 },
  E12: { x: 365, y: 250, w: 187, h: 100 },
  E13: { x: 115, y: 350, w: 148, h: 172 },
  E14: { x: 688, y: 210, w: 160, h: 117 },
  E15: { x: 975, y: 435, w: 144, h: 167 },
  E16: { x: 545, y: 302, w: 141, h: 129 },
  E17: { x: 489, y: 207, w: 173, h: 88 },
  E18: { x: 652, y: 84, w: 139, h: 104 },
  E19: { x: 344, y: 72, w: 141, h: 194 },
  E20: { x: 932, y: 142, w: 168, h: 103 },
  E21: { x: 1128, y: 293, w: 154, h: 168 },
  E22: { x: 14, y: 416, w: 121, h: 181 },
  E23: { x: 52, y: 37, w: 130, h: 156 },
  E24: { x: 12, y: 245, w: 171, h: 115 },
  E25: { x: 1050, y: 76, w: 164, h: 123 },
  E26: { x: 161, y: 123, w: 185, h: 117 },
  E27: { x: 1005, y: 326, w: 125, h: 132 },
  E28: { x: 1110, y: 441, w: 133, h: 81 },
  E29: { x: 628, y: 4, w: 218, h: 104 },
  E30: { x: 1059, y: 4, w: 130, h: 104 },
  E31: { x: 493, y: 92, w: 154, h: 114 },
  E32: { x: 223, y: -4, w: 163, h: 91 },
  E33: { x: 819, y: 525, w: 139, h: 97 },
}

function getEndingById(endingId: string): Ending | undefined {
  return ENDING_TABLE.find((ending) => ending.id === endingId)
}

function getDisplayEndingTitle(title: string, lang: 'ko' | 'en'): string {
  if (lang === 'ko') return title
  const index = ORIGINAL_ENDING_TITLES.indexOf(title)
  if (index >= 0) return ORIGINAL_ENDING_TITLES_EN[index] ?? title
  return translate(title, lang)
}

function getEndingIconPath(ending: Pick<Ending, 'imageIndex'>, isHover = false): string {
  return `/assets/original/end${ending.imageIndex}${isHover ? 'b' : ''}.png`
}



function getPastelPatternClass(seed: number): string {
  const classes = [
    'pattern-pastel-1',
    'pattern-pastel-2',
    'pattern-pastel-3',
    'pattern-pastel-4',
    'pattern-pastel-5',
    'pattern-pastel-6',
    'pattern-pastel-7',
    'pattern-pastel-8',
  ]
  return classes[(Math.max(1, seed) - 1) % classes.length]
}



function getEndingScore(ending: Ending, stats: GameStats, initialStats?: GameStats): number {
  const baseline = initialStats || stats
  const growth: Record<StatKey, number> = {} as any
  for (const key of STAT_KEYS) {
    growth[key] = Math.max(0, stats[key] - baseline[key])
  }

  const targetSum = ending.statKeys.reduce((sum, key) => sum + growth[key], 0)
  const targetAvg = targetSum / ending.statKeys.length

  const nonTargetKeys = STAT_KEYS.filter((k) => !ending.statKeys.includes(k))
  const nonTargetSum = nonTargetKeys.reduce((sum, key) => sum + growth[key], 0)
  const nonTargetAvg = nonTargetKeys.length > 0 ? nonTargetSum / nonTargetKeys.length : 0

  return targetAvg - nonTargetAvg * 0.6
}

function pickEnding(state: GameState): EndingResult {
  // 1. Cloud Ending (E32) - Check if any stat is exactly 0
  if (state.stats.large === 0 || state.stats.gram === 0 || state.stats.shape === 0 || state.stats.nutri === 0 || state.stats.regist === 0 || state.stats.hard === 0) {
    const ending = getEndingById('E32')!
    return {
      endingId: ending.id,
      imageIndex: ending.imageIndex,
      title: ending.title,
      hint: ending.hint,
      tier: ending.tier,
      statKeys: ending.statKeys,
      score: 0,
      isNew: (state.endingSeenCount['E32'] ?? 0) === 0,
      story: ending.story,
    }
  }

  if ((state.careCount ?? 0) < PIG_FEED_CARE_THRESHOLD) {
    const ending = getEndingById('E30')!
    return {
      endingId: ending.id,
      imageIndex: ending.imageIndex,
      title: ending.title,
      hint: ending.hint,
      tier: ending.tier,
      statKeys: ending.statKeys,
      score: state.careCount ?? 0,
      isNew: (state.endingSeenCount['E30'] ?? 0) === 0,
      story: ending.story,
    }
  }

  // 2. Smallest Potato (E28) - Check if large < 25
  if (state.stats.large < 25) {
    const ending = getEndingById('E28')!
    return {
      endingId: ending.id,
      imageIndex: ending.imageIndex,
      title: ending.title,
      hint: ending.hint,
      tier: ending.tier,
      statKeys: ending.statKeys,
      score: Math.round(state.stats.large + state.stats.gram / 2),
      isNew: (state.endingSeenCount['E28'] ?? 0) === 0,
      story: ending.story,
    }
  }

  // 3. Largest Potato (E29) - Check if large & gram > 900
  if (state.stats.large > 900 && state.stats.gram > 900) {
    const ending = getEndingById('E29')!
    return {
      endingId: ending.id,
      imageIndex: ending.imageIndex,
      title: ending.title,
      hint: ending.hint,
      tier: ending.tier,
      statKeys: ending.statKeys,
      score: Math.round(state.stats.large + state.stats.gram / 2),
      isNew: (state.endingSeenCount['E29'] ?? 0) === 0,
      story: ending.story,
    }
  }

  // 4. Growth-based relative matching for E01-E33 (excluding E32, E28, E29, E30)
  const candidatesWithScores = ENDING_TABLE
    .filter((e) => e.id !== 'E30' && e.id !== 'E32' && e.id !== 'E28' && e.id !== 'E29')
    .map((ending) => {
      const score = getEndingScore(ending, state.stats, state.initialStats)
      return { ending, score }
    })

  candidatesWithScores.sort((a, b) => b.score - a.score)
  const topCandidate = candidatesWithScores[0]
  let selected: Ending

  if (!topCandidate || topCandidate.score < 45) {
    selected = getEndingById('E30')! // Pig Food fallback
  } else {
    const threshold = topCandidate.score - 15
    const topCandidates = candidatesWithScores
      .filter((c) => c.score >= threshold)
      .map((c) => c.ending)

    const unseen = topCandidates.find((ending) => !state.unlockedEndingIds.includes(ending.id))
    if (unseen) {
      selected = unseen
    } else {
      const tierWeights: Record<number, number> = { 1: 1.00, 2: 1.05, 3: 1.12, 4: 1.22, 5: 1.35, 6: 1.50 }
      const weighted = topCandidates.map((ending) => {
        const seen = state.endingSeenCount[ending.id] ?? 0
        const recentPenalty = state.lastEndingId === ending.id ? 0.15 : 1
        const repeatPenalty = Math.pow(0.5, seen)
        const weight = (tierWeights[ending.tier] ?? 1.0) * repeatPenalty * recentPenalty
        return { ending, weight }
      })

      const total = weighted.reduce((sum, item) => sum + item.weight, 0)
      let cursor = Math.random() * total
      selected = weighted[0].ending
      for (const item of weighted) {
        cursor -= item.weight
        if (cursor <= 0) {
          selected = item.ending
          break
        }
      }
    }
  }

  const seenCount = state.endingSeenCount[selected.id] ?? 0
  const score = Math.round(state.stats.large + state.stats.gram / 2)

  return {
    endingId: selected.id,
    imageIndex: selected.imageIndex,
    title: selected.title,
    hint: selected.hint,
    tier: selected.tier,
    statKeys: selected.statKeys,
    score,
    isNew: seenCount === 0,
    story: selected.story,
  }
}

const EVENT_POOL: ActiveEvent[] = [
  {
    id: 'worm',
    title: '흙 속의 지렁이',
    speaker: '지렁이',
    message: '"앗 비켜, 내 밭이라구!" 지렁이가 꿈틀대며 화를 냅니다! 흙 속 지름길을 두고 감자에게 비키라고 씩씩거리며 꼬리를 흔드네요.',
    image: '/assets/original/worm1.png',
    choices: [
      { id: 'worm_deal', label: '지렁이를 상대한다 (무게 350g 이상 필요)', result: '', effects: {}, tone: 'good' },
      { id: 'worm_ignore', label: '지렁이를 무시한다', result: '"바쁘니까 비켜줄게... 칫." 감자가 지렁이의 억지를 묵묵히 받아들이고 멀리 피해 돌아갑니다. 다행히 평화는 유지되었지만 지렁이가 고소하다는 듯 웃고 떠납니다.', effects: {}, tone: 'bad' },
    ],
  },
  {
    id: 'sweet',
    title: '성깔 있는 고구마',
    speaker: '고구마',
    message: '"너 때문에 내 늘씬한 몸매가 구겨지잖아!" 옆자리의 고구마가 나타나 투덜거립니다. 밭이 너무 좁으니 저기 멀리 구석으로 비키라며 엉덩이로 슬쩍 밀어오네요.',
    image: '/assets/original/sweetpotato.png',
    choices: [
      { id: 'sweet_deal', label: '고구마를 상대한다 (크기 550 이상 필요)', result: '', effects: {}, tone: 'good' },
      { id: 'sweet_ignore', label: '고구마를 무시한다', result: '"어휴 귀찮아, 나 그냥 여기 가만히 있을게..." 고구마를 그냥 무시한 채 구석에 가만히 웅크려 봅니다. 마음은 편하지만 조금 억울한 기분입니다.', effects: {}, tone: 'bad' },
    ],
  },
  {
    id: 'landdog',
    title: '땅강아지의 손톱 내기',
    speaker: '땅강아지',
    message: '"헤이 감자 친구! 너 그렇게 말랑해서 이 거친 흙바닥에서 버티겠어?" 땅강아지가 날카로운 앞발을 번쩍이며 감자의 단단함을 시험해보는 힘내기를 걸어옵니다!',
    image: '/assets/original/landdog.png',
    choices: [
      { id: 'landdog_deal', label: '대결을 받아들인다 (단단함 400 이상 필요)', result: '', effects: {}, tone: 'good' },
      { id: 'landdog_ignore', label: '내기를 거절한다', result: '"난 평화를 사랑하는 감자라고~ 대결은 사절이다!" 내기를 단호히 거절하고 한걸음 물러섭니다. 땅강아지가 코웃음을 치며 사라집니다.', effects: {}, tone: 'bad' },
    ],
  },
  {
    id: 'doraji',
    title: '자존심 강한 도라지',
    speaker: '도라지',
    message: '"어머머, 그렇게 둥글넙적한 얼굴로 밭의 대표가 되겠다고?" 자존심 강한 도라지가 파란 꽃잎을 뽐내며 누가 더 수려하고 멋진 모양새인지 배틀을 신청합니다!',
    image: '/assets/original/doraji.png',
    choices: [
      { id: 'doraji_deal', label: '외모 대결을 한다 (모양 500 이상 필요)', result: '', effects: {}, tone: 'good' },
      { id: 'doraji_ignore', label: '도라지를 상대하지 않는다', result: '"아름다움은 내면에서 나오는 법..." 도라지의 외모 부심을 사뿐히 무시하고 깊은 흙 속으로 시선을 돌립니다.', effects: {}, tone: 'bad' },
    ],
  },
  {
    id: 'bugs',
    title: '웨앵웨앵 벌레 떼 습격',
    speaker: '해충',
    message: '"웨앵웨앵~! 맛있고 부드러운 감자잎이다!" 밭 전체에 굶주린 해충들이 떼를 지어 몰려와 초록 잎사귀와 줄기를 갉아먹기 직전입니다!',
    image: '/assets/original/bug1.png',
    choices: [
      { id: 'bugs_deal', label: '몸으로 버텨내기', result: '', effects: {}, tone: 'good' },
      { id: 'bugs_hide', label: '일단 흙 속에 깊이 숨기', result: '"일단 후퇴다! 흙더미 속으로 쏙!" 안전하게 흙 속에 깊이 파묻혀 지나가길 기다립니다. 안전하지만, 해를 받지 못해 광합성을 못 했습니다. 영양가 50 감소.', effects: { nutri: [-50, -50] }, tone: 'bad' },
    ],
  },
  {
    id: 'dung',
    title: '따뜻한 거름씨의 방문',
    speaker: '거름',
    message: '"안녕 꼬마 감자야! 요즘 흙 속의 양분이 몸에 골고루 잘 스며들고 있니?" 인자하고 구수한 거름씨가 다가와 감자의 영양 상태를 조심스레 챙겨줍니다.',
    image: '/assets/original/dung1.png',
    choices: [
      { id: 'dung_deal', label: '상태를 솔직히 말한다', result: '', effects: {}, tone: 'good' },
      { id: 'dung_ignore', label: '바쁘다며 대화를 피한다', result: '"계획 짜느라 좀 바빠요, 나중에 봐요!" 대화를 피한 채 쌀쌀맞게 굴어 거름씨가 상처를 받고 다른 채소에게 가버립니다.', effects: {}, tone: 'bad' },
    ],
  },
  {
    id: 'shower',
    title: '여름날의 시원한 소나기',
    speaker: '먹구름',
    message: '"쏴아아아-!" 갑자기 먹구름이 밭을 덮더니 시원하고 상쾌한 여름 소나기가 세차게 대지를 적시기 시작합니다!',
    image: 'rain',
    choices: [
      { id: 'shower_drink', label: '빗물을 맘껏 들이켠다', result: '"캬아, 목마르던 참에 잘 됐다!" 빗물을 온몸으로 빨아들이며 마음껏 수분을 섭취해 몸집을 불렸으나 약간 말랑해졌습니다.', effects: { large: [30, 45], shape: [15, 25], hard: [-25, -15] }, tone: 'good' },
      { id: 'shower_hide', label: '흙더미 뒤로 피한다', result: '"비에 젖으면 모양새가 망가질 수 있어!" 단단한 돌멩이 뒤에 숨어 거센 비를 피하며 내실을 다집니다.', effects: { hard: [15, 25], regist: [15, 25] }, tone: 'good' },
    ],
  },
  {
    id: 'mole',
    title: '장난꾸러기 땅강아지',
    speaker: '땅강아지',
    message: '"헤이, 둥글둥글 감자 엉덩이 터치!" 장난기 가득한 땅강아지가 땅속에서 툭 튀어나와 엉덩이를 간지럽히며 메롱을 하고 달아납니다!',
    image: '/assets/original/landdog.png',
    choices: [
      { id: 'mole_chase', label: '화를 내며 쫓아낸다', result: '"거기 서! 장난이 너무 지나치잖아!" 화를 내며 땅강아지를 끝까지 추격해 쫓아냈으나, 흙에 부딪혀 약간의 상처가 생겼습니다.', effects: { hard: [25, 40], gram: [-25, -15] }, tone: 'good' },
      { id: 'mole_roll', label: '뒹굴러서 구멍을 메운다', result: '"히히, 간지러워라! 나도 데굴데굴~" 같이 땅바닥을 뒹굴거리며 헤집어놓은 구멍들을 메워 밭을 정돈했습니다.', effects: { shape: [20, 30], nutri: [15, 25] }, tone: 'good' },
    ],
  },
  {
    id: 'pebble',
    title: '반짝이는 꼬마 돌멩이',
    speaker: '꼬마 돌',
    message: '"저기... 혹시 심심하지 않아? 같이 얘기 나누자!" 흙 속 깊은 곳에 묻혀있던, 작고 단단하게 반짝이는 꼬마 돌멩이가 수줍게 인사를 해옵니다.',
    image: '/assets/original/stone.png',
    choices: [
      { id: 'pebble_hard', label: '돌 옆에서 굳건히 버티기', result: '"오, 정말 단단하고 멋진 돌이네! 옆에 붙어있어야지." 돌멩이의 기운을 빌려 몸을 굳건히 세웠으나 눌림 흔적이 남았습니다.', effects: { hard: [35, 55], shape: [-15, -5] }, tone: 'good' },
      { id: 'pebble_hug', label: '돌멩이를 조심스레 품기', result: '"작고 귀엽구나, 내가 안아줄게!" 돌멩이를 폭 안아주며 흙 속의 따뜻한 온기와 영양을 고스란히 섭취했습니다.', effects: { nutri: [25, 45], regist: [15, 25] }, tone: 'good' },
    ],
  },
  {
    id: 'fertilizer',
    title: '농부의 특제 무공해 비료',
    speaker: '농부',
    message: '"요 녀석, 올해는 아주 실하게 영글어야 할 텐데!" 인자한 농부 할아버지가 콧노래를 부르며 특제 무공해 유기농 비료를 아낌없이 듬뿍 뿌려줍니다!',
    image: '/assets/original/dung2.png',
    choices: [
      { id: 'fer_eat_all', label: '비료를 욕심껏 다 삼킨다', result: '"와! 맛있는 양분이 잔뜩이다!" 비료를 폭풍 흡입하여 엄청난 속도로 무게와 몸집을 불렸지만 모양이 많이 망가졌습니다.', effects: { gram: [50, 75], large: [40, 60], shape: [-35, -20] }, tone: 'good' },
      { id: 'fer_eat_slow', label: '골고루 천천히 나누어 먹는다', result: '"천천히 꼭꼭 씹어 먹어야 체하지 않지!" 거름을 아껴가며 조심조심 고르게 섭취해 체력을 튼튼하게 다집니다.', effects: { nutri: [30, 45], regist: [30, 45], shape: [15, 25] }, tone: 'good' },
    ],
  },
  {
    id: 'moonlight',
    title: '보름달 밤의 차가운 정취',
    speaker: '보름달',
    message: '"조용한 밤, 감자야 잘 자렴..." 은은하고 차가운 보름달이 푸른 달빛의 커튼을 밭 전체에 포근하게 내려줍니다.',
    image: '/assets/original/moon.png',
    choices: [
      { id: 'moon_meditate', label: '달빛 아래 명상하기', result: '"달빛을 호흡하며 차분하게 정신일도..." 조용히 달빛 샤워를 하며 마음과 겉모양을 정갈하게 정돈했습니다.', effects: { regist: [25, 35], shape: [25, 35] }, tone: 'good' },
      { id: 'moon_sleep', label: '포근하게 꿀잠 자기', result: '"쿨쿨쿨... 밤에는 푹 자야 건강하지!" 폭신한 흙 침대에 누워 포근하게 꿀잠을 자며 피로를 풀었습니다.', effects: { hard: [25, 35], nutri: [25, 35] }, tone: 'good' },
    ],
  },
  {
    id: 'carrot',
    title: '옆자리 도라지의 방문',
    speaker: '도라지',
    message: '"감자야! 오늘 날씨도 좋은데 흙 속에서 달리기 한판 어때?" 활기찬 이웃집 꼬마 도라지가 엉덩이를 흔들며 같이 운동하자고 달려옵니다!',
    image: '/assets/original/doraji.png',
    choices: [
      { id: 'carrot_stretch', label: '도라지와 함께 스트레칭', result: '"좋아! 으라차차 스트레칭 시작!" 도라지와 손을 맞잡고 쭉쭉 늘려 몸 크기와 밸런스를 가꿨습니다.', effects: { large: [25, 35], shape: [25, 35] }, tone: 'good' },
      { id: 'carrot_talk', label: '밤새 수다 떨며 놀기', result: '"운동보단 수다가 최고지! 오늘 밤샘 토크 고?" 밤새 밭에 사는 벌레들 이야기로 꽃을 피우며 신나게 노닥거려 무게가 늘었지만 조금 피곤해졌습니다.', effects: { gram: [30, 45], regist: [-15, -5] }, tone: 'good' },
    ],
  },

  // ── 고구마 추가 이벤트 (sweetpotato.png) ──
  {
    id: 'sweet2',
    title: '고구마의 영양 레시피',
    speaker: '고구마',
    message: '"이봐, 감자! 나한테 특별 영양 흡수 비법이 있어. 우리 밭에서 제일 알찬 채소가 되는 비결이지!" 고구마가 주황빛 몸을 자랑스레 내밀며 비법을 전수해주겠다고 합니다.',
    image: '/assets/original/sweetpotato.png',
    choices: [
      { id: 'sweet2_learn', label: '비법을 배운다', result: '"고마워, 덕분에 영양 흡수가 확 달라졌어!" 고구마의 비법대로 영양 흡수 루틴을 바꿔 영양가와 면역력이 크게 올랐습니다.', effects: { nutri: [35, 50], regist: [20, 30] }, tone: 'good' },
      { id: 'sweet2_refuse', label: '필요 없다고 한다', result: '"훗, 그래 나중에 후회하지 마." 고구마의 제안을 거절했습니다. 하지만 내 방식대로 하는 것도 나쁘지 않습니다.', effects: { hard: [10, 20] }, tone: 'bad' },
    ],
  },
  {
    id: 'sweet3',
    title: '고구마의 씨앗 선물',
    speaker: '고구마',
    message: '"저기, 우리 씨앗 나눌까? 같이 심으면 밭이 풍성해질 텐데!" 고구마가 조그만 씨앗 꾸러미를 내밀며 수줍게 제안합니다.',
    image: '/assets/original/sweetpotato.png',
    choices: [
      { id: 'sweet3_accept', label: '씨앗을 받아 심는다', result: '"와, 고마워! 같이 심으니 밭이 더 기름져졌어!" 씨앗을 함께 심자 흙 속의 영양이 풍부해져 무게와 크기가 늘었습니다.', effects: { gram: [30, 45], large: [20, 30] }, tone: 'good' },
      { id: 'sweet3_decline', label: '정중히 거절한다', result: '"아, 그래... 그럼 나 혼자 심을게." 씨앗을 거절하자 고구마가 쓸쓸히 돌아갑니다. 별다른 변화는 없었지만 왠지 아쉬운 기분입니다.', effects: {}, tone: 'bad' },
    ],
  },
  {
    id: 'sweet4',
    title: '고구마와 영양 대결',
    speaker: '고구마',
    message: '"두고 봐! 누가 더 알찬 채소인지 한번 겨뤄보자고!" 고구마가 두 팔을 걷어붙이며 영양 대결을 선언합니다. 과연 감자가 이길 수 있을까요?',
    image: '/assets/original/sweetpotato.png',
    choices: [
      { id: 'sweet4_fight', label: '대결을 받아들인다', result: '"지지 않아!" 최선을 다해 맞붙었으나 고구마의 단 맛에 밀려 약간 주눅이 들었습니다. 하지만 오기가 생겨 단단함이 올랐습니다.', effects: { hard: [30, 45], nutri: [-20, -10] }, tone: 'good' },
      { id: 'sweet4_retreat', label: '슬쩍 자리를 피한다', result: '"아, 오늘은 좀 바빠서..." 대결을 피해 조용히 흙 속으로 숨었습니다. 체면이 좀 구겨졌지만 모양은 멀쩡합니다.', effects: { shape: [10, 20] }, tone: 'bad' },
    ],
  },
  {
    id: 'sweet5',
    title: '울고 있는 고구마',
    speaker: '고구마',
    message: '"으앙... 밭에서 제일 못난 채소래..." 옆자리 고구마가 눈물을 뚝뚝 흘리며 울고 있습니다. 누군가에게 상처를 받은 모양입니다.',
    image: '/assets/original/sweetpotato.png',
    choices: [
      { id: 'sweet5_comfort', label: '따뜻하게 위로한다', result: '"괜찮아, 넌 충분히 예쁜 고구마야!" 고구마를 진심으로 위로해줬습니다. 따뜻한 마음이 흘러들어 면역력과 모양이 올랐습니다.', effects: { regist: [25, 35], shape: [20, 30] }, tone: 'good' },
      { id: 'sweet5_ignore', label: '모른 척 넘어간다', result: '"저도 바쁜데..." 고구마의 울음소리를 외면하고 지나쳤습니다. 조금 미안하지만 성장에 집중하기로 했습니다.', effects: { gram: [10, 20] }, tone: 'bad' },
    ],
  },

  // ── 돌멩이 추가 이벤트 (stone.png) ──
  {
    id: 'pebble2',
    title: '굴러오는 돌멩이',
    speaker: '돌멩이',
    message: '"두구두구두구..." 경사진 밭에서 돌멩이가 빠른 속도로 굴러오고 있습니다! 빗물에 쓸려 내려오는 것 같은데, 피할까요 막을까요?',
    image: '/assets/original/stone.png',
    choices: [
      { id: 'pebble2_block', label: '몸으로 막아낸다', result: '"내가 막아주지!" 돌멩이의 충격을 단단한 몸으로 버텨냈습니다. 흠집이 좀 났지만 단단함이 크게 올랐습니다.', effects: { hard: [40, 55], shape: [-20, -10] }, tone: 'good' },
      { id: 'pebble2_dodge', label: '재빨리 옆으로 피한다', result: '"잠깐만!" 민첩하게 피해 돌멩이가 지나가게 했습니다. 크기와 모양은 유지됐습니다.', effects: { large: [10, 20], shape: [10, 20] }, tone: 'good' },
    ],
  },
  {
    id: 'pebble3',
    title: '햇빛을 모으는 돌멩이',
    speaker: '반짝돌',
    message: '"반짝반짝~" 수정처럼 투명한 돌멩이가 햇빛을 모아 감자 쪽으로 빛을 집중시키고 있습니다. 따뜻한 빛이 온몸을 포근하게 감쌉니다.',
    image: '/assets/original/stone.png',
    choices: [
      { id: 'pebble3_bask', label: '빛을 온몸으로 받는다', result: '"따뜻해라!" 집중된 햇빛을 받아 광합성 효율이 높아져 영양가와 면역력이 크게 올랐습니다.', effects: { nutri: [35, 50], regist: [25, 35] }, tone: 'good' },
      { id: 'pebble3_avoid', label: '너무 뜨거워 피한다', result: '"조금 강렬한 걸..." 빛이 너무 강해 피했습니다. 돌멩이가 아쉬워하며 빛을 끕니다.', effects: { hard: [15, 25] }, tone: 'bad' },
    ],
  },
  {
    id: 'pebble4',
    title: '돌멩이 아래의 비밀',
    speaker: '흙 속 속삭임',
    message: '"스르르..." 이상하게 빛나는 돌멩이 아래에서 뭔가가 움직이는 것 같습니다. 작은 벌레인지, 숨겨진 영양분인지...?',
    image: '/assets/original/stone.png',
    choices: [
      { id: 'pebble4_dig', label: '조심스레 파본다', result: '"오!" 돌멩이 아래에서 영양분이 풍부한 미생물 덩어리를 발견했습니다! 무게와 영양가가 확 올랐습니다.', effects: { gram: [35, 50], nutri: [30, 40] }, tone: 'good' },
      { id: 'pebble4_pass', label: '그냥 지나친다', result: '"뭐가 있는 것 같기도 하고..." 괜히 건드렸다가 사고가 날 수 있으니 그냥 지나쳤습니다. 특별한 변화는 없었습니다.', effects: { regist: [10, 20] }, tone: 'bad' },
    ],
  },
  {
    id: 'pebble5',
    title: '돌멩이 굴리기 내기',
    speaker: '꼬마 돌',
    message: '"나 좀 굴려줄 수 있어? 심심하단 말이야!" 꼬마 돌멩이가 데굴데굴 구르고 싶어하며 부탁합니다. 같이 굴리면 재미있을 것 같은데요!',
    image: '/assets/original/stone.png',
    choices: [
      { id: 'pebble5_roll', label: '신나게 같이 굴린다', result: '"데굴데굴 신나라!" 돌멩이와 함께 빙글빙글 구르며 놀았습니다. 신나게 운동한 덕에 크기와 단단함이 늘었습니다.', effects: { large: [20, 30], hard: [20, 30] }, tone: 'good' },
      { id: 'pebble5_refuse', label: '무거워서 거절한다', result: '"미안, 나 좀 무거워..." 정중히 거절하자 돌멩이가 혼자 터벅터벅 굴러갑니다. 대신 그 자리에서 고요히 집중해 모양이 정돈됐습니다.', effects: { shape: [20, 30] }, tone: 'bad' },
    ],
  },

  // ── 보름달 추가 이벤트 (moon.png) ──
  {
    id: 'moon2',
    title: '달빛이 강해지는 밤',
    speaker: '보름달',
    message: '"오늘 밤은 달빛이 유독 강하구나..." 보름달이 평소보다 훨씬 강렬하게 빛나며 밭 전체를 환하게 비추고 있습니다. 식물들이 술렁거립니다.',
    image: '/assets/original/moon.png',
    choices: [
      { id: 'moon2_absorb', label: '달빛으로 광합성한다', result: '"밤에도 광합성이 된다고?!" 강렬한 달빛을 이용해 야간 광합성을 성공적으로 마쳤습니다. 영양가와 크기가 올랐습니다.', effects: { nutri: [30, 45], large: [20, 30] }, tone: 'good' },
      { id: 'moon2_sleep', label: '너무 밝아서 잠을 잔다', result: '"불 좀 꺼줘..." 달빛이 너무 밝아 잠을 설쳤지만, 포근한 달빛 속에 누워 단단함은 조금 올랐습니다.', effects: { hard: [15, 25], regist: [-10, -5] }, tone: 'bad' },
    ],
  },
  {
    id: 'moon3',
    title: '달무리가 생긴 밤',
    speaker: '보름달',
    message: '"오늘 밤은 달무리가 생겼구나... 무언가 좋은 일이 생길 징조일지도." 보름달 주변에 신비로운 빛의 고리가 생겼습니다. 달이 속삭입니다.',
    image: '/assets/original/moon.png',
    choices: [
      { id: 'moon3_meditate', label: '달무리 아래 명상한다', result: '"신비로운 에너지가..." 달무리의 특별한 에너지를 받아 모양과 면역력이 고르게 올랐습니다.', effects: { shape: [30, 42], regist: [30, 42] }, tone: 'good' },
      { id: 'moon3_burrow', label: '불길해서 흙 속으로 간다', result: '"왠지 무섭잖아..." 달무리가 불길하게 느껴져 흙 속 깊이 파고들었습니다. 안전하지만 기회를 놓쳤습니다.', effects: { gram: [10, 20] }, tone: 'bad' },
    ],
  },
  {
    id: 'moon4',
    title: '달이 이야기를 건넨다',
    speaker: '보름달',
    message: '"나는 매달 모양이 바뀌지만 언제나 같은 나야. 너도 그렇게 자라렴." 보름달이 조용한 달빛으로 감자에게 이야기를 건넵니다.',
    image: '/assets/original/moon.png',
    choices: [
      { id: 'moon4_listen', label: '달의 말을 귀 기울여 듣는다', result: '"...고마워, 달아." 달의 이야기에서 성장의 의미를 깨달았습니다. 모든 능력치가 골고루 조금씩 성장했습니다.', effects: { gram: [12, 18], large: [12, 18], shape: [12, 18], nutri: [12, 18], regist: [12, 18], hard: [12, 18] }, tone: 'good' },
      { id: 'moon4_ignore', label: '달이 말을 하다니 무섭다', result: '"으...달이 말을 해?" 달의 말이 무서워 귀를 막았습니다. 달이 조용해졌고 평범한 밤이 됐습니다.', effects: { hard: [15, 25] }, tone: 'bad' },
    ],
  },
  {
    id: 'moon5',
    title: '구름에 가린 달',
    speaker: '보름달',
    message: '"잠깐... 구름이 나를 가리네." 환했던 보름달이 두꺼운 구름에 가려졌습니다. 어두워진 밭에서 감자는 무엇을 해야 할지 고민합니다.',
    image: '/assets/original/moon.png',
    choices: [
      { id: 'moon5_wait', label: '구름이 걷힐 때까지 기다린다', result: '"이윽고 달이 다시 나타났어!" 꾹 참고 기다리자 구름이 걷히고 달빛이 다시 쏟아졌습니다. 단단함과 면역력이 올랐습니다.', effects: { hard: [25, 35], regist: [25, 35] }, tone: 'good' },
      { id: 'moon5_sleep2', label: '어두우니 일찍 잔다', result: '"이런 날은 일찍 자는 게 최고지." 어둠을 틈타 일찍 잠들어 충분한 휴식을 취했습니다. 무게와 영양가가 늘었습니다.', effects: { gram: [20, 30], nutri: [20, 30] }, tone: 'good' },
    ],
  },

  // ── 거름 추가 이벤트 (dung1.png) ──
  {
    id: 'dung2',
    title: '진한 거름 냄새',
    speaker: '거름씨',
    message: '"오늘은 특별히 진한 냄새가 나는 퇴비를 갖고 왔어! 냄새는 좀 독하지만 효과는 최고라구!" 거름씨가 강렬한 냄새의 퇴비를 흔들며 자랑합니다.',
    image: '/assets/original/dung1.png',
    choices: [
      { id: 'dung2_absorb', label: '참고 영양분을 흡수한다', result: '"으윽... 하지만 효과는 진짜야!" 냄새를 참고 퇴비를 흡수했습니다. 영양가와 무게가 크게 올랐습니다.', effects: { nutri: [45, 60], gram: [30, 40] }, tone: 'good' },
      { id: 'dung2_refuse', label: '냄새가 너무 심해 거절한다', result: '"미안, 오늘은 패스..." 냄새를 못 참고 거절했습니다. 거름씨가 무안해하며 돌아갑니다.', effects: { shape: [10, 20] }, tone: 'bad' },
    ],
  },
  {
    id: 'dung3',
    title: '거름씨의 맞춤 처방',
    speaker: '거름씨',
    message: '"너 얼굴을 보니까 단단함이 좀 부족한 것 같은데? 내가 딱 맞는 특제 미네랄 처방을 해줄게!" 거름씨가 꼼꼼히 살펴보더니 처방전을 꺼냅니다.',
    image: '/assets/original/dung1.png',
    choices: [
      { id: 'dung3_accept', label: '처방을 받아들인다', result: '"오, 역시 전문가!" 맞춤 미네랄 처방을 받아 단단함과 면역력이 크게 올랐습니다.', effects: { hard: [40, 55], regist: [30, 40] }, tone: 'good' },
      { id: 'dung3_self', label: '스스로 해결하겠다고 한다', result: '"저는 제 방식이 있어요!" 처방을 거부하고 혼자 해결하기로 했습니다. 오기가 생겨 모양이 정돈됐습니다.', effects: { shape: [20, 30] }, tone: 'bad' },
    ],
  },
  {
    id: 'dung4',
    title: '오래된 거름 더미 발견',
    speaker: '흙 속 냄새',
    message: '"...음? 여기 오래된 거름 더미가 묻혀있네." 흙 속에서 오래전에 묻힌 낡은 거름 더미를 발견했습니다. 냄새는 덜하지만 영양이 농축돼 있을지도 모릅니다.',
    image: '/assets/original/dung1.png',
    choices: [
      { id: 'dung4_eat', label: '조심히 흡수해본다', result: '"오래됐지만 영양은 그대로네!" 숙성된 거름에서 농축된 영양분을 흡수해 영양가와 무게가 크게 올랐습니다.', effects: { nutri: [50, 65], gram: [25, 35] }, tone: 'good' },
      { id: 'dung4_skip', label: '오래된 것 같아 포기한다', result: '"좀 찜찜한데..." 오래된 거름이라 혹시 모를 독성이 걱정돼 포기했습니다. 현명한 판단이었습니다.', effects: { regist: [15, 25] }, tone: 'bad' },
    ],
  },
  {
    id: 'dung5',
    title: '거름씨의 제안',
    speaker: '거름씨',
    message: '"우리 서로 교환 어때? 나한테 흙을 좀 나눠주면 내가 특급 영양분을 줄게!" 거름씨가 물물교환을 제안합니다. 나쁜 거래는 아닌 것 같습니다.',
    image: '/assets/original/dung1.png',
    choices: [
      { id: 'dung5_trade', label: '교환을 수락한다', result: '"좋아, 교환하자!" 흙을 나눠준 대가로 고농도 영양분을 받았습니다. 크기가 약간 줄었지만 영양가가 크게 올랐습니다.', effects: { nutri: [55, 70], large: [-20, -10] }, tone: 'good' },
      { id: 'dung5_refuse', label: '교환을 거절한다', result: '"내 흙은 소중해!" 교환을 거절하고 흙을 지켰습니다. 거름씨가 아쉬워하며 돌아갑니다.', effects: { hard: [15, 25] }, tone: 'bad' },
    ],
  },

  // ── 도라지 추가 이벤트 (doraji.png) ──
  {
    id: 'doraji2',
    title: '도라지의 모양 비법',
    speaker: '도라지',
    message: '"나처럼 예쁜 모양을 갖고 싶지 않아? 사실 비법이 있거든." 도라지가 파란 꽃잎을 가다듬으며 모양 관리 비법을 공유하겠다고 합니다.',
    image: '/assets/original/doraji.png',
    choices: [
      { id: 'doraji2_learn', label: '비법을 배운다', result: '"오, 이렇게 하면 되는 거야?" 도라지의 모양 관리 비법을 실천해 모양이 크게 좋아지고 크기도 늘었습니다.', effects: { shape: [40, 55], large: [20, 30] }, tone: 'good' },
      { id: 'doraji2_own', label: '내 방식이 있다고 한다', result: '"나는 나만의 스타일이 있어." 도라지의 제안을 거절하고 내 방식을 고수했습니다. 단단함이 조금 올랐습니다.', effects: { hard: [15, 25] }, tone: 'bad' },
    ],
  },
  {
    id: 'doraji3',
    title: '도라지와 크기 대결',
    speaker: '도라지',
    message: '"어디 한번 봐봐, 내가 더 크지?" 도라지가 폼 나게 몸을 쭉 뻗어 키를 재자고 합니다. 과연 감자가 더 클까요?',
    image: '/assets/original/doraji.png',
    choices: [
      { id: 'doraji3_compete', label: '키 대결을 한다', result: '"으라차차!" 최선을 다해 크기를 키웠습니다. 대결 덕분에 크기와 모양이 좋아졌습니다.', effects: { large: [35, 48], shape: [20, 30] }, tone: 'good' },
      { id: 'doraji3_yield', label: '도라지가 더 크다고 인정한다', result: '"넌 진짜 크구나..." 도라지의 크기에 감탄하며 양보했습니다. 대신 면역력을 키우는 데 집중했습니다.', effects: { regist: [25, 35] }, tone: 'bad' },
    ],
  },
  {
    id: 'doraji4',
    title: '아픈 도라지',
    speaker: '도라지',
    message: '"저기... 나 오늘 좀 힘드네. 흙이 너무 건조해서 뿌리가 아파." 평소에는 도도했던 도라지가 시들시들한 모습으로 도움을 요청합니다.',
    image: '/assets/original/doraji.png',
    choices: [
      { id: 'doraji4_help', label: '물기를 나눠준다', result: '"고마워, 덕분에 살았어!" 수분을 나눠줘 도라지가 되살아났습니다. 보답으로 면역력 비법을 알려줘 면역력이 크게 올랐습니다.', effects: { regist: [40, 55], shape: [-10, -5] }, tone: 'good' },
      { id: 'doraji4_ignore', label: '모른 척한다', result: '"나도 바쁜걸..." 도라지를 외면하고 지나쳤습니다. 찜찜하지만 내 성장에 집중했습니다.', effects: { gram: [15, 25] }, tone: 'bad' },
    ],
  },

  // ── 지렁이 추가 이벤트 (worm1.png) ──
  {
    id: 'worm2',
    title: '지렁이의 흙길 공사',
    speaker: '지렁이',
    message: '"흠흠, 새 흙길을 뚫어줄게! 뿌리가 더 깊이 내려갈 수 있도록!" 지렁이가 꿈틀꿈틀 땅을 파며 감자를 위한 통로를 만들어 주겠다고 합니다.',
    image: '/assets/original/worm1.png',
    choices: [
      { id: 'worm2_use', label: '감사히 이용한다', result: '"오, 뿌리가 쑥쑥 내려가!" 지렁이가 뚫어준 길을 따라 뿌리가 깊이 내려가 무게와 크기가 크게 올랐습니다.', effects: { gram: [35, 50], large: [25, 35] }, tone: 'good' },
      { id: 'worm2_decline', label: '필요 없다고 한다', result: '"아, 괜찮아요..." 지렁이의 제안을 거절했습니다. 지렁이가 서운해하며 다른 곳으로 갑니다.', effects: { hard: [10, 20] }, tone: 'bad' },
    ],
  },
  {
    id: 'worm3',
    title: '지렁이 달리기 경주',
    speaker: '지렁이',
    message: '"꿈틀꿈틀 달리기 시합 어때? 흙 속 100m 경주야!" 지렁이가 의외로 진지한 표정으로 달리기 시합을 제안합니다. 과연 감자가 따라갈 수 있을까요?',
    image: '/assets/original/worm1.png',
    choices: [
      { id: 'worm3_race', label: '시합에 참가한다', result: '"꿈틀꿈틀!" 지렁이와 함께 흙 속을 누비며 경주를 펼쳤습니다. 모양이 좀 흐트러졌지만 크기와 단단함이 올랐습니다.', effects: { large: [30, 40], hard: [25, 35], shape: [-15, -5] }, tone: 'good' },
      { id: 'worm3_decline', label: '사양한다', result: '"나는 달리기를 잘 못해서..." 경주를 사양하고 제자리에서 꾸준히 성장했습니다. 영양가가 조금 올랐습니다.', effects: { nutri: [15, 25] }, tone: 'bad' },
    ],
  },
  {
    id: 'worm4',
    title: '지렁이의 영양 선물',
    speaker: '지렁이',
    message: '"내가 먹은 낙엽이랑 흙을 소화한 거야. 최고급 영양 선물이라구!" 지렁이가 정성스럽게 만든 영양 덩어리를 선물로 내밀며 수줍어합니다.',
    image: '/assets/original/worm1.png',
    choices: [
      { id: 'worm4_accept', label: '감사히 받는다', result: '"와, 고마워 지렁아!" 지렁이가 준 영양 덩어리를 흡수해 영양가와 무게가 올랐습니다.', effects: { nutri: [40, 55], gram: [30, 40] }, tone: 'good' },
      { id: 'worm4_refuse', label: '지렁이가 먹은 거라 망설인다', result: '"음... 솔직히 좀..." 지렁이의 선물을 거절했습니다. 지렁이가 눈물을 보이며 자기 것 먹으러 갑니다.', effects: { regist: [10, 20] }, tone: 'bad' },
    ],
  },
  {
    id: 'worm5',
    title: '지렁이 무리의 습격',
    speaker: '지렁이 무리',
    message: '"꿈틀꿈틀꿈틀!" 갑자기 수십 마리의 지렁이 무리가 밭을 가득 채우며 몰려왔습니다! 다들 배가 고픈 모양입니다.',
    image: '/assets/original/worm1.png',
    choices: [
      { id: 'worm5_share', label: '흙을 나눠주며 달랜다', result: '"먹어, 먹어!" 지렁이들에게 흙을 나눠주며 달래자 지렁이들이 고마워하며 도로 파고 들어갔습니다. 면역력이 올랐습니다.', effects: { regist: [30, 45], gram: [-15, -5] }, tone: 'good' },
      { id: 'worm5_harden', label: '단단하게 버텨낸다', result: '"내 자리다!" 껍질을 단단하게 굳혀 지렁이들의 습격을 버텨냈습니다. 단단함이 크게 올랐지만 모양이 좀 뒤틀렸습니다.', effects: { hard: [40, 55], shape: [-20, -10] }, tone: 'good' },
    ],
  },

  // ── 땅강아지 추가 이벤트 (landdog.png) ──
  {
    id: 'landdog2',
    title: '땅강아지의 터널 선물',
    speaker: '땅강아지',
    message: '"나 터널 파는 건 자신 있거든! 네 뿌리 밑에 터널 파줄까? 물 빠짐도 좋아지고 공기도 잘 통할 거야!" 땅강아지가 날카로운 앞발로 파보는 시늉을 합니다.',
    image: '/assets/original/landdog.png',
    choices: [
      { id: 'landdog2_accept', label: '터널을 파달라고 한다', result: '"오, 숨쉬기 편해졌어!" 땅강아지가 뚫어준 터널 덕분에 통기성이 좋아져 면역력과 영양가가 올랐습니다.', effects: { regist: [30, 42], nutri: [25, 35] }, tone: 'good' },
      { id: 'landdog2_refuse', label: '뿌리가 다칠까봐 거절한다', result: '"조심히 거절할게..." 뿌리가 다칠 것을 우려해 거절했습니다. 땅강아지가 이해하며 다른 밭으로 갑니다.', effects: { hard: [15, 25] }, tone: 'bad' },
    ],
  },
  {
    id: 'landdog3',
    title: '땅강아지 레슬링 대회',
    speaker: '땅강아지',
    message: '"자, 흙바닥 레슬링 시합이다! 3초 안에 상대를 쓰러뜨리면 이기는 거야!" 땅강아지가 이두박근을 과시하며 레슬링 대회를 선언합니다.',
    image: '/assets/original/landdog.png',
    choices: [
      { id: 'landdog3_wrestle', label: '레슬링을 한다', result: '"이얍!" 온 힘을 다해 겨뤘습니다. 지긴 했지만 전력을 다한 덕에 단단함과 무게가 올랐습니다.', effects: { hard: [35, 50], gram: [20, 30], shape: [-15, -5] }, tone: 'good' },
      { id: 'landdog3_dodge', label: '영리하게 피한다', result: '"레슬링보다는 두뇌 싸움이지." 레슬링 대신 땅강아지를 요리조리 피해 면역력을 길렀습니다.', effects: { regist: [25, 35], shape: [15, 25] }, tone: 'good' },
    ],
  },
  {
    id: 'landdog4',
    title: '땅강아지의 돌 선물',
    speaker: '땅강아지',
    message: '"이거 내가 아끼던 건데... 너한테 줄게. 단단해지는 데 도움이 될 거야." 땅강아지가 반짝이는 작은 돌을 조심스레 내밀며 선물합니다.',
    image: '/assets/original/landdog.png',
    choices: [
      { id: 'landdog4_accept', label: '소중히 받는다', result: '"고마워, 땅강아지야!" 돌을 곁에 두자 신기하게도 단단함이 크게 올랐습니다. 게다가 면역력도 덩달아 올랐습니다.', effects: { hard: [45, 60], regist: [25, 35] }, tone: 'good' },
      { id: 'landdog4_polite', label: '괜찮다며 사양한다', result: '"아니야, 네가 가져." 선물을 정중히 돌려줬습니다. 땅강아지가 감사해하며 앞발로 땅을 갈아줬습니다. 영양가가 올랐습니다.', effects: { nutri: [25, 35] }, tone: 'good' },
    ],
  },
]



function maybeCreateEvent(state: GameState): ActiveEvent | null {
  if (state.day < 8 || state.day >= HARVEST_RUSH_TURN) return null
  if (state.day - state.lastEventTurn < 9) return null
  if (Math.random() > 0.24) return null

  const candidates = EVENT_POOL.filter((event) => (state.eventSeen[event.id] ?? 0) < 2)
  if (candidates.length === 0) return null

  const topStats = getTopStats(state.stats)
  const weighted = candidates.filter((event) => {
    if (event.id === 'worm') return state.stats.gram >= 230 || topStats[0] === 'nutri'
    if (event.id === 'landdog') return state.stats.large >= 230 || state.stats.hard >= 170
    return true
  })

  return pickRandom(weighted.length > 0 ? weighted : candidates)
}

function advanceTurn(prev: GameState): GameState {
  if (prev.screen !== 'game' || !prev.resolvingDay || prev.day >= TOTAL_TURNS) return prev

  const ticksPerDay = FAST_TEST_MODE ? FAST_TICKS_PER_DAY : NORMAL_TICKS_PER_DAY
  const now = Date.now()
  const touchCombo = getDecayedTouchCombo(prev, now)
  const speedMultiplier = getTouchSpeedMultiplier(touchCombo)
  const slot = getActivePlanSlot(prev.day, prev.unlockedSlotsCount)
  const nextDay = clamp(prev.day + speedMultiplier / ticksPerDay, 1, TOTAL_TURNS)
  const nextSlot = getActivePlanSlot(nextDay, prev.unlockedSlotsCount)
  const isNewSlot = slot !== nextSlot || Math.floor(prev.day) !== Math.floor(nextDay)
  const isNewDay = Math.floor(prev.day) !== Math.floor(nextDay)
  const nextWeekIndex = getWeekIndex(nextDay)
  const weekChanged = nextWeekIndex !== prev.weekIndex
  const weekFocusStat = weekChanged ? getRandomStat() : prev.weekFocusStat

  const skill = getSkill(prev.plan[slot])
  const harvestStarted = prev.day >= HARVEST_RUSH_TURN
  const harvestFocus = prev.harvestFocus ?? (harvestStarted ? getTopStats(prev.stats)[0] : null)
  const isHarvestRush = prev.day >= HARVEST_RUSH_TURN
  const multiplier = isHarvestRush ? 1.75 : 0.42
  const clearBonusMultiplier = getClearBonusGrowthMultiplier(prev.bonus)

  // Get active combo to apply growth bonus
  const activeCombo = getActiveCombo(prev.plan, prev.unlockedSlotsCount)
  const statMultipliers: Record<StatKey, number> = {
    gram: 1, large: 1, shape: 1, nutri: 1, regist: 1, hard: 1
  }
  if (activeCombo) {
    activeCombo.boostedStats.forEach((key) => {
      statMultipliers[key] *= activeCombo.multiplier
    })
  }

  const nextStats = { ...prev.stats }
  if (skill) {
    for (const key of STAT_KEYS) {
      const range = skill.ranges[key]
      if (range) {
        const tickDelta = (randomInt(range[0], range[1]) * multiplier) / ticksPerDay
        const weeklyMultiplier = key === prev.weekFocusStat && tickDelta > 0 ? 2.50 : 1
        const solarAfternoonMultiplier = (skill.action === 'solar' && slot === 'afternoon' && tickDelta > 0) ? 1.50 : 1
        const appliedMultiplier = tickDelta > 0
          ? statMultipliers[key] * weeklyMultiplier * solarAfternoonMultiplier * clearBonusMultiplier
          : 1
        nextStats[key] = clamp(nextStats[key] + tickDelta * appliedMultiplier, 0, 1600)
      }
    }
  } else {
    for (const key of STAT_KEYS) {
      const tickDelta = randomInt(0, 2) / ticksPerDay
      nextStats[key] = clamp(nextStats[key] + tickDelta * statMultipliers[key] * clearBonusMultiplier, 0, 1600)
    }
  }

  if (isHarvestRush && harvestFocus) {
    const tickDelta = randomInt(3, 8) / ticksPerDay
    nextStats[harvestFocus] = clamp(nextStats[harvestFocus] + tickDelta * statMultipliers[harvestFocus] * clearBonusMultiplier, 0, 1600)
  }

  const reachedEnding = nextDay >= TOTAL_TURNS
  const endingState = { ...prev, day: nextDay, stats: nextStats, harvestFocus }
  const endingResult = reachedEnding ? pickEnding(endingState) : null
  // 도감 등록(unlock)은 광고 시청 성공 후에만 수행한다 — unlockCurrentEnding() 참고
  const unlockedEndingIds = prev.unlockedEndingIds
  const endingSeenCount = prev.endingSeenCount

  const shouldUpdateLog = isNewSlot || reachedEnding
  const baseNext: GameState = {
    ...prev,
    day: nextDay,
    stats: nextStats,
    screen: endingResult ? 'harvest' : prev.screen,
    activeEvent: endingResult ? null : prev.activeEvent,
    currentEnding: endingResult ?? prev.currentEnding,
    unlockedEndingIds,
    weekIndex: nextWeekIndex,
    weekFocusStat,
    endingSeenCount,
    lastEndingId: endingResult?.endingId ?? prev.lastEndingId,
    actionPlayback: (skill && isNewSlot)
      ? { kind: skill.action, frames: buildActionFrames(getGrowthStage(prev.day), skill.action), frameIndex: 0, loopCount: 0 }
      : prev.actionPlayback,
    harvestFocus,
    bonus: getClearBonusCount(endingSeenCount, unlockedEndingIds),
    currentMessage: reachedEnding
      ? `수확 완료! 이번 감자는 "${endingResult?.title}" 엔딩으로 기록됐다.`
      : weekChanged
      ? `${nextWeekIndex}주차 추천 능력은 ${STAT_LABELS[weekFocusStat]}입니다. 맞는 육성을 고르면 더 크게 자랍니다.`
      : now < prev.messageLockedUntil
      ? prev.currentMessage
      : isNewDay
      ? `Day ${Math.floor(nextDay)} 시작. 현재 계획이 계속 진행됩니다.`
      : shouldUpdateLog
      ? (isHarvestRush
          ? '수확이 임박했다. 가장 강한 능력치에 운명의 가중치가 붙는다.'
          : skill
            ? getActionStatusMessage(slot, skill)
            : '감자가 조용히 자라고 있다. 계획을 채우면 성장 방향이 뚜렷해진다.')
      : prev.currentMessage,
    messageLockedUntil: reachedEnding || weekChanged
      ? now + 5000
      : prev.messageLockedUntil,
    eventLog: shouldUpdateLog
      ? [
          reachedEnding ? `엔딩 획득: ${endingResult?.title}` :
          skill ? `Turn ${Math.floor(nextDay)}: ${PLAN_LABELS[slot]} ${skill.name}` : `Turn ${Math.floor(nextDay)}: 자연 성장`,
          ...prev.eventLog,
        ].slice(0, 30)
      : prev.eventLog,
  }

  if (reachedEnding) {
    saveGameDirectly(baseNext)
    return baseNext
  }

  const event = !prev.activeEvent && isNewDay ? maybeCreateEvent(baseNext) : null
  if (!event) return baseNext

  return {
    ...baseNext,
    activeEvent: event,
    lastEventTurn: Math.floor(nextDay),
    currentMessage: `${event.title} 발생! 선택에 따라 성장 방향이 바뀐다.`,
    messageLockedUntil: now + 5000,
    eventLog: [`돌발 이벤트: ${event.title}`, ...baseNext.eventLog].slice(0, 30),
  }
}

type TimeTabsProps = {
  plan: GameState['plan']
  planCursor: number
  unlockedSlotsCount: number
  onSelectSlot: (index: number) => void
  comboClass: string
  lang: 'ko' | 'en'
}

function TimeTabs({ plan, planCursor, unlockedSlotsCount, onSelectSlot, comboClass, lang }: TimeTabsProps) {
  const t = (text: string) => translate(text, lang)
  return (
    <div className={`time-tabs ${comboClass}`} aria-label={t('오늘 계획')}>
      {PLAN_SLOTS.map((slot, index) => {
        const picked = getSkill(plan[slot])
        const isLocked = index >= unlockedSlotsCount
        const isActive = index === planCursor && !isLocked
        const isDone = Boolean(picked) && !isLocked

        return (
          <button
            key={slot}
            type="button"
            className={`time-tab-btn time-tab ${isActive ? 'is-active' : ''} ${isDone ? 'is-done' : ''} ${isLocked ? 'is-locked' : ''}`}
            onClick={() => !isLocked && onSelectSlot(index)}
            disabled={isLocked}
          >
            <span>{t(PLAN_LABELS[slot])}</span>
            {isLocked ? (
              <strong>🔒 {t('잠금')}</strong>
            ) : picked ? (
              <div className="slot-image-wrapper">
                <img src={picked.buttonImage} alt={t(picked.name)} className="slot-image" />
              </div>
            ) : (
              <strong>-</strong>
            )}
          </button>
        )
      })}
    </div>
  )
}


type ColorRgb = [number, number, number]

type SkyStop = {
  t: number
  top: ColorRgb
  mid: ColorRgb
  bottom: ColorRgb
  sunX: number
  sunY: number
  sunAlpha: number
  moonAlpha: number
  starAlpha: number
}

type FilterStop = {
  t: number
  brightness: number
  saturate: number
  sepia: number
  hue: number
}

const SKY_STOPS: SkyStop[] = [
  { t: 0.00, top: [34, 47, 93], mid: [93, 75, 124], bottom: [224, 142, 132], sunX: 66, sunY: 34, sunAlpha: 0.16, moonAlpha: 0.34, starAlpha: 0.36 },
  { t: 0.16, top: [126, 190, 231], mid: [255, 182, 139], bottom: [255, 232, 181], sunX: 64, sunY: 30, sunAlpha: 0.72, moonAlpha: 0.02, starAlpha: 0.02 },
  { t: 0.35, top: [120, 211, 245], mid: [190, 239, 255], bottom: [247, 255, 232], sunX: 76, sunY: 18, sunAlpha: 0.9, moonAlpha: 0, starAlpha: 0 },
  { t: 0.58, top: [141, 217, 244], mid: [253, 207, 151], bottom: [255, 240, 199], sunX: 72, sunY: 24, sunAlpha: 0.76, moonAlpha: 0, starAlpha: 0 },
  { t: 0.76, top: [120, 115, 206], mid: [238, 139, 177], bottom: [255, 188, 137], sunX: 68, sunY: 34, sunAlpha: 0.5, moonAlpha: 0.06, starAlpha: 0.08 },
  { t: 0.90, top: [22, 38, 86], mid: [56, 69, 129], bottom: [119, 104, 135], sunX: 76, sunY: 18, sunAlpha: 0.06, moonAlpha: 0.72, starAlpha: 0.58 },
  { t: 1.00, top: [34, 47, 93], mid: [93, 75, 124], bottom: [224, 142, 132], sunX: 66, sunY: 34, sunAlpha: 0.16, moonAlpha: 0.34, starAlpha: 0.36 },
]

const FILTER_STOPS: FilterStop[] = [
  { t: 0.00, brightness: 0.76, saturate: 0.88, sepia: 0.08, hue: 14 },
  { t: 0.16, brightness: 0.98, saturate: 1.06, sepia: 0.04, hue: 4 },
  { t: 0.35, brightness: 1.06, saturate: 1.08, sepia: 0, hue: 0 },
  { t: 0.58, brightness: 1.03, saturate: 1.1, sepia: 0.05, hue: -4 },
  { t: 0.76, brightness: 0.9, saturate: 1.2, sepia: 0.14, hue: -12 },
  { t: 0.90, brightness: 0.68, saturate: 0.88, sepia: 0.06, hue: 14 },
  { t: 1.00, brightness: 0.76, saturate: 0.88, sepia: 0.08, hue: 14 },
]

function getDayFraction(day: number): number {
  return ((day % 1) + 1) % 1
}

function easeInOut(t: number): number {
  return t * t * (3 - 2 * t)
}

function mixNumber(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function mixColor(a: ColorRgb, b: ColorRgb, t: number): ColorRgb {
  return [
    Math.round(mixNumber(a[0], b[0], t)),
    Math.round(mixNumber(a[1], b[1], t)),
    Math.round(mixNumber(a[2], b[2], t)),
  ]
}

function rgb(color: ColorRgb): string {
  return `rgb(${color[0]}, ${color[1]}, ${color[2]})`
}

function getInterpolatedStop<T extends { t: number }>(stops: T[], fraction: number): { from: T; to: T; mix: number } {
  for (let i = 0; i < stops.length - 1; i += 1) {
    const from = stops[i]
    const to = stops[i + 1]
    if (fraction >= from.t && fraction <= to.t) {
      return { from, to, mix: easeInOut((fraction - from.t) / (to.t - from.t)) }
    }
  }
  return { from: stops[0], to: stops[1], mix: 0 }
}

function getSkyStyle(day: number): React.CSSProperties {
  const { from, to, mix } = getInterpolatedStop(SKY_STOPS, getDayFraction(day))
  const top = mixColor(from.top, to.top, mix)
  const mid = mixColor(from.mid, to.mid, mix)
  const bottom = mixColor(from.bottom, to.bottom, mix)
  const sunX = mixNumber(from.sunX, to.sunX, mix)
  const sunY = mixNumber(from.sunY, to.sunY, mix)
  const sunAlpha = mixNumber(from.sunAlpha, to.sunAlpha, mix)
  const moonAlpha = mixNumber(from.moonAlpha, to.moonAlpha, mix)
  const starAlpha = mixNumber(from.starAlpha, to.starAlpha, mix)

  return {
    background: `
      radial-gradient(circle at ${sunX}% ${sunY}%, rgba(255, 244, 186, ${sunAlpha}) 0 6.2%, rgba(255, 214, 128, ${sunAlpha * 0.24}) 6.8%, transparent 8.8%),
      radial-gradient(circle at ${100 - sunX}% ${Math.max(10, sunY - 6)}%, rgba(255, 250, 220, ${moonAlpha}) 0 5.1%, rgba(205, 222, 255, ${moonAlpha * 0.2}) 5.8%, transparent 8%),
      radial-gradient(circle at 22% 26%, rgba(255,255,255, ${starAlpha}) 0 0.24%, transparent 0.5%),
      radial-gradient(circle at 42% 15%, rgba(255,255,255, ${starAlpha * 0.86}) 0 0.2%, transparent 0.45%),
      radial-gradient(circle at 64% 30%, rgba(255,255,255, ${starAlpha * 0.78}) 0 0.22%, transparent 0.5%),
      linear-gradient(180deg, ${rgb(top)} 0%, ${rgb(mid)} 50%, ${rgb(bottom)} 100%)
    `,
  }
}

function getStageFilter(day: number): string {
  const { from, to, mix } = getInterpolatedStop(FILTER_STOPS, getDayFraction(day))
  const brightness = mixNumber(from.brightness, to.brightness, mix)
  const saturate = mixNumber(from.saturate, to.saturate, mix)
  const sepia = mixNumber(from.sepia, to.sepia, mix)
  const hue = mixNumber(from.hue, to.hue, mix)

  return `brightness(${brightness.toFixed(3)}) saturate(${saturate.toFixed(3)}) sepia(${sepia.toFixed(3)}) hue-rotate(${hue.toFixed(1)}deg)`
}

function StatBoard({
  potatoName,
  stats,
  boostedStats,
  plan,
  unlockedSlotsCount,
  day,
  resolvingDay,
  harvestFocus,
  badStats,
  lang,
}: {
  potatoName: string
  stats: GameStats
  boostedStats: StatKey[]
  plan: GameState['plan']
  unlockedSlotsCount: number
  day: number
  resolvingDay: boolean
  harvestFocus: StatKey | null
  badStats?: Record<StatKey, boolean>
  lang: 'ko' | 'en'
}) {
  const t = (text: string) => translate(text, lang)
  const activeSlot = getActivePlanSlot(day, unlockedSlotsCount)
  const activeSkillId = plan[activeSlot]
  const activeSkill = activeSkillId ? getSkill(activeSkillId) || null : null
  const isHarvestRush = day >= HARVEST_RUSH_TURN

  return (
    <aside className="stat-board">
      <h2>&lt;{potatoName || t('귀여운 감자')}&gt;</h2>
      <ul>
        {STAT_KEYS.map((key) => {
          const val = stats[key]
          const formatted = val.toFixed(2)
          const dotIndex = formatted.indexOf('.')
          const integerPart = formatted.substring(0, dotIndex)
          const decimalPart = formatted.substring(dotIndex)

          let trend: 'increasing' | 'decreasing' | 'neutral' = 'neutral'
          let isBoosted = false

          if (resolvingDay) {
            if (isHarvestRush && harvestFocus === key) {
              trend = 'increasing'
              isBoosted = boostedStats.includes(key)
            } else if (activeSkill) {
              const range = activeSkill.ranges[key]
              if (range) {
                const avg = (range[0] + range[1]) / 2
                if (avg > 0) {
                  trend = 'increasing'
                  isBoosted = boostedStats.includes(key)
                } else if (avg < 0) {
                  trend = 'decreasing'
                }
              }
            } else {
              // Natural growth
              trend = 'increasing'
              isBoosted = boostedStats.includes(key)
            }
          } else {
            // When planning, calculate net avg from all planned skills for this slot count
            const plannedSkills = PLAN_SLOTS.slice(0, unlockedSlotsCount)
              .map((slot) => (plan[slot] ? getSkill(plan[slot]) : null))
              .filter(Boolean)

            let netAvg = 0
            const hasSkills = plannedSkills.length > 0
            if (hasSkills) {
              for (const s of plannedSkills) {
                if (s?.ranges[key]) {
                  netAvg += (s.ranges[key]![0] + s.ranges[key]![1]) / 2
                }
              }
            } else {
              netAvg = 1 // default natural growth is positive
            }

            if (netAvg < 0) {
              trend = 'decreasing'
            } else if (netAvg > 0) {
              trend = 'increasing'
              isBoosted = boostedStats.includes(key)
            }
          }

          const isTrendDecreasing = trend === 'decreasing'
          const isTrendBoosted = isBoosted && trend === 'increasing'

          const valueClass = isTrendBoosted
            ? 'is-boosted'
            : isTrendDecreasing
            ? 'is-decreasing'
            : ''

          return (
            <li key={key}>
              <span className="stat-label">
                {t(STAT_LABELS[key])}
                {badStats?.[key] && (
                  <img
                    src="/assets/original/bad_icon.png"
                    alt="Bad"
                    className="bad-stat-icon"
                  />
                )}
                {isTrendBoosted && !badStats?.[key] && (
                  <img
                    src="/assets/original/good_icon.png"
                    alt="Good"
                    className="good-stat-icon"
                  />
                )}
              </span>
              <strong>
                {isTrendBoosted && <span className="boost-indicator increase">▲</span>}
                {isTrendDecreasing && <span className="boost-indicator decrease">▼</span>}
                <span className={`stat-value ${valueClass}`}>
                  {integerPart}
                  <span className="stat-decimal">{decimalPart}</span>
                </span>
                <span className="stat-unit">{key === 'gram' ? ' g' : key === 'large' ? ' mm' : ` ${t('점')}`}</span>
              </strong>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}

type SkillButtonsProps = {
  plan: GameState['plan']
  disabled: boolean
  onSelect: (skillId: string) => void
  focusStat: StatKey
  lang: 'ko' | 'en'
}

function SkillButtons({ plan, disabled, onSelect, focusStat, lang }: SkillButtonsProps) {
  const t = (text: string) => translate(text, lang)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  return (
    <>
      {SKILLS.map((skill) => {
        const planned = Object.values(plan).includes(skill.id)
        const hasError = imageErrors[skill.id]
        const isRecommended = getPositiveStats(skill).includes(focusStat)

        return (
          <button
            key={skill.id}
            type="button"
            className={`legacy-skill ${skill.positionClass} ${planned ? 'is-selected' : ''} ${isRecommended ? 'is-recommended' : ''} ${hasError ? 'fallback-button' : ''}`}
            onClick={() => onSelect(skill.id)}
            disabled={disabled}
            title={`${t(skill.name)} (${t(ACTION_LABELS[skill.action])})`}
          >
            {isRecommended && (
              <span className="recommended-badge">{lang === 'ko' ? '추천★' : 'REC★'}</span>
            )}
            {hasError ? (
              <span className="fallback-text">{t(skill.name)}</span>
            ) : (
              <>
                <img
                  src={skill.buttonImage}
                  alt={t(skill.name)}
                  onError={() => {
                    setImageErrors((prev) => ({ ...prev, [skill.id]: true }))
                  }}
                />
                {lang === 'en' ? <span className="skill-en-overlay">{t(skill.name)}</span> : null}
              </>
            )}
          </button>
        )
      })}
    </>
  )
}

type EventPanelProps = {
  event: ActiveEvent | null
  onChoice: (eventId: string, choiceId: string) => void
  lang: 'ko' | 'en'
}

function EventPanel({ event, onChoice, lang }: EventPanelProps) {
  const dragStartRef = useRef<{ x: number; y: number } | null>(null)
  const dragSideRef = useRef<'left' | 'right' | null>(null)
  const [slideState, setSlideState] = useState<{ side: 'left' | 'right'; progress: number } | null>(null)

  if (!event) return null

  const t = (text: string) => translate(text, lang)

  const poolEvent = EVENT_POOL.find((e) => e.id === event.id)
  const image = event.image ?? poolEvent?.image
  const hasImage = Boolean(image)
  const activeEventId = event.id
  const leftChoice = event.choices[0]
  const rightChoice = event.choices[event.choices.length - 1]

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>): void {
    dragStartRef.current = { x: e.clientX, y: e.clientY }
    const target = e.target as Element
    if (target.closest('.swipe-choice-left')) dragSideRef.current = 'left'
    else if (target.closest('.swipe-choice-right')) dragSideRef.current = 'right'
    else dragSideRef.current = null
    setSlideState(null)
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>): void {
    if (!dragStartRef.current || !dragSideRef.current) return
    const dx = e.clientX - dragStartRef.current.x
    if (dx <= 0) { setSlideState(null); return }
    setSlideState({ side: dragSideRef.current, progress: Math.min(1, dx / 80) })
  }

  function handlePointerUp(e: React.PointerEvent<HTMLDivElement>): void {
    if (!dragStartRef.current) return
    const dx = e.clientX - dragStartRef.current.x
    const dy = e.clientY - dragStartRef.current.y
    const side = dragSideRef.current
    dragStartRef.current = null
    dragSideRef.current = null
    setSlideState(null)

    if (dx < 72 || Math.abs(dx) < Math.abs(dy) * 1.3) return
    const selected = side === 'left' ? leftChoice : side === 'right' ? rightChoice : null
    if (selected) onChoice(activeEventId, selected.id)
  }

  const leftProgress = slideState?.side === 'left' ? slideState.progress : 0
  const rightProgress = slideState?.side === 'right' ? slideState.progress : 0

  return (
    <div
      className={`event-panel ${hasImage ? 'has-image' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={t(event.title)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => { dragStartRef.current = null; dragSideRef.current = null; setSlideState(null) }}
    >
      {hasImage && (
        <div className={`event-image-container${image === 'rain' ? ' is-rain-effect' : ''}`}>
          {image === 'rain' ? (
            <div className="rain-effect" aria-hidden="true">
              {Array.from({ length: 18 }).map((_, i) => (
                <span
                  key={i}
                  className="rain-drop"
                  style={{
                    '--rain-left': `${(6 + i * 11.7) % 100}%`,
                    '--rain-delay': `${-((i * 0.23) % 1.45)}s`,
                    '--rain-dur': `${1.05 + (i % 5) * 0.14}s`,
                  } as React.CSSProperties}
                />
              ))}
            </div>
          ) : (
            <img src={image} alt={t(event.speaker)} className="event-image" />
          )}
        </div>
      )}
      <div className="event-content">
        <span>{t(event.speaker)}</span>
        <h2>{t(event.title)}</h2>
        <p>{t(event.message)}</p>
        <div className="event-choices" aria-label={t('오른쪽으로 밀어서 선택')}>
          <div
            className={`swipe-choice swipe-choice-left${leftProgress > 0 ? ' is-sliding' : ''}`}
            style={{ '--fill': leftProgress } as React.CSSProperties}
          >
            <strong>{t(leftChoice?.label)}</strong>
          </div>
          <div
            className={`swipe-choice swipe-choice-right${rightProgress > 0 ? ' is-sliding' : ''}`}
            style={{ '--fill': rightProgress } as React.CSSProperties}
          >
            <strong>{t(rightChoice?.label)}</strong>
          </div>
        </div>
        <em className="event-swipe-guide">{t('버튼을 오른쪽으로 밀어 선택하세요')}</em>
      </div>
    </div>
  )
}

function TouchComboMeter({ combo, speed }: { combo: number; speed: number }) {
  const comboValue = Math.round(combo)

  return (
    <div className={`touch-combo-meter ${comboValue >= 80 ? 'is-hot' : ''} ${comboValue <= 0 ? 'is-idle' : ''}`}>
      <div className="tcm-body">
        <div className="tcm-label tcm-label-left">
          <span>TOUCH</span>
          <span>COMBO</span>
        </div>
        <strong className="tcm-value">{comboValue}</strong>
        <div className="tcm-label tcm-label-right">
          <span>SPEED</span>
          <span>x{speed.toFixed(2)}</span>
        </div>
      </div>
      <div className="touch-combo-bar">
        <i style={{ width: `${combo}%` }} />
      </div>
    </div>
  )
}

function WeekBadge({ weekIndex, focusStat, lang }: { weekIndex: number; focusStat: StatKey; lang: 'ko' | 'en' }) {
  const t = (text: string) => translate(text, lang)
  return (
    <div className="week-badge">
      <span>{t(`${weekIndex}주차`)}</span>
      <strong>{t(STAT_LABELS[focusStat])}</strong>
      <em>{t('추천')}</em>
    </div>
  )
}

function TitleOverlay({
  onStart,
  onCollection,
  onAchievements,
  onShowRecords,
  onShowSettings,
  lang,
}: {
  onStart: () => void
  onCollection: () => void
  onAchievements: () => void
  onShowRecords: () => void
  onShowSettings: () => void
  lang: 'ko' | 'en'
}) {
  const [showOpening, setShowOpening] = useState(false)
  const [exitModalOpen, setExitModalOpen] = useState(false)

  const t = (text: string) => translate(text, lang)

  function confirmExit(): void {
    window.open('', '_self')
    window.close()
    window.setTimeout(() => {
      if (!window.closed) {
        window.location.assign('about:blank')
      }
    }, 120)
  }

  // Generate stable floating particles
  const particles = useMemo(() => {
    return Array.from({ length: 26 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: `${18 + Math.random() * 24}px`,
      delay: `${Math.random() * 10}s`,
      duration: `${8 + Math.random() * 12}s`,
      swayDuration: `${3 + Math.random() * 5}s`,
      opacity: 0.15 + Math.random() * 0.45,
    }))
  }, [])

  return (
    <div className="title-overlay" role="dialog" aria-modal="true" aria-label={t('돌아온 감자 키우기')}>
      <div className="title-scene">
        {/* Visible opening video button on the top-left */}
        <button
          type="button"
          className="title-opening-btn"
          onClick={() => setShowOpening(true)}
        >
          🎬 {t('오프닝 영상')}
        </button>

        {/* Blurred backdrop fills any aspect ratio; sharp 16:9 layer keeps art + hotspots aligned */}
        <img
          src={lang === 'en' ? '/assets/original/title_eng.png' : '/assets/original/title.png'}
          alt=""
          aria-hidden="true"
          className="title-bg-blur"
        />
        <div className="title-cover-layer">
          <img
            src={lang === 'en' ? '/assets/original/title_eng.png' : '/assets/original/title.png'}
            alt={t('돌아온 감자 키우기')}
            className="title-bg-image"
          />
        </div>

        {/* Ambient warm light beam overlay & Sunshine flare/rays */}
        <div className="title-light-beam" />
        <div className="title-light-glow" />
        <div className="title-sun-flare" />
        <div className="title-sunshine-rays" />

        {/* Floating particles indicating game active status */}
        <div className="title-particles-container">
          {particles.map((p) => (
            <div
              key={p.id}
              className="title-particle"
              style={{
                left: p.left,
                width: p.size,
                height: p.size,
                animationDelay: p.delay,
                ['--float-dur' as any]: p.duration,
                ['--target-opacity' as any]: p.opacity,
                ['--sway-dur' as any]: p.swayDuration,
              } as React.CSSProperties}
            />
          ))}
        </div>

        {/* Transparent button mapping overlays — title-cover-layer 좌표계에 정렬 */}
        <div className="title-cover-layer title-cover-buttons">
          <button
            type="button"
            className="title-map-btn btn-start"
            onClick={onStart}
            aria-label={t('시작하기')}
          />
          <button
            type="button"
            className="title-map-btn btn-collection"
            onClick={onCollection}
            aria-label={t('도감')}
          />
          <button
            type="button"
            className="title-map-btn btn-achievements"
            onClick={onAchievements}
            aria-label={t('업적')}
          />
          <button
            type="button"
            className="title-map-btn btn-ranking"
            onClick={onShowRecords}
            aria-label={t('랭킹')}
          />
          <button
            type="button"
            className="title-map-btn btn-settings"
            onClick={onShowSettings}
            aria-label={t('설정')}
          />
          <button
            type="button"
            className="title-map-btn btn-exit"
            onClick={() => setExitModalOpen(true)}
            aria-label={t('종료')}
          />
        </div>

        <div className="title-copyright-overlay">
          Copyright 2026 HashBrown. All rights reserved.
        </div>
      </div>

      {showOpening && (
        <div className="opening-modal" onClick={() => setShowOpening(false)}>
          <div className="opening-modal-inner" onClick={(e) => e.stopPropagation()}>
            <video
              src="/assets/gameopening.mp4"
              autoPlay
              controls
              className="opening-video"
              onEnded={() => setShowOpening(false)}
              onError={(e) => { (e.currentTarget.parentElement!.querySelector('.opening-fallback') as HTMLElement).style.display = 'flex' }}
            />
            <div className="opening-fallback" style={{ display: 'none' }}>
              <p>{t('오프닝 영상을 준비 중입니다.')}<br />{t('/assets/original/opening.webm 파일을 추가해주세요.')}</p>
            </div>
            <button type="button" className="opening-close-btn" onClick={() => setShowOpening(false)}>✕</button>
          </div>
        </div>
      )}

      {exitModalOpen && (
        <div className="exit-dialog-overlay" onClick={() => setExitModalOpen(false)}>
          <div className="exit-dialog-box" onClick={(e) => e.stopPropagation()}>
            <h3 className="exit-dialog-title">{t('감자 키우기 종료')}</h3>
            <p className="exit-dialog-message">
              {t('감자가 흙 속에서 곤히 자고 있어요.')}<br />{t('정말 게임을 종료하시겠습니까?')}
            </p>
            <div className="exit-dialog-buttons">
              <button type="button" className="exit-dialog-btn confirm-btn" onClick={confirmExit}>
                {t('종료하기')}
              </button>
              <button type="button" className="exit-dialog-btn cancel-btn" onClick={() => setExitModalOpen(false)}>
                {t('돌아가기')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function SettingsOverlay({
  lang,
  setLang,
  isMuted,
  setIsMuted,
  isBgmOn,
  setIsBgmOn,
  onClose,
}: {
  lang: 'ko' | 'en'
  setLang: (lang: 'ko' | 'en') => void
  isMuted: boolean
  setIsMuted: (muted: boolean) => void
  isBgmOn: boolean
  setIsBgmOn: (on: boolean) => void
  onClose: () => void
}) {
  const t = (text: string) => translate(text, lang)

  return (
    <div className="exit-dialog-overlay settings-dialog-overlay" onClick={onClose}>
      <div className="exit-dialog-box settings-dialog-box" onClick={(e) => e.stopPropagation()}>
        <h3 className="exit-dialog-title settings-dialog-title">
          {t('설정 변경')}
        </h3>
        
        <div className="settings-options-container">
          {/* Sound Mute Toggle Button */}
          <button
            type="button"
            className={`settings-toggle-btn sound-toggle ${isMuted ? 'is-muted' : ''}`}
            onClick={() => {
              setIsMuted(!isMuted)
              if (isMuted) {
                // If it was muted, now playing OK_SOUND since it's unmuted
                playMenuClickSound(0.86)
              }
            }}
          >
            <span className="toggle-emoji">{isMuted ? '🔇' : '🔊'}</span>
            <span className="toggle-label">
              {isMuted ? t('소리 꺼짐') : t('소리 켜짐')}
            </span>
          </button>

          {/* BGM Toggle Button */}
          <button
            type="button"
            className={`settings-toggle-btn bgm-toggle ${isBgmOn ? '' : 'is-muted'}`}
            onClick={() => {
              setIsBgmOn(!isBgmOn)
              playMenuClickSound(0.86)
            }}
          >
            <span className="toggle-emoji">{isBgmOn ? '🎵' : '🎵'}</span>
            <span className="toggle-label">
              {isBgmOn ? t('배경음악 켜짐') : t('배경음악 꺼짐')}
            </span>
          </button>

          {/* Language Toggle Button */}
          <button
            type="button"
            className="settings-toggle-btn lang-toggle"
            onClick={() => {
              setLang(lang === 'ko' ? 'en' : 'ko')
              playMenuClickSound(0.86)
            }}
          >
            <span className="toggle-emoji lang-emoji">
              {lang === 'ko' ? '가' : 'A'}
            </span>
            <span className="toggle-label">
              {lang === 'ko' ? t('한국어') : t('영어')}
            </span>
          </button>
        </div>

        <button
          type="button"
          className="exit-dialog-btn cancel-btn settings-close-btn"
          onClick={onClose}
        >
          {t('돌아가기')}
        </button>
      </div>
    </div>
  )
}

// 밀어서 광고 보기: 버튼 다중 터치로 광고가 여러 번 뜨는 것을 막기 위해 슬라이드 제스처로 확인
function SlideToWatchAd({ onConfirm, label }: { onConfirm: () => void; label: string }) {
  const trackRef = useRef<HTMLDivElement | null>(null)
  const [dragX, setDragX] = useState(0)
  const dragRef = useRef<{ pointerId: number; startX: number } | null>(null)
  const firedRef = useRef(false)

  const getMaxTravel = () => {
    const track = trackRef.current
    if (!track) return 160
    const w = track.clientWidth
    return w > 60 ? w - 52 : 160
  }

  const handleDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (firedRef.current || dragRef.current) return
    dragRef.current = { pointerId: e.pointerId, startX: e.clientX }
    try { e.currentTarget.setPointerCapture(e.pointerId) } catch { /* noop */ }
  }
  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current || e.pointerId !== dragRef.current.pointerId) return
    const max = getMaxTravel()
    setDragX(Math.max(0, Math.min(max, e.clientX - dragRef.current.startX)))
  }
  const handleUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current || e.pointerId !== dragRef.current.pointerId) return
    const max = getMaxTravel()
    const dx = e.clientX - dragRef.current.startX
    dragRef.current = null
    if (!firedRef.current && dx >= max * 0.8) {
      firedRef.current = true
      setDragX(max)
      onConfirm()
      return
    }
    setDragX(0)
  }

  return (
    <div
      ref={trackRef}
      className="ad-slide-track"
      role="button"
      aria-label={label}
      onPointerDown={handleDown}
      onPointerMove={handleMove}
      onPointerUp={handleUp}
      onPointerCancel={handleUp}
    >
      <span className="ad-slide-label">{label}</span>
      <span className="ad-slide-thumb" style={{ transform: `translateX(${dragX}px)` }}>▶️</span>
    </div>
  )
}

function HarvestOverlay({ step, onNext, lang, ending, onConfirmAd, onCancel }: { step: number; onNext: () => void; lang: 'ko' | 'en'; ending: EndingResult | null; onConfirmAd: () => void; onCancel: () => void }) {
  const t = (text: string) => translate(text, lang)
  const messages = [
    t('수확의 시기가 다가왔습니다!'),
    t('98일간의 정성 어린 보살핌 끝에 드디어 감자를 수확합니다.'),
    t('두근두근... 과연 어떤 감자가 자라났을까요?'),
    '3',
    '2',
    '1',
  ]

  const isCountdown = step >= 3 && step <= 5
  const currentMsg = messages[step] || ''
  const patternClass = ending ? getPastelPatternClass(ending.imageIndex) : 'pattern-pastel-1'

  if (step === 6) {
    return (
      <div
        className={`harvest-overlay ${patternClass}`}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 99,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Yangjin, sans-serif',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(255, 245, 200, 0.45)' }} />

        <div className="harvest-card" style={{ cursor: 'default' }}>
          <h3 style={{
            fontSize: 'clamp(16px, 2cqw, 24px)',
            margin: '0 0 16px 0',
            color: '#e64a19',
            fontWeight: 950,
            borderBottom: '1px dashed rgba(62, 39, 35, 0.2)',
            paddingBottom: '8px',
            width: '100%',
            textAlign: 'center'
          }}>
            🎬 {t('엔딩 확인')}
          </h3>

          <p style={{
            fontSize: 'clamp(15px, 2cqw, 20px)',
            margin: '0 0 12px 0',
            lineHeight: 1.6,
            wordBreak: 'keep-all',
            color: '#3e2723',
            textAlign: 'center',
          }}>
            {t('감자 수확이 완료되었습니다! 엔딩 결과를 확인하시겠습니까?')}
          </p>

          <p style={{
            fontSize: 'clamp(12px, 1.6cqw, 15px)',
            margin: '0 0 24px 0',
            color: '#795548',
            textAlign: 'center',
            opacity: 0.9,
          }}>
            📺 {t('광고 시청 후 최종 엔딩을 감상하실 수 있습니다.')}
          </p>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            width: '100%',
            alignItems: 'center'
          }}>
            <SlideToWatchAd onConfirm={onConfirmAd} label={t('밀어서 광고 보고 엔딩 보기')} />
            
            <button
              type="button"
              onClick={onCancel}
              style={{
                width: '100%',
                maxWidth: '260px',
                minHeight: '40px',
                background: '#efebe9',
                color: '#5d4037',
                border: '1.5px solid #5d4037',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.1s ease',
              }}
            >
              ↩️ {t('취소 (타이틀로)')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`harvest-overlay ${patternClass}`}
      onClick={onNext}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 99,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontFamily: 'Yangjin, sans-serif',
      }}
    >
      {/* 배경 반투명 오버레이 */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(255, 245, 200, 0.45)' }} />

      {/* 메인 카드 */}
      <div className="harvest-card">
        <h3 style={{
          fontSize: 'clamp(14px, 1.8cqw, 22px)',
          margin: '0 0 clamp(8px, 1.2vw, 16px) 0',
          color: isCountdown ? '#e64a19' : '#2e7d32',
          fontWeight: 950,
          borderBottom: '1px dashed rgba(62, 39, 35, 0.2)',
          paddingBottom: '8px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          transform: 'translateX(-22px)'
        }}>
          {isCountdown ? `🕐 ${t('카운트다운')}` : `🎉 ${t('수확의 날')}`}
        </h3>

        {isCountdown ? (
          <>
            <div style={{
              fontSize: '86px',
              lineHeight: 1,
              color: '#e64a19',
              textShadow: '0 4px 0 #bf360c, 0 6px 12px rgba(0,0,0,0.25)',
              animation: 'smile-pop 0.25s ease',
              marginTop: '15px',
              marginBottom: '8px',
            }}>{currentMsg}</div>
          </>
        ) : (
          <>
            <p style={{
              fontSize: 'clamp(18px, 2.4cqw, 26px)',
              margin: 0,
              lineHeight: 1.5,
              wordBreak: 'keep-all',
              color: '#3e2723',
              textShadow: '0 1px 0 rgba(255,255,255,0.7)',
            }}>
              🥔 {currentMsg}
            </p>
          </>
        )}

        <span style={{
          fontSize: '13px',
          color: '#795548',
          display: 'block',
          marginTop: '10px',
          opacity: 0.8,
        }}>{t('화면을 터치해서 계속')}</span>
      </div>
    </div>
  )
}

function AdOverlay({ onComplete, lang }: { onComplete: () => void; lang: 'ko' | 'en' }) {
  const [secondsLeft, setSecondsLeft] = useState(5)
  const t = (text: string) => translate(text, lang)

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="ad-overlay"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 100,
        background: '#0e0b07',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Yangjin, sans-serif',
        color: '#fff',
        padding: '16px'
      }}
    >
      <div style={{
        width: 'min(90vw, 560px)',
        aspectRatio: '16/9',
        background: '#222',
        border: '3px solid #ffeb3b',
        boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '12%',
          fontSize: '28px',
          color: '#ffeb3b',
          animation: 'smile-pop 1s infinite alternate',
          textShadow: '0 2px 4px #000'
        }}>
          🥔 {t('초특가 감자칩 세트!')} 🥔
        </div>
        <div style={{ fontSize: '18px', color: '#fff', textAlign: 'center', padding: '0 20px', lineHeight: 1.5, wordBreak: 'keep-all' }}>
          "{t('바삭한 소리까지 맛있다! 지금 바로 밭에서 수확한 싱싱한 감자로 만든 해시 브라운 출시!')}"
        </div>
        <div style={{
          position: 'absolute',
          bottom: '10%',
          fontSize: '14px',
          color: '#a8ffb2'
        }}>
          * {t('본 광고는 감자 협회 제공 모의 광고입니다')} *
        </div>
      </div>

      <div style={{
        marginTop: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px'
      }}>
        <h3 style={{ fontSize: '20px', margin: 0, color: '#fff' }}>
          {secondsLeft > 0 ? t(`광고 시청 중... (${secondsLeft}초 남음)`) : t('광고 시청 완료!')}
        </h3>
        <button
          type="button"
          onClick={onComplete}
          disabled={secondsLeft > 0}
          style={{
            minWidth: '160px',
            minHeight: '44px',
            background: secondsLeft > 0 ? '#444' : 'linear-gradient(180deg, #ffeb3b, #f57f17)',
            border: '2px solid #ffeb3b',
            color: secondsLeft > 0 ? '#aaa' : '#3e2723',
            fontSize: '18px',
            fontWeight: 950,
            cursor: secondsLeft > 0 ? 'not-allowed' : 'pointer',
            borderRadius: '4px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
            transition: 'transform 0.1s ease'
          }}
        >
          {secondsLeft > 0 ? t('건너뛰기 대기') : `${t('광고 건너뛰기')} ⏩`}
        </button>
      </div>
    </div>
  )
}

const STAT_ICON_IMAGES: Record<StatKey, string> = {
  gram:   '/assets/original/stat_icon1.png',
  large:  '/assets/original/stat_icon2.png',
  shape:  '/assets/original/stat_icon3.png',
  nutri:  '/assets/original/stat_icon4.png',
  regist: '/assets/original/stat_icon5.png',
  hard:   '/assets/original/stat_icon6.png',
}


function SeedIntroOverlay({
  seedSlot,
  onRoll,
  onStart,
  lang,
}: {
  seedSlot: SeedSlot
  onRoll: () => void
  onStart: (name: string) => void
  lang: 'ko' | 'en'
}) {
  const [potatoName, setPotatoName] = useState('')
  const [rollingReels, setRollingReels] = useState<boolean[]>([false, false, false, false, false])
  const [displayResults, setDisplayResults] = useState<StatKey[]>(seedSlot.results)
  const prevResultsRef = useRef<StatKey[]>(seedSlot.results)

  const t = (text: string) => translate(text, lang)

  const isAnyReelRolling = rollingReels.some((r) => r)
  const canRoll = (!seedSlot.rolled || seedSlot.rerolls > 0) && !isAnyReelRolling

  useEffect(() => {
    if (seedSlot.rolled) {
      prevResultsRef.current = seedSlot.results
      setRollingReels([true, true, true, true, true])

      const stopDelays = [700, 1000, 1300, 1600, 1900]
      const timers = stopDelays.map((delay, index) => {
        return window.setTimeout(() => {
          setRollingReels((prev) => {
            const next = [...prev]
            next[index] = false
            return next
          })
          setDisplayResults((prev) => {
            const next = [...prev]
            next[index] = seedSlot.results[index]
            return next
          })
          playSound(UI_SOUNDS[index % UI_SOUNDS.length], 0.8)
        }, delay)
      })

      return () => {
        timers.forEach(clearTimeout)
      }
    }
  }, [seedSlot.results, seedSlot.rolled])

  const statsCycle: StatKey[] = ['gram', 'large', 'shape', 'nutri', 'regist', 'hard']

  return (
    <div className="seed-intro-overlay" role="dialog" aria-modal="true" aria-label={t('씨감자 재능 슬롯')}>
      <div className="seed-intro-panel">
        <div className="seed-copy">
          <span>{t('씨감자 준비')}</span>
          <h2>{t('조각마다 타고난 재능이 달라요')}</h2>
          <p>
            {t('감자는 보통 씨감자를 잘라 심습니다. 같은 감자에서 나온 조각도 밭에 들어가면 서로 다른 재능을 품고 자라납니다.')}
          </p>
          <div className="seed-name-section" style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
            <label htmlFor="potato-name-input" style={{ fontFamily: 'Gaegu, cursive', fontSize: '21px', fontWeight: 900, color: '#4a2814' }}>🥔 {t('감자 이름 지어주기')}</label>
            <input
              id="potato-name-input"
              type="text"
              placeholder={t('예: 귀여운 감자 (미입력시 랜덤)')}
              value={potatoName}
              onChange={(e) => setPotatoName(e.target.value.slice(0, 12))}
              disabled={isAnyReelRolling}
              style={{
                width: '100%',
                padding: '8px 10px',
                fontFamily: 'Gaegu, cursive',
                fontSize: '16px',
                fontWeight: 700,
                border: '2px solid #59351c',
                borderRadius: '6px',
                background: '#fffdf6',
                color: '#3b2515',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
              }}
            />
          </div>
        </div>
        <div className={`seed-slot-machine ${seedSlot.jackpot && !isAnyReelRolling ? 'is-jackpot' : ''}`}>
          {displayResults.map((stat, index) => {
            const isRolling = rollingReels[index]
            return (
              <div className={`seed-reel ${isRolling ? 'is-rolling' : 'is-stopped'}`} key={`${stat}-${index}`}>
                {isRolling ? (
                  <div className="seed-reel-strip">
                    {Array.from({ length: 12 }).map((_, i) => {
                      const cycleStat = statsCycle[i % statsCycle.length]
                      return (
                        <div className="reel-strip-item" key={i}>
                          <img src={STAT_ICON_IMAGES[cycleStat]} alt="" className="reel-item-img" />
                          <strong>{t(STAT_LABELS[cycleStat])}</strong>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="reel-stopped-item">
                    <img src={STAT_ICON_IMAGES[stat]} alt="" className="reel-item-img" />
                    <strong>{t(STAT_LABELS[stat])}</strong>
                  </div>
                )}
              </div>
            )
          })}
        </div>
        {seedSlot.jackpot && !isAnyReelRolling ? <div className="jackpot-ribbon">JACKPOT</div> : null}
        <div className="seed-actions">
          {canRoll ? (
            <button type="button" className="seed-roll-btn" onClick={onRoll} disabled={isAnyReelRolling}>
              {seedSlot.rolled ? t('한번 더 돌리기') + ` ${seedSlot.rerolls}` : t('재능 슬롯 돌리기')}
            </button>
          ) : null}
          <button type="button" className="seed-start-btn" onClick={() => onStart(potatoName.trim())} disabled={isAnyReelRolling}>
            {t('재배 시작')}
          </button>
        </div>
      </div>
    </div>
  )
}

type EndingOverlayProps = {
  ending: EndingResult | null
  seenCount: number
  onRestart: () => void
  onCollection: () => void
  lang: 'ko' | 'en'
}

function EndingOverlay({ ending, seenCount, onRestart, onCollection, lang }: EndingOverlayProps) {
  const [videoFailed, setVideoFailed] = useState(false)
  const [creditOpen, setCreditOpen] = useState(false)
  const [showLightBurst, setShowLightBurst] = useState(true)

  useEffect(() => {
    // Play grand success applause sound on mount
    playSound(APPLAUSE_SOUND, 0.95)

    // Remove light burst after 1.5 seconds
    const timer = setTimeout(() => {
      setShowLightBurst(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  if (!ending) return null

  const t = (text: string) => translate(text, lang)

  const characterAlt = `${t(ending.title)} ${t('감자 캐릭터')}`
  const selectedQuizDecor = getEndingQuizDecor(ending.endingId)

  return (
    <div className="ending-overlay" role="dialog" aria-modal="true" aria-label={t('엔딩 결과')}>
      {/* Soft drifting pastel pattern background */}
      <div className="ending-pattern-bg" />

      {/* Confetti and Star Explosion */}
      <div className="ending-confetti-container">
        {Array.from({ length: 45 }).map((_, idx) => {
          const angle = (idx * 360) / 45 + Math.random() * 8;
          const distance = 130 + Math.random() * 280;
          const tx = `${Math.cos((angle * Math.PI) / 180) * distance}px`;
          const ty = `${Math.sin((angle * Math.PI) / 180) * distance}px`;
          const rot = `${Math.random() * 720}deg`;
          const delay = `${Math.random() * 0.3}s`;
          const duration = `${1.2 + Math.random() * 1.6}s`;
          const color = ['#ff4081', '#536dfe', '#69f0ae', '#ffd740', '#40c4ff', '#e040fb'][idx % 6];
          const isStar = idx % 2 === 0;
          return (
            <div
              key={idx}
              className={`confetti-particle ${isStar ? 'is-star' : ''}`}
              style={{
                '--tx': tx,
                '--ty': ty,
                '--rot': rot,
                backgroundColor: isStar ? 'transparent' : color,
                color: color,
                animationDelay: delay,
                animationDuration: duration,
                fontSize: `${14 + Math.random() * 18}px`
              } as React.CSSProperties}
            >
              {isStar ? '⭐' : ''}
            </div>
          );
        })}
      </div>

      {/* Flashing Light Burst Overlay */}
      {showLightBurst && <div className="ending-light-burst" />}

      <div className="ending-overlay-wrapper">
        <div className={`collection-detail-card scrapbook-ending-card ${getPastelPatternClass(ending.imageIndex)}`}>

          {/* Header Row */}
          <div className="scrapbook-header-row">
            <div className="scrapbook-header-left">
              <span className="scrapbook-book-icon">🎉</span>
              <span className="scrapbook-label-text">{t('새로운 엔딩 획득!')}</span>
            </div>
            <button
              type="button"
              className="scrapbook-header-right credit-listening-btn"
              onClick={() => setCreditOpen((prev) => !prev)}
            >
              <span className="credit-note-icon">🎬</span>
              <span className="credit-text">{t('크레딧 보기')}</span>
              <div className="blue-tape" />
            </button>
          </div>

          {/* Title & Tagline Banner */}
          <div className="scrapbook-title-banner">
            <div className="yellow-tape-center" />
            <div className="scrapbook-title-badge">
              <span className={`star-decoration star-icon ${seenCount >= 5 ? 'green-star' : 'yellow-star'}`}>★</span>
              <h2 className="detail-title">{t(ending.title)}</h2>
              <span className={`star-decoration star-icon ${seenCount >= 5 ? 'green-star' : 'yellow-star'}`}>★</span>
            </div>
            <div className="scrapbook-tagline-wrapper">
              <div className="scrapbook-tagline">
                {t(ENDING_TAGLINES[ending.endingId] || "평범한 재료로 만든 특별한 한 판")}
              </div>
            </div>
          </div>

          {/* Center Character Sticker */}
          <figure
            className={`ending-center-character-wrapper ${ending.endingId === 'E29' ? 'is-giant-ending' : ''}`}
            aria-label={characterAlt}
          >
            {ending.isNew ? <span className="detail-id new-ending-badge">NEW</span> : null}
            <img
              src={getEndingIconPath(ending)}
              alt={characterAlt}
              className={`center-character-sticker ${ending.endingId === 'E29' ? 'is-giant-ending' : ''}`}
            />
          </figure>

          {/* Notebook Memo & Post-it Section */}
          <div className="scrapbook-body-container">
            <section className={`notebook-memo ${ending.endingId === 'E29' ? 'is-giant-ending' : ''}`}>
              <div className="green-tape-left" />
              <div className="binder-rings">
                <span className="ring" />
                <span className="ring" />
                <span className="ring" />
                <span className="ring" />
                <span className="ring" />
                <span className="ring" />
              </div>
              <div className="note-heading">✏️ {t('요리 메모')} ♡</div>
              <div className="note-content">
                <p>{formatStoryText(t(getCleanStory(ending.story)))}</p>
              </div>
            </section>

            <section className="postit-quiz">
              <div className="yellow-tape-right" />
              <div className="quiz-content">
                <span className="quiz-umbrella-icon">{selectedQuizDecor?.icon || '📌'}</span>
                <p className="quiz-question">
                  {t(ENDING_QUESTIONS[ending.endingId] || "비 오는 날에 더 맛있는 이유는 뭘까요?")}
                </p>
                <div className="raindrops-decor">
                  {(selectedQuizDecor?.accents || ['✦', '✦', '✦']).map((accent, idx) => (
                    <span key={`ending-accent-${idx}`} className="drop">{accent}</span>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Bottom Actions */}
          <div className="scrapbook-navigation ending-actions-nav">
            <button type="button" className="nav-list-btn list-btn" onClick={onRestart}>
              🌱 {t('다시 키우기')}
            </button>
            <button type="button" className="nav-list-btn list-btn" onClick={onCollection}>
              📖 {t('도감 보기')}
            </button>
          </div>

          {/* Credit Pop-up Modal */}
          {creditOpen && (
            <div className="collection-credit-modal" onClick={() => setCreditOpen(false)}>
              <div className="collection-credit-pip" onClick={(e) => e.stopPropagation()}>
                <div className="polaroid-header">
                  <span>🎬 {t('엔딩 크레딧')}</span>
                  <button type="button" className="polaroid-close" onClick={() => setCreditOpen(false)}>✕</button>
                </div>
                <div className="video-wrapper">
                  <video
                    className="detail-video-element"
                    controls
                    playsInline
                    preload="metadata"
                    onEnded={() => setCreditOpen(false)}
                    onError={() => setVideoFailed(true)}
                    poster="/assets/original/endback1.png"
                  >
                    <source src="/assets/original/ending.webm" type="video/webm" />
                  </video>
                </div>
                {videoFailed && (
                  <p className="detail-video-fallback">
                    {t('이 기기 브라우저가 webm 코덱을 지원하지 않아 크레딧 재생이 실패했습니다.')}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

type CollectionOverlayProps = {
  unlockedIds: string[]
  seenCount: Record<string, number>
  onClose: () => void
  onRestart: () => void
  onResume?: () => void
  returnScreen?: GameState['collectionReturnScreen']
  lang: 'ko' | 'en'
}

function RecordsOverlay({ onClose, lang }: { onClose: () => void; lang: 'ko' | 'en' }) {
  const records = loadRecords()
  const hasRecords = records.length > 0
  const [sortBy, setSortBy] = useState<'score' | 'date'>('date')

  const t = (text: string) => translate(text, lang)

  const statBest: GameStats = { gram: 0, large: 0, shape: 0, nutri: 0, regist: 0, hard: 0 }
  let bestTotal = 0
  records.forEach((r) => {
    STAT_KEYS.forEach((k) => { if (r.stats[k] > statBest[k]) statBest[k] = r.stats[k] })
    const total = STAT_KEYS.reduce((s, k) => s + r.stats[k], 0)
    if (total > bestTotal) bestTotal = total
  })

  const sorted = [...records].sort((a, b) => {
    if (sortBy === 'score') {
      const ta = STAT_KEYS.reduce((s, k) => s + a.stats[k], 0)
      const tb = STAT_KEYS.reduce((s, k) => s + b.stats[k], 0)
      return tb - ta
    }
    return b.savedAt - a.savedAt
  })

  function formatDate(ts: number): string {
    const d = new Date(ts)
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    const hh = String(d.getHours()).padStart(2, '0')
    const min = String(d.getMinutes()).padStart(2, '0')
    return `${mm}/${dd} ${hh}:${min}`
  }

  return (
    <div className="records-overlay" onClick={onClose}>
      <div className="records-panel" onClick={(e) => e.stopPropagation()}>
        <div className="records-header">
          <span className="records-title">🏆 {t('명예의 전당')}</span>
          <div className="records-sort-btns">
            <button type="button" className={`records-sort-btn ${sortBy === 'score' ? 'is-active' : ''}`} onClick={() => setSortBy('score')}>{t('점수순')}</button>
            <button type="button" className={`records-sort-btn ${sortBy === 'date' ? 'is-active' : ''}`} onClick={() => setSortBy('date')}>{t('날짜순')}</button>
          </div>
          <button type="button" className="records-close-btn" onClick={onClose}>✕</button>
        </div>

        {!hasRecords ? (
          <div className="records-empty">
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🥔</div>
            <p>{t('아직 기록이 없습니다.')}<br />{t('첫 수확을 완료해보세요!')}</p>
          </div>
        ) : (
          <div className="records-list">
            {sorted.map((record, idx) => {
              const total = Math.floor(STAT_KEYS.reduce((s, k) => s + record.stats[k], 0))
              const isChampion = total === bestTotal
              return (
                <div key={record.id} className={`record-card ${isChampion ? 'is-champion' : ''}`}>
                  <div className="record-card-header">
                    <span className="record-rank">{isChampion ? '🏆' : `#${idx + 1}`}</span>
                    <strong className="record-name">{getDisplayPotatoName(record.name, lang)}</strong>
                    <span className="record-date">{formatDate(record.savedAt)}</span>
                    <span className="record-ending">{getDisplayEndingTitle(record.endingTitle, lang)}</span>
                  </div>
                  <div className="record-stats-row">
                    {STAT_KEYS.map((key) => {
                      const val = Math.floor(record.stats[key])
                      const isStatBest = record.stats[key] >= statBest[key] && statBest[key] > 0
                      return (
                        <span key={key} className={`record-stat-chip ${isStatBest ? 'is-best' : ''}`}>
                          {isStatBest && <span className="record-crown">👑</span>}
                          <span className="record-stat-label">{t(STAT_LABELS[key])}</span>
                          <span className="record-stat-val">{val}</span>
                        </span>
                      )
                    })}
                    <span className={`record-stat-chip record-total ${isChampion ? 'is-best' : ''}`}>
                      {isChampion && <span className="record-crown">👑</span>}
                      <span className="record-stat-label">{t('종합')}</span>
                      <span className="record-stat-val">{total}</span>
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function AchievementsOverlay({ game, onClose, lang }: { game: GameState; onClose: () => void; lang: 'ko' | 'en' }) {
  const t = (text: string) => translate(text, lang)
  const context = getAchievementContext(game)
  const cards = ACHIEVEMENTS.map((achievement, index) => ({
    achievement,
    index,
    unlocked: achievement.test(context),
  }))
  const unlockedCount = cards.filter((card) => card.unlocked).length

  return (
    <div className="achievements-overlay" role="dialog" aria-modal="true" aria-label={lang === 'ko' ? '업적' : 'Achievements'} onClick={onClose}>
      <div className="achievements-board" onClick={(e) => e.stopPropagation()}>
        <div className="achievements-header">
          <div>
            <span className="achievements-kicker">{lang === 'ko' ? '숨은 낱말 카드' : 'Hidden Word Cards'}</span>
            <h2>{lang === 'ko' ? '업적' : 'Achievements'}</h2>
          </div>
          <strong>{unlockedCount}/40</strong>
          <button type="button" className="achievements-close-btn" onClick={onClose} aria-label={t('돌아가기')}>
            ✕
          </button>
        </div>

        <div className="achievements-grid">
          {cards.map(({ achievement, index, unlocked }) => (
            <article
              key={achievement.id}
              className={`achievement-card ${unlocked ? 'is-unlocked' : 'is-locked'}`}
            >
              <span className="achievement-number">{String(index + 1).padStart(2, '0')}</span>
              <strong className="achievement-word">{unlocked ? selectCopy(achievement.word, lang) : '???'}</strong>
              <span className="achievement-title">{unlocked ? selectCopy(achievement.title, lang) : lang === 'ko' ? '숨김 카드' : 'Hidden Card'}</span>
              <em>{selectCopy(achievement.hint, lang)}</em>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

const STAR_POSITIONS: Record<string, React.CSSProperties> = {
  E01: { left: '8px', bottom: '8px' },
  E02: { left: '10px', bottom: '10px' },
  E03: { left: '8px', bottom: '8px' },
  E04: { left: '8px', bottom: '8px' },
  E05: { left: '8px', bottom: '8px' },
  E06: { left: '8px', bottom: '8px' },
  E07: { left: '10px', bottom: '15px' },
  E08: { left: '10px', bottom: '10px' },
  E09: { left: '8px', bottom: '10px' },
  E10: { left: '12px', bottom: '12px' },
  E11: { left: '10px', bottom: '10px' },
  E12: { left: '12px', bottom: '10px' },
  E13: { left: '10px', bottom: '15px' },
  E14: { left: '10px', bottom: '10px' },
  E15: { left: '10px', bottom: '15px' },
  E16: { left: '10px', bottom: '10px' },
  E17: { left: '10px', bottom: '8px' },
  E18: { left: '8px', bottom: '8px' },
  E19: { left: '10px', bottom: '20px' },
  E20: { left: '12px', bottom: '8px' },
  E21: { left: '10px', bottom: '15px' },
  E22: { left: '10px', bottom: '20px' },
  E23: { left: '10px', bottom: '15px' }, // Dropper potato body is bottom-right, bottom-left is empty margin
  E24: { left: '10px', bottom: '10px' },
  E25: { left: '12px', bottom: '10px' },
  E26: { left: '12px', bottom: '10px' },
  E27: { left: '8px', bottom: '10px' },
  E28: { left: '8px', bottom: '8px' },
  E29: { left: '-32px', top: '50%', bottom: 'auto', transform: 'translateY(-50%)' },
  E30: { left: '-32px', top: '50%', bottom: 'auto', transform: 'translateY(-50%)' },
  E31: { left: '10px', bottom: '10px' },
  E32: { left: '-32px', top: '50%', bottom: 'auto', transform: 'translateY(-50%)' },
  E33: { left: '8px', bottom: '8px' },
}

function CollectionOverlay({ unlockedIds, seenCount, onClose, onRestart, onResume, returnScreen, lang }: CollectionOverlayProps) {
  const unlocked = new Set(unlockedIds)
  const [selectedEnding, setSelectedEnding] = useState<Ending | null>(null)
  const [collectionVideoFailed, setCollectionVideoFailed] = useState(false)
  const [collectionCreditOpen, setCollectionCreditOpen] = useState(false)
  const [showRecords, setShowRecords] = useState(false)

  const t = (text: string) => translate(text, lang)

  const sortedEndings = [...ENDING_TABLE].sort((a, b) => a.id.localeCompare(b.id))
  const unlockedEndings = sortedEndings.filter((e) => unlocked.has(e.id))
  const currentIndex = selectedEnding ? unlockedEndings.findIndex((e) => e.id === selectedEnding.id) : -1

  const handlePrevEnding = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (unlockedEndings.length <= 1) return
    const prevIndex = (currentIndex - 1 + unlockedEndings.length) % unlockedEndings.length
    setSelectedEnding(unlockedEndings[prevIndex])
  };

  const handleNextEnding = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (unlockedEndings.length <= 1) return
    const nextIndex = (currentIndex + 1) % unlockedEndings.length
    setSelectedEnding(unlockedEndings[nextIndex])
  };

  const totalClears = Object.values(seenCount).reduce((a, b) => a + b, 0)
  const selectedQuizDecor = selectedEnding ? getEndingQuizDecor(selectedEnding.id) : null

  return (
    <div className="collection-overlay" role="dialog" aria-modal="true" aria-label={t('엔딩 도감')}>
      <div className="collection-board">
        {[...ENDING_TABLE]
          .sort((a, b) => {
            const coordA = ENDING_COORDS[a.id]
            const coordB = ENDING_COORDS[b.id]
            const yA = coordA ? coordA.y : 0
            const yB = coordB ? coordB.y : 0
            return yA - yB
          })
          .map((ending) => {
            const isUnlocked = unlocked.has(ending.id)
            const coord = ENDING_COORDS[ending.id]
            if (!coord) return null

            const left = (coord.x / 1280) * 100
            const top = (coord.y / 720) * 100
            const width = (coord.w / 1280) * 100
            const height = (coord.h / 720) * 100

            const seen = seenCount[ending.id] ?? 0
            const starStyle = STAR_POSITIONS[ending.id] || { left: '50%', top: '-8px', transform: 'translateX(-50%)' }

            const totalStars = Math.min(5, seen)
            const isGreen = seen >= 5
            const starColorClass = isGreen ? 'green-star' : 'yellow-star'
            const topStarsCount = Math.min(3, totalStars)
            const bottomStarsCount = Math.max(0, totalStars - 3)

            return (
              <button
                key={ending.id}
                type="button"
                className={`sticker-item ${isUnlocked ? 'is-unlocked' : 'is-locked'}`}
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  width: `${width}%`,
                  height: `${height}%`,
                }}
                onClick={isUnlocked ? () => setSelectedEnding(ending) : undefined}
                disabled={!isUnlocked}
              >
                {isUnlocked && totalStars > 0 && (
                  <div className="sticker-stars" style={starStyle}>
                    <div className="stars-row">
                      {Array.from({ length: topStarsCount }).map((_, i) => (
                        <span key={`top-${i}`} className={`star-icon ${starColorClass}`}>★</span>
                      ))}
                    </div>
                    {bottomStarsCount > 0 && (
                      <div className="stars-row">
                        {Array.from({ length: bottomStarsCount }).map((_, i) => (
                          <span key={`bottom-${i}`} className={`star-icon ${starColorClass}`}>★</span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {isUnlocked ? (
                  <>
                    <img
                      src={getEndingIconPath(ending, false)}
                      alt={t(ending.title)}
                      className="sticker-img default-img"
                    />
                    <img
                      src={getEndingIconPath(ending, true)}
                      alt={t(ending.title)}
                      className="sticker-img hover-img"
                    />
                  </>
                ) : (
                  <img
                    src={getEndingIconPath(ending, false)}
                    alt={`${ending.id} ${t('미수집')}`}
                    className="sticker-img default-img"
                  />
                )}
              </button>
            )
          })}
      </div>

      <div className="collection-footer">
        <div className="stats-box">
          <span>{t(`총 ${totalClears}회 클리어`)}</span>
          <span>{t('33종류의 감자를 모두 모아보세요')}</span>
        </div>
        <div className="footer-actions">
          <button type="button" className="footer-btn close-btn" onClick={onClose}>
            {t('타이틀로')}
          </button>
          <button type="button" className="footer-btn restart-btn" onClick={onRestart}>
            {t('새 회차')}
          </button>
          <button type="button" className="footer-btn records-btn" onClick={() => setShowRecords(true)}>
            🏆 {t('명예의 전당')}
          </button>
          {returnScreen === 'game' && onResume && (
            <button type="button" className="footer-btn resume-btn" onClick={onResume}>
              {t('게임재개')}
            </button>
          )}
        </div>
      </div>

      {showRecords && <RecordsOverlay onClose={() => setShowRecords(false)} lang={lang} />}

      {selectedEnding && (
        <div className="collection-detail-overlay" onClick={() => setSelectedEnding(null)}>
          <div className="collection-detail-wrapper" onClick={(e) => e.stopPropagation()}>
            <div className={`collection-detail-card scrapbook-ending-card ${getPastelPatternClass(selectedEnding.imageIndex)}`}>

              {/* Header Row */}
              <div className="scrapbook-header-row">
                <div className="scrapbook-header-left">
                  <span className="scrapbook-book-icon">📒</span>
                  <span className="scrapbook-label-text">{t('엔딩 다시보기')}</span>
                </div>
                <button
                  type="button"
                  className="scrapbook-header-right credit-listening-btn"
                  onClick={() => setCollectionCreditOpen((prev) => !prev)}
                >
                  <span className="credit-note-icon">🎬</span>
                  <span className="credit-text">{t('크레딧 보기')}</span>
                  <div className="blue-tape" />
                </button>
              </div>

              {/* Title & Tagline Banner */}
              <div className="scrapbook-title-banner">
                <div className="yellow-tape-center" />
                <div className="scrapbook-title-badge">
                  <span className={`star-decoration star-icon ${(seenCount[selectedEnding.id] ?? 0) >= 5 ? 'green-star' : 'yellow-star'}`}>★</span>
                  <h2 className="detail-title">{t(selectedEnding.title)}</h2>
                  <span className={`star-decoration star-icon ${(seenCount[selectedEnding.id] ?? 0) >= 5 ? 'green-star' : 'yellow-star'}`}>★</span>
                </div>
                <div className="scrapbook-tagline-wrapper">
                  <div className="scrapbook-tagline">
                    {t(ENDING_TAGLINES[selectedEnding.id] || "평범한 재료로 만든 특별한 한 판")}
                  </div>
                </div>
              </div>

              {/* Center Character Sticker */}
              <figure
                className={`ending-center-character-wrapper ${selectedEnding.id === 'E29' ? 'is-giant-ending' : ''}`}
                aria-label={`${t(selectedEnding.title)} ${t('감자 캐릭터')}`}
              >
                <img
                  src={getEndingIconPath(selectedEnding)}
                  alt={`${t(selectedEnding.title)} ${t('감자 캐릭터')}`}
                  className={`center-character-sticker ${selectedEnding.id === 'E29' ? 'is-giant-ending' : ''}`}
                />
              </figure>

              {/* Notebook Memo & Post-it Section */}
              <div className="scrapbook-body-container">
                <section className={`notebook-memo ${selectedEnding.id === 'E29' ? 'is-giant-ending' : ''}`}>
                  <div className="green-tape-left" />
                  <div className="binder-rings">
                    <span className="ring" />
                    <span className="ring" />
                    <span className="ring" />
                    <span className="ring" />
                    <span className="ring" />
                    <span className="ring" />
                  </div>
                  <div className="note-heading">✏️ {t('요리 메모')} ♡</div>
                  <div className="note-content">
                    <p>{formatStoryText(t(getCleanStory(selectedEnding.story)))}</p>
                  </div>
                </section>

                <section className="postit-quiz">
                  <div className="yellow-tape-right" />
                  <div className="quiz-content">
                    <span className="quiz-umbrella-icon">{selectedQuizDecor?.icon || '📌'}</span>
                    <p className="quiz-question">
                      {t(ENDING_QUESTIONS[selectedEnding.id] || "비 오는 날에 더 맛있는 이유는 뭘까요?")}
                    </p>
                    <div className="raindrops-decor">
                      {(selectedQuizDecor?.accents || ['✦', '✦', '✦']).map((accent, index) => (
                        <span key={`${selectedEnding.id}-accent-${index}`} className="drop">{accent}</span>
                      ))}
                    </div>
                  </div>
                </section>
              </div>

              {/* Bottom Navigation */}
              <div className="scrapbook-navigation">
                <button type="button" className="nav-arrow-btn prev-btn" onClick={handlePrevEnding}>
                  ◀ {t('이전 엔딩')}
                </button>
                <button type="button" className="nav-list-btn list-btn" onClick={() => setSelectedEnding(null)}>
                  📖 {t('엔딩 목록')}
                </button>
                <button type="button" className="nav-arrow-btn next-btn" onClick={handleNextEnding}>
                  {t('다음 엔딩')} ▶
                </button>
              </div>

              {/* Credit Pop-up Modal */}
              {collectionCreditOpen && (
                <div className="collection-credit-modal" onClick={() => setCollectionCreditOpen(false)}>
                  <div className="collection-credit-pip" onClick={(e) => e.stopPropagation()}>
                    <div className="polaroid-header">
                      <span>🎬 {t('엔딩 크레딧')}</span>
                      <button type="button" className="polaroid-close" onClick={() => setCollectionCreditOpen(false)}>✕</button>
                    </div>
                    <div className="video-wrapper">
                      <video
                        className="detail-video-element"
                        controls
                        playsInline
                        preload="metadata"
                        onEnded={() => setCollectionCreditOpen(false)}
                        onError={() => setCollectionVideoFailed(true)}
                        poster="/assets/original/endback1.png"
                      >
                        <source src="/assets/original/ending.webm" type="video/webm" />
                      </video>
                    </div>
                    {collectionVideoFailed && (
                      <p className="detail-video-fallback">
                        {t('이 기기 브라우저가 webm 코덱을 지원하지 않아 크레딧 재생이 실패했습니다.')}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function loadRecords(): RunRecord[] {
  try {
    const raw = localStorage.getItem(RECORDS_KEY)
    if (!raw) return []
    return JSON.parse(raw) as RunRecord[]
  } catch {
    return []
  }
}

function saveRecords(records: RunRecord[]): void {
  try {
    localStorage.setItem(RECORDS_KEY, JSON.stringify(records.slice(-100)))
  } catch {
    // ignore
  }
}

function saveGameDirectly(state: GameState) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state))
  } catch (e) {
    console.error('Failed to save game state', e)
  }
}

function splitHintIntoTwoLines(text: string): React.ReactNode {
  const words = text.split(' ')
  if (words.length <= 2) return text
  const mid = Math.ceil(words.length / 2)
  const line1 = words.slice(0, mid).join(' ')
  const line2 = words.slice(mid).join(' ')
  return (
    <>
      {line1}
      <br />
      {line2}
    </>
  )
}

// 돼지 접근 경고: 보살핌(careCount)이 30 미만이면 날이 갈수록 돼지가 점점 다가온다.
// 구작 "돼지탈출"의 돼지 이미지(pig1/pig2)를 사용해 돼지 사료 엔딩을 미리 경고한다.
function PigWarning({ day, careCount, lang }: { day: number; careCount: number; lang: 'ko' | 'en' }) {
  if (careCount >= PIG_FEED_CARE_THRESHOLD || day < 20 || day >= TOTAL_TURNS) return null
  const t = (text: string) => translate(text, lang)
  const progress = clamp((day - 20) / (TOTAL_TURNS - 20), 0, 1)
  const stage = progress < 0.4 ? 1 : progress < 0.75 ? 2 : 3
  const image = stage === 3 ? '/assets/original/pig2.png' : '/assets/original/pig1.png'
  const size = Math.round(70 + progress * 150)
  const message =
    stage === 1
      ? '꿀꿀... 심심한 감자는 내 사료가 되지~'
      : stage === 2
        ? '꿀꿀! 보살핌이 부족한 감자 냄새가 나는데?'
        : '꿀꿀!! 이대로면 수확 날에 내가 먹어버린다!'
  return (
    <div className={`pig-warning pig-stage-${stage}`} style={{ width: `${size}px` }} aria-hidden="true">
      <div className="pig-warning-bubble">
        <strong>{t('보살핌')} {Math.min(careCount, PIG_FEED_CARE_THRESHOLD)}/{PIG_FEED_CARE_THRESHOLD}</strong>
        <span>{t(message)}</span>
      </div>
      <img src={image} alt="" className="pig-warning-img" />
    </div>
  )
}

function App() {
  const [game, setGame] = useState<GameState>(() => {
    try {
      if (AUTO_GAME_TEST) {
        const debugDay = Number(SEARCH_PARAMS.get('day'))
        const fresh = createFreshState('game')
        if (Number.isFinite(debugDay) && debugDay >= 1 && debugDay <= TOTAL_TURNS) {
          fresh.day = debugDay
          fresh.weekIndex = getWeekIndex(debugDay)
        }
        return fresh
      }
      if (AUTO_COLLECTION_TEST) return createFreshState('collection')

      const raw = localStorage.getItem(SAVE_KEY)
      if (!raw) return createFreshState('title')
      const parsed = JSON.parse(raw) as GameState
      const validUnlockedEndingIds = (parsed.unlockedEndingIds ?? []).filter((endingId) => getEndingById(endingId))
      const runCount = parsed.runCount ?? 0
      const unlockedSlotsCount = 3
      const parsedPlanCursor = typeof parsed.planCursor === 'number' ? parsed.planCursor : INITIAL_STATE.planCursor
      // 일수 방어 (B3): 숫자가 아니거나 98을 넘는 세이브는 소프트락이 되므로 교정한다
      const rawDay = Number(parsed.day)
      let loadedDay = Number.isFinite(rawDay) ? clamp(rawDay, 1, TOTAL_TURNS) : INITIAL_STATE.day
      const loadedScreen = (parsed.screen ?? 'game') as GameState['screen']
      if (loadedScreen === 'game' && loadedDay >= TOTAL_TURNS && !parsed.currentEnding) {
        loadedDay = TOTAL_TURNS - 0.5
      }
      const shouldShowTitle = loadedScreen === 'game' && loadedDay <= 1.01 && !parsed.currentEnding
      const savedCollectionReturnScreen = (parsed as Record<string, unknown>).collectionReturnScreen
      const parsedReturnScreen: GameState['collectionReturnScreen'] =
        typeof savedCollectionReturnScreen === 'string' &&
        ['title', 'intro', 'game', 'harvest', 'ending'].includes(savedCollectionReturnScreen)
          ? (savedCollectionReturnScreen as GameState['collectionReturnScreen'])
          : parsed.currentEnding
            ? 'ending'
            : shouldShowTitle
              ? 'title'
              : 'game'
      
      const endingSeenCount = parsed.endingSeenCount ?? {}
      const totalClears = getClearBonusCount(endingSeenCount, validUnlockedEndingIds)

      return {
        ...INITIAL_STATE,
        ...parsed,
        day: loadedDay,
        stats: sanitizeStats({ ...INITIAL_STATE.stats, ...parsed.stats }),
        // B5: initialStats가 없는 구버전 세이브는 현재 능력치 대신 기본 시작 능력치로 폴백
        // (현재 능력치로 폴백하면 성장량이 0이 되어 무조건 "돼지 사료" 엔딩이 됨)
        initialStats: parsed.initialStats ? sanitizeStats(parsed.initialStats) : { ...INITIAL_STATE.stats },
        potatoName: typeof parsed.potatoName === 'string' && parsed.potatoName ? parsed.potatoName : '귀여운 감자',
        plan: normalizePlan(parsed.plan),
        planCursor: clamp(parsedPlanCursor, 0, unlockedSlotsCount - 1),
        activeEvent: parsed.activeEvent
          ? {
              ...parsed.activeEvent,
              image: parsed.activeEvent.image ?? EVENT_POOL.find((e) => e.id === parsed.activeEvent!.id)?.image,
            }
          : null,
        eventSeen: parsed.eventSeen ?? {},
        lastEventTurn: parsed.lastEventTurn ?? 0,
        harvestFocus: parsed.harvestFocus ?? null,
        currentEnding: parsed.currentEnding
          ? {
              ...parsed.currentEnding,
              imageIndex: parsed.currentEnding.imageIndex ?? getEndingById(parsed.currentEnding.endingId)?.imageIndex ?? 1,
            }
          : null,
        unlockedEndingIds: validUnlockedEndingIds,
        endingSeenCount,
        lastEndingId: parsed.lastEndingId ?? null,
        screen: shouldShowTitle ? 'title' : loadedScreen,
        collectionReturnScreen: parsedReturnScreen,
        runCount,
        careCount: Math.max(0, Math.floor(Number(parsed.careCount) || 0)),
        unlockedSlotsCount,
        touchCombo: parsed.touchCombo ?? 0,
        touchComboUpdatedAt: Date.now(),
        messageLockedUntil: 0,
        weekIndex: parsed.weekIndex ?? getWeekIndex(loadedDay),
        weekFocusStat: parsed.weekFocusStat ?? getRandomStat(),
        seedSlot: {
          ...createSeedSlot(),
          ...parsed.seedSlot,
        },
        toys: parsed.toys ?? INITIAL_STATE.toys,
        recordSaved: parsed.recordSaved ?? false,
        resolvingDay: !shouldShowTitle && loadedScreen === 'game',
        bonus: totalClears,
        combo100Duration: parsed.combo100Duration ?? 0,
        combo100MaxDuration: parsed.combo100MaxDuration ?? 0,
        combo100ReachedAt: parsed.combo100ReachedAt ?? null,
      }
    } catch {
      return createFreshState('title')
    }
  })

  const dragStartRef = useRef<{
    x: number; y: number;
    centerX: number; centerY: number;
    prevAngle: number;
    prevX: number; prevY: number; prevTime: number;
    lastMoveSpeed: number;
    lastMoveDx: number;
    lastMoveDy: number;
    lastAngularVelocity: number;
    sessionCombo: number;
    comboBuffer: number;
    isTouchOnly: boolean;
  } | null>(null)
  const spinRef = useRef<{ velocity: number; direction: number; comboBuffer: number; rafId: number; lastTime: number; lastGameUpdate: number } | null>(null)
  const spinSettleRef = useRef<{ velocity: number; rafId: number; lastTime: number } | null>(null)
  useEffect(() => () => {
    if (spinRef.current) cancelAnimationFrame(spinRef.current.rafId)
    if (spinSettleRef.current) cancelAnimationFrame(spinSettleRef.current.rafId)
  }, [])

  const [floatingWords, setFloatingWords] = useState<Array<{ id: number; text: string; x: number; y: number; rot: number }>>([])
  const [soilPuffs, setSoilPuffs] = useState<Array<{ id: number; x: number; y: number }>>([])
  const floatingIdRef = useRef(0)
  const lastRollWordTimeRef = useRef(0)

  function addFloatingWord(text: string, x: number, y: number): void {
    const id = ++floatingIdRef.current
    const rot = Math.random() * 30 - 15
    setFloatingWords(prev => [...prev, { id, text, x, y, rot }])
    setTimeout(() => setFloatingWords(prev => prev.filter(w => w.id !== id)), 1400)
  }

  function addSoilPuff(x: number, y: number): void {
    const id = ++floatingIdRef.current
    setSoilPuffs(prev => [...prev, { id, x, y }])
    setTimeout(() => setSoilPuffs(prev => prev.filter(p => p.id !== id)), 600)
  }

  const [harvestStep, setHarvestStep] = useState(0)
  const [msgPage, setMsgPage] = useState(0)
  useEffect(() => setMsgPage(0), [game.currentMessage])
  const [eventResultMessage, setEventResultMessage] = useState<string | null>(null)
  const [showTitleRecords, setShowTitleRecords] = useState(false)
  const [showAchievements, setShowAchievements] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [lang, setLang] = useState<'ko' | 'en'>(() => {
    return (localStorage.getItem('potato-lang') as 'ko' | 'en') || 'ko'
  })
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    return localStorage.getItem('potato-muted') === 'true'
  })
  const [isBgmOn, setIsBgmOn] = useState<boolean>(() => {
    return localStorage.getItem('potato-bgm-on') !== 'false'
  })

  useEffect(() => {
    localStorage.setItem('potato-bgm-on', String(isBgmOn))
  }, [isBgmOn])

  useEffect(() => {
    localStorage.setItem('potato-lang', lang)
  }, [lang])

  useEffect(() => {
    localStorage.setItem('potato-muted', String(isMuted))
    ;(window as any).gameAudioMuted = isMuted
  }, [isMuted])

  const t = (text: string) => translate(text, lang)


  const [showAd, setShowAd] = useState(false)
  const [isAdLoading, setIsAdLoading] = useState(false)
  const [adNotice, setAdNotice] = useState<string | null>(null)
  const [checkingUpdates, setCheckingUpdates] = useState(true)
  const [hotfixStatus, setHotfixStatus] = useState('시스템 초기화 중...')
  const [badStats, setBadStats] = useState<Record<StatKey, boolean>>({
    gram: false,
    large: false,
    shape: false,
    nutri: false,
    regist: false,
    hard: false,
  })

  // AdMob Initializer
  useEffect(() => {
    if (isNative) {
      AdMob.initialize().then(() => {
        console.log("AdMob Initialized successfully.")
      }).catch(err => {
        console.error("AdMob Initialization failed:", err)
      })
    }
  }, [])

  // Real Hotfix Loader
  useEffect(() => {
    const checkHotfix = async () => {
      setCheckingUpdates(true)
      setHotfixStatus('서버 연결 및 보안 키 확인...')
      await new Promise(r => setTimeout(r, 200))

      setHotfixStatus('최신 핫픽스 패치 조회 중...')
      try {
        // 4초 타임아웃: 모바일 네트워크에서 응답이 멈춰도 스플래시가 영원히 머물지 않도록
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 4000)
        const res = await fetch('https://jeongdawoont-star.github.io/hash2n/vibe-apps/hotfixes/potato.hotfix.json', { cache: 'no-store', signal: controller.signal })
        clearTimeout(timeoutId)
        if (res.ok) {
          const data = await res.json()
          setHotfixStatus('핫픽스 다운로드 및 컴파일 중...')
          await new Promise(r => setTimeout(r, 300))
          
          if (data.translations) {
            Object.assign(TRANSLATIONS, data.translations)
            console.log("Hotfix translations applied:", data.translations)
          }

          // 보안: 원격 코드(patchCode) 실행은 제거되었습니다.
          // 서버 계정이 탈취될 경우 모든 기기에서 임의 코드가 실행될 수 있어,
          // 선언적 데이터(translations 등)만 허용합니다.

          setHotfixStatus('핫픽스 적용 완료!')
        } else {
          setHotfixStatus('최신 패치가 없습니다. (준비 완료)')
        }
      } catch (err) {
        console.warn("Hotfix check failed (using offline version):", err)
        setHotfixStatus('오프라인 모드로 실행합니다. (준비 완료)')
      }
      
      await new Promise(r => setTimeout(r, 400))
      setCheckingUpdates(false)
    }

    checkHotfix()
  }, [])

  const adInFlightRef = useRef(false)

  const playRewardedAd = async (): Promise<boolean> => {
    if (!isNative) {
      // Browser fallback logic (simulated AdOverlay)
      return new Promise((resolve) => {
        setShowAd(true)
        ;(window as any).onMockAdComplete = (success: boolean) => {
          resolve(success)
        }
      })
    }

    return new Promise((resolve) => {
      let earnedReward = false
      let listeners: any[] = []

      const cleanup = () => {
        listeners.forEach(l => l.remove())
        listeners = []
      }

      listeners.push(
        AdMob.addListener(RewardAdPluginEvents.Rewarded, (reward) => {
          console.log("Rewarded: User watched ad successfully.", reward)
          earnedReward = true
        })
      )

      listeners.push(
        AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
          console.log("Rewarded ad dismissed.")
          cleanup()
          resolve(earnedReward)
        })
      )

      listeners.push(
        AdMob.addListener(RewardAdPluginEvents.FailedToShow, (err) => {
          console.error("Rewarded ad failed to show:", err)
          cleanup()
          resolve(false)
        })
      )

      AdMob.prepareRewardVideoAd({
        adId: ADMOB_REWARDED_AD_ID,
        isTesting: ADMOB_IS_TESTING,
      }).then(() => {
        AdMob.showRewardVideoAd().catch((err: unknown) => {
          console.error("Failed to show AdMob rewarded ad:", err)
          cleanup()
          resolve(false)
        })
      }).catch((err: unknown) => {
        console.error("Failed to prepare AdMob rewarded ad:", err)
        cleanup()
        resolve(false)
      })
    })
  }

  // 광고 시청 성공 시에만 엔딩을 도감에 등록하고 엔딩 화면으로 전환한다 (B4: 광고 게이트 보호)
  function unlockCurrentEndingAndShow(): void {
    setHarvestStep(0)
    setGame((prev) => {
      if (!prev.currentEnding) return { ...prev, screen: 'ending' }
      if (prev.screen === 'ending') return prev // 중복 호출 방지: 클리어 1회당 1번만 등록
      const endingId = prev.currentEnding.endingId
      const unlockedEndingIds = prev.unlockedEndingIds.includes(endingId)
        ? prev.unlockedEndingIds
        : [...prev.unlockedEndingIds, endingId]
      const endingSeenCount = {
        ...prev.endingSeenCount,
        [endingId]: (prev.endingSeenCount[endingId] ?? 0) + 1,
      }
      const next: GameState = {
        ...prev,
        screen: 'ending',
        unlockedEndingIds,
        endingSeenCount,
        lastEndingId: endingId,
        bonus: getClearBonusCount(endingSeenCount, unlockedEndingIds),
      }
      saveGameDirectly(next)
      return next
    })
  }

  const growthStage = getGrowthStage(game.day)
  const potatoImage = game.actionPlayback
    ? game.actionPlayback.frames[game.actionPlayback.frameIndex]
    : `/assets/original/potato${growthStage}_normal.png`

  const [displayedPotatoImage, setDisplayedPotatoImage] = useState(potatoImage)
  const [potatoSpinAngle, setPotatoSpinAngle] = useState(0)
  const potatoSpinAngleRef = useRef(0)
  const wasDraggedRef = useRef(false)
  const activePointerIdRef = useRef<number | null>(null)
  const potatoPointerAcceptedRef = useRef(false)
  const imgLoadRef = useRef<HTMLImageElement | null>(null)
  const potatoHitMapRef = useRef<PotatoHitMap | null>(null)
  const potatoHitMapRequestRef = useRef(0)
  useEffect(() => {
    if (potatoImage === displayedPotatoImage) return
    const img = new Image()
    imgLoadRef.current = img
    const apply = () => { if (imgLoadRef.current === img) setDisplayedPotatoImage(potatoImage) }
    img.onload = apply
    img.onerror = apply
    img.src = potatoImage
    return () => { imgLoadRef.current = null }
  }, [potatoImage])

  useEffect(() => {
    const requestId = ++potatoHitMapRequestRef.current
    const img = new Image()
    img.onload = () => {
      if (potatoHitMapRequestRef.current !== requestId) return
      const width = img.naturalWidth
      const height = img.naturalHeight
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const context = canvas.getContext('2d')
      if (!context) {
        potatoHitMapRef.current = null
        return
      }
      context.drawImage(img, 0, 0)
      const data = context.getImageData(0, 0, width, height).data
      const alpha = new Uint8ClampedArray(width * height)
      let left = width
      let right = 0
      let top = height
      let bottom = 0
      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          const value = data[(y * width + x) * 4 + 3]
          alpha[y * width + x] = value
          if (value > 18) {
            left = Math.min(left, x)
            right = Math.max(right, x)
            top = Math.min(top, y)
            bottom = Math.max(bottom, y)
          }
        }
      }
      potatoHitMapRef.current = {
        src: displayedPotatoImage,
        width,
        height,
        alpha,
        bounds: left <= right ? { left, right, top, bottom } : { left: 0, right: width - 1, top: 0, bottom: height - 1 },
      }
    }
    img.onerror = () => {
      if (potatoHitMapRequestRef.current === requestId) potatoHitMapRef.current = null
    }
    img.src = displayedPotatoImage
    return () => {
      if (potatoHitMapRequestRef.current === requestId) potatoHitMapRef.current = null
    }
  }, [displayedPotatoImage])

  const dayProgress = (game.day / TOTAL_TURNS) * 100
  const p = (game.day % 1) * 100
  const dayStyle = {
    // M1: background(축약형)와 backgroundClip 혼용 시 React가 매 렌더마다 경고를 출력하므로 backgroundImage 사용
    backgroundImage: `linear-gradient(to top, #f6b7cd 0%, #ffd9aa ${Math.max(0, p - 8)}%, #b9e7ff ${Math.min(100, p + 8)}%, #d8f7ee 100%)`,
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    color: 'transparent',
    display: 'inline-block',
    fontSize: '1em',
    lineHeight: 1,
    transform: 'none',
    textShadow: 'none',
    padding: '0.15em 0.08em',
    margin: '-0.15em 0',
    overflow: 'visible',
  }
  const dayMod = Math.floor(game.day) % 4
  const phaseClass = dayMod === 0 ? 'phase-night' : dayMod === 3 ? 'phase-sunset' : dayMod === 1 ? 'phase-morning' : 'phase-day'
  const skyStyle = getSkyStyle(game.day)
  const statusProfile = getStatusProfile(game.stats, game.day, game.initialStats)
  const activeCombo = getActiveCombo(game.plan, game.unlockedSlotsCount)

  // 식단 콤보가 새로 완성되면 goodpt 효과음
  const comboNameRef = useRef<string | null>(null)
  useEffect(() => {
    const name = activeCombo?.name ?? null
    if (name && comboNameRef.current !== name && game.screen === 'game') {
      playSound(GOOD_SOUND, 0.55)
    }
    comboNameRef.current = name
  }, [activeCombo?.name, game.screen])

  // 돼지 경고 단계가 올라가면 badpt 효과음
  const pigStageSoundRef = useRef(0)
  useEffect(() => {
    const active = game.screen === 'game' && game.careCount < PIG_FEED_CARE_THRESHOLD && game.day >= 20 && game.day < TOTAL_TURNS
    const progress = clamp((game.day - 20) / (TOTAL_TURNS - 20), 0, 1)
    const stage = active ? (progress < 0.4 ? 1 : progress < 0.75 ? 2 : 3) : 0
    if (stage > pigStageSoundRef.current) {
      playSound(BAD_SOUND, 0.6)
    }
    pigStageSoundRef.current = stage
  }, [game.day, game.careCount, game.screen])
  const visibleTouchCombo = getDecayedTouchCombo(game)
  const touchSpeedMultiplier = getTouchSpeedMultiplier(visibleTouchCombo)
  const skillButtonsDisabled =
    Boolean(game.activeEvent) || game.day >= TOTAL_TURNS
  const isGameInputLocked = game.screen !== 'game'

  useEffect(() => {
    const orientation = screen.orientation as
      | (ScreenOrientation & {
      lock?: (orientation: OrientationLockType) => Promise<void>
    })
      | undefined

    void orientation?.lock?.('landscape').catch(() => {
      // Browser/PWA builds may reject orientation locks until native packaging.
    })
  }, [])

  useEffect(() => {
    preloadSounds()
    preloadImages()
  }, [])

  useEffect(() => {
    if (game.screen === 'harvest' && game.currentEnding && !game.recordSaved) {
      setGame((prev) => ({ ...prev, recordSaved: true }))
      const existing = loadRecords()
      const newRecord: RunRecord = {
        id: Date.now(),
        name: game.potatoName,
        endingTitle: game.currentEnding.title,
        stats: { ...game.stats },
        savedAt: Date.now(),
      }
      saveRecords([...existing, newRecord])
    }
  }, [game.screen, game.recordSaved])

  // 돼지 퇴치: 보살핌이 30에 도달하는 순간 안내 메시지를 띄운다
  const prevCareCountRef = useRef(game.careCount)
  useEffect(() => {
    const prevCare = prevCareCountRef.current
    prevCareCountRef.current = game.careCount
    if (prevCare < PIG_FEED_CARE_THRESHOLD && game.careCount >= PIG_FEED_CARE_THRESHOLD && game.screen === 'game') {
      setGame((g) => ({
        ...g,
        currentMessage: '돼지가 포기하고 돌아갔습니다! 이제 사료가 될 걱정은 없어요.',
        messageLockedUntil: Date.now() + 5000,
        eventLog: ['돼지 퇴치 성공! (보살핌 30 달성)', ...g.eventLog].slice(0, 30),
      }))
    }
  }, [game.careCount, game.screen])

  // M2: 게임 화면일 때만 성장 틱을 돌려 타이틀/도감 화면에서의 배터리 소모를 줄인다
  const isGameTicking = game.screen === 'game'
  useEffect(() => {
    if (!isGameTicking) return
    const id = window.setInterval(() => {
      setGame((prev) => advanceTurn(prev))
    }, TURN_MS)

    return () => window.clearInterval(id)
  }, [isGameTicking])

  const gameStateRef = useRef(game)
  useEffect(() => {
    gameStateRef.current = game
  }, [game])

  useEffect(() => {
    const id = window.setInterval(() => {
      saveGameDirectly(gameStateRef.current)
    }, 5000)

    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    if (game.screen !== 'game') return

    const timer = window.setInterval(() => {
      setGame((prev) => {
        if (prev.screen !== 'game') return prev

        const now = Date.now()
        const currentCombo = getDecayedTouchCombo(prev, now)

        if (currentCombo >= 100) {
          const reachedAt = prev.combo100ReachedAt || now
          const currentDuration = Math.max(0, (now - reachedAt) / 1000)
          const maxDuration = Math.max(prev.combo100MaxDuration || 0, currentDuration)

          return {
            ...prev,
            combo100ReachedAt: reachedAt,
            combo100Duration: currentDuration,
            combo100MaxDuration: maxDuration,
          }
        } else {
          return {
            ...prev,
            combo100ReachedAt: null,
            combo100Duration: 0,
          }
        }
      })
    }, 200)

    return () => window.clearInterval(timer)
  }, [game.screen])

  useEffect(() => {
    const onBlurSave = () => saveGameDirectly(gameStateRef.current)
    window.addEventListener('visibilitychange', onBlurSave)
    window.addEventListener('beforeunload', onBlurSave)
    return () => {
      window.removeEventListener('visibilitychange', onBlurSave)
      window.removeEventListener('beforeunload', onBlurSave)
    }
  }, [])

  useEffect(() => {
    if (!game.actionPlayback) return

    const id = window.setTimeout(() => {
      setGame((prev) => {
        if (!prev.actionPlayback) return prev
        const frames = prev.actionPlayback.frames
        const nextFrame = prev.actionPlayback.frameIndex + 1
        if (nextFrame >= frames.length) {
          const nextLoop = prev.actionPlayback.loopCount + 1
          if (nextLoop >= 3) {
            return { ...prev, actionPlayback: null }
          }
          return {
            ...prev,
            actionPlayback: { ...prev.actionPlayback, frameIndex: 0, loopCount: nextLoop },
          }
        }
        return {
          ...prev,
          actionPlayback: { ...prev.actionPlayback, frameIndex: nextFrame },
        }
      })
    }, 220)

    return () => window.clearTimeout(id)
  }, [game.actionPlayback])

  // Play sleep sound on dgdg action start
  const prevActionKindRef = useRef<string | null>(null)
  useEffect(() => {
    const kind = game.actionPlayback?.kind ?? null
    if (kind && kind !== prevActionKindRef.current) {
      if (kind === 'dgdg') playSound(SLEEP_SOUND, 0.72)
    }
    prevActionKindRef.current = kind
  }, [game.actionPlayback?.kind])

  // BGM
  const bgmRef = useRef<HTMLAudioElement | null>(null)
  const bgmIndexRef = useRef(0)
  useEffect(() => {
    if (game.screen !== 'game' && game.screen !== 'intro') {
      bgmRef.current?.pause()
      return
    }
    if (isMuted || !isBgmOn) {
      bgmRef.current?.pause()
      return
    }
    if (bgmRef.current) {
      if (bgmRef.current.paused) {
        void bgmRef.current.play().catch(() => {})
      }
      return
    }
    // 트랙이 끝나면 항상 다음 트랙으로 이어지도록 재귀적으로 onended를 연결한다 (BGM 반복재생 버그 수정)
    const playTrack = (index: number) => {
      const audio = new Audio(BGM_TRACKS[index % BGM_TRACKS.length])
      audio.volume = 0.32
      audio.onended = () => {
        bgmIndexRef.current += 1
        playTrack(bgmIndexRef.current)
      }
      bgmRef.current = audio
      void audio.play().catch(() => {})
    }
    playTrack(bgmIndexRef.current)
    return () => { bgmRef.current?.pause() }
  }, [game.screen, isMuted, isBgmOn])

  useEffect(() => {
    if (!AUTO_ENDING_TEST && !AUTO_COLLECTION_TEST) return

    const id = window.setTimeout(() => {
      if (AUTO_COLLECTION_TEST) {
        setGame((prev) => ({
          ...prev,
          screen: 'collection',
          collectionReturnScreen: 'title',
        }))
        return
      }

      jumpToEndingForTest('ending')
    }, 80)

    return () => window.clearTimeout(id)
  }, [])

  function resetPlan(message: string): void {
    setGame((prev) => ({
      ...prev,
      plan: { morning: null, afternoon: null, evening: null },
      planCursor: 0,
      resolvingDay: true,
      currentMessage: message,
    }))
  }

  function beginSeedIntro(): void {
    playMenuClickSound(0.86)
    setHarvestStep(0)
    setShowAd(false)
    setShowAchievements(false)
    setShowSettings(false)
    setGame((prev) => ({
      ...createFreshState('intro'),
      unlockedEndingIds: prev.unlockedEndingIds,
      endingSeenCount: prev.endingSeenCount,
      lastEndingId: prev.lastEndingId,
      potatoName: prev.potatoName ?? '귀여운 감자',
      runCount: prev.runCount,
      toys: prev.toys,
      bonus: getClearBonusCount(prev.endingSeenCount, prev.unlockedEndingIds),
      currentMessage: '씨감자는 보통 감자를 여러 조각으로 나누어 심습니다. 같은 밭에서 태어나도 조각마다 타고난 재능은 조금씩 다릅니다.',
      messageLockedUntil: Date.now() + 5000,
      eventLog: ['씨감자 재능 확인 대기', ...prev.eventLog].slice(0, 30),
    }))
  }

  function rollSeedTalent(): void {
    playOriginalButtonVoice()
    setGame((prev) => {
      if (prev.screen !== 'intro') return prev
      if (prev.seedSlot.rolled && prev.seedSlot.rerolls <= 0) return prev

      const roll = rollSeedSlot(prev.seedSlot)
      const result = applySkillRanges(prev.stats, roll.stats)

      const nextState = {
        ...prev,
        stats: result.stats,
        seedSlot: roll.slot,
        currentMessage: roll.message,
        messageLockedUntil: Date.now() + 5000,
        eventLog: [`씨감자 슬롯: ${roll.slot.results.map((stat) => STAT_LABELS[stat]).join('/')}`, ...prev.eventLog].slice(0, 30),
      }
      saveGameDirectly(nextState)
      return nextState
    })
  }

  function startGameAfterIntro(potatoName: string): void {
    playMenuClickSound(0.86)
    setShowSettings(false)
    setGame((prev) => {
      if (prev.screen !== 'intro') return prev
      let nextState: GameState
      const finalName = potatoName ? potatoName : getRandomPotatoName()
      const nameMessage = potatoName ? `${finalName} 재배 시작!` : `이름을 비워두어 "${finalName}" 이름을 받았습니다.`
      if (!prev.seedSlot.rolled) {
        const roll = rollSeedSlot(prev.seedSlot)
        const result = applySkillRanges(prev.stats, roll.stats)
        nextState = {
          ...prev,
          stats: result.stats,
          initialStats: { ...result.stats },
          seedSlot: roll.slot,
          screen: 'game',
          potatoName: finalName,
          resolvingDay: true,
          currentMessage: `${nameMessage} ${roll.message} 이제 아침, 점심, 저녁 계획을 골라보세요.`,
          messageLockedUntil: Date.now() + 5000,
        }
      } else {
        const currentStats = { ...prev.stats }
        nextState = {
          ...prev,
          stats: currentStats,
          initialStats: { ...currentStats },
          screen: 'game',
          potatoName: finalName,
          resolvingDay: true,
          currentMessage: `${nameMessage} ${STAT_LABELS[prev.weekFocusStat]} 재능이 잘 받는 1주차입니다. 아침, 점심, 저녁 슬롯을 모두 채워보세요.`,
          messageLockedUntil: Date.now() + 5000,
          eventLog: ['재배 시작', ...prev.eventLog].slice(0, 30),
        }
      }
      
      // Set initialStats freeze point
      nextState.initialStats = { ...nextState.stats }
      saveGameDirectly(nextState)
      return nextState
    })
  }

  function openSettings(): void {
    playMenuClickSound(0.72)
    setShowSettings(true)
  }

  function closeSettings(): void {
    playSound(NO_SOUND, 0.58)
    setShowSettings(false)
  }

  function addTouchCombo(message: string, mood?: GameState['touchMood']): void {
    const now = Date.now()
    setGame((prev) => {
      if (prev.screen !== 'game' || prev.activeEvent || prev.day >= TOTAL_TURNS) return prev

      const elapsed = now - (prev.touchComboUpdatedAt || now)
      const decayed = getDecayedTouchCombo(prev, now)

      if (elapsed > 500) {
        return addCareCount({ ...prev, touchCombo: decayed, touchComboUpdatedAt: now, touchMood: mood ?? prev.touchMood })
      }

      const nextCombo = clamp(Math.floor(decayed) + 1, 0, TOUCH_COMBO_MAX)
      const speed = getTouchSpeedMultiplier(nextCombo)

      return {
        ...prev,
        careCount: Math.max(0, Math.floor((prev.careCount ?? 0) + 1)),
        touchCombo: nextCombo,
        touchComboUpdatedAt: now,
        touchMood: mood ?? prev.touchMood,
        currentMessage: message ? `${message} 터치콤보 ${nextCombo}콤보, 시간 속도 x${speed.toFixed(2)}` : prev.currentMessage,
        eventLog: [`터치콤보 ${nextCombo}`, ...prev.eventLog].slice(0, 30),
      }
    })
  }

  function onStageTap(event: React.MouseEvent<HTMLDivElement>): void {
    const target = event.target as HTMLElement
    if (target.closest('button, .dialog-panel, .stat-board, .time-tabs, .status-title, .week-badge, .touch-combo-meter')) return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    addSoilPuff(x, y)
    addTouchCombo('')
  }

  function selectSkill(skillId: string): void {
    if (game.activeEvent || game.day >= TOTAL_TURNS) {
      return
    }

    const selectedSkill = getSkill(skillId)
    if (!selectedSkill) return

    playOriginalButtonVoice()

    setGame((prev) => {
      if (prev.activeEvent || prev.day >= TOTAL_TURNS) {
        return prev
      }

      const slot = PLAN_SLOTS[prev.planCursor]
      const skill = getSkill(skillId)
      if (!skill) return prev

      const nextCursor = (prev.planCursor + 1) % prev.unlockedSlotsCount

      return {
        ...prev,
        careCount: Math.max(0, Math.floor((prev.careCount ?? 0) + 1)),
        plan: { ...prev.plan, [slot]: skillId },
        planCursor: nextCursor,
        currentMessage: `${PLAN_LABELS[slot]}에 ${skill.name} 배치 완료`,
        eventLog: [`${PLAN_LABELS[slot]}: ${skill.name}`, ...prev.eventLog].slice(0, 30),
      }
    })
  }

  function selectPlanSlot(slotIndex: number): void {
    if (game.activeEvent || game.day >= TOTAL_TURNS) return
    playSound(UI_SOUNDS[0], 0.6)
    setGame((prev) => ({
      ...prev,
      planCursor: slotIndex,
    }))
  }

  function cancelPlan(): void {
    if (game.activeEvent || game.day >= TOTAL_TURNS) return
    playSound(NO_SOUND, 0.9)
    resetPlan('계획 슬롯을 모두 비웠습니다.')
  }

  function resolveEventChoice(eventId: string, choiceId: string): void {
    const currentState = gameStateRef.current
    const event = currentState.activeEvent
    const choice = event?.choices.find((item) => item.id === choiceId)
    if (!event || event.id !== eventId || !choice) return

    let actualTone = choice.tone
    if (choiceId === 'worm_deal') {
      actualTone = currentState.stats.gram >= 350 ? 'good' : 'bad'
    } else if (choiceId === 'sweet_deal') {
      actualTone = currentState.stats.large >= 550 ? 'good' : 'bad'
    } else if (choiceId === 'landdog_deal') {
      actualTone = currentState.stats.hard >= 400 ? 'good' : 'bad'
    } else if (choiceId === 'doraji_deal') {
      actualTone = 'good'
    } else if (choiceId === 'bugs_deal') {
      actualTone = currentState.stats.regist >= 400 ? 'good' : 'bad'
    } else if (choiceId === 'dung_deal') {
      actualTone = 'good'
    }

    playSound(actualTone === 'good' ? GOOD_SOUND : BAD_SOUND, 0.86)

    setGame((prev) => {
      if (!prev.activeEvent || prev.activeEvent.id !== eventId) return prev

      let effects = choice.effects
      let resultMsg = choice.result
      const nextToys = { ...prev.toys }

      if (choiceId === 'worm_deal') {
        if (prev.stats.gram >= 350) {
          resultMsg = '지렁이와의 대결에서 무거운 몸집으로 승리해 지렁이 인형을 획득했습니다! (지렁이: 내가 주는 선물이니 사양말라구!)'
          effects = {}
          nextToys.worm = true
        } else {
          resultMsg = '지렁이가 감자를 얕보고 흙을 다 파헤쳐 몸뚱이를 튕겨냈습니다! (지렁이: 살이나 찌우렴!) 무게가 100g 증가했습니다.'
          effects = { gram: [100, 100] }
        }
      } else if (choiceId === 'sweet_deal') {
        if (prev.stats.large >= 550) {
          resultMsg = '고구마를 힘으로 밀어내고 고구마 인형을 획득했습니다! (고구마: 형님으로 모시겠구마!)'
          effects = {}
          nextToys.sweet = true
        } else {
          resultMsg = '고구마에게 밭 구석으로 힘껏 밀려나 몸에 흠집이 났습니다. 모양이 120 감소했습니다.'
          effects = { shape: [-120, -120] }
        }
      } else if (choiceId === 'landdog_deal') {
        if (prev.stats.hard >= 400) {
          resultMsg = '땅강아지의 날카로운 발톱을 단단한 몸으로 막아내고 손톱 인형을 획득했습니다! (땅강아지: 당신께 경의를 표합니다.)'
          effects = {}
          nextToys.landdog = true
        } else {
          resultMsg = '땅강아지의 앞발 공격에 몸 곳곳에 생채기가 났습니다! 크기 20, 무게 20, 모양 20 감소.'
          effects = { large: [-20, -20], gram: [-20, -20], shape: [-20, -20] }
        }
      } else if (choiceId === 'doraji_deal') {
        if (prev.stats.shape >= 500) {
          resultMsg = '도라지와의 외모 배틀에서 승리해 도라지꽃 인형을 획득했습니다! (도라지: 특별히 주는 선물이야!)'
          effects = {}
          nextToys.doraji = true
        } else {
          resultMsg = '도라지에게 외모 팩트 폭행을 당했습니다! 대신 쓴 도라지 즙을 마셔 면역력이 100 증가했습니다.'
          effects = { regist: [100, 100] }
        }
      } else if (choiceId === 'bugs_deal') {
        if (prev.stats.regist >= 400) {
          resultMsg = '강인한 면역력 덕분에 벌레 떼의 습격에도 아무런 피해를 입지 않고 버텨냈습니다!'
          effects = {}
        } else {
          resultMsg = '벌레들에게 몸을 처참히 갉아먹혔습니다! 무게 125, 크기 125, 모양 25, 면역력 25, 영양가 25 감소.'
          effects = { gram: [-125, -125], large: [-125, -125], shape: [-25, -25], regist: [-25, -25], nutri: [-25, -25] }
        }
      } else if (choiceId === 'dung_deal') {
        if (prev.stats.nutri >= 350) {
          resultMsg = '거름씨와 건강하게 인사를 나눴습니다. (거름: 딱 봐도 건강해 보여! 다른 채소에게 가볼게.)'
          effects = {}
        } else {
          resultMsg = '영양 부족 진단을 받고 거름씨의 양분을 듬뿍 받아들였습니다! 영양가 100 증가.'
          effects = { nutri: [100, 100] }
        }
      } else if (event.id === 'mystery_tutorial' && choice.id === 'tutorial_listen') {
        const weakest = [...STAT_KEYS].sort((a, b) => prev.stats[a] - prev.stats[b])[0]
        effects = { [weakest]: [32, 58] }
      }

      const result = applySkillRanges(prev.stats, effects, prev.day >= HARVEST_RUSH_TURN ? 1.35 : 1)
      const seen = prev.eventSeen[event.id] ?? 0

      // Bad stats visual check (when stats decrease by 10 points or more)
      const affectedBadStats: Partial<Record<StatKey, boolean>> = {}
      let hasBad = false
      for (const key of STAT_KEYS) {
        const delta = result.stats[key] - prev.stats[key]
        if (delta <= -10) {
          affectedBadStats[key] = true
          hasBad = true
        }
      }
  if (hasBad) {
        setTimeout(() => {
          setBadStats((bs) => ({ ...bs, ...affectedBadStats }))
          setTimeout(() => {
            setBadStats((bs) => {
              const next = { ...bs }
              for (const k in affectedBadStats) {
                next[k as StatKey] = false
              }
              return next
            })
          }, 4000)
        }, 0)
      }

      const nextState = {
        ...prev,
        stats: result.stats,
        careCount: Math.max(0, Math.floor((prev.careCount ?? 0) + 1)),
        toys: nextToys,
        activeEvent: null,
        eventSeen: { ...prev.eventSeen, [event.id]: seen + 1 },
        currentMessage: resultMsg,
        messageLockedUntil: Date.now() + 5000,
        eventLog: [`${event.title}: ${choice.label}`, ...prev.eventLog].slice(0, 30),
      }
      setEventResultMessage(resultMsg)
      saveGameDirectly(nextState)
      return nextState
    })
  }

  function clickToy(toyKey: 'worm' | 'sweet' | 'landdog' | 'doraji'): void {
    playSound(GOOD_SOUND, 0.72)
    setGame((prev) => {
      const nextStats = { ...prev.stats }
      const statMap: Record<string, StatKey> = {
        worm: 'gram',
        sweet: 'large',
        landdog: 'hard',
        doraji: 'shape',
      }
      const targetStat = statMap[toyKey]
      nextStats[targetStat] = clamp(nextStats[targetStat] + 1, 0, 1600)

      return {
        ...prev,
        stats: nextStats,
        currentMessage: `장식 인형을 터치하여 ${STAT_LABELS[targetStat]}이(가) 1 증가했습니다!`,
        eventLog: [`장식 터치: ${STAT_LABELS[targetStat]} +1`, ...prev.eventLog].slice(0, 30),
      }
    })
  }

  function startNewRun(): void {
    playMenuClickSound(0.86)
    setHarvestStep(0)
    setShowAd(false)
    setGame((prev) => {
      const nextRunCount = prev.runCount + 1
      const totalClears = getClearBonusCount(prev.endingSeenCount, prev.unlockedEndingIds)
      const nextState = {
        ...createFreshState('intro'),
        unlockedEndingIds: prev.unlockedEndingIds,
        endingSeenCount: prev.endingSeenCount,
        lastEndingId: prev.lastEndingId,
        runCount: nextRunCount,
        bonus: totalClears,
        unlockedSlotsCount: 3,
        toys: prev.toys,
        eventLog: [`회차 ${nextRunCount + 1} 시작`, ...prev.eventLog].slice(0, 30),
        currentMessage: '새 씨감자가 준비되었습니다. 슬롯으로 타고난 재능을 확인하고 이름을 정하세요.',
      }
      saveGameDirectly(nextState)
      return nextState
    })
  }

  function openCollection(): void {
    playSound(NO_SOUND, 0.72)
    setGame((prev) => ({
      ...prev,
      collectionReturnScreen: prev.screen === 'collection' ? prev.collectionReturnScreen : prev.screen,
      screen: 'collection',
    }))
  }

  function closeCollection(): void {
    setGame((prev) => ({ ...prev, screen: 'title' }))
  }

  function resumeCollection(): void {
    playMenuClickSound(0.86)
    setGame((prev) => ({ ...prev, screen: prev.collectionReturnScreen }))
  }

  function jumpToEndingForTest(nextScreen: 'ending' | 'collection' = 'ending'): void {
    if (!FAST_TEST_MODE) return

    playMenuClickSound(0.86)
    setGame((prev) => {
      const endingState = { ...prev, day: TOTAL_TURNS, activeEvent: null, resolvingDay: false }
      const endingResult = pickEnding(endingState)
      const unlockedEndingIds = prev.unlockedEndingIds.includes(endingResult.endingId)
        ? prev.unlockedEndingIds
        : [...prev.unlockedEndingIds, endingResult.endingId]
      const endingSeenCount = {
        ...prev.endingSeenCount,
        [endingResult.endingId]: (prev.endingSeenCount[endingResult.endingId] ?? 0) + 1,
      }

      return {
        ...prev,
        day: TOTAL_TURNS,
        activeEvent: null,
        resolvingDay: false,
        actionPlayback: null,
        screen: nextScreen === 'ending' ? 'harvest' : nextScreen,
        currentEnding: endingResult,
        unlockedEndingIds,
        endingSeenCount,
        lastEndingId: endingResult.endingId,
        bonus: getClearBonusCount(endingSeenCount, unlockedEndingIds),
        currentMessage: `테스트 모드: "${endingResult.title}" 엔딩을 바로 확인합니다.`,
        eventLog: [`테스트 엔딩: ${endingResult.title}`, ...prev.eventLog].slice(0, 30),
      }
    })
  }

  function onTapPotato(event: React.MouseEvent<HTMLButtonElement>): void {
    event.stopPropagation()
    if (!potatoPointerAcceptedRef.current && event.detail !== 0) return
    potatoPointerAcceptedRef.current = false
    if (wasDraggedRef.current) {
      wasDraggedRef.current = false
      return
    }
    playSound(GOOD_SOUND, 0.72)
    addTouchCombo('', 'smile')
    const x = 42 + Math.random() * 20
    const y = 22 + Math.random() * 16
    addFloatingWord(getLocalizedPhrase('touch', lang), x, y)
    window.setTimeout(() => {
      setGame((prev) => ({ ...prev, touchMood: 'idle' }))
    }, 600)
  }

  function getPotatoRollMass(): number {
    return 1 + Math.max(0, growthStage - 1) * 0.13
  }

  function normalizeSpinAngle(angle: number): number {
    return ((((angle + 180) % 360) + 360) % 360) - 180
  }

  function getPointerSpinAngle(x: number, y: number, centerX: number, centerY: number): number {
    return Math.atan2(y - centerY, x - centerX) * 180 / Math.PI
  }

  function hasOpaquePotatoPixel(map: PotatoHitMap, imageX: number, imageY: number): boolean {
    const px = Math.round(imageX)
    const py = Math.round(imageY)
    for (let y = py - 1; y <= py + 1; y += 1) {
      for (let x = px - 1; x <= px + 1; x += 1) {
        if (x < 0 || y < 0 || x >= map.width || y >= map.height) continue
        if (map.alpha[y * map.width + x] > 18) return true
      }
    }
    return false
  }

  function getPotatoHitInfo(actor: HTMLButtonElement, clientX: number, clientY: number): PotatoHitInfo {
    const rect = actor.getBoundingClientRect()
    const rectCenterX = rect.left + rect.width / 2
    const rectCenterY = rect.top + rect.height / 2
    const map = potatoHitMapRef.current

    if (!map || map.src !== displayedPotatoImage || rect.width <= 0 || rect.height <= 0) {
      const dx = clientX - rectCenterX
      const dy = clientY - rectCenterY
      const rx = rect.width * 0.38
      const ry = rect.height * 0.38
      return {
        hit: (dx / rx) ** 2 + (dy / ry) ** 2 <= 1,
        centerX: rectCenterX,
        centerY: rectCenterY,
        radius: Math.min(rx, ry),
      }
    }

    const angle = -potatoSpinAngleRef.current * Math.PI / 180
    const localX = clientX - rect.left
    const localY = clientY - rect.top
    const dx = localX - rect.width / 2
    const dy = localY - rect.height / 2
    const unrotatedX = rect.width / 2 + dx * Math.cos(angle) - dy * Math.sin(angle)
    const unrotatedY = rect.height / 2 + dx * Math.sin(angle) + dy * Math.cos(angle)
    const imageX = (unrotatedX / rect.width) * map.width
    const imageY = (unrotatedY / rect.height) * map.height
    const boundsCenterX = (map.bounds.left + map.bounds.right) / 2
    const boundsCenterY = (map.bounds.top + map.bounds.bottom) / 2
    const centerLocalX = (boundsCenterX / map.width) * rect.width
    const centerLocalY = (boundsCenterY / map.height) * rect.height
    const forwardAngle = potatoSpinAngleRef.current * Math.PI / 180
    const centerDx = centerLocalX - rect.width / 2
    const centerDy = centerLocalY - rect.height / 2
    const centerX = rectCenterX + centerDx * Math.cos(forwardAngle) - centerDy * Math.sin(forwardAngle)
    const centerY = rectCenterY + centerDx * Math.sin(forwardAngle) + centerDy * Math.cos(forwardAngle)
    const visibleWidth = ((map.bounds.right - map.bounds.left + 1) / map.width) * rect.width
    const visibleHeight = ((map.bounds.bottom - map.bounds.top + 1) / map.height) * rect.height

    return {
      hit: imageX >= 0 && imageY >= 0 && imageX < map.width && imageY < map.height && hasOpaquePotatoPixel(map, imageX, imageY),
      centerX,
      centerY,
      radius: Math.min(visibleWidth, visibleHeight) / 2,
    }
  }

  function applyPotatoSpinAngle(angle: number): void {
    const normalized = normalizeSpinAngle(angle)
    potatoSpinAngleRef.current = normalized
    setPotatoSpinAngle(normalized)
  }

  function cancelSpinAnimations(): void {
    if (spinRef.current) {
      cancelAnimationFrame(spinRef.current.rafId)
      spinRef.current = null
    }
    if (spinSettleRef.current) {
      cancelAnimationFrame(spinSettleRef.current.rafId)
      spinSettleRef.current = null
    }
  }

  function settlePotatoSpin(): void {
    if (spinSettleRef.current) cancelAnimationFrame(spinSettleRef.current.rafId)
    const settle = { velocity: 0, rafId: 0, lastTime: performance.now() }
    spinSettleRef.current = settle

    const tick = (time: number) => {
      if (spinSettleRef.current !== settle) return
      const dt = clamp((time - settle.lastTime) / 1000, 0.001, 0.04)
      settle.lastTime = time
      const angle = potatoSpinAngleRef.current
      const mass = getPotatoRollMass()
      const spring = 34 / mass
      const damping = Math.pow(0.76, dt * 60)

      settle.velocity += -angle * spring * dt
      settle.velocity *= damping
      const nextAngle = angle + settle.velocity * dt

      if (Math.abs(nextAngle) < 0.25 && Math.abs(settle.velocity) < 5) {
        applyPotatoSpinAngle(0)
        spinSettleRef.current = null
        return
      }

      applyPotatoSpinAngle(nextAngle)
      settle.rafId = requestAnimationFrame(tick)
    }

    settle.rafId = requestAnimationFrame(tick)
  }

  function startMomentumSpin(initialVelocity: number, direction: number): void {
    cancelSpinAnimations()
    if (initialVelocity < 0.05) {
      setGame((prev) => ({ ...prev, touchMood: 'idle', dragPower: 0 }))
      settlePotatoSpin()
      return
    }
    const mass = getPotatoRollMass()
    const decay = clamp(0.942 - (growthStage - 1) * 0.008, 0.865, 0.942)
    const now = performance.now()
    const spin = {
      velocity: (initialVelocity / mass) * 900,
      direction: direction || 1,
      comboBuffer: 0,
      rafId: 0,
      lastTime: now,
      lastGameUpdate: now,
    }
    spinRef.current = spin
    const tick = (time: number) => {
      if (spinRef.current !== spin) return
      const dt = clamp((time - spin.lastTime) / 1000, 0.001, 0.04)
      spin.lastTime = time
      spin.velocity *= Math.pow(decay, dt * 60)
      if (spin.velocity < 18) {
        spinRef.current = null
        setGame((prev) => ({ ...prev, touchMood: 'idle', dragPower: 0 }))
        settlePotatoSpin()
        return
      }
      applyPotatoSpinAngle(potatoSpinAngleRef.current + spin.direction * spin.velocity * dt)
      spin.comboBuffer += (spin.velocity / 560) * (dt * 60) * 0.35
      const gain = Math.floor(spin.comboBuffer)
      spin.comboBuffer -= gain
      if (time - spin.lastGameUpdate >= 70 || gain > 0) setGame((prev) => {
        if (prev.screen !== 'game' || prev.activeEvent || prev.day >= TOTAL_TURNS) {
          spinRef.current = null
          settlePotatoSpin()
          return { ...prev, touchMood: 'idle', dragPower: 0 }
        }
        spin.lastGameUpdate = time
        const currentTime = Date.now()
        const decayed = getDecayedTouchCombo(prev, currentTime)
        const nextCombo = gain > 0 ? clamp(decayed + gain, 0, TOUCH_COMBO_MAX) : decayed
        if (currentTime - lastRollWordTimeRef.current > 500) {
          lastRollWordTimeRef.current = currentTime
          const wx = 36 + Math.random() * 32
          const wy = 28 + Math.random() * 28
          addFloatingWord(getLocalizedPhrase('roll', lang), wx, wy)
        }
        return {
          ...prev,
          touchMood: 'roll',
          dragPower: clamp(spin.velocity / 700, 0, 1),
          touchCombo: nextCombo,
          touchComboUpdatedAt: currentTime,
        }
      })
      spin.rafId = requestAnimationFrame(tick)
    }
    spin.rafId = requestAnimationFrame(tick)
  }

  function onPointerDown(event: React.PointerEvent<HTMLButtonElement>): void {
    // 멀티터치 방지: 이미 다른 손가락이 감자를 잡고 있으면 두 번째 손가락은 무시
    // (두 손가락 번갈아 터치 시 의도치 않게 회전하던 문제 수정)
    if (activePointerIdRef.current !== null && activePointerIdRef.current !== event.pointerId) {
      event.preventDefault()
      event.stopPropagation()
      return
    }
    wasDraggedRef.current = false
    potatoPointerAcceptedRef.current = false
    const now = Date.now()
    const hitInfo = getPotatoHitInfo(event.currentTarget, event.clientX, event.clientY)
    if (!hitInfo.hit) {
      event.preventDefault()
      event.stopPropagation()
      return
    }
    potatoPointerAcceptedRef.current = true
    activePointerIdRef.current = event.pointerId
    try {
      event.currentTarget.setPointerCapture(event.pointerId)
    } catch {
      // Some synthetic or already-released pointer events cannot be captured.
    }
    cancelSpinAnimations()
    const centerX = hitInfo.centerX
    const centerY = hitInfo.centerY
    const startDx = event.clientX - centerX
    const startDy = event.clientY - centerY
    // 타원 영역 밖(투명 영역) 클릭은 무시: (dx/rx)²+(dy/ry)² > 1 이면 return
    const startDistance = Math.sqrt(startDx * startDx + startDy * startDy)
    const isTouchOnly = startDistance < Math.max(14, hitInfo.radius * 0.18)

    dragStartRef.current = {
      x: event.clientX, y: event.clientY,
      centerX, centerY,
      prevAngle: getPointerSpinAngle(event.clientX, event.clientY, centerX, centerY),
      prevX: event.clientX, prevY: event.clientY, prevTime: now,
      lastMoveSpeed: 0, lastMoveDx: 0, lastMoveDy: 0, lastAngularVelocity: 0, sessionCombo: 0, comboBuffer: 0,
      isTouchOnly,
    }
  }

  function onPointerMove(event: React.PointerEvent<HTMLButtonElement>): void {
    if (!dragStartRef.current || dragStartRef.current.isTouchOnly) return
    if (activePointerIdRef.current !== null && event.pointerId !== activePointerIdRef.current) return
    const now = Date.now()
    const dx = event.clientX - dragStartRef.current.x
    const dy = event.clientY - dragStartRef.current.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    if (distance <= 20) return

    wasDraggedRef.current = true

    const dt = Math.max(8, now - dragStartRef.current.prevTime)
    const moveDx = event.clientX - dragStartRef.current.prevX
    const moveDy = event.clientY - dragStartRef.current.prevY
    const moveSpeed = Math.sqrt(moveDx * moveDx + moveDy * moveDy) / dt // px/ms
    const mass = getPotatoRollMass()
    const nextAngle = getPointerSpinAngle(event.clientX, event.clientY, dragStartRef.current.centerX, dragStartRef.current.centerY)
    const rawAngleDelta = normalizeSpinAngle(nextAngle - dragStartRef.current.prevAngle)
    const radius = Math.sqrt(
      (event.clientX - dragStartRef.current.centerX) ** 2 +
      (event.clientY - dragStartRef.current.centerY) ** 2
    )
    const angleDelta = radius > 18 ? rawAngleDelta : ((moveDx * 0.55) + (moveDy * 0.18)) / mass

    dragStartRef.current.prevX = event.clientX
    dragStartRef.current.prevY = event.clientY
    dragStartRef.current.prevTime = now
    dragStartRef.current.prevAngle = nextAngle
    dragStartRef.current.lastMoveSpeed = moveSpeed
    dragStartRef.current.lastMoveDx = moveDx
    dragStartRef.current.lastMoveDy = moveDy
    dragStartRef.current.lastAngularVelocity = angleDelta / (dt / 1000)
    applyPotatoSpinAngle(potatoSpinAngleRef.current + angleDelta / mass)

    if (now - lastRollWordTimeRef.current > 600 && moveSpeed > 0.3) {
      lastRollWordTimeRef.current = now
      const wx = 36 + Math.random() * 32
      const wy = 28 + Math.random() * 28
      addFloatingWord(getLocalizedPhrase('roll', lang), wx, wy)
    }

    const power = clamp(distance / (130 * mass), 0, 1)
    const SESSION_CAP = 10

    dragStartRef.current.comboBuffer += Math.max(moveSpeed * 2, Math.abs(angleDelta) / 28)
    const gain = Math.floor(dragStartRef.current.comboBuffer)
    const remaining = SESSION_CAP - dragStartRef.current.sessionCombo
    const actualGain = Math.min(gain, remaining)

    if (actualGain > 0) {
      dragStartRef.current.comboBuffer -= actualGain
      dragStartRef.current.sessionCombo += actualGain
      setGame((prev) => {
        if (prev.screen !== 'game' || prev.activeEvent || prev.day >= TOTAL_TURNS) return prev
        const elapsed = now - (prev.touchComboUpdatedAt || now)
        const decayed = getDecayedTouchCombo(prev, now)
        if (elapsed > 500) return { ...prev, touchCombo: decayed, touchComboUpdatedAt: now, touchMood: 'roll', dragPower: power }
        const nextCombo = clamp(decayed + actualGain, 0, TOUCH_COMBO_MAX)
        return {
          ...prev,
          touchMood: 'roll', dragPower: power,
          touchCombo: nextCombo, touchComboUpdatedAt: now,
          currentMessage: prev.currentMessage,
        }
      })
    } else {
      if (gain > 0) dragStartRef.current.comboBuffer -= gain
      setGame((prev) => ({ ...prev, touchMood: 'roll', dragPower: power }))
    }
  }

  function onPointerUp(event?: React.PointerEvent<HTMLButtonElement>): void {
    if (!dragStartRef.current) return
    if (event && activePointerIdRef.current !== null && event.pointerId !== activePointerIdRef.current) return
    if (event?.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    if (dragStartRef.current.isTouchOnly) {
      dragStartRef.current = null
      activePointerIdRef.current = null
      if (event?.type === 'pointercancel') potatoPointerAcceptedRef.current = false
      // 회전된 상태로 멈춰 있으면 중력(스프링)으로 원위치 복귀 (B: 되돌아오지 않는 문제 수정)
      if (Math.abs(potatoSpinAngleRef.current) > 0.5 && !spinRef.current && !spinSettleRef.current) {
        settlePotatoSpin()
      }
      return
    }
    const now = Date.now()
    const dt = now - dragStartRef.current.prevTime
    const lastSpeed = dt < 150 ? dragStartRef.current.lastMoveSpeed : 0
    const angularVelocity = dt < 170 ? dragStartRef.current.lastAngularVelocity : 0
    const direction = Math.sign(angularVelocity)
    const spinSpeed = Math.max(lastSpeed / 1.15, Math.abs(angularVelocity) / 520)
    if (wasDraggedRef.current) {
      setGame((prev) => {
        if (prev.screen !== 'game' || prev.activeEvent || prev.day >= TOTAL_TURNS) return prev
        return addCareCount(prev)
      })
    }
    dragStartRef.current = null
    activePointerIdRef.current = null
    if (event?.type === 'pointercancel') potatoPointerAcceptedRef.current = false
    startMomentumSpin(clamp(spinSpeed, 0, 1.65), direction || 1)
  }

  return (
    <main className={`app ${phaseClass} screen-${game.screen} lang-${lang}`}>
      <div className="app-blurred-bg" aria-hidden="true" />
      <aside className="rotate-lock" role="alert">
        <div className="rotate-phone" aria-hidden="true" />
        <strong>{t('가로 모드 전용')}</strong>
        <p>{t('폰을 가로로 돌려서 진행하세요.')}</p>
      </aside>

      <section className="game-shell">
        <div className={`legacy-stage screen-${game.screen} stage-${growthStage}`} onClick={onStageTap}>
          <div className="stage-sky" style={skyStyle} aria-hidden="true" />
          <div className="stage-background" style={{ backgroundImage: 'url(/assets/original/back_front.png)', filter: getStageFilter(game.day) }} />
          <div className="day-badge">
            <span>DAY</span>
            <strong style={dayStyle}>{Math.floor(game.day)}</strong>
          </div>

          <WeekBadge weekIndex={game.weekIndex} focusStat={game.weekFocusStat} lang={lang} />
          <TouchComboMeter combo={visibleTouchCombo} speed={touchSpeedMultiplier} />

          <TimeTabs
            plan={game.plan}
            planCursor={game.planCursor}
            unlockedSlotsCount={game.unlockedSlotsCount}
            onSelectSlot={selectPlanSlot}
            comboClass={activeCombo?.colorClass ?? ''}
            lang={lang}
          />

          {activeCombo && (
            <div className={`combo-badge ${activeCombo.colorClass}`}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <img src="/assets/original/good_icon.png" alt="" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
                {t(activeCombo.name)} (x{activeCombo.multiplier.toFixed(2)})
              </span>
            </div>
          )}

            <div className="bonus-badge">
              <div className="bonus-label">
              <span>{t('다회차')}</span>
              <span>{t('성장 보너스')}</span>
              </div>
            <strong>+{game.bonus}</strong>
          </div>

          <div className="status-title">
            <span className="status-kicker">🥔 {t('현재 상태')}</span>
            <strong>{t(statusProfile.title)}</strong>
            <em>{splitHintIntoTwoLines(t(statusProfile.hint))}</em>
          </div>

          {game.screen === 'game' && (
            <PigWarning day={game.day} careCount={game.careCount} lang={lang} />
          )}

          <StatBoard
            potatoName={getDisplayPotatoName(game.potatoName, lang)}
            stats={game.stats}
            boostedStats={activeCombo?.boostedStats ?? []}
            plan={game.plan}
            unlockedSlotsCount={game.unlockedSlotsCount}
            day={game.day}
            resolvingDay={game.resolvingDay}
            harvestFocus={game.harvestFocus}
            badStats={badStats}
            lang={lang}
          />

          {/* Toys on Stage */}
          {game.toys.worm && (
            <button
              type="button"
              className="toy-item toy-worm"
              onClick={() => clickToy('worm')}
            >
              <img src="/assets/original/toy_worm.png" alt="Worm Toy" />
            </button>
          )}
          {game.toys.sweet && (
            <button
              type="button"
              className="toy-item toy-sweet"
              onClick={() => clickToy('sweet')}
            >
              <img src="/assets/original/toy_sweetpotato.png" alt="Sweetpotato Toy" />
            </button>
          )}
          {game.toys.landdog && (
            <button
              type="button"
              className="toy-item toy-landdog"
              onClick={() => clickToy('landdog')}
            >
              <img src="/assets/original/toy_landdog.png" alt="Landdog Toy" />
            </button>
          )}
          {game.toys.doraji && (
            <button
              type="button"
              className="toy-item toy-doraji"
              onClick={() => clickToy('doraji')}
            >
              <img src="/assets/original/toy_doraji.png" alt="Doraji Toy" />
            </button>
          )}

          <button
            type="button"
            className={`potato-actor potato-${game.touchMood} stage-${growthStage}`}
            onClick={isGameInputLocked ? undefined : onTapPotato}
            disabled={isGameInputLocked}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <img
              src={displayedPotatoImage}
              alt=""
              className="potato-image"
              style={{ '--spin-rot': `${potatoSpinAngle}deg` } as React.CSSProperties}
            />
          </button>

          {soilPuffs.map(p => (
            <div key={p.id} className="soil-puff" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
              <span /><span /><span /><span /><span /><span /><span /><span />
            </div>
          ))}

          {floatingWords.map(w => (
            <div
              key={w.id}
              className="floating-word"
              style={{ left: `${w.x}%`, top: `${w.y}%`, '--rot': `${w.rot}deg` } as React.CSSProperties}
            >
              {w.text}
            </div>
          ))}

          <SkillButtons plan={game.plan} disabled={skillButtonsDisabled || isGameInputLocked} onSelect={selectSkill} focusStat={game.weekFocusStat} lang={lang} />

          <div className="quick-controls" aria-label={t('계획 실행 제어')}>
            <button
              type="button"
              className="memo-action-btn memo-plan-btn"
              onClick={cancelPlan}
              disabled={isGameInputLocked || Boolean(game.activeEvent)}
              title={t('계획 비우기')}
              aria-label={t('계획 비우기')}
            >
              <img src="/assets/original/memo1.png" className="memo-frame-img" alt="" aria-hidden="true" />
              <strong>{t('재계획')}</strong>
            </button>
            <div className="quick-control-group">
              <button type="button" className="memo-action-btn memo-table-btn" onClick={openCollection}>
                <img src="/assets/original/memo3.png" className="memo-frame-img" alt="" aria-hidden="true" />
                <strong>{t('테이블')}</strong>
              </button>
              <button
                type="button"
                className="memo-action-btn memo-settings-btn"
                onClick={openSettings}
                disabled={isGameInputLocked}
                title={t('설정')}
                aria-label={t('설정')}
              >
                <img src="/assets/original/memo5.png" className="memo-frame-img" alt="" aria-hidden="true" />
                <strong>{t('설정')}</strong>
              </button>
            </div>
            {FAST_TEST_MODE ? (
              <button type="button" className="table-btn test-btn" onClick={() => jumpToEndingForTest()} disabled={isGameInputLocked}>
                {t('엔딩')}
              </button>
            ) : null}
          </div>

          <div className="day-progress" aria-label={`${t('진행도')} ${dayProgress}%`}>
            <span style={{ width: `${dayProgress}%` }} />
          </div>

          <EventPanel event={game.activeEvent} onChoice={resolveEventChoice} lang={lang} />

          {eventResultMessage && (
            <div
              className="event-result-overlay"
              onClick={() => setEventResultMessage(null)}
              role="dialog"
              aria-modal="true"
            >
              <div className="event-result-box">
                <p className="event-result-text">{t(eventResultMessage)}</p>
                <span className="event-result-hint">{t('화면을 터치하면 닫힙니다')}</span>
              </div>
            </div>
          )}

          {game.screen === 'title' ? (
            <TitleOverlay
              onStart={beginSeedIntro}
              onCollection={openCollection}
              onAchievements={() => setShowAchievements(true)}
              onShowRecords={() => setShowTitleRecords(true)}
              onShowSettings={openSettings}
              lang={lang}
            />
          ) : null}

          {showAchievements ? (
            <AchievementsOverlay
              game={game}
              lang={lang}
              onClose={() => setShowAchievements(false)}
            />
          ) : null}

          {game.screen === 'intro' ? (
            <SeedIntroOverlay
              seedSlot={game.seedSlot}
              onRoll={rollSeedTalent}
              onStart={startGameAfterIntro}
              lang={lang}
            />
          ) : null}

          {showSettings && (
            <SettingsOverlay
              lang={lang}
              setLang={setLang}
              isMuted={isMuted}
              setIsMuted={setIsMuted}
              isBgmOn={isBgmOn}
              setIsBgmOn={setIsBgmOn}
              onClose={closeSettings}
            />
          )}

          {game.screen === 'harvest' ? (
            <HarvestOverlay
              lang={lang}
              step={harvestStep}
              ending={game.currentEnding}
              onNext={() => {
                if (harvestStep < 5) {
                  playMenuClickSound(0.86)
                  setHarvestStep(harvestStep + 1)
                } else if (harvestStep === 5) {
                  playMenuClickSound(0.86)
                  setHarvestStep(6)
                }
              }}
              onConfirmAd={async () => {
                if (adInFlightRef.current) return // 연속 조작으로 광고가 중복 호출되는 것 방지
                adInFlightRef.current = true
                playMenuClickSound(0.86)
                setIsAdLoading(true)
                let success = false
                try {
                  success = await playRewardedAd()
                } catch (err) {
                  console.error('Rewarded ad error:', err)
                  success = false
                } finally {
                  setIsAdLoading(false)
                  adInFlightRef.current = false
                }
                if (success) {
                  unlockCurrentEndingAndShow()
                } else {
                  setAdNotice(lang === 'ko'
                    ? '광고 시청이 완료되지 않았습니다. 엔딩을 보려면 광고를 끝까지 시청해야 합니다.'
                    : 'Ad watch not completed. You must watch the ad to view the ending.'
                  )
                }
              }}
              onCancel={() => {
                playSound(NO_SOUND, 0.86)
                setGame((prev) => ({ ...prev, screen: 'title' }))
              }}
            />
          ) : null}

          {showAd ? (
            <AdOverlay
              lang={lang}
              onComplete={() => {
                setShowAd(false)
                if ((window as any).onMockAdComplete) {
                  (window as any).onMockAdComplete(true)
                  delete (window as any).onMockAdComplete
                } else {
                  unlockCurrentEndingAndShow()
                }
              }}
            />
          ) : null}

          {isAdLoading && (
            <div style={{
              position: 'absolute',
              inset: 0,
              zIndex: 1000,
              background: 'rgba(0, 0, 0, 0.8)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontFamily: 'Yangjin, sans-serif',
            }}>
              <div style={{ fontSize: '20px', color: '#ffeb3b', marginBottom: '10px' }}>
                🎬 {t('광고 준비 중...')}
              </div>
              <div style={{ fontSize: '14px', color: '#ccc' }}>
                {t('잠시만 기다려주세요.')}
              </div>
            </div>
          )}

          {adNotice && (
            <div
              style={{
                position: 'absolute', inset: 0, zIndex: 1001,
                background: 'rgba(0, 0, 0, 0.65)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              onClick={() => setAdNotice(null)}
            >
              <div
                style={{
                  background: '#fffbe9', border: '4px solid #6b4a2b', borderRadius: '18px',
                  padding: '22px 26px', maxWidth: '320px', textAlign: 'center',
                  fontFamily: 'Gaegu, cursive', color: '#4a2814',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ fontSize: '30px', marginBottom: '8px' }}>📺</div>
                <p style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 14px' }}>{adNotice}</p>
                <button
                  type="button"
                  onClick={() => setAdNotice(null)}
                  style={{
                    fontFamily: 'inherit', fontSize: '17px', fontWeight: 900,
                    background: '#ffd34d', border: '3px solid #6b4a2b', borderRadius: '12px',
                    padding: '8px 22px', cursor: 'pointer', color: '#4a2814',
                  }}
                >
                  {t('확인')}
                </button>
              </div>
            </div>
          )}

          {game.screen === 'ending' ? (
            <EndingOverlay
              ending={game.currentEnding}
              seenCount={game.currentEnding ? (game.endingSeenCount[game.currentEnding.endingId] ?? 1) : 1}
              onRestart={startNewRun}
              onCollection={openCollection}
              lang={lang}
            />
          ) : null}

          {game.screen === 'collection' ? (
            <CollectionOverlay
              unlockedIds={game.unlockedEndingIds}
              seenCount={game.endingSeenCount}
              onClose={closeCollection}
              onRestart={startNewRun}
              onResume={resumeCollection}
              returnScreen={game.collectionReturnScreen}
              lang={lang}
            />
          ) : null}

          {game.screen === 'game' ? (() => {
            const translatedMessage = t(game.currentMessage)
            const pages = splitIntoPages(translatedMessage)
            const pageText = pages[msgPage] ?? ''
            const hasMore = msgPage < pages.length - 1
            const isLong = pageText.length > 26
            return (
              <div
                className={`dialog-panel ${isLong ? 'is-long' : 'is-short'}`}
                onClick={hasMore ? () => setMsgPage(p => p + 1) : undefined}
                style={hasMore ? { cursor: 'pointer' } : undefined}
              >
                <p>{renderDialogMessage(pageText, lang)}</p>
                {hasMore && <span className="dialog-next">NEXT ▼</span>}
              </div>
            )
          })() : null}

          {showTitleRecords && <RecordsOverlay onClose={() => setShowTitleRecords(false)} lang={lang} />}

          {checkingUpdates && (
            <div className="hotfix-splash-overlay" style={{
              position: 'absolute',
              inset: 0,
              zIndex: 999,
              background: '#1a1008 url(/assets/original/mainbg.png) no-repeat center / cover',
              backgroundBlendMode: 'multiply',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'Yangjin, sans-serif',
              color: '#fff'
            }}>
              <div style={{ animation: 'bounce-micro 1s infinite alternate', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img src="/assets/original/potato1_normal.png" alt="Loading" style={{ width: '120px', filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.5))' }} />
                <h2 style={{ fontSize: '32px', margin: '16px 0 8px', color: '#ffea00', textShadow: '0 3px 0 #000' }}>{t('돌아온 감자 키우기')}</h2>
                <p style={{ fontSize: '18px', color: '#fffdf6', textShadow: '0 2px 4px #000', margin: '4px 0' }}>{t(hotfixStatus)}</p>
                <div style={{ width: '200px', height: '6px', background: '#4a2f1b', border: '1.5px solid #ffea00', marginTop: '12px', overflow: 'hidden' }}>
                  <div style={{
                    width: hotfixStatus.includes('완료') ? '100%' : hotfixStatus.includes('조회') ? '60%' : '20%',
                    height: '100%',
                    background: '#ffea00',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default App

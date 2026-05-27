## Hash Coding Log

교실에서 실제로 사용하는 웹 도구, 자동화 페이지, 수업 자료, 코딩 실험을 모아 둔 GitHub Pages 프로젝트입니다.

메인 사이트

- https://jeongdawoont-star.github.io/hash2n/

주요 페이지

- 활동 트래커: https://jeongdawoont-star.github.io/hash2n/score_tracker/
- 주간학습 및 알림장 자동화: https://jeongdawoont-star.github.io/hash2n/vibe-apps/weekly-notice-automation.html
- 받아쓰기 Studio: https://jeongdawoont-star.github.io/hash2n/vibe-apps/dictation-studio.html
- 사회 공개수업 대본: https://jeongdawoont-star.github.io/hash2n/vibe-apps/social-open-class-script.html
- 조형 요소와 조형 원리 슬라이드: https://jeongdawoont-star.github.io/hash2n/vibe-apps/design-elements-slide.html
- SongsaBot 소개: https://jeongdawoont-star.github.io/hash2n/vibe-apps/songsabot.html

검색 노출 기본 파일

- robots.txt
- sitemap.xml

하드닝(코드 노출 최소화) 기본 운영

- 작업 연속성/기준 문서: `WORK_CONTINUITY.md`
- 의존성 설치: `npm install`
- B단계(최소 필수): `npm run harden:b`
- C단계(선택): `npm run harden:c`
- 배포 전 점검: `npm run predeploy:check`
- 일괄 실행: `npm run harden:all`

권장 규칙

- `records.js` 내부 앱 링크는 상대경로(`./vibe-apps/...`) 사용
- 배포 산출물은 `.deploy-hardened` 폴더 기준으로 점검
- 소스맵 파일(`*.map`)은 배포하지 않음

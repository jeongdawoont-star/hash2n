// 홈 화면 앱으로 설치되게 하는 최소 서비스워커. 파일을 캐시하지 않으므로 늘 최신 버전을 불러온다.
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));

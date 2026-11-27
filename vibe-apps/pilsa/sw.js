// 필사의 노력 서비스 워커
// - 앱 화면(HTML·라이브러리·이미지)은 캐시해 두고, 새 버전이 있으면 받아 와서 다음 실행부터 쓴다.
// - AI 호출(googleapis.com)은 캐시하지 않는다. 사진과 키는 서비스 워커를 거쳐 저장되지 않는다.
const CACHE = 'pilsa-v3.1.0';
const CORE = [
  './', 'index.html', 'privacy.html', 'terms.html', 'manifest.webmanifest',
  'lib/pdf.min.js', 'lib/pdf.worker.min.js', 'lib/jszip.min.js', 'lib/qrcode.min.js', 'lib/jsQR.min.js',
  'icons/icon192.png', 'icons/icon512.png', 'images/icon.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // AI·글꼴 등 외부 요청은 브라우저에 맡긴다
  // 같은 출처: 캐시를 먼저 보여 주고 뒤에서 새로 받아 둔다 (stale-while-revalidate)
  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(req, { ignoreSearch: true });
      const fresh = fetch(req).then((res) => {
        if (res && res.ok) cache.put(req, res.clone());
        return res;
      }).catch(() => cached);
      return cached || fresh;
    })
  );
});

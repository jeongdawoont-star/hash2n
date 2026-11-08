// 오프라인용: 한 번 열면 파일을 저장해 두고, 다음엔 저장본을 먼저 쓴 뒤 뒤에서 새로 받아 둔다
const V = 'aiac-20261108212951';
const FILES = ['./', 'index.html', 'style.css', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'favicon.ico',
  'js/main.js', 'js/scene.js', 'js/kit.js', 'js/models.js', 'js/plan.js', 'js/store.js', 'js/sound.js', 'js/music.js', 'js/models_plus.js',
  'data/themes.js', 'data/emoji_ko.js', 'js/emoji3d.js', 'data/words.js', 'vendor/three.module.js'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  if (u.origin !== location.origin && !u.hostname.includes('fonts.')) return;
  e.respondWith(caches.open(V).then(async c => {
    const hit = await c.match(e.request, { ignoreSearch: true });
    const net = fetch(e.request).then(r => { if (r.ok || r.type === 'opaque') c.put(e.request, r.clone()); return r; }).catch(() => hit);
    return hit || net;
  }));
});

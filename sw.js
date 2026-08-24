// 리천 논술 문제 제작 — 서비스워커.
// 항상 네트워크 먼저(새 버전이 바로 반영되게), 오프라인일 때만 저장본으로 연다.
const CACHE = 'nonsul-v1';
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(['./'])).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', (e) => {
  if (e.request.mode !== 'navigate') return;   // 앱은 한 파일이다 — 문서 요청만 다룬다
  e.respondWith(
    fetch(e.request).then((r) => {
      const copy = r.clone();
      caches.open(CACHE).then((c) => c.put('./', copy));
      return r;
    }).catch(() => caches.match('./'))
  );
});

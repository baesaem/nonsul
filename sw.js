// 리천 논술 문제 제작 — 서비스워커.
// 항상 네트워크 먼저(새 버전이 바로 반영되게), 오프라인일 때만 저장본으로 연다.
const CACHE = 'nonsul-v2';
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(['./'])).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  // 옛 이름의 저장고는 걷어 낸다 — 남겨 두면 용량만 먹는다
  e.waitUntil(caches.keys()
    .then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  if (e.request.mode !== 'navigate') return;   // 앱은 한 파일이다 — 문서 요청만 다룬다
  e.respondWith(
    // ⚠ cache:'no-store'가 있어야 한다. 그냥 fetch하면 브라우저 HTTP 캐시(깃허브 페이지가
    //   HTML에 붙이는 max-age)를 거쳐 옛 판이 돌아온다 — 설치된 앱을 다시 켰을 때
    //   지난 버전이 뜨는 것을 실기기에서 겪었다.
    fetch(e.request.url, { cache: 'no-store' }).then((r) => {
      const copy = r.clone();
      caches.open(CACHE).then((c) => c.put('./', copy));
      return r;
    }).catch(() => caches.match('./'))
  );
});

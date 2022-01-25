self.addEventListener('install', event => {
  console.log('[SW] - install', event);
});

self.addEventListener('activate', event => {
  console.log('[SW] - activate', event);
});

self.addEventListener('fetch', event => {
  console.log('[SW] - fetch', event);
});

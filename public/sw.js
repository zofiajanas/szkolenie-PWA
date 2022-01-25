const STATIC_CACHE_VER = 'static-8';
const DYNAMIC_CACHE_VER = 'dynamic';

const cacheList = [
  '/',
  '/index.html',
  '/offline.html',
  '/src/js/app.js',
  '/src/js/feed.js',
  '/src/js/material.min.js',
  '/src/css/app.css',
  '/src/css/feed.css',
  '/src/images/main-image.jpg',
  'https://fonts.googleapis.com/css?family=Roboto:400,700',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css',
];

self.addEventListener('install', event => {
  console.log('[SW] - install', event);

  event.waitUntil(
    caches.open(STATIC_CACHE_VER).then(cache => {
      console.log('SW cache');
      cache.addAll(cacheList);
    })
  );
});

self.addEventListener('activate', event => {
  console.log('[SW] - activate', event);

  event.waitUntil(
    caches.keys().then(keyList => {
      console.log(keyList);
      keyList
        .filter(key => key !== STATIC_CACHE_VER && key !== DYNAMIC_CACHE_VER)
        .map(key => caches.delete(key));
    })
  );
});

self.addEventListener('fetch', event => {
  // console.log('[SW] - fetch', event);
  const url = 'https://httpbin.org/get';

  // jeśli nasz url zawiera link
  if (event.request.url.indexOf(url) > -1) {
    event.respondWith(
      caches.open(DYNAMIC_CACHE_VER).then(cache => {
        return fetch(event.request).then(res => {
          cache.put(event.request, res.clone());
          return res;
        });
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(response => {
        if (response) return response;
        else {
          return fetch(event.request)
            .then(res => {
              // pobieranie jeśli skrypt wewnątrz ma odnośnić do kolejnych skryptów
              return caches.open(DYNAMIC_CACHE_VER).then(cache => {
                cache.add(event.request.url);
                return res;
              });
            })
            .catch(err => {
              return caches.open(STATIC_CACHE_VER).then(cache => {
                if (event.request.headers.get('accept').includes('text/html')) {
                  return cache.match('/offline.html');
                }
              });
            });
        }
      })
    );
  }
});

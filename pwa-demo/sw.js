const CAHCE_NAME = 'cache-v2'

self.addEventListener('install', e => {
  console.log('install', e)
  e.waitUntil(
    caches.open(CAHCE_NAME).then(cache => {
      cache.addAll(['/', './index.css'])
    })
  )
})
self.addEventListener('activate', e => {
  console.log('activate', e)
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(mappedCacheName => {
          if (mappedCacheName !== CAHCE_NAME) {
            return caches.delete(mappedCacheName)
          }
        })
      )
    })
  )
})
self.addEventListener('fetch', e => {
  console.log('fetch', e)

  e.respondWith(
    caches.open(CAHCE_NAME).then(cache =>
      cache.match(e.request).then(res => {
        if (res) return res

        return fetch(e.request).then(response => {
          cache.put(e.request, response.clone())

          return response
        })
      })
    )
  )
})

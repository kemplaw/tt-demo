/* eslint-disable no-restricted-globals */
const CAHCE_NAME = 'cache-v2'

self.addEventListener('install', e => {
  console.log('install', e)
  e.waitUntil(
    // 利用 cache api 实现离线缓存
    caches.open(CAHCE_NAME).then(cache => {
      cache.addAll(['/', './index.css'])
    })
  )
})
self.addEventListener('activate', e => {
  // 删除无用离线缓存
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(mappedCacheName => {
          if (mappedCacheName !== CAHCE_NAME) {
            return caches.delete(mappedCacheName)
          }

          return false
        })
      )
    })
  )
})
self.addEventListener('fetch', e => {
  console.log('fetch', e)

  // 读取离线缓存
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

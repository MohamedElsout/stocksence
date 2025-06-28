const CACHE_NAME = 'stocksence-v1.0.0';
const urlsToCache = [
  './',
  './dashboard',
  './sales',
  './reports',
  './about',
  './settings',
  './download',
  './manifest.json'
];

// تثبيت Service Worker
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ Service Worker: Installation complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Service Worker: Installation failed', error);
      })
  );
});

// تفعيل Service Worker
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker: Activation complete');
      return self.clients.claim();
    })
  );
});

// اعتراض الطلبات وتقديم المحتوى من الـ Cache
self.addEventListener('fetch', (event) => {
  // تجاهل الطلبات غير HTTP/HTTPS
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // إرجاع الملف من الـ Cache إذا وُجد
        if (response) {
          console.log('📁 Service Worker: Serving from cache', event.request.url);
          return response;
        }

        // محاولة جلب الملف من الشبكة
        console.log('🌐 Service Worker: Fetching from network', event.request.url);
        return fetch(event.request).then((response) => {
          // التأكد من صحة الاستجابة
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // نسخ الاستجابة لحفظها في الـ Cache
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        }).catch(() => {
          // في حالة عدم توفر الإنترنت، إرجاع صفحة offline
          if (event.request.destination === 'document') {
            return caches.match('./');
          }
        });
      })
  );
});

// التعامل مع الرسائل من التطبيق الرئيسي
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('⏭️ Service Worker: Skipping waiting...');
    self.skipWaiting();
  }
});

// إشعارات Push (للمستقبل)
self.addEventListener('push', (event) => {
  console.log('📬 Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'إشعار جديد من StockSence',
    icon: './icons/icon-192x192.png',
    badge: './icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'فتح التطبيق',
        icon: './icons/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'إغلاق',
        icon: './icons/icon-192x192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('StockSence', options)
  );
});

// التعامل مع النقر على الإشعارات
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Service Worker: Notification click received');
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('./')
    );
  }
});

// تحديث البيانات في الخلفية
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('🔄 Service Worker: Background sync triggered');
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // مزامنة البيانات المحلية مع الخادم (للمستقبل)
  return Promise.resolve();
}
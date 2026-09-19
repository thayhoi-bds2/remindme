/* Service Worker - nhắc việc GV
   Dùng để hiển thị thông báo (bắt buộc trên Android) và mở lại app khi bấm vào thông báo. */
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });

self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
      for (var i = 0; i < list.length; i++) {
        if ('focus' in list[i]) return list[i].focus();
      }
      return self.clients.openWindow('./');
    })
  );
});

/* Dự phòng cho Web Push (nếu sau này bổ sung máy chủ đẩy thông báo) */
self.addEventListener('push', function (e) {
  var data = {};
  try { data = e.data ? e.data.json() : {}; } catch (err) { data = { title: 'Nhắc việc', body: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(data.title || 'Nhắc việc', {
    body: data.body || '',
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    tag: data.tag || undefined,
    requireInteraction: true,
    vibrate: [300, 150, 300, 150, 300],
    data: { url: './' }
  }));
});

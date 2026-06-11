// Service Worker for Push Notifications - GlisseGauloisse
self.addEventListener("install", function () {
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", function (event) {
  if (!event.data) return;
  
  const data = event.data.json();
  const title = data.title || "GlisseGauloisse";
  const options = {
    body: data.body || "Nouvelle notification",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    vibrate: [200, 100, 200],
    tag: data.tag || "glissegauloisse-" + Date.now(),
    renotify: true,
    requireInteraction: true,
    data: {
      url: data.url || "/",
    },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (clientList) {
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        if ("focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});

// Keep service worker alive
self.addEventListener("fetch", function (event) {
  // Pass through all fetch requests - just keeps SW active
  return;
});

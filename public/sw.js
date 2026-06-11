// Service Worker for Push Notifications - GlisseGauloisse
self.addEventListener("push", function (event) {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "GlisseGauloisse";
  const options = {
    body: data.body || "Nouvelle notification",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    data: {
      url: data.url || "/admin",
    },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  const url = event.notification.data?.url || "/admin";
  event.waitUntil(clients.openWindow(url));
});

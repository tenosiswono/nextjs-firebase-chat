/* global importScripts, firebase, clients */
importScripts('https://www.gstatic.com/firebasejs/3.5.2/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/3.5.2/firebase-messaging.js')

firebase.initializeApp({
  messagingSenderId: '356329036784'
})
const messaging = firebase.messaging()

messaging.setBackgroundMessageHandler((payload) => {
  const notificationData = JSON.parse(payload.data.notification) || {}
  const notificationTitle = notificationData.title || 'nextjs-firebase-chat'
  const notificationOptions = {
    body: notificationData.body || 'Yeay, some notification? login first',
    icon: notificationData.icon || 'static/images/icon-96x96.png',
    tag: notificationData.tag || 'notification',
    image: notificationData.image || '',
    renotify: notificationData.renotify || false,
    data: {
      url: notificationData.url || 'https://nextjs-firebase-chat.now.sh/'
    }
  }
  if (notificationData.tag === 'notification') {
    return self.registration.showNotification(notificationTitle, notificationOptions)
  }
  return false
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(clients.matchAll({ includeUncontrolled: true, type: 'window' }).then((clientList) => {
    for (let i = 0; i < clientList.length; i += 1) {
      const client = clientList[i]
      if (client.url === event.notification.data.url && 'focus' in client) {
        return client.focus()
      }
    }
    if (clients.openWindow) {
      return clients.openWindow(event.notification.data.url)
    }
    return false
  }))
})

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(() => {
    console.log('[SW] - register');
  });
}

var enableNotificationsButtons = document.querySelectorAll('.enable-notifications');

const options = {
  body: 'zawartość jakaś',
  icon: '/src/images/icons/app-icon-96x96.png',
  image: '/src/images/sf-boat.jpg',
  dir: 'ltr',
  lang: 'pl-PL',
  vibrate: [200, 20, 100],
  badge: '/src/images/icons/app-icon-96x96.png',
};

const displayConfirmNotification = () => {
  new Notification('Super tytuł', options);
};

const askForNotificationPermission = () => {
  Notification.requestPermission().then(permission => {
    if (permission !== 'granted') {
      alert('no permission');
    } else {
      displayConfirmNotification();
    }
  });
};

if ('Notification' in window) {
  enableNotificationsButtons.forEach(button => {
    button.addEventListener('click', askForNotificationPermission);
  });
}

var CACHE_NAME = 'icarus-cache-v1';
var urlsToCache = [
    'https://fonts.googleapis.com/css?family=Lato|Raleway',
    '/Scripts/dist/icarus/vendor.js',
    '/Content/styles/dist/icarus/vendor.css',
    '/Content/styles/dist/icarus/icarus.min.css',
    '/Content/styles/dist/fonts/glyphicons-halflings-regular.eot',
    '/Content/styles/dist/fonts/glyphicons-halflings-regular.svg',
    '/Content/styles/dist/fonts/glyphicons-halflings-regular.ttf',
    '/Content/styles/dist/fonts/glyphicons-halflings-regular.woff',
    '/Content/styles/dist/fonts/glyphicons-halflings-regular.woff2',
    '/Content/Images/Logo.png',
    '/Content/favicon.ico'
];
/*
    @see https://developers.google.com/web/fundamentals/primers/service-workers/
    @see https://developers.google.com/web/fundamentals/web-app-manifest/
*/
/*
// inside service worker script
self.onerror = (message) => {
    console.log(message);
};
*/
/** Service Worker error handling
    @see https://stackoverflow.com/questions/37736322/how-does-global-error-handling-work-in-service-workers
*/
self.addEventListener('error', (e) => {
    console.log('Service Worker Error', e);
});
/* @see https://developers.google.com/web/fundamentals/native-hardware/fullscreen/
if (navigator.standalone == true) {
    // My app is installed and therefore fullscreen
}
*/
//https://developers.google.com/web/fundamentals/app-install-banners/
self.addEventListener('install', (event) => {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            }).catch((err) => {
                console.log('Service Worker: Failed to open cache');
                return null;
            })
    );
});


self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                return fetch(event.request);
            }));
});

self.addEventListener('activate', (event) => {
    var cacheWhitelist = ['icarus-cache-v1'];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                }));
        }));
});

// https://developers.google.com/web/fundamentals/app-install-banners/
/*
btnAdd.addEventListener('click', (e) => {
    // hide our user interface that shows our A2HS button
    btnAdd.style.display = 'none';
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice
        .then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the A2HS prompt');
            } else {
                console.log('User dismissed the A2HS prompt');
            }
            deferredPrompt = null;
        });
});
*/


// https://developers.google.com/web/fundamentals/codelabs/push-notifications/
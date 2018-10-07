/**
    A collection of scripts, stylesheets and images that can be cached
    @see https://developers.google.com/web/fundamentals/primers/service-workers/
    @see https://developers.google.com/web/fundamentals/web-app-manifest/
*/
var CACHE_NAME = 'icarus-cache-v1';
var urlsToCache = [
    'https://fonts.googleapis.com/css?family=Lato|Raleway',
    '/Scripts/dist/icarus/vendor.js',
    '/Content/styles/dist/icarus/vendor.css',
    '/Content/styles/dist/icarus/icarus.min.css',
    '/Content/styles/fonts/glyphicons-halflings-regular.eot',
    '/Content/styles/fonts/glyphicons-halflings-regular.svg',
    '/Content/styles/fonts/glyphicons-halflings-regular.ttf',
    '/Content/styles/fonts/glyphicons-halflings-regular.woff',
    '/Content/styles/fonts/glyphicons-halflings-regular.woff2',
    '/Content/Images/Logo.png',
    '/Content/favicon.ico'
];

//https://developers.google.com/web/fundamentals/app-install-banners/
self.addEventListener('install', function (event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});


self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                return fetch(event.request);
            }));
});

self.addEventListener('activate', function (event) {
    var cacheWhitelist = ['icarus-cache-v1'];
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
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
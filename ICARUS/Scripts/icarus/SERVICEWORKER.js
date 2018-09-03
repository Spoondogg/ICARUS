/**
    Web Application Service Worker
 */
export class SERVICEWORKER {

    constructor() {
        // Register service worker
        // https://developers.google.com/web/fundamentals/primers/service-workers/
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function () {
                navigator.serviceWorker.register('service-worker.js').then(function (registration) {
                    // Registration was successful
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                }, function (err) {
                    // registration failed :(
                    console.log('ServiceWorker registration failed: ', err);
                });
            });
        }
    }
}
/**
    @module
*/
//
/**
    A Web Application Service Worker
    @class
 */
export default class SERVICEWORKER {
	constructor() {
		this.registerServiceWorker();
	}
	/**
	    Registers the Service Worker
	    @see https://developers.google.com/web/fundamentals/primers/service-workers/
	*/
	registerServiceWorker() {
		if ('serviceWorker' in navigator) {
			window.addEventListener('load', function() {
				navigator.serviceWorker.register('service-worker.js').then(function(registration) {
					// Registration was successful
					console.log('ServiceWorker registration successful with scope: ', registration.scope);
				}, function(err) {
					// registration failed :(
					console.log('ServiceWorker registration failed: ', err);
				});
			});
		}
	}
}
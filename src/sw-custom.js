
if ("function" === typeof importScripts) {
   importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

  // Global workbox
  if (workbox) {
    console.log("Workbox is loaded");
    workbox.setConfig({ debug: true });
    workbox.loadModule('workbox-strategies');


    //`generateSW` and `generateSWString` provide the option
    // to force update an exiting service worker.
    // Since we're using `injectManifest` to build SW,
    // manually overriding the skipWaiting();
    self.addEventListener("install", (event) => {
      self.skipWaiting();
      //location.reload();
    });

    // Manual injection point for manifest files.
    // All assets under build/ and 5MB sizes are precached.
    workbox.precaching.precacheAndRoute([]);

    // Font caching
    workbox.routing.registerRoute(
      new RegExp("https://fonts.(?:.googlepis|gstatic).com/(.*)"), new workbox.strategies.CacheFirst({ cacheName: "googleapis" })
    );

    // Image caching
    workbox.routing.registerRoute(
      /\.(?:png|gif|jpg|jpeg|svg|ico)$/, new workbox.strategies.CacheFirst({ cacheName: "images" })
    );

    // JS, CSS caching
    workbox.routing.registerRoute(
      /\.(?:js|css)$/, new workbox.strategies.StaleWhileRevalidate({ cacheName: "static-resources" })
    );

	// default page handler for offline usage,
	// where the browser does not how to handle deep links
	// it's a SPA, so each path that is a navigation should default to index.html
	workbox.routing.registerRoute(
	  ({ event }) => event.request.mode === 'navigate',
	  async () => {
	    const defaultBase = '/index.html';
	    return caches
	      .match(workbox.precaching.getCacheKeyForURL(defaultBase))
	      .then(response => {
		  return response || fetch(defaultBase);
	      })
	      .catch(err => {
		return fetch(defaultBase);
	      });
	  }
	);

  } else {
    console.error("Workbox could not be loaded. No offline support");
  }
}


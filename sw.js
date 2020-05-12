
if ("function" === typeof importScripts) {
  importScripts(
    "https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js"
  );

  // Global workbox
  if (workbox) {
    console.log("Workbox is loaded");

    // Disable logging
    workbox.setConfig({ debug: true });

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
    workbox.precaching.precacheAndRoute([
  {
    "url": "asset-manifest.json",
    "revision": "5ea3bf934e87975dd39b1c4a248028b2"
  },
  {
    "url": "cadenaoriginal_3_3.js",
    "revision": "a4bdbf5c24d955872c54383b1a571781"
  },
  {
    "url": "favicon.ico",
    "revision": "e6b475a45a60bf27a14cbe0b23688351"
  },
  {
    "url": "forge.min.js",
    "revision": "c7fdbbca904f71b11d88580e94257c07"
  },
  {
    "url": "index.html",
    "revision": "939a0aacdd80e8ff88e1d02a05a5168a"
  },
  {
    "url": "manifest.json",
    "revision": "662eff1d10ff5647cfd13bb89a1e954d"
  },
  {
    "url": "pluma_48x48.png",
    "revision": "2ace5bb4bdada95b5f00b1ccd50d933a"
  },
  {
    "url": "pluma144x144.png",
    "revision": "3af49b5ff302eeccf17b5258c2411a6c"
  },
  {
    "url": "pluma192x192.png",
    "revision": "875d276cbe4858af1b8b032f44ab3eb1"
  },
  {
    "url": "pluma512x512.png",
    "revision": "136f21c487d2cfc622592779e8164a7a"
  },
  {
    "url": "pluma72x72.png",
    "revision": "b3f68ab569ab794a67d774457831b8ad"
  },
  {
    "url": "precache-manifest.ded7efdf3047eadc656df87af19c2ac6.js",
    "revision": "ded7efdf3047eadc656df87af19c2ac6"
  },
  {
    "url": "service-worker.js",
    "revision": "d63139a4b2a92f1e7ce14e28b91354f8"
  },
  {
    "url": "static/css/2.69121389.chunk.css",
    "revision": "9007091a29eb46a0a4bc188af71ea80a"
  },
  {
    "url": "static/css/main.5bf4d104.chunk.css",
    "revision": "1bfb6ae6bde3b1a707d31aa09a0c4f82"
  },
  {
    "url": "static/js/2.7ab96d67.chunk.js",
    "revision": "c8b5c29c4cbc29e03e51530cd8b79eb7"
  },
  {
    "url": "static/js/main.aacfde1f.chunk.js",
    "revision": "0c72aafd53ba605c4bf55935eda669d2"
  },
  {
    "url": "static/js/runtime-main.fca6c1bd.js",
    "revision": "deed22cd06b5570b2fc2f7755d9d4e78"
  },
  {
    "url": "utils.js",
    "revision": "0f02b5c92604e1b44ad699b0721addc0"
  }
]);

    // Font caching
    workbox.routing.registerRoute(
      new RegExp("https://fonts.(?:.googlepis|gstatic).com/(.*)"),
      workbox.strategies.cacheFirst({
        cacheName: "googleapis",
        plugins: [
          new workbox.expiration.Plugin({
            maxEntries: 30,
          }),
        ],
      })
    );

    // Image caching
    workbox.routing.registerRoute(
      /\.(?:png|gif|jpg|jpeg|svg|ico)$/,
      workbox.strategies.cacheFirst({
        cacheName: "images",
        plugins: [
          new workbox.expiration.Plugin({
            maxEntries: 60,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
          }),
        ],
      })
    );

    // JS, CSS caching
    workbox.routing.registerRoute(
      /\.(?:js|css)$/,
      workbox.strategies.staleWhileRevalidate({
        cacheName: "static-resources",
        plugins: [
          new workbox.expiration.Plugin({
            maxEntries: 60,
            maxAgeSeconds: 20 * 24 * 60 * 60, // 20 Days
          }),
        ],
      })
    );
  } else {
    console.error("Workbox could not be loaded. No offline support");
  }
}


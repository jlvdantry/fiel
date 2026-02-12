SW_VERSION = '1.0.290';
importScripts('Constantes.js');
importScripts('utils.js');
importScripts('forge.min.js');
importScripts('encripta.js');
importScripts('db.js');
importScripts('dbFiel.js');
importScripts('dbInterval.js');
importScripts('fiel.js');
importScripts('descargaMasivaSat.js');
importScripts('sycRequest.js');
importScripts('tareasPendientes.js');
importScripts('log.js');
importScripts('estaAutenticado.js');
importScripts('notifica.js');
var DMS = null;
var intervalSync = null;

log_en_bd('sw','1');

if ("function" === typeof importScripts) {
   importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');
   importScripts('insertaDatos.js');
  // Global workbox
  if (workbox) {
    //workbox.setConfig({ debug: true });
    workbox.loadModule('workbox-strategies');


    //`generateSW` and `generateSWString` provide the option
    // to force update an exiting service worker.
    // Since we're using `injectManifest` to build SW,
    // manually overriding the skipWaiting();
    self.addEventListener("install", (event) => {
      self.skipWaiting();
      generallaves();
      insertaRFCS();
    });


    self.addEventListener('activate', event => {
		event.waitUntil(self.clients.claim());
    });


	self.addEventListener('periodicsync', (event) => {
	    const timestamp = new Date().toLocaleString();
	    if (event.tag === 'check-sat-status') {
		event.waitUntil(
		    (async () => {
			try {
			    // 1. Just call the log function (it doesn't return a promise)
			    console.log(`[SW] Sincronización iniciada: ${timestamp}`);
			    
			    // 2. Perform your logic
	                    await procesarTareasPendientes('Segundo');
			} catch (err) {
			    // Use console.error which is wrapped to log to DB
			    console.error('SyncError: ' + err.message);
			}
		    })()
		);
	    }
	});

    // Manual injection point for manifest files.
    // All assets under build/ and 5MB sizes are precached.
    workbox.precaching.precacheAndRoute([{"revision":"17d4710542673e7b1990c27d2dbd21de","url":"static/v4/actualizaSolicitud.js"},{"revision":"a51306634718899c7223da3c64bd7258","url":"static/v4/apple-icon-180x180.png"},{"revision":"d60d8979a018c6c9f325a9923edbc901","url":"static/v4/apple-launch-1125x2436.png"},{"revision":"8deb514dd319e162034bc89a22a4b55d","url":"static/v4/apple-launch-1170x2532.png"},{"revision":"39e2197139f1aa1d74404e32097bf5db","url":"static/v4/apple-launch-1242x2688.png"},{"revision":"b33172204b0695d988bd6b1cb1ec8b83","url":"static/v4/apple-launch-1284x2778.png"},{"revision":"3274e95d3e2ba5b891dd6ec1c76d69c1","url":"static/v4/apple-launch-1536x2048.png"},{"revision":"456c1377fdf47262f056770ab7e75383","url":"static/v4/apple-launch-1668x2224.png"},{"revision":"88167a6568345c1f184f2b2b00b8b974","url":"static/v4/apple-launch-1668x2388.png"},{"revision":"aa2e9dcb9423e2cc3351efee275e93a2","url":"static/v4/apple-launch-2048x2732.png"},{"revision":"e907773cb684f6a5c52695a69f42e7ed","url":"static/v4/apple-launch-640x1136.png"},{"revision":"52448a1cec8159d7362899fcae0cdf16","url":"static/v4/apple-launch-750x1334.png"},{"revision":"7259618c8e117300e389a06cf8efd952","url":"static/v4/apple-launch-828x1792.png"},{"revision":"c250b3090db4db0af909cfea48f1371d","url":"static/v4/asset-manifest.json"},{"revision":"5fcde1585d918711baecc6a33e531160","url":"static/v4/cadenaoriginal_3_3.js"},{"revision":"6d45e980f5b3172686b79f83b7fb2729","url":"static/v4/cargaFael.js"},{"revision":"45a344987ca3ae5e4656e0f644db5ad6","url":"static/v4/cargaFiel.js"},{"revision":"871d3e2d00dbede78feac47be7355aee","url":"static/v4/Constantes.js"},{"revision":"294db6a12f153d098354496cc9061ac2","url":"static/v4/db.js"},{"revision":"bf536ac2b9e956cb73c8b836076e04fe","url":"static/v4/dbConfig.js"},{"revision":"2ca08edc399194cd34af5247bc4e485c","url":"static/v4/dbFiel.js"},{"revision":"cfed443a24868b74d3316518531ecd26","url":"static/v4/dbInterval.js"},{"revision":"e9cc27be98aaca3508353a7d99a0985b","url":"static/v4/descargaMasivaSat.js"},{"revision":"36214d6dcb300c761e9892ebfb92d66e","url":"static/v4/encripta.js"},{"revision":"3b133215ebc3edb0e6aa56dcf94fe405","url":"static/v4/estaAutenticado.js"},{"revision":"57fa627b552071d907841938379ed8af","url":"static/v4/favicon.ico"},{"revision":"a03fb407fa7f5a95b4bdf1f4c4321079","url":"static/v4/fiel.js"},{"revision":"e90842916e60987c879e3dae084acc47","url":"static/v4/forge.min.js"},{"revision":"60f1b5449e38ae312092be50a29973da","url":"static/v4/index.html"},{"revision":"c7c2fba1ef5fb31aeef361be8a5161dc","url":"static/v4/insertaDatos.js"},{"revision":"51e3a65aab2504817f01793ae0c0814e","url":"static/v4/log.js"},{"revision":"51786482ed1a6534a106ed0a48d76a27","url":"static/v4/manifest.json"},{"revision":"76af09612cae73ea86bdd8d8fcad5598","url":"static/v4/mifiel.png"},{"revision":"fe44f0077684ee1078349e351a5366d7","url":"static/v4/notifica.js"},{"revision":"3af49b5ff302eeccf17b5258c2411a6c","url":"static/v4/pluma144x144.png"},{"revision":"136f21c487d2cfc622592779e8164a7a","url":"static/v4/pluma512x512m.png"},{"revision":"366878b119b22945daa5fe82d3db3f65","url":"static/v4/querespuesta.js"},{"revision":"f203aed96b905ced2cecb5f8bccdf819","url":"static/v4/static/css/main.d71e290b.css"},{"revision":"f2af095786523f5c9dc51521214c33c9","url":"static/v4/static/js/472.c8b6ff68.chunk.js"},{"revision":"2e1935c0ee4d41803a60da3b209d4d40","url":"static/v4/static/js/746.eac071f1.chunk.js"},{"revision":"3e4a8d132525eb996e3cc781fdb8dda3","url":"static/v4/static/js/858.d3bdadfc.chunk.js"},{"revision":"7e00ab4e104a6ca7b84389120a426947","url":"static/v4/static/js/main.9379a2af.js"},{"revision":"c4954d16e2f57acb3c50d342ca727f52","url":"static/v4/suscribe.js"},{"revision":"6e4f9ce2dce0b7445c779a0f9ae9f09c","url":"static/v4/sycRequest.js"},{"revision":"379c30a83edcaf527bf50e903f8be35d","url":"static/v4/tareasPendientes.js"},{"revision":"beaac8700b7b19c3bc8259425d8559e3","url":"static/v4/utils.js"},{"revision":"541ea20988d6452c83c3a169480c8a23","url":"static/v4/zip.min.js"}]);

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

	workbox.routing.registerRoute(
	  new workbox.routing.NavigationRoute(
	    new workbox.strategies.NetworkFirst({
	      // Define the cache name for fallback HTML
	      cacheName: 'html-cache',
	      // Customize the list of URLs that Workbox ignores during navigation
	      networkTimeoutSeconds: 10,
	      plugins: [
		{
		  // Specify a cache expiration policy
		  expiration: {
		    maxEntries: 50,
		  },
		},
	      ],
	    }),
	    {
	      // This will ensure all navigation requests (e.g. /dashboard, /profile) go to index.html
	      // but you can exclude certain URLs (like API endpoints)
	      allowlist: [/^\/$/, /^\/index\.html$/], // The root path and index.html should return the main HTML file.
	      denylist: [/\*\.php\//], // Exclude API requests from being redirected.
	    }
	  )
	);

	// default page handler for offline usage,
	// where the browser does not how to handle deep links
	// it's a SPA, so each path that is a navigation should default to index.html

	// Cache the 'index.html' page with a NetworkFirst strategy.
	workbox.routing.registerRoute(
	  ({ request }) => request.mode === 'navigate', // Handle all navigation requests
	  new workbox.strategies.NetworkFirst({
	    cacheName: 'html-cache',
	    plugins: [
	      {
		expiration: {
		  maxAgeSeconds: 24 * 60 * 60, // Cache for 24 hours
		  maxEntries: 1, // Only cache one HTML page (the index.html)
		},
	      },
	    ],
	  })
	);

  } else {
    console.error("Workbox could not be loaded. No offline support");
  }
}

self.addEventListener("sync", event => {
    if (event.tag.substring(0,9)=== "autentica") {
       if (event.tag.substring(10)!=='') {
                     PWDFIEL=event.tag.substring(10);
       }
       event.waitUntil(syncRequest(ESTADOREQ.INICIAL.AUTENTICA));
    };
    if (event.tag === "verifica") {
       event.waitUntil(syncRequest(ESTADOREQ.INICIAL.VERIFICA));
       event.waitUntil(syncRequest(ESTADOREQ.SOLICITUDACEPTAD));
    };
    if (event.tag === "solicita") {
       event.waitUntil(syncRequest(ESTADOREQ.INICIAL.DESCARGA));
    } ;
});


/* envia mensaje a los clientes despues de que se actualizo el request */
var postRequestUpd = function(request,accion,respuesta) {
        self.clients.matchAll({ includeUncontrolled: true }).then(function(clients) {
                clients.forEach(function(client) {
                        client.postMessage(
                                {action: accion, request: request, respuesta: respuesta, PWDFIEL:PWDFIEL}
                        );
                });
        });
};
 
var enviaContra = (pwd) => {
        self.clients.matchAll({ includeUncontrolled: true }).then(function(clients) {
                clients.forEach(function(client) {
                        client.postMessage(
                                {'action':'CONTRA','value': pwd}
                        );
                });
        });

}

importScripts('querespuesta.js');
importScripts('actualizaSolicitud.js');


var updSolicitudDownload = (mensaje,idKey) => {
        return new Promise( (resolve, reject) => {
                      selObjectByKey('request',idKey).then( obj => {
                                obj.passdata.msg_d=mensaje;
			        obj.estado=ESTADOREQ.DESCARGADO;
                                updObjectByKey('request',obj,idKey);
                      }).then( () => { resolve() });
        });
}

var borraverificaciones = () => {
}


self.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'GET_VERSION') {
    event.source.postMessage({
      action: 'VERSION',
      version: VERSION,
    });
  }
  if (event.data && event.data.action === 'dameContra') {
     dame_pwd().then( x => { enviaContra(x); });
  }
  if (event.data && event.data.action === 'setContra') {
	  encripta_pw(event.data.PWDFIEL);
  }
  if (event.data && event.data.action === 'REVISA_REQUERIMIENTOS') {
          procesarTareasPendientes('Primer');
  }
});



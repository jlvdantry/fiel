const SW_VERSION = '1.0.70';
if ("function" === typeof importScripts) {
	importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');
   importScripts('db.js');
   importScripts('Constantes.js');
   importScripts('encripta.js');
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
      generallaves();
    });

    // Manual injection point for manifest files.
    // All assets under build/ and 5MB sizes are precached.
    workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

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
    console.log('recibio sync el sw event='+JSON.stringify(event,true));
    if (event.tag.substring(0,9)=== "autentica") {
       if (event.tag.substring(10)!=='') {
                     PWDFIEL=event.tag.substring(10);
       }
       event.waitUntil(syncRequest(ESTADOREQ.INICIAL.AUTENTICA));
    };
    if (event.tag === "verifica") {
       event.waitUntil(syncRequest(ESTADOREQ.INICIAL.VERIFICA));
       event.waitUntil(syncRequest(ESTADOREQ.ACEPTADO));
    };
    if (event.tag === "solicita") {
       event.waitUntil(syncRequest(ESTADOREQ.INICIAL.SOLICITUD));
    } ;
    if (event.tag === "download") {
       event.waitUntil(syncRequest(ESTADOREQ.INICIAL.DESCARGA));
    } ;
});

var syncRequest = estado => { 
    openDatabasex(DBNAME, DBVERSION).then( db => {
          var oS=openObjectStore(db, 'request', "readonly"); return oS;
    }).then( objectStore => {
          var req=selObjects(objectStore, "estadoIndex", estado); return req;
    }).then( requests => {
                  return Promise.all(
                         requests.map( async (request) => {

                                if (request.value.url=='/autentica.php') {
				}

                                if (request.value.url=='/verifica.php' & 'respuesta' in request.value) {
				     if  (request.value.respuesta.substring(0,9)=="Terminada" || request.value.respuesta.substring(0,9)=="Rechazada") {  return; }
                                }

                                if (request.value.url=='/solicita.php' & (estado==ESTADOREQ.ACEPTADO || estado==ESTADOREQ.REQUIRIENDO)) {  // no procesa las verificaciones ya terminadas 
                                     await updestado(request,ESTADOREQ.VERIFICANDO, 'Verificando')
				     postRequestUpd(request,"update-request","");   /* hay que checar que no genere mucho registros de verificacion */
                                     return; //si fue aceptada la solicitud deberia de mandar la verificacion
                                }

                                if (request.value.url=='factura') {
                                     return;
                                }

                                console.log('[syncRequest] syncRequest antes de hacer fetch url='+request.value.url+' llave='+request.key);
				const jsonHeaders = request.value.header;
				const headers = new Headers(jsonHeaders);
                                await updestado(request,ESTADOREQ.REQUIRIENDO, null);
                                fetch(request.value.url,{ method : 'post', headers: headers, body   : request.value.body })
                                .then(response => {
                                          if (response.status==500) { updestado(request,ESTADOREQ.ERROR); return { 'error' : response.status };
                                          } else { return response.json(); }
                                })
                                .then(response => {
                                          if(request.value.url=='/autentica.php') 
                                            { updestado(request,ESTADOREQ.AUTENTICADO, response); }
                                          else 
                                            { updestado(request,ESTADOREQ.RECIBIDO, response); }
                                          return response;
                                 })
                                .then(response => { querespuesta(request,response); return Promise.resolve(); })
                                .catch(function(err)  { return Promise.reject(err); })
                         })
                   );
    });
};

/* actualiza el estado del request */
var updestado = (request,esta,respuesta) => {
        request.value.estado=esta;
        request.value.respuesta=respuesta;
        return new Promise( (resolve, reject) => {
            var now = new Date();
            openDatabasex(DBNAME, DBVERSION).then(function(db) {
                  return openObjectStore(db, 'request', "readwrite");
                   }).then( objectStore => {
                           return updObject_01(objectStore, request.value, request.key);
                   }).then( objectStore => {
                           //console.log('[updestado] actualizo el estado forma key='+request.key+' Estado='+esta);
                           resolve(request);
                   }).catch(function(err)  {
                           return Promise.reject(err);
                   });
            resolve(request);
        });
};

var postRequestUpd = function(request,accion,respuesta) {
        self.clients.matchAll({ includeUncontrolled: true }).then(function(clients) {
                clients.forEach(function(client) {
                        //console.log('[postRequestUpd] envia mensaje al cliente id='+client.id+' accion='+accion+' key='+request.key);
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


var querespuesta = (request,respuesta) => {
         console.log('[querespuesta] respuesta recibida del servidor id requerimiento='+request.key+' url='+request.value.url);
         if("error" in respuesta) {
            updestado(request,5,respuesta).then( () => { postRequestUpd(request,"update-request",respuesta); });
            return;
         }

         if("created" in respuesta) { /* si en la respuesta viene el item created quiere decir que esta autentica y que se cuenta con un token */
            respuesta.createdLocal=Math.floor(Date.now() / 1000) ;
            respuesta.expiredLocal=Math.floor((Date.now() + (TOKEN.TIMELIVE*60*1000)) / 1000);
            updestado(request,ESTADOREQ.AUTENTICADO,respuesta).then( (r) => 
                          { postRequestUpd(r,"autenticado",respuesta); }
            );
            encripta_pw(PWDFIEL);
            return;
         }

         if("status" in respuesta) {
            if ("code" in respuesta.status) {
               if (request.value.url=='/solicita.php') {
		       updestado(request,respuesta.status.code,respuesta.status.message)
                       .then( (r) => { 
		                 request.value.passdata.msg=respuesta.status.message;
		                 "requestId" in respuesta ? request.value.folioReq=respuesta.requestId : null;
		                 updObjectByKey("request",request.value,request.key); /* actualiza el folio del requerimiento de la solicitud */
                              })
                       .then ( () => {
                                 postRequestUpd(request,"se genero una solicitud",respuesta);
                             });
		       return;
               }
               if (request.value.url=='/verifica.php' & respuesta.status.code==5000) {
		       request.value.passdata.intentos=("intentos" in request.value.passdata ?  request.value.passdata.intentos+1 : 1);
		       request.value.passdata.msg_v=respuesta.statusRequest.message + ' ' + request.value.passdata.intentos;
		       "packagesIds" in respuesta ? request.value.folioReq=respuesta.packagesIds : null;
		       updestado(request,respuesta.status.code,request.value.passdata.msg_v).then( () => {
			       updObjectByKey("request",request.value,request.key); // actualiza el resultado de la verificacion en el request de la verificacion 
			       respuesta.statusRequest.message=request.value.passdata.msg_v;
			       updSolicitud(respuesta,request.value.passdata.keySolicitud) 
                               .then( () => {
			            postRequestUpd(request,"se verifico",respuesta);
                               });
                       });
		       return;
               }
               if (request.value.url=='/verifica.php' & respuesta.status.code==300) {  // token invalido seguramente porque ya expiro
                       updestado(request,ESTADOREQ.TOKENINVALIDO,respuesta.status.message).then ( () => {;
                                    postRequestUpd(request,"token-invalido",respuesta);
		       });
		       return;
               }
            }
         }

         if(respuesta.msg=="El paquete se descargo") {
		       request.value.passdata.msg_d=respuesta.msg;
                       updestado(request,ESTADOREQ.DESCARGADO,respuesta).then( () => {  // actualiza el resultado de la descarga en el request de la descarga
                               updObjectByKey("request",request.value,request.key); // actualiza el resultado de la descarga en el request de la descarga
                               updSolicitudDownload('Se descargo',request.value.passdata.keySolicitud)  // actualiza el resulta de la descarga en el request de la solicitud
                               .then( () => {
                                    postRequestUpd(request,"se descargo",respuesta);
                               });
                       });
                       return;
         }
     updestado(request,ESTADOREQ.RESPUESTADESCONOCIDA,respuesta);
};

var updSolicitud = (respuesta,idKey) => {
        return new Promise( (resolve, reject) => {
		      selObjectByKey('request',idKey).then( obj => {
				var mensaje = respuesta.statusRequest.message.substring(0,9)!=="Terminada" ?  respuesta.statusRequest.message.substring(0,9) : 'Facturas '+respuesta.numberCfdis ;
				obj.passdata.msg_v=mensaje;
				updObjectByKey('request',obj,idKey);
		      }).then( () => { resolve() });
        });
}

var updSolicitudDownload = (mensaje,idKey) => {
        return new Promise( (resolve, reject) => {
                      selObjectByKey('request',idKey).then( obj => {
                                obj.passdata.msg_d=mensaje;
			        obj.estado=ESTADOREQ.DESCARGADO;
                                updObjectByKey('request',obj,idKey);
                      }).then( () => { resolve() });
        });
}

self.addEventListener('activate', function(event) {
        console.log('[activate] ');
	event.waitUntil(self.clients.claim());
});

self.addEventListener('message', (event) => {
  console.log('recibio message el sw event='+JSON.stringify(event.data,true));
  if (event.data && event.data.action === 'GET_VERSION') {
    event.source.postMessage({
      action: 'VERSION',
      version: SW_VERSION,
    });
  }
  if (event.data && event.data.action === 'dameContra') {
     dame_pwd().then( x => { enviaContra(x); });
  }

});
 
  setInterval(function() {
       console.log('[setInterval] va a sincronizar');
       syncRequest(ESTADOREQ.INICIAL.VERIFICA);
       syncRequest(ESTADOREQ.ACEPTADO);
  }, REVISA.ESTADOREQ * 1000);




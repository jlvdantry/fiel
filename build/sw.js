 SW_VERSION = '1.0.257';
importScripts('utils.js');
importScripts('db.js');
importScripts('dbFiel.js');
importScripts('fiel.js');
importScripts('descargaMasivaSat.js');
var DMS = null;
if ("function" === typeof importScripts) {
   importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');
   importScripts('Constantes.js');
   importScripts('encripta.js');
   importScripts('insertaDatos.js');
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
      insertaRFCS();
    });

    // Manual injection point for manifest files.
    // All assets under build/ and 5MB sizes are precached.
    workbox.precaching.precacheAndRoute([{"revision":"a51306634718899c7223da3c64bd7258","url":"static/v4/apple-icon-180x180.png"},{"revision":"d60d8979a018c6c9f325a9923edbc901","url":"static/v4/apple-launch-1125x2436.png"},{"revision":"8deb514dd319e162034bc89a22a4b55d","url":"static/v4/apple-launch-1170x2532.png"},{"revision":"39e2197139f1aa1d74404e32097bf5db","url":"static/v4/apple-launch-1242x2688.png"},{"revision":"b33172204b0695d988bd6b1cb1ec8b83","url":"static/v4/apple-launch-1284x2778.png"},{"revision":"3274e95d3e2ba5b891dd6ec1c76d69c1","url":"static/v4/apple-launch-1536x2048.png"},{"revision":"456c1377fdf47262f056770ab7e75383","url":"static/v4/apple-launch-1668x2224.png"},{"revision":"88167a6568345c1f184f2b2b00b8b974","url":"static/v4/apple-launch-1668x2388.png"},{"revision":"aa2e9dcb9423e2cc3351efee275e93a2","url":"static/v4/apple-launch-2048x2732.png"},{"revision":"e907773cb684f6a5c52695a69f42e7ed","url":"static/v4/apple-launch-640x1136.png"},{"revision":"52448a1cec8159d7362899fcae0cdf16","url":"static/v4/apple-launch-750x1334.png"},{"revision":"7259618c8e117300e389a06cf8efd952","url":"static/v4/apple-launch-828x1792.png"},{"revision":"2a4e88c2a71897e94d35fc27adaff80f","url":"static/v4/asset-manifest.json"},{"revision":"5fcde1585d918711baecc6a33e531160","url":"static/v4/cadenaoriginal_3_3.js"},{"revision":"7d0cdb70e88778129cab62b7d7c384d5","url":"static/v4/cargaFael.js"},{"revision":"e33d8432229cf84c02c84c6f1df53b8b","url":"static/v4/cargaFiel.js"},{"revision":"8c140018b82f96264980eb5ff392ec62","url":"static/v4/Constantes.js"},{"revision":"9917fc7006c7213c842c2dbd0b068568","url":"static/v4/db.js"},{"revision":"23e5ca32966ac5ab621b27f1893bc114","url":"static/v4/dbFiel.js"},{"revision":"eb8ef4196a26c6de4cea0f0f41c9c59e","url":"static/v4/descargaMasivaSat.js"},{"revision":"b3455c1dc2e4ab6fa628e60df491357c","url":"static/v4/encripta.js"},{"revision":"57fa627b552071d907841938379ed8af","url":"static/v4/favicon.ico"},{"revision":"b88abc35af03c8204d72871d7c3b4f6c","url":"static/v4/fiel.js"},{"revision":"e90842916e60987c879e3dae084acc47","url":"static/v4/forge.min.js"},{"revision":"cd2c821170bfc232fea7fdd8d895a478","url":"static/v4/index.html"},{"revision":"63dd150dfba0574a0e55a943cd423f1b","url":"static/v4/insertaDatos.js"},{"revision":"7d5b147fcab946c531d11ea18e390783","url":"static/v4/manifest.json"},{"revision":"76af09612cae73ea86bdd8d8fcad5598","url":"static/v4/mifiel.png"},{"revision":"3af49b5ff302eeccf17b5258c2411a6c","url":"static/v4/pluma144x144.png"},{"revision":"136f21c487d2cfc622592779e8164a7a","url":"static/v4/pluma512x512m.png"},{"revision":"a789b6c409f1cd0ffef139d9bb11e052","url":"static/v4/static/css/main.8a7121de.css"},{"revision":"7e61e7cf84792b45abb60a2502dbd0d2","url":"static/v4/static/js/main.2ba2b051.js"},{"revision":"76a4e1b67cc50d497523f90cb3d505b2","url":"static/v4/utils.js"},{"revision":"541ea20988d6452c83c3a169480c8a23","url":"static/v4/zip.min.js"}]);

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
       event.waitUntil(syncRequest(ESTADOREQ.INICIAL.DESCARGA));
    } ;
});

var syncRequest = estado => { 
    console.log('[syncRequest] estado='+estado);
    openDatabasex(DBNAME, DBVERSION).then( db => {
          var oS=openObjectStore(db, 'request', "readonly"); 
	  return oS;
    }).then( async objectStore => {
          var req= await selObjects(objectStore, "estadoIndex", estado); 
          console.log('[syncRequest] paso selObjects estado='+estado+' total de requerimientos='+req.length);
	  return req;
    }).then( requests => {
                  return Promise.all(
                         requests.map( (request) => {
                                console.log('[syncRequest] syncRequest antes de hacer fetch url='+request.value.url+' llave='+request.key+' estado='+estado);

                                if (request.value.url=='/solicita.php' & estado==ESTADOREQ.INICIAL.SOLICITUD & !('header' in request.value)) {    
					/* si se cumple solo va armar el soa para la peticion */
					dame_pwd().then( pwd => { 
						 console.log('[syncRequest] va a solicitar el armado del soa del key='+request.key);
						 DMS.solicita_armasoa(request,request.key,pwd) 
					});
					return;
				}


                                if (request.value.url=='/verifica.php' & 'respuesta' in request.value) { // no procesa las verificaciones ya terminadas
				     if  (request.value.respuesta.substring(0,9)=="Terminada" || request.value.respuesta.substring(0,9)=="Rechazada") {  return; }
                                }

                                if (request.value.url=='/solicita.php' & estado==ESTADOREQ.ACEPTADO) {  
				     postRequestUpd(request,"update-request","");   /* mensajea al cliente y aqui se genera el registro de verificacion */
                                     return; //si fue aceptada la solicitud deberia de mandar la verificacion
                                }

                                if (request.value.url=='factura') {
                                     return;
                                }

				const jsonHeaders = request.value.header;
				const headers = new Headers(jsonHeaders);
                                updestado(request,ESTADOREQ.REQUIRIENDO, null);
                                fetch(request.value.url,{ method : 'post', headers: headers, body   : request.value.body })
                                .then(response => {
                                          if (response.status==500) { updestado(request,ESTADOREQ.ERROR); return { 'error' : response.status };
                                          } else { return response.json(); }
                                })
                                .then( async response => {
                                          await updestado(request,ESTADOREQ.RECIBIDO, response); 
                                          return response;
                                 })
                                .then(response => { querespuesta(request,response); return Promise.resolve(); })
                                .catch(function(err)  { return Promise.reject(err); })
                         })
                   );
    });
};


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

/* checa cual fue la respuesta del servidor */
var querespuesta = (request,respuesta) => {
         console.log('[querespuesta] respuesta recibida del servidor id requerimiento='+request.key+' url='+request.value.url);
         if("error" in respuesta) {
            updestado(request,5,respuesta).then( () => { postRequestUpd(request,"update-request",respuesta); });
            return;
         }

         if("created" in respuesta) { /* si en la respuesta viene el item created quiere decir que esta autenticado y que se cuenta con un token */
            respuesta.createdLocal=Math.floor(Date.now() / 1000) ;
            respuesta.expiredLocal=Math.floor((Date.now() + (TOKEN.TIMELIVE*60*1000)) / 1000);
            updestado(request,ESTADOREQ.AUTENTICADO,respuesta).then( (r) => 
                          { postRequestUpd(r,"autenticado",respuesta); }
            );
            return;
         }

         if("status" in respuesta) {
            if ("code" in respuesta.status) {
               if (request.value.url=='/solicita.php') {
		       updestado(request,respuesta.status.code,respuesta.status.message)   // se supoone que aqui se acepto la solicitud
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
               if (request.value.url=='/verifica.php' & respuesta.status.code==ESTADOREQ.ACEPTADO) {
		       request.value.passdata.intentos=("intentos" in request.value.passdata ?  request.value.passdata.intentos+1 : 1);
		       request.value.passdata.msg_v=respuesta.statusRequest.message + ' ' + request.value.passdata.intentos;
		       "packagesIds" in respuesta ? request.value.folioReq=respuesta.packagesIds : null;
		       respuesta.codeRequest.value==5004 ? request.value.passdata.msg_v=respuesta.codeRequest.message.substring(0,29) : null; // no se encontro informacion
		       updestado(request,ESTADOREQ.VERIFICACIONTERMINADA,request.value.passdata.msg_v).then( () => {
			       updObjectByKey("request",request.value,request.key); // actualiza el resultado de la verificacion en el request de la verificacion 
			       respuesta.statusRequest.message=request.value.passdata.msg_v;
			       updSolicitud(respuesta,request.value.passdata.keySolicitud) 
                               .then( () => {
			            postRequestUpd(request,"se verifico",respuesta);
                               });
                       });
		       return;
               }
               if (request.value.url=='/verifica.php' & respuesta.status.code==ESTADOREQ.TOKENINVALIDO) {  // token invalido seguramente porque ya expiro
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
     upestado(request,ESTADOREQ.RESPUESTADESCONOCIDA,respuesta);
};

var updSolicitud = (respuesta,idKey) => {
        return new Promise( (resolve, reject) => {
		      selObjectByKey('request',idKey).then( obj => {
			        var mensaje='';
			        if (respuesta.statusRequest.message.substring(0,9)!=="Terminada") {
				    mensaje = respuesta.statusRequest.message ;
                                    if (mensaje=="No se encontró la información") {
					    obj.estado=ESTADOREQ.SOLICITUDSININFORMACION;
				    }	    
				    else  { 
					    obj.passdata.intentos=("intentos" in obj.passdata ?  obj.passdata.intentos+1 : 1);
					    obj.passdata.msg_v="Verificacione(s): "+obj.passdata.intentos;
					    obj.estado=ESTADOREQ.ACEPTADO; 
				    }
				} else {
				    mensaje = 'Facturas '+respuesta.numberCfdis;  
                                    obj.estado=ESTADOREQ.SOLICITUDTERMINADA
				}
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

var borraverificaciones = () => {
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
  if (event.data && event.data.action === 'setContra') {
	  encripta_pw(event.data.PWDFIEL);
  }

});
 
  setInterval( () => {
            if (DMS===null) {
                    DMS= new DescargaMasivaSat();
            }

       console.log('[setInterval] va a sincronizar');
       syncRequest(ESTADOREQ.INICIAL.AUTENTICA) ;
       syncRequest(ESTADOREQ.INICIAL.SOLICITUD);
       syncRequest(ESTADOREQ.INICIAL.VERIFICA);
       syncRequest(ESTADOREQ.ACEPTADO);
       syncRequest(ESTADOREQ.INICIAL.DESCARGA);
       bajaVerificaciones();
       bajaTokenCaducado();
  }, REVISA.ESTADOREQ * 1000);




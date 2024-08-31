if ("function" === typeof importScripts) {
   importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');
   importScripts('db.js');
   importScripts('Constantes.js');
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
    workbox.precaching.precacheAndRoute([{"revision":"a51306634718899c7223da3c64bd7258","url":"static/v2/apple-icon-180x180.png"},{"revision":"d60d8979a018c6c9f325a9923edbc901","url":"static/v2/apple-launch-1125x2436.png"},{"revision":"8deb514dd319e162034bc89a22a4b55d","url":"static/v2/apple-launch-1170x2532.png"},{"revision":"39e2197139f1aa1d74404e32097bf5db","url":"static/v2/apple-launch-1242x2688.png"},{"revision":"b33172204b0695d988bd6b1cb1ec8b83","url":"static/v2/apple-launch-1284x2778.png"},{"revision":"3274e95d3e2ba5b891dd6ec1c76d69c1","url":"static/v2/apple-launch-1536x2048.png"},{"revision":"456c1377fdf47262f056770ab7e75383","url":"static/v2/apple-launch-1668x2224.png"},{"revision":"88167a6568345c1f184f2b2b00b8b974","url":"static/v2/apple-launch-1668x2388.png"},{"revision":"aa2e9dcb9423e2cc3351efee275e93a2","url":"static/v2/apple-launch-2048x2732.png"},{"revision":"e907773cb684f6a5c52695a69f42e7ed","url":"static/v2/apple-launch-640x1136.png"},{"revision":"52448a1cec8159d7362899fcae0cdf16","url":"static/v2/apple-launch-750x1334.png"},{"revision":"7259618c8e117300e389a06cf8efd952","url":"static/v2/apple-launch-828x1792.png"},{"revision":"f6009bb1ae79e92aae7639849841b86f","url":"static/v2/asset-manifest.json"},{"revision":"5fcde1585d918711baecc6a33e531160","url":"static/v2/cadenaoriginal_3_3.js"},{"revision":"6305c17a7fa865f730ba6511bf2970d0","url":"static/v2/Constantes.js"},{"revision":"aa3455d3647fedabb7544e802376cfc6","url":"static/v2/db.js"},{"revision":"57fa627b552071d907841938379ed8af","url":"static/v2/favicon.ico"},{"revision":"e90842916e60987c879e3dae084acc47","url":"static/v2/forge.min.js"},{"revision":"82348aa30f78adaf8ccc53c067e08917","url":"static/v2/index.html"},{"revision":"7d5b147fcab946c531d11ea18e390783","url":"static/v2/manifest.json"},{"revision":"3af49b5ff302eeccf17b5258c2411a6c","url":"static/v2/pluma144x144.png"},{"revision":"136f21c487d2cfc622592779e8164a7a","url":"static/v2/pluma512x512m.png"},{"revision":"a49ab6790e56f3fd90ef6558324763cb","url":"static/v2/static/css/main.b2a7cc15.css"},{"revision":"7211a548504d26b8e19473d47eaee803","url":"static/v2/static/js/main.89c8eb9b.js"},{"revision":"76a4e1b67cc50d497523f90cb3d505b2","url":"static/v2/utils.js"},{"revision":"541ea20988d6452c83c3a169480c8a23","url":"static/v2/zip.min.js"}]);

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

self.addEventListener("sync", event => {
    console.log('[sync] sync '+event.tag);
    if (event.tag.substring(0,9)=== "autentica") {
       if (event.tag.substring(10)!=='') {
                     PWDFIEL=event.tag.substring(10);
       }
       event.waitUntil(syncRequest(ESTADOREQ.INICIAL));
    };
    if (event.tag === "verifica") {
       event.waitUntil(syncRequest(ESTADOREQ.INICIAL));
       event.waitUntil(syncRequest(ESTADOREQ.ACEPTADO));
    };
    if (event.tag === "dameContra") {
        event.waitUntil(enviaContra())
    };

});

var syncRequest = estado => {
    console.log('[syncRequest] estado='+estado);
    openDatabasex(DBNAME, DBVERSION).then( db => {
          var oS=openObjectStore(db, 'request', "readonly"); return oS;
    }).then( objectStore => {
          var req=selObjects(objectStore, "estadoIndex", estado); return req;
    }).then( requests => {
                  return Promise.all(
                         requests.map( async (request) => {
                                if (request.value.url=='/verifica.php' & (request.value.respuesta=="Terminada" || request.value.respuesta=="Rechazada")) {  
                                                 // no procesa las verificaciones ya terminadas 
                                     return;
                                }
                                if (request.value.url=='/solicita.php' & (estado==ESTADOREQ.ACEPTADO || estado==ESTADOREQ.REQUIRIENDO)) {  // no procesa las verificaciones ya terminadas 
                                     return;
                                }
                                if (request.value.url=='factura') {
                                     return;
                                }
                                console.log('[syncRequest] syncRequest antes de hacer map '+request.value.url+' llave='+request.key);
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
                           console.log('[updestado] actualizo el estado forma key='+request.key+' Estado='+esta);
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
                        console.log('[postRequestUpd] envia mensaje al cliente id='+client.id+' accion='+accion+' key='+request.key);
                        client.postMessage(
                                {action: accion, request: request, respuesta: respuesta, PWDFIEL:PWDFIEL}
                        );
                });
        });
};
 
var enviaContra = () => {
        self.clients.matchAll({ includeUncontrolled: true }).then(function(clients) {
                clients.forEach(function(client) {
                        console.log('[postRequestUpd] envia mensaje al cliente id='+client.id+' accion='+accion+' key='+request.key);
                        client.postMessage(
                                {contra: PWDFIEL}
                        );
                });
        });

}

var querespuesta = (request,respuesta) => {
         console.log('[querespuesta] respuesta recibida del servidor id='+request.key+' url='+request.value.url);
         if("error" in respuesta) {
            updestado(request,5,respuesta).then( () => { postRequestUpd(request,"update-request",respuesta); });
            return;
         }

         if("created" in respuesta) {
            respuesta.createdLocal=Math.floor(Date.now() / 1000) ;
            respuesta.expiresLocal=Math.floor((Date.now() + (TOKEN.TIMELIVE*60*1000)) / 1000);
            updestado(request,ESTADOREQ.AUTENTICADO,respuesta).then( (r) => 
                          { postRequestUpd(r,"update-request",respuesta); }
            );
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
                                 postRequestUpd(request,"update-request",respuesta);
                             });
		       return;
               }
               if (request.value.url=='/verifica.php' & respuesta.status.code==5000) {
		       request.value.passdata.msg_v=respuesta.statusRequest.message;
		       "packagesIds" in respuesta ? request.value.folioReq=respuesta.packagesIds : null;
		       updestado(request,respuesta.status.code,respuesta.statusRequest.message).then( () => {
			       updObjectByKey("request",request.value,request.key); // actualiza el resultado de la verificacion en el request de la verificacion 
			       updSolicitud(respuesta,request.value.passdata.keySolicitud) 
                               .then( () => {
			            postRequestUpd(request,"update-request",respuesta);
                               });
                       });
		       return;
               }
               if (request.value.url=='/verifica.php' & respuesta.status.code==300) {  // token invalido seguramente porque ya expiro
                       updestado(request,ESTADOREQ.TOKENINVALIDO,respuesta.status.message);
		       return;
               }
            }
         }

         if(respuesta.msg=="El paquete se descargo") {
		       request.value.passdata.msg_d=respuesta.msg;
                       updestado(request,ESTADOREQ.PAQUETEDESCARGADO,respuesta).then( () => {  // actualiza el resultado de la descarga en el request de la descarga
                               updObjectByKey("request",request.value,request.key); // actualiza el resultado de la descarga en el request de la descarga
                               updSolicitudDownload('Se descargo',request.value.passdata.keySolicitud)  // actualiza el resulta de la descarga en el request de la solicitud
                               .then( () => {
                                    postRequestUpd(request,"update-request",respuesta);
                               });
                       });
                       return;
         }
     updestado(request,ESTADOREQ.RESPUESTADESCONOCIDA,respuesta);
};

var updSolicitud = (respuesta,idKey) => {
        return new Promise( (resolve, reject) => {
		      selObjectByKey('request',idKey).then( obj => {
				var mensaje = respuesta.statusRequest.message!=="Terminada" ?  respuesta.statusRequest.message : 'Facturas '+respuesta.numberCfdis ;
				obj.passdata.msg_v=mensaje;
				updObjectByKey('request',obj,idKey);
		      }).then( () => { resolve() });
        });
}

var updSolicitudDownload = (mensaje,idKey) => {
        return new Promise( (resolve, reject) => {
                      selObjectByKey('request',idKey).then( obj => {
                                obj.passdata.msg_d=mensaje;
                                updObjectByKey('request',obj,idKey);
                      }).then( () => { resolve() });
        });
}

self.addEventListener('activate', function(event) {
  console.log('[sw.js] va a activar el intervalor para revisar requerimentos iniciales o aceptados');
});
 
  setInterval(function() {
       syncRequest(ESTADOREQ.INICIAL);
       syncRequest(ESTADOREQ.ACEPTADO);
  }, REVISA.ESTADOREQ * 1000);




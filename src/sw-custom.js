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
                     console.log('[sync] PWDFIEL='+PWDFIEL);;
       }
       event.waitUntil(syncRequest(ESTADOREQ.INICIAL));
    };
    if (event.tag.substring(0,8)=== "autLocal") {
       if (event.tag.substring(9)!=='') {
                     PWDFIEL=event.tag.substring(10);
                     console.log('[sync] PWDFIEL='+PWDFIEL);;
       }
       //event.waitUntil(syncRequest(ESTADOREQ.INICIAL));
    }
    if (event.tag === "verifica") {
       event.waitUntil(syncRequest(ESTADOREQ.INICIAL));
       event.waitUntil(syncRequest(ESTADOREQ.ACEPTADO));
    };
    if (event.tag === "dameContra") {
        event.waitUntil(enviaContra())
    };

});

var syncRequest = estado => {
    //console.log('[syncRequest] estado='+estado);
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
                        console.log('[enviaContra] envia mensaje al cliente id='+client.id+' accion=contra');
                        client.postMessage(
                                {action: 'contra',contra: PWDFIEL}
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
                                 request.value.passdata.msgs=[];
		                 request.value.passdata.msgs.push(respuesta.status.message);
		                 "requestId" in respuesta ? request.value.folioReq=respuesta.requestId : null;
		                 updObjectByKey("request",request.value,request.key); /* actualiza el folio del requerimiento de la solicitud */
                              })
                       .then ( () => {
                                 postRequestUpd(request,"update-request",respuesta);
                             });
		       return;
               }
               if (request.value.url=='/verifica.php') {
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
                                mensaje = respuesta.codeRequest.value=='5004' ? respuesta.codeRequest.message :  mensaje;
                                mensaje = mensaje.indexOf("En proceso")!==-1 ? cuantosproceso(mensaje) : mensaje ;
				obj.passdata.msgs.push(mensaje);
				updObjectByKey('request',obj,idKey);
		      }).then( () => { resolve() });
        });
}
 
var cuantosproceso = (m) => {
    e=m.split(':');
    if (e.length==1) return 'En proceso : 1' ;
    return 'En proceso :'+e[1]+1;
}

var updSolicitudDownload = (mensaje,idKey) => {
        return new Promise( (resolve, reject) => {
                      selObjectByKey('request',idKey).then( obj => {
                                obj.passdata.msgs.push(mensaje);
                                updObjectByKey('request',obj,idKey);
                      }).then( () => { resolve() });
        });
}

self.addEventListener('activate', function(event) {
  console.log('[sw.js] va a activar el intervalo para revisar requerimentos iniciales o aceptados');
  selObjectUlt('configuracion',undefined,undefined,'prev').then( d => {
     console.log('[sw.js activate] dias_token='+JSON.stringify(d));
  }).
  catch( error => {
     inserta_dias_token();
  });
});
 
  setInterval(function() {
       syncRequest(ESTADOREQ.INICIAL);
       syncRequest(ESTADOREQ.ACEPTADO);
  }, REVISA.ESTADOREQ * 1000);




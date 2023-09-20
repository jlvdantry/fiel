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
    if (event.tag === "autentica") {
       event.waitUntil(syncRequest(ESTADOREQ.INICIAL));
    };

});

var syncRequest = estado => {
    openDatabasex(DBNAME, DBVERSION).then( db => {
          var oS=openObjectStore(db, 'request', "readonly"); return oS;
    }).then( objectStore => {
          var req=selObjects(objectStore, "estadoIndex", estado); return req;
    }).then( requests => {
                  return Promise.all(
                         requests.map(function(request) {
                                console.log('[syncRequest] syncRequest antes de hacer map '+request.value.url+' llave='+request.key);
				const jsonHeaders = request.value.header;
				const headers = new Headers(jsonHeaders);
                                fetch(request.value.url,{ method : 'post', headers: headers, body   : request.value.body })
                                .then(response => {
                                          if (response.status==500) { updestado(request,ESTADOREQ.ERROR); return { 'error' : response.status };
                                          } else { return response.json(); }
                                })
                                .then(response => {
                                          if(request.value.url=='/autentica.php') { updestado(request,estado,ESTADOREQ.AUTENTICADO, response); return response;
                                          } else { updestado(request,ESTADOREQ.RECIBIDO, response); return response; }
                                 })
                                .then(response => { querespuesta(request,response); return Promise.resolve(); })
                                .catch(function(err)  { return Promise.reject(err); })
                         })
                   );
    });
};

var updestado = function (request,estado,respuesta) {
        return new Promise(function (resolve, reject) {
            var now = new Date();
            console.log( '[updestado] updestado key='+request.key+' Estado='+estado);
            openDatabasex(DBNAME, DBVERSION).then(function(db) {
                  return openObjectStore(db, 'request', "readwrite");
                   }).then(function(objectStore) {
                           request.value.estado=estado;
                           request.value.respuesta=respuesta;
                           return updObject_01(objectStore, request.value, request.key);
                   }).then(function(objectStore) {
                           console.log('[updestado] upestado debe de actualizar la forma key='+request.key+' Estado='+estado);
                           postRequestUpd(request,estado,"update-request",respuesta);
                   }).catch(function(err)  {
                           return Promise.reject(err);
                   });
            resolve('ok');
        });
};

var postRequestUpd = function(request,estado,accion,respuesta) {
        self.clients.matchAll({ includeUncontrolled: true }).then(function(clients) {
                clients.forEach(function(client) {
                        console.log('[postRequestUpd] envia mensaje al cliente id='+client.id+' accion='+accion+' key='+request.key+' Estado='+estado);
                        client.postMessage(
                                {action: accion, request: request, estado: estado, respuesta: respuesta}
                        );
                });
        });
};

var querespuesta = function(request,respuesta) {
      console.log('[querespuesta] respuesta recibida del servidor='+respuesta);
         if("error" in respuesta) {
            updestado(request,5,respuesta);
            return;
         }

         if("created" in respuesta) {
            updestado(request,ESTADOREQ.AUTENTICADO,respuesta);
            return;
         }
         if("status" in respuesta) {
            if ("code" in respuesta.status) {
               if (request.value.url=='/solicita.php') {
		       updestado(request,respuesta.status.code,respuesta.status.message);
		       request.value.passdata.msg=respuesta.status.message;
		       "requestId" in respuesta ? request.value.folioReq=respuesta.requestId : null;
		       updObjectByKey("request",request.value,request.key);
		       return;
               }
               if (request.value.url=='/verifica.php') {
		       updestado(request,respuesta.status.code,respuesta.statusRequest.message);
		       request.value.passdata.msg_v=respuesta.statusRequest.message;
		       "requestId" in respuesta ? request.value.folioReq=respuesta.requestId : null;
		       updObjectByKey("request",request.value,request.key);
                       if (respuesta.codeRequest.value!=5000) { updSolicitud(respuesta.codeRequest.message,request.value.passdata.keySolicitud) ; }
                       else 
                          { 
                              if (respuesta.statusRequest.message!=="Terminada")
                                 { updSolicitud(respuesta.statusRequest.message,request.value.passdata.keySolicitud); }
                              else  
                                 { updSolicitud('Facturas '+respuesta.numberCfdis,request.value.passdata.keySolicitud); }
                          }
		       return;
               }
            }
         }
     updestado(request,ESTADOREQ.RESPUESTADESCONOCIDA,respuesta);
};

var updSolicitud = (mensaje,idKey) => {
      selObjectByKey('request',idKey).then( obj => {
                obj.passdata.msg_v=mensaje;
                updObjectByKey('request',obj,idKey);
      });
}


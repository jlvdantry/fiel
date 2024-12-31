SW_VERSION = '1.0.290';
importScripts('utils.js');
importScripts('db.js');
importScripts('dbFiel.js');
importScripts('fiel.js');
importScripts('descargaMasivaSat.js');
importScripts('encripta.js');
console.log('[sw] entro');
var DMS = null;
var intervalId = null;
if ("function" === typeof importScripts) {
   importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');
   importScripts('Constantes.js');
   importScripts('encripta.js');
   importScripts('insertaDatos.js');
	/* para mostrar el log en el browser   
	const originalConsoleLog = console.log;
	console.log = function (...args) {
	    originalConsoleLog.apply(this, args);
	    const message = args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : arg)).join(' ');
	    clients.matchAll({ includeUncontrolled: true, type: 'window' }).then(clientList => {
		clientList.forEach(client => {
		    client.postMessage({ action: 'log', message }); // Send a structured message
		});
	    });
	};
	*/

  // Global workbox
  if (workbox) {
    console.log("Workbox is loaded");
    workbox.setConfig({ debug: true });
    workbox.loadModule('workbox-strategies');


      self.skipWaiting();
    //`generateSW` and `generateSWString` provide the option
    // to force update an exiting service worker.
    // Since we're using `injectManifest` to build SW,
    // manually overriding the skipWaiting();
    self.addEventListener("install", (event) => {
      console.log('[install] entro');
      //self.skipWaiting();
      generallaves();
      insertaRFCS();
    });


	self.addEventListener('activate', event => {
		console.log('[activate] ');
		event.waitUntil(self.clients.claim());
                if (DMS===null) { 
		    DMS= new DescargaMasivaSat(); 
		    DMS.getTokenEstatusSAT().then( res => {
			       if (res.tokenEstatusSAT===TOKEN.NOSOLICITADO || res.tokenEstatusSAT===TOKEN.CADUCADO || res.tokenEstatusSAT===ESTADOREQ.ERROR) {
				       console.log('[sw activate] va a autenticarse contra el SAT');
				       dame_pwd.then(pwd => {
				            DMS.autenticate_armasoa(pwd).then( x => { console.log('[sw activate] genero el request de aut') }); 
				       });
			       } else {
				       DMS=null;
			       }
		    });
		}
	});


    // Manual injection point for manifest files.
    // All assets under build/ and 5MB sizes are precached.
    workbox.precaching.precacheAndRoute([{"revision":"a51306634718899c7223da3c64bd7258","url":"static/v4/apple-icon-180x180.png"},{"revision":"d60d8979a018c6c9f325a9923edbc901","url":"static/v4/apple-launch-1125x2436.png"},{"revision":"8deb514dd319e162034bc89a22a4b55d","url":"static/v4/apple-launch-1170x2532.png"},{"revision":"39e2197139f1aa1d74404e32097bf5db","url":"static/v4/apple-launch-1242x2688.png"},{"revision":"b33172204b0695d988bd6b1cb1ec8b83","url":"static/v4/apple-launch-1284x2778.png"},{"revision":"3274e95d3e2ba5b891dd6ec1c76d69c1","url":"static/v4/apple-launch-1536x2048.png"},{"revision":"456c1377fdf47262f056770ab7e75383","url":"static/v4/apple-launch-1668x2224.png"},{"revision":"88167a6568345c1f184f2b2b00b8b974","url":"static/v4/apple-launch-1668x2388.png"},{"revision":"aa2e9dcb9423e2cc3351efee275e93a2","url":"static/v4/apple-launch-2048x2732.png"},{"revision":"e907773cb684f6a5c52695a69f42e7ed","url":"static/v4/apple-launch-640x1136.png"},{"revision":"52448a1cec8159d7362899fcae0cdf16","url":"static/v4/apple-launch-750x1334.png"},{"revision":"7259618c8e117300e389a06cf8efd952","url":"static/v4/apple-launch-828x1792.png"},{"revision":"f32bff7ece4c807bf0486c0a48934724","url":"static/v4/asset-manifest.json"},{"revision":"5fcde1585d918711baecc6a33e531160","url":"static/v4/cadenaoriginal_3_3.js"},{"revision":"6d45e980f5b3172686b79f83b7fb2729","url":"static/v4/cargaFael.js"},{"revision":"45a344987ca3ae5e4656e0f644db5ad6","url":"static/v4/cargaFiel.js"},{"revision":"4941c9dc7a7f93e80887f93a9be5ae9c","url":"static/v4/Constantes.js"},{"revision":"2e3ec8e280431cc1210f4b62019fb919","url":"static/v4/db.js"},{"revision":"13dc121556039b8d106745468ea97e3f","url":"static/v4/dbFiel.js"},{"revision":"a999c9510dfe849499448e9a5400f586","url":"static/v4/descargaMasivaSat.js"},{"revision":"b3455c1dc2e4ab6fa628e60df491357c","url":"static/v4/encripta.js"},{"revision":"57fa627b552071d907841938379ed8af","url":"static/v4/favicon.ico"},{"revision":"72376defcec0684ed0f9b91d17c0855c","url":"static/v4/fiel.js"},{"revision":"e90842916e60987c879e3dae084acc47","url":"static/v4/forge.min.js"},{"revision":"04b3b312d4775bf9dcff74df0b9ff426","url":"static/v4/index.html"},{"revision":"c7c2fba1ef5fb31aeef361be8a5161dc","url":"static/v4/insertaDatos.js"},{"revision":"7d5b147fcab946c531d11ea18e390783","url":"static/v4/manifest.json"},{"revision":"76af09612cae73ea86bdd8d8fcad5598","url":"static/v4/mifiel.png"},{"revision":"3af49b5ff302eeccf17b5258c2411a6c","url":"static/v4/pluma144x144.png"},{"revision":"136f21c487d2cfc622592779e8164a7a","url":"static/v4/pluma512x512m.png"},{"revision":"e783a65500d79dd8adc8d064e6cf105b","url":"static/v4/static/css/main.3e8e37ab.css"},{"revision":"c98c13c14c3cce5948f94f7d8de459a1","url":"static/v4/static/js/main.02f1ae0f.js"},{"revision":"936314bc2d9d2cd574f9ea430d8b612c","url":"static/v4/utils.js"},{"revision":"541ea20988d6452c83c3a169480c8a23","url":"static/v4/zip.min.js"}]);

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
    openDatabasex(DBNAME, DBVERSION).then( db => {
          var oS=openObjectStore(db, 'request', "readonly"); 
	  return oS;
    }).then( async objectStore => {
          var req= await selObjects(objectStore, "estadoIndex", estado); 
	  return req;
    }).then( requests => {
                  return Promise.all(
                         requests.map( (request) => {
                                console.log('[syncRequest] url='+request.value.url+' llave='+request.key+' estado='+estado);

                                if (request.value.url=='/solicita.php' & estado==ESTADOREQ.INICIAL.SOLICITUD & !('header' in request.value)) {    
					/* si se cumple solo va armar el soa para la peticion */
					dame_pwd().then( pwd => { 
                                                 if (DMS===null) { DMS= new DescargaMasivaSat(); }
						 DMS.solicita_armasoa(request,request.key,pwd) 
					});
					return;
				}


                                if (request.value.estado==ESTADOREQ.SOLICITUDPENDIENTEDOWNLOAD) { // genera registro para que se  descargue las facturas
                                         console.log('[syncRequest] va a obtener el ultimo token activo');
					 obtieneelUltimoTokenActivo().then( aut => {
                                                         console.log('[syncRequest] download');
							 var token = { created: aut.value.respuesta.created, expired:aut.value.respuesta.expired ,value:aut.value.respuesta.value };
                                                         console.log('[syncRequest] download token');
							 var datos = { pwdfiel:PWDFIEL, token:token,folioReq:request.value.folioReq };
                                                         console.log('[syncRequest] download datos');
                                                         DMS.descargando(datos,request).then( x=> { 
                                                                console.log('[syncRequest] download DMS.descargando');
								updestado(request,ESTADOREQ.SOLICITUDDESCARGANDO); 
					                 });
					 }).catch( e=> { console.error('[syncRequest] error='+JSON.stringify(e,true));
					 });

					 return;
                                }

                                if (request.value.url=='/verifica.php' & 'respuesta' in request.value) { // no procesa las verificaciones ya terminadas
                                     if  (request.value.respuesta.substring(0,9)=="Rechazada") {  return; }
                                }

                                if (request.value.url=='/solicita.php' & estado==ESTADOREQ.ACEPTADO) {  // genera el registro de verificacion
					 obtieneelUltimoTokenActivo().then( aut => {
						 if ('respuesta' in aut.value) {
						    if (aut.value.respuesta!==null) {
							 var token = { created: aut.value.respuesta.created, expired:aut.value.respuesta.expired
									       ,value:aut.value.respuesta.value }
							 var datos = { pwdfiel:PWDFIEL, token:token,folioReq:request.value.folioReq }
							 DMS.verificando( datos,request.key);
						    }
						 }
					 }).catch( e=> { console.log('[syncRequest] no token para verificar e='+JSON.stringify(e,true));
					 });

				         postRequestUpd(request,"update-request","");   /* mensajea al cliente y aqui se genera el registro de verificacion */
                                         return; //si fue aceptada la solicitud deberia de mandar la verificacion
                                }

                                if (request.value.url=='factura') {
                                     return;
                                }

				const jsonHeaders = request.value.header;
				const headers = new Headers(jsonHeaders);
                                updestado(request,ESTADOREQ.REQUIRIENDO, null).then( x=> {
					console.log('[syncRequest] url='+request.value.url+' key='+request.key+' es='+estado);
					fetch(request.value.url,{ method : 'post', headers: headers, body   : request.value.body })
					.then( async response => {
						  if (response.status===500) { 
							  console.log('sw error 500');
							  await updestado(request,ESTADOREQ.ERROR);
							  Promise.reject({'error' : response.status });
						  } else { return response.json(); }
					})
					.then( async response => {
						  await updestado(request,ESTADOREQ.RECIBIDO, response); 
						  return response;
					 })
					.then(response => { querespuesta(request,response); return Promise.resolve(); })
					.catch(function(err)  { 
						console.log('[fetch] error='+err);
						return Promise.reject(err); 
					})
                                });
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
         if(respuesta===undefined) {
		 console.log('[querepuesta] respuesta indefinida'+JSON.stringify(request,true));
		 debugger;
	 }
         console.log('[querespuesta] id='+request.key+' url='+request.value.url);
         if("error" in respuesta) {
            updestado(request,ESTADOREQ.ERROR,respuesta).then( () => { postRequestUpd(request,"update-request",respuesta); });
            return;
         }

         if("created" in respuesta) { /* si en la respuesta viene el item created quiere decir que esta autenticado y que se cuenta con un token */
            respuesta.createdLocal=Math.floor(Date.now() / 1000) ;
            respuesta.expiredLocal=Math.floor((Date.now() + (TOKEN.TIMELIVE*60*1000)) / 1000);
            updestado(request,ESTADOREQ.AUTENTICADO,respuesta).then( (r) => 
                          { postRequestUpd(r,"autenticado",respuesta); 
			    if (DMS===null) { DMS= new DescargaMasivaSat(); }
			  });
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
			       updSolicitud(respuesta,request.value) 
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
     updestado(request,ESTADOREQ.RESPUESTADESCONOCIDA,respuesta);
};

var updSolicitud = (respuesta,verificacionValue) => {
        return new Promise( (resolve, reject) => {
		      selObjectByKey('request',verificacionValue.passdata.keySolicitud).then( obj => {
			        var mensaje='';
			        if (respuesta.statusRequest.message.substring(0,9)!=="Terminada") {
				    mensaje = respuesta.statusRequest.message ;
                                    if (mensaje=="No se encontró la información") {
					    obj.estado=ESTADOREQ.SOLICITUDSININFORMACION;
					    obj.passdata.msg_v=mensaje;
				    }	    
				    else  { 
					    obj.passdata.intentos=("intentos" in obj.passdata ?  obj.passdata.intentos+1 : 1);
					    obj.passdata.msg_v="Verificacione(s): "+obj.passdata.intentos;
					    obj.estado=ESTADOREQ.ACEPTADO; 
				    }
				}
                                if (respuesta.statusRequest.message.substring(0,9)==="Terminada") {
				    mensaje = 'Facturas '+respuesta.numberCfdis;  
                                    obj.estado=ESTADOREQ.SOLICITUDPENDIENTEDOWNLOAD
                                    obj.passdata.msg_v=mensaje;
                                    obj.folioReq=verificacionValue.folioReq;
				}
                                if (respuesta.statusRequest.message.substring(0,7)==="Vencida") {
                                    mensaje = 'Vencida ';
                                    obj.estado=ESTADOREQ.SOLICITUDVENCIDA
                                    obj.passdata.msg_v=mensaje;
                                }
				updObjectByKey('request',obj,verificacionValue.passdata.keySolicitud);
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


self.addEventListener('message', (event) => {
  console.log('recibio message el sw event='+JSON.stringify(event.data.action,true));
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
});

/* checa si ya se tecleo el pwd de la privada */
var revisaSiEstaAutenticado = () => {
	dame_pwd().then(pwd => {
	    if (pwd!==null)  { /* ya se tecleo la pwd */
	       if (DMS===null) {
		   PWDFIEL= pwd;
		   DMS= new DescargaMasivaSat();
               }
	       DMS.getTokenEstatusSAT().then( res => {
                   if (res.tokenEstatusSAT===TOKEN.NOSOLICITADO || res.tokenEstatusSAT===TOKEN.CADUCADO || res.tokenEstatusSAT===ESTADOREQ.ERROR || res.tokenEstatusSAT===TOKEN.NOGENERADO) {
			       console.log('[sw revisaSiEstaAutenticado] va a autenticarse contra el SAT');
			       DMS.autenticate_armasoa(pwd).then( x => { console.log('[sw] genero el request de autentificacion') });
                   }
	       });
	    }
	});
}

        dame_pwd().then(pwd => {
            if (pwd!==null)  { /* ya se tecleo la pwd */
               if (DMS===null) {
                   PWDFIEL= pwd;
                   DMS= new DescargaMasivaSat();
               }
            }
        });


setInterval( () => {
       console.log('[setInterval] va a sincronizar');
	try {
       syncRequest(ESTADOREQ.INICIAL.AUTENTICA) ;
       syncRequest(ESTADOREQ.INICIAL.SOLICITUD);
       syncRequest(ESTADOREQ.INICIAL.VERIFICA);
       syncRequest(ESTADOREQ.SOLICITUDPENDIENTEDOWNLOAD);
       syncRequest(ESTADOREQ.ACEPTADO);
       syncRequest(ESTADOREQ.INICIAL.DESCARGA);
       bajaVerificaciones();
       bajaTokenCaducado();
       bajaTokenInvalido();
       bajaRequiriendo();
	} catch (err) {
        console.error("Error in interval:", err);
    }
}, REVISA.ESTADOREQ * 1000);

setInterval( () => {
	try {
            revisaSiEstaAutenticado()
	    } 
	catch (err) {
           console.error("Error in interval EstaAutenticado:", err);
	};
}, REVISA.VIGENCIATOKEN_SW * 1000);




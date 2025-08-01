SW_VERSION = '1.0.290';
importScripts('utils.js');
importScripts('encripta.js');
importScripts('db.js');
importScripts('dbFiel.js');
importScripts('dbInterval.js');
importScripts('fiel.js');
importScripts('descargaMasivaSat.js');
console.log('[sw] entro');
var DMS = null;
var intervalSync = null;

/*
        const originalConsoleLog = console.log;
        console.log = function (...args) {
            const message = args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : arg)).join(' ');
            clients.matchAll({ includeUncontrolled: true, type: 'window' }).then(clientList => {
                clientList.forEach(client => {
                    client.postMessage({ action: 'log', message }); // Send a structured message
                });
            });
       };
       */

if ("function" === typeof importScripts) {
   importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');
   importScripts('Constantes.js');
   importScripts('insertaDatos.js');
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
		console.log('[activate] '+event.target.state);
		event.waitUntil(self.clients.claim());
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
       event.waitUntil(syncRequest(ESTADOREQ.SOLICITUDACEPTAD));
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
                  //console.log('[sR] estado='+estado+' requests='+requests.length);
                  //return Promise.all(
                         requests.map( request => {
                                console.log('[sR] url='+request.value.url+' key='+request.key+' es='+estado);
                                if (request.value.url=='/solicita.php' & estado==ESTADOREQ.INICIAL.SOLICITUD & !('header' in request.value)) {    
                                        if (DMS===null) { DMS= new DescargaMasivaSat(); }
					/* si se cumple solo va armar el soa para la peticion */
					dame_pwd().then( pwd => { 
						 DMS.solicita_armasoa(request,request.key,pwd) 
					});
					return;
				}

                                if (request.value.estado==ESTADOREQ.SOLICITUDPENDIENTEDOWNLOAD) { // genera registro para que se  descargue las facturas
                                         console.log('[sR] va a obtener el ultimo token activo');
					 obtieneelUltimoTokenActivo().then( aut => {
                                                         console.log('[sR] download');
							 var token = { Created: aut.value.respuesta.Created, Expires:aut.value.respuesta.Expires ,token:aut.value.respuesta.token };
                                                         console.log('[sR] download token');
							 var datos = { pwdfiel:PWDFIEL, token:token,folioReq:request.value.folioReq };
                                                         console.log('[sR] download datos');
                                                         DMS.descargando(datos,request).then( x=> { 
                                                                console.log('[sR] download DMS.descargando');
								updestado(request,ESTADOREQ.SOLICITUDDESCARGANDO); 
					                 });
					 }).catch( e=> { console.error('[sR] error='+JSON.stringify(e,true));
					 });
					 return;
                                }

                                if (request.value.url=='/verifica.php' & 'respuesta' in request.value) { // no procesa las verificaciones ya terminadas
                                     if  (request.value.respuesta.substring(0,9)=="Rechazada") {  return; }
                                }

                                if (request.value.url=='/solicita.php' & estado==ESTADOREQ.SOLICITUDACEPTADA) {  // genera el registro de verificacion
					 obtieneelUltimoTokenActivo().then( aut => {
						 if ('respuesta' in aut.value) {
						    if (aut.value.respuesta!==null) {
							 var token = { Created: aut.value.respuesta.Created, Expires:aut.value.respuesta.Expires
									       ,token:aut.value.respuesta.token }
							 var datos = { pwdfiel:PWDFIEL, token:token,folioReq:request.value.folioReq }
							 DMS.verificando( datos,request.key);
						    }
						 }
					 }).catch( e=> { console.log('[sR] no token para verificar e='+JSON.stringify(e,true));
					 });
				         postRequestUpd(request,"update-request","");   /* mensajea al cliente y aqui se genera el registro de verificacion */
                                         return; //si fue aceptada la solicitud deberia de mandar la verificacion
                                }

                                if (request.value.url=='factura') {
                                     return;
                                }

				const jsonHeaders = request.value.header;
				const HEADERS = new Headers(jsonHeaders);
                                updestado(request,ESTADOREQ.REQUIRIENDO, null).then( x=> {
					console.log('[sR] url='+request.value.url+' key='+request.key+' es='+estado);
					body={envelope:request.value.body,urlSAT:request.value.urlSAT,headers:JSON.stringify(jsonHeaders)};
					headerf={'content-type':'application/json'};
					fetch('proxySAT.php',{method : 'post', headers: headerf, body   : JSON.stringify(body) })
					.then( async response => {
						  if (response.status===500) { 
							  console.log('[sr] error 500');
							  await updestado(request,ESTADOREQ.ERROR);
							  Promise.reject({'error' : response.status });
						  } else { return response.json(); }
					})
					.then( async response => {
						  await updestado(request,ESTADOREQ.RECIBIDO, response); 
						  return response;
					 })
					.then(response => { querespuesta(request,response); return Promise.resolve(); })
					.catch( async err => { 
						console.log('[fetch] error='+err);
						await updestado(request,ESTADOREQ.ERRORFETCH, err); 
						return Promise.reject(err); 
					})
                                });  // fin updestado
                         });  // fin del map
                    //); // promise all
    }); // fin requests
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
		 console.log('[qr] respuesta indefinida'+JSON.stringify(request,true));
	 }
         console.log('[qr] id='+request.key+' url='+request.value.url);
         if("error" in respuesta) {
            updestado(request,ESTADOREQ.ERROR,respuesta).then( () => { postRequestUpd(request,"update-request",respuesta); });
            return;
         }

         if("Created" in respuesta) { /* si en la respuesta viene el item created quiere decir que esta autenticado y que se cuenta con un token */
            respuesta.createdLocal=Math.floor(Date.now() / 1000) ;
            respuesta.expiredLocal=Math.floor((Date.now() + (TOKEN.TIMELIVE*60*1000)) / 1000);
            updestado(request,ESTADOREQ.AUTENTICADO,respuesta).then( (r) => 
                          { postRequestUpd(r,"autenticado",respuesta); 
			    if (DMS===null) { DMS= new DescargaMasivaSat(); }
			  });
            return;
         }

         if("status" in respuesta & "CodEstatus" in respuesta) {
               if (request.value.url=='/solicita.php') {
		       updestado(request,respuesta.CodEstatus,respuesta.Mensaje)   // se supone que aqui se acepto la solicitud
                       .then( (r) => { 
		                 request.value.passdata.msg=respuesta.Mensaje;
		                 "IdSolicitud" in respuesta ? request.value.folioReq=respuesta.IdSolicitud : null;
		                 updObjectByKey("request",request.value,request.key); /* actualiza el folio del requerimiento de la solicitud */
                              })
                       .then ( () => {
                                 postRequestUpd(request,"se genero una solicitud",respuesta);
                             });
		       return;
               }
               if (request.value.url=='/verifica.php')  {

		    if (respuesta.EstadoSolicitud==ESTADOSOLICITUD.ACEPTADA) {
		       request.value.passdata.intentos=("intentos" in request.value.passdata ?  request.value.passdata.intentos+1 : 1);
		       request.value.passdata.msg_v=respuesta.Mensaje + ' ' + request.value.passdata.intentos;
		       updestado(request,ESTADOREQ.VERIFICACIONTERMINADA,respuesta.Mensaje).then( () => {
				     updSolicitud(respuesta,request.value)
				       .then( () => {
					postRequestUpd(request,"se verifico",respuesta);
				       });

                               });
		    }
		    //   "packagesIds" in respuesta ? request.value.folioReq=respuesta.packagesIds : null;
		    //   respuesta.codeRequest.value==5004 ? request.value.passdata.msg_v=respuesta.codeRequest.message.substring(0,29) : null; // no se encontro informacion
		    //   updestado(request,ESTADOREQ.VERIFICACIONTERMINADA,request.value.passdata.msg_v).then( () => {
		//	       updObjectByKey("request",request.value,request.key); // actualiza el resultado de la verificacion en el request de la verificacion 
		//	       respuesta.statusRequest.message=request.value.passdata.msg_v;
		//	       updSolicitud(respuesta,request.value) 
                 //              .then( () => {
		//	            postRequestUpd(request,"se verifico",respuesta);
                 //              });
                 //      });
		       return;
               }
//               if (request.value.url=='/verifica.php' & respuesta.CodEstatus==ESTADOREQ.TOKENINVALIDO) {  // token invalido seguramente porque ya expiro
//                       updestado(request,ESTADOREQ.TOKENINVALIDO,respuesta.Mensaje).then ( () => {;
//                                    postRequestUpd(request,"token-invalido",respuesta);
//		       });
//		       return;
//               }
         }

         if(respuesta.Mensaje=="El paquete se descargo") {
		       request.value.passdata.msg_d=respuesta.Mensaje;
                       updestado(request,ESTADOREQ.DESCARGADO,respuesta).then( () => {  // actualiza el resultado de la descarga en el request de la descarga
                               updObjectByKey("request",request.value,request.key); // actualiza el resultado de la descarga en el request de la descarga
                               updSolicitudDownload('Se descargo',request.value.passdata.keySolicitud)  // actualiza el resulta de la descarga en el request de la solicitud
                               .then( () => {
                                    postRequestUpd(request,"se descargo",respuesta);
                               });
                       });
                       return;
         }
	               request.value.passdata.msg_d=respuesta.Mensaje;
                       updestado(request,ESTADOREQ.RESPUESTADESCONOCIDA,respuesta).then( () => {  // actualiza el resultado de la descarga en el request de la descarga
                               updObjectByKey("request",request.value,request.key); // actualiza el resultado de la descarga en el request de la descarga
                               updSolicitudDownload(respuesta.Mensaje,request.value.passdata.keySolicitud)  // actualiza el resulta de la descarga en el request de la solicitud
                               .then( () => {
                                    postRequestUpd(request,respuesta.Mensaje,respuesta);
                               });
                       });

};

var updSolicitud = (respuesta,verificacionValue) => {
        return new Promise( (resolve, reject) => {
		      selObjectByKey('request',verificacionValue.passdata.keySolicitud).then( obj => {
			        var mensaje='';
			        if (respuesta.EstadoSolicitud==ESTADOSOLICITUD.TERMINADA) {
                                   if(respuesta.NumeroCFDIs==0) {
					    mensaje = 'No se encontro informacion'
					    obj.estado=ESTADOREQ.SOLICITUDSININFORMACION;
					    obj.passdata.msg_v=mensaje;
				   }	    
                                   else {
					    mensaje = 'Facturas '+respuesta.numberCfdis;  
					    obj.estado=ESTADOREQ.SOLICITUDPENDIENTEDOWNLOAD
					    obj.passdata.msg_v=mensaje;
					    obj.folioReq=verificacionValue.folioReq;
				   }
				}
			        if (respuesta.EstadoSolicitud==ESTADOSOLICITUD.ACEPTADA) { 
					    obj.passdata.intentos=("intentos" in obj.passdata ?  obj.passdata.intentos+1 : 1);
					    obj.passdata.msg_v="Aceptada, Verificacione(s): "+obj.passdata.intentos;
				}
			        if (respuesta.EstadoSolicitud==ESTADOSOLICITUD.ENPROCESO) { 
					    obj.passdata.intentos=("intentos" in obj.passdata ?  obj.passdata.intentos+1 : 1);
					    obj.passdata.msg_v="EN proceso, Verificacione(s): "+obj.passdata.intentos;
				}

                                if (respuesta.EstadoSolicitud==ESTADOSOLICITUD.VENCIDA) {
				    obj.passdata.intentos=("intentos" in obj.passdata ?  obj.passdata.intentos+1 : 1);
				    obj.passdata.msg_v="Vencida, Verificacione(s): "+obj.passdata.intentos;
                                }
                                if (respuesta.EstadoSolicitud==ESTADOSOLICITUD.ERROR) {
				    obj.passdata.intentos=("intentos" in obj.passdata ?  obj.passdata.intentos+1 : 1);
				    obj.passdata.msg_v="Error, Verificacione(s): "+obj.passdata.intentos;
                                }
                                if (respuesta.EstadoSolicitud==ESTADOSOLICITUD.RECHAZADA) {
				    obj.passdata.intentos=("intentos" in obj.passdata ?  obj.passdata.intentos+1 : 1);
				    obj.passdata.msg_v="Rechazada, Verificacione(s): "+obj.passdata.intentos;
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
  console.log('recibio message el sw event='+JSON.stringify(event.data.action,true)+' clientID='+event.source.id);
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
  if (event.data && event.data.action === 'TAB_VISIBLE') {
	  console.log('intervalSync='+intervalSync);
	  estacorriendoIntevalo();
  }
  if (event.data && event.data.action === 'START_INTERVALO') {
	  console.log('START_INTERVALO');
	  estacorriendoIntevalo();
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
	           console.log('[sw rSEA] estatus token='+(res!==undefined ? res.tokenEstatusSAT : 'indefinido'));
                   if (res===undefined || res.tokenEstatusSAT===TOKEN.NOSOLICITADO || res.tokenEstatusSAT===TOKEN.CADUCADO 
			               || res.tokenEstatusSAT===ESTADOREQ.ERROR || res.tokenEstatusSAT===TOKEN.NOGENERADO 
			               || res.tokenEstatusSAT===ESTADOREQ.ERRORFETCH
		      ) {
			       console.log('[sw rSEA] va a generar el request de autenticacion');
			       DMS.autenticate_armasoa(pwd).then( x => { console.log('[rSEA] genero el request de autentificacion') });
                   }
	       }).catch(er => { console.log('[sw rSEA] error en getTokenEstatusSAT '+er);}) 
	    }
	}).catch(er => { console.log('[sw rSEA] error en dame_pwd '+er)
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


var ponIntervaloRequest = () => {
	lee_llaves().then(x => {

              if ('validada' in x.value) {
			console.log("[sw sI] va a pone intervalo de sincronizacion diferentes estados");
			setInterval( () => { // TODO  esto debe ser hasta que este cargada la fiel y esta este correcta.
				var obj = { fechatiempo: Date.now() };
				insertaOActualizaInterval(obj,'Inter1');
				try {
				       syncRequest(ESTADOREQ.INICIAL.AUTENTICA) ;
				       syncRequest(ESTADOREQ.INICIAL.SOLICITUD);
				       syncRequest(ESTADOREQ.INICIAL.VERIFICA);
				       syncRequest(ESTADOREQ.SOLICITUDPENDIENTEDOWNLOAD);
				       syncRequest(ESTADOREQ.SOLICITUDACEPTADA);
				       syncRequest(ESTADOREQ.INICIAL.DESCARGA);
				       bajaVerificaciones();
				       bajaTokenCaducado();
				       bajaTokenInvalido();
				       bajaRequiriendo();
				} catch (err) {
				console.log("Error in interval:", err);
			    }
			}, REVISA.ESTADOREQ * 1000);
	      }

         }).catch ( err => { console.log(err);});
}

var ponIntervaloAutenticacion = () => {
        lee_llaves().then(x => {
              if ('validada' in x.value) {
			console.log("[sw sI] pone intervalo para revisar si esta autenticado");
			setInterval( () => { // TODO  esto debe ser hasta que este cargada la fiel y esta este correcta.
				var obj = { fechatiempo: Date.now() };
				insertaOActualizaInterval(obj,'Inter2');
				try { revisaSiEstaAutenticado() } 
				catch (err) {
				   console.log("Error in interval EstaAutenticado:", err);
				};
			}, REVISA.VIGENCIATOKEN_SW * 1000);
	      }

         }).catch ( err => { console.log(err);});
}


var  estacorriendoIntevalo = () => {    // TODO  esto debe ser hasta que este cargada la fiel y esta este correcta.
	console.log('[eCI Estan corriendo los intervalos de tiempo]');
	dameInterval('Inter1').then( x => {
		var tiempo = Date.now() - x;
		if (tiempo > REVISA.ESTADOREQ * 1000) { // no esta corriendo el intervalo
	                console.log('[eCI] va a poner intervalor Inter1 tiempo='+tiempo+' DN='+(REVISA.ESTADOREQ * 1000));
			ponIntervaloRequest();
		}
	}).catch(msg=> { 
		if (msg.substring(0,20)=='No encontro registro') { ponIntervaloRequest(); } 
		else { console.log('error al poner intervalo de sincronizacion msg='+msg); }
	});

        dameInterval('Inter2').then( x => {
                var tiempo = Date.now() - x;
                if (tiempo > REVISA.VIGENCIATOKEN_SW * 1000) { // no esta corriendo el intervalo
	                console.log('[eCI] va a poner intervalor Inter2 tiempo='+tiempo+' DN='+(REVISA.VIGENCIATOKEN_SW * 1000));
                        ponIntervaloAutenticacion();
                }
        }).catch(msg=> { if (msg.substring(0,20)=='No encontro registro') { ponIntervaloAutenticacion(); } 
		else { console.log('error al poner intervalo de autenticacion msg='+msg); }
	});

}


/* checa cual fue la respuesta del servidor */
var querespuesta = (request,respuesta) => {
         if(respuesta===undefined) {
		 console.log('[qr] respuesta indefinida'+JSON.stringify(request,true));
	 }
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
                       .then ( () => { postRequestUpd(request,"se genero una solicitud",respuesta);
                             });
		       return;
               }
               if (request.value.url=='/verifica.php')  {
		    if (respuesta.EstadoSolicitud==ESTADOSOLICITUD.ACEPTADA) {
		       request.value.passdata.intentos=("intentos" in request.value.passdata ?  request.value.passdata.intentos+1 : 1);
		       request.value.passdata.msg_v=respuesta.Mensaje + ' ' + request.value.passdata.intentos;
		       updestado(request,ESTADOREQ.VERIFICACIONTERMINADA,respuesta.Mensaje).then( () => {
				     updSolicitud(respuesta,request.value)
				       .then( () => { postRequestUpd(request,"se verifico",respuesta);
				       });

                               });
		    }
                    if (respuesta.EstadoSolicitud==ESTADOSOLICITUD.RECHAZADA) {
                       request.value.passdata.intentos=("intentos" in request.value.passdata ?  request.value.passdata.intentos+1 : 1);
                       request.value.passdata.msg_v=respuesta.Mensaje + ' ' + request.value.passdata.intentos;
                       updestado(request,ESTADOREQ.EstadoSolicitud,respuesta.Mensaje).then( () => {
                                     updSolicitud(respuesta,request.value)
                                       .then( () => { postRequestUpd(request,"No hay informacion",respuesta);
                                       });

                               });
                    }
		    if (respuesta.EstadoSolicitud==ESTADOSOLICITUD.TERMINADA) {
                       request.value.passdata.intentos=("intentos" in request.value.passdata ?  request.value.passdata.intentos+1 : 1);
                       request.value.passdata.msg_v=respuesta.Mensaje + ' ' + request.value.passdata.intentos;
                       updestado(request,ESTADOREQ.VERIFICACIONTERMINADA,respuesta.Mensaje).then( () => {
                                     updSolicitud(respuesta,request.value)
                                       .then( () => { postRequestUpd(request,"se verifico, NumeroCFDIs?"+respuesta.NumeroCFDIs,respuesta);
                                       });

                               });

		    }
		    return;
               }
               if (request.value.url=='/download.php')  {
			 if(respuesta.Mensaje=="Solicitud Aceptada") {
				       request.value.passdata.msg_d=respuesta.Mensaje;
				       var respuestax=respuesta;
				       delete respuesta.paquete;
				       updestado(request,ESTADOREQ.DESCARGADO,respuestax).then( () => {  // actualiza el resultado de la descarga en el request de la descarga
					       updObjectByKey("request",request.value,request.key); // actualiza el resultado de la descarga en el request de la descarga
					       updSolicitudDownload('Se descargo',request.value.passdata.keySolicitud)  // actualiza el resulta de la descarga en el request de la solicitud
					       .then( () => {
						    postRequestUpd(request,"se descargo",respuesta);
					       });
					       notifica();
				       });
				 

				       return;
			 }
				       request.value.passdata.msg_d=respuesta.Mensaje;
				       updestado(request,ESTADOREQ.RESPUESTADESCONOCIDA,respuesta).then( () => {  // actualiza el resultado de la descarga en el request de la descarga
					       updObjectByKey("request",request.value,request.key); // actualiza el resultado de la descarga en el request de la descarga
				               updSolicitudDownload(respuesta.Mensaje,request.value.passdata.keySolicitud)  //actualiza el resulta de la descarga en el request de la solicitud
					       .then( () => {
						    postRequestUpd(request,respuesta.Mensaje,respuesta);
					       });
				       });
				       notifica();

	       }
         }
         if("nonce" in respuesta ) {
		 inserta_loginFiel(respuesta);
	 }

};

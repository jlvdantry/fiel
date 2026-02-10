/* checa cual fue la respuesta del servidor */
var querespuesta = (request,respuesta) => {
         if(respuesta===undefined) {
		 console.log('[qr] respuesta indefinida'+JSON.stringify(request,true));
	 }
         if("error" in respuesta) {
              await updestado(request, ESTADOREQ.ERROR, respuesta);
              await postRequestUpd(request, "update-request", respuesta);
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

	       if (request.value.url == '/solicita.php') {
			if (respuesta.status === "Aceptada" || respuesta.CodEstatus === "301") {
			    request.value.passdata.msg = respuesta.Mensaje;
			    if ("IdSolicitud" in respuesta) {
				request.value.passdata.idSolicitud = respuesta.IdSolicitud;
			    }
			    // Esperamos a que la DB se actualice realmente
			    await updestado(request, ESTADOREQ.SOLICITUDACEPTADA, respuesta.Mensaje);
			    await postRequestUpd(request, "solicito-aceptada", respuesta);
			}
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
				if (respuesta.Mensaje === "Solicitud Aceptada" || "paquete" in respuesta) {
				    const respuestax = { ...respuesta };
				    delete respuesta.paquete; // No guardar el binario pesado en el log

				    // 1. Actualizar estado del request de descarga
				    await updestado(request, ESTADOREQ.DESCARGADO, respuestax);
				    await updObjectByKey("request", request.value, request.key);

				    // 2. Actualizar el request original de la solicitud
				    await updSolicitudDownload('Se descargo', request.value.passdata.keySolicitud);
				    
				    // 3. Notificar y avisar al servidor
				    await postRequestUpd(request, "se descargo", respuesta);
				    await notifica(); // Ahora la notificación es parte del flujo esperado
				    return;
				}

	       }
         }

         if("nonce" in respuesta ) {
		 inserta_loginFiel(respuesta);
	 }

         if ("token_api" in respuesta) {
		await updestado(request, ESTADOLOGINFIEL.LOGUEADO, respuesta);
		enviarNotificacionSat("Sesión Iniciada", "Acceso correcto con e.firma");
         }

         if("errors" in respuesta ) { //errores que vienen de laravel para el login fiel

		    const mensajes = Object.values(respuesta.errors);
		    const errorTexto = mensajes.length > 0 ? mensajes[0][0] : respuesta.message;

		    request.value.passdata.msg = errorTexto; // Guardamos el texto en español
		    
		    updestado(request, ESTADOLOGINFIEL.ERROR, respuesta).then((r) => {
			postRequestUpd(r, "error-validacion", { msg: errorTexto });
		    });
		    return;
	 }

};

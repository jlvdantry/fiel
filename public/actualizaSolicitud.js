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
					    mensaje = 'Facturas '+respuesta.NumeroCFDIs;  
					    obj.estado=ESTADOREQ.SOLICITUDPENDIENTEDOWNLOAD
					    obj.passdata.msg_v=mensaje;
					    obj.passdata.IdsPaquetes=respuesta.IdsPaquetes;
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
				    obj.estado=respuesta.EstadoSolicitud;
				    obj.passdata.intentos=("intentos" in obj.passdata ?  obj.passdata.intentos+1 : 1);
				    obj.passdata.msg_v="Vencida, Verificacione(s): "+obj.passdata.intentos;
                                }
                                if (respuesta.EstadoSolicitud==ESTADOSOLICITUD.ERROR) {
				    obj.estado=respuesta.EstadoSolicitud;
				    obj.passdata.intentos=("intentos" in obj.passdata ?  obj.passdata.intentos+1 : 1);
				    obj.passdata.msg_v="Error, Verificacione(s): "+obj.passdata.intentos;
                                }
                                if (respuesta.EstadoSolicitud==ESTADOSOLICITUD.RECHAZADA) {
				    obj.estado=respuesta.EstadoSolicitud;
				    obj.passdata.intentos=("intentos" in obj.passdata ?  obj.passdata.intentos+1 : 1);
				    obj.passdata.msg_v="Rechazada, No se encontro informacion: "+obj.passdata.intentos;
                                }
				updObjectByKey('request',obj,verificacionValue.passdata.keySolicitud);
		      }).then( () => { resolve() });
        });
}

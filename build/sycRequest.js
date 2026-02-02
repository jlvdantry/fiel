
// Cambiamos a una función async para poder usar await
var syncRequest = async (estado,endpoint=ENDPOINTFIEL.PROXYSAT) => { 
    try {
        const db = await openDatabasex(DBNAME, DBVERSION);
        const objectStore = await openObjectStore(db, 'request', "readonly"); 
        const requests = await selObjects(objectStore, "estadoIndex", estado);

        // USAR for...of en lugar de .map para ejecución secuencial
        for (const request of requests) {
            console.log('Procesando secuencial: url=' + request.value.url + ' key=' + request.key);

            // Casos especiales (Solicitud, Descarga, etc.)
            if (request.value.url == '/solicita.php' && estado == ESTADOREQ.INICIAL.SOLICITUD  && !('header' in request.value)) {
                if (DMS === null) { DMS = new DescargaMasivaSat(); }
                const pwd = await dame_pwd();
                await DMS.solicita_armasoa(request, request.key, pwd);
                continue; // Pasa a la siguiente tarea del bucle
            }

            if (request.value.estado == ESTADOREQ.SOLICITUDPENDIENTEDOWNLOAD) {
                const aut = await obtieneelUltimoTokenActivo();
                var token = { Created: aut.value.respuesta.Created, Expires: aut.value.respuesta.Expires, token: aut.value.respuesta.token };
                var datos = { pwdfiel: PWDFIEL, token: token, folioReq: request.value.folioReq };
                await DMS.descargando(datos, request);
                await updestado(request, ESTADOREQ.SOLICITUDDESCARGANDO);
                continue;
            }

	if (request.value.url=='/verifica.php' & 'respuesta' in request.value) { // no procesa las verificaciones ya terminadas
	     if  (request.value.respuesta.substring(0,9)=="Rechazada") {  return; }
	}

	if (request.value.url=='/solicita.php' & estado==ESTADOREQ.SOLICITUDACEPTADA) {  // genera el registro de verificacion
		const aut = await obtieneelUltimoTokenActivo();
		if ('respuesta' in aut.value) {
			   if (aut.value.respuesta!==null) {
				var token = { Created: aut.value.respuesta.Created, Expires:aut.value.respuesta.Expires
						      ,token:aut.value.respuesta.token }
				var datos = { pwdfiel:PWDFIEL, token:token,folioReq:request.value.folioReq }
				DMS.verificando( datos,request.key);
			   }
		}
		await postRequestUpd(request,"update-request","");   /* mensajea al cliente y aqui se genera el registro de verificacion */
		continue; //si fue aceptada la solicitud deberia de mandar la verificacion
	}

	if (request.value.url=='factura') {
	     continue;
	}


            // Lógica del FETCH (ProxySAT)
            const jsonHeaders = request.value.header;
            await updestado(request, ESTADOREQ.REQUIRIENDO, null);
            
            const body = { envelope: request.value.body, urlSAT: request.value.urlSAT, headers: JSON.stringify(jsonHeaders) };
            const headerf = { 'content-type': 'application/json','X-Requested-With': 'XMLHttpRequest' };

            try {
                // AQUÍ ESTÁ LA CLAVE: esperar al fetch antes de seguir
                const response = await fetch(endpoint, { method: 'post', headers: headerf, body: JSON.stringify(body) });
                
                if (!response.ok) {
                    await updestado(request, ESTADOREQ.ERROR);
                    continue;
                }

                const data = await response.json();
                await updestado(request, ESTADOREQ.RECIBIDO, data);
                await querespuesta(request, data); // Asegúrate que querespuesta sea async o devuelva promesa
                
                console.log('Finalizó fetch para: ' + request.value.url);
            } catch (err) {
                console.error('[fetch error]', err);
                await updestado(request, ESTADOREQ.ERRORFETCH, err.message);
            }
        }
        return Promise.resolve(); // Terminaron todas las tareas de este estado
    } catch (error) {
        console.error("Error en syncRequest:", error);
    }
};

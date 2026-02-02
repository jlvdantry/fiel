/* funcion que inserta o actualiza los datos en la tabla de request esta funcion se ejecuta
   cuando se hacer un requermiento */
function insertaOActualizaFiel(obj,file)
{
        return new Promise( (resolve, reject) => {
               this.selObjectUlt('request','url','fiel','prev').then( llave => {
                    llave.value[file]=obj;
                    updObjectByKey('request', llave.value, llave.key).then( x => { resolve(obj) }).catch( err => { console.log('[insertaOActualizaFiel] '+err) })
               }).catch ( err => {
                        var json= { };
                        json.url='fiel';
                        json[file]=obj;
                        json=datos_comunes(json);
                        openDatabasex(DBNAME, DBVERSION).then(function(db) {
                                return openObjectStore(db, 'request', "readwrite");
                                }).then(function(objectStore) {

                                        addObject(objectStore, json).then( (key) => {
                                            json.key=key;
                                            resolve(json) ; } );
                                }).catch(function(err) {
                                        console.log("[inserta_request] Database error: "+err.message);
                        });
                });
        })
}

function damePublica() {
        return new Promise( (resolve, reject) => {
		selObjectUlt('request','url','fiel').then( fiel => {
			resolve (fiel.value.publica)
		}).then( pub => { resolve(pub); })
		.catch( err => { reject (null) })
        })
}

function damePrivada() {
        return new Promise( (resolve, reject) => {
                selObjectUlt('request','url','fiel').then( fiel => {
                        return fiel.value.privada
                })
		.then( pri => { resolve(pri); })
		.catch( err => { reject (null) })
        })
}

function dameRfc() {
        return new Promise( (resolve, reject) => {
                selObjectUlt('request','url','fiel').then( fiel => {
                        resolve (fiel.value.rfc)
                }).catch( err => { reject (null) })
        })
}

function dameNombre() {
      return new Promise( (resolve, reject) => {
             selObjectUlt('request','url','fiel').then( fiel => {
                        resolve (fiel.value.nombre)
                }).catch( err => { reject (null) })
      });
}

/* funcion que inserta los datos en la tabla de request esta funcion se ejecuta
   cuando se hacer un requermiento */
function inserta_solicitud(passdata)
{
        return new Promise(function (resolve, reject) {
                var json= { };
                json.estado=window.ESTADOREQ.INICIAL.SOLICITUD;
                json.url='/solicita.php';
                json.urlSAT=ENDPOINTSSAT.SOLICITUD;
                json.passdata=passdata;
                json=datos_comunes(json);
                openDatabasex(DBNAME, DBVERSION).then(function(db) {
                        return openObjectStore(db, 'request', "readwrite");
                        }).then(function(objectStore) {
                                addObject(objectStore, json).then( (key) => {
                                    resolve(key) ; } );
                        }).catch(function(err) {
                                console.log("[inserta_solicitud] Database error: "+err.message);
                });
        })
}

/* inserta el request para solicitar el nonce, 
   para autenticarse contra el servidor utilizando la fiel y que va hacer el web push */
function inserta_nonce(passdata)
{
        return new Promise(function (resolve, reject) {
                var json= { };
                json.estado=window.ESTADOREQ.LOGINFIEL.NONCEINICIAL;
                json.url='nonce';
                json.urlSAT=ENDPOINTFIEL.NONCE;
                json.passdata=passdata;
                json=datos_comunes(json);
                openDatabasex(DBNAME, DBVERSION).then(function(db) {
                        return openObjectStore(db, 'request', "readwrite");
                        }).then(function(objectStore) {
                                addObject(objectStore, json).then( (key) => {
                                    resolve(key) ; } );
                        }).catch(function(err) {
                                console.log("[inserta_nonce] Database error: "+err.message);
                });
        })
}

/* inserta el request para hacer login con la fiel,
   y poder hacer el web push */
function inserta_loginFiel(passdata)
{
        return new Promise(function (resolve, reject) {
                var json= { };
                json.estado=ESTADOREQ.LOGINFIEL.INICIAL;
                json.url='loginfiel';
                json.urlSAT=ENDPOINTFIEL.LOGIN;
                json.passdata=passdata;
                json=datos_comunes(json);
                openDatabasex(DBNAME, DBVERSION).then(function(db) {
                        return openObjectStore(db, 'request', "readwrite");
                        }).then(function(objectStore) {
                                addObject(objectStore, json).then( (key) => {
                                    resolve(key) ; } );
                        }).catch(function(err) {
                                console.log("[inserta_loginfiel] Database error: "+err.message);
                });
        })
}






function bajaVerificaciones()
{
        return new Promise(function (resolve, reject) {
                openDatabasex(DBNAME, DBVERSION).then(function(db) {
                        return openObjectStore(db, 'request', "readwrite");
                        }).then( objectStore => { 
				let range = IDBKeyRange.only(ESTADOREQ.VERIFICACIONTERMINADA);
				myIndex=objectStore.index('estado');
				cursor  = myIndex.openCursor(range,'prev');
				let counter = 0;
				cursor.onerror   = event => {
				}
				cursor.onsuccess = event => {
				    var cursor1 = event.target.result;
				    if (cursor1) {
                                       counter++; 
                                       if (counter>3)  {
				          objectStore.delete(cursor1.primaryKey);	
				       }
				       cursor1.continue();
				    } else {
				       resolve('registros borrados');
				    };
				};


                        }).catch(function(err) {
                                reject(err.message);
                });
        })

}


function bajaTokenInvalido()
{
        return new Promise(function (resolve, reject) {
                openDatabasex(DBNAME, DBVERSION).then(function(db) {
                        return openObjectStore(db, 'request', "readwrite");
                        }).then( objectStore => {
                                let range = IDBKeyRange.only(ESTADOREQ.TOKENINVALIDO);
                                myIndex=objectStore.index('estado');
                                cursor  = myIndex.openCursor(range,'prev');
                                let counter = 0;
                                cursor.onerror   = event => {
                                }
                                cursor.onsuccess = event => {
                                    var cursor1 = event.target.result;
                                    if (cursor1) {
                                       counter++;
                                       if (counter>3)  {
                                          objectStore.delete(cursor1.primaryKey);
                                          console.log('[bTI] registro borrado='+cursor1.primaryKey);
                                       }
                                       cursor1.continue();
                                    } else {
                                       resolve('registros borrados');
                                    };
                                };


                        }).catch(function(err) {
                                reject(err.message);
                });
        })

}

function bajaTokenCaducado()
{
        return new Promise(function (resolve, reject) {
                openDatabasex(DBNAME, DBVERSION).then(function(db) {
                        return openObjectStore(db, 'request', "readwrite");
                        }).then( objectStore => {
                                let range = IDBKeyRange.only(TOKEN.CADUCADO);
                                myIndex=objectStore.index('estado');
                                cursor  = myIndex.openCursor(range,'prev');
                                let counter = 0;
                                cursor.onerror   = event => {
                                }
                                cursor.onsuccess = event => {
                                    var cursor1 = event.target.result;
                                    if (cursor1) {
                                       counter++;
                                       if (counter>3)  {
                                          objectStore.delete(cursor1.primaryKey);
                                       }
                                       cursor1.continue();
                                    } else {
                                       resolve('registros borrados');
                                    };
                                };


                        }).catch(function(err) {
                                reject(err.message);
                });
        })

}

/* baja aquellos reques que tienen estatus de requiriendo pero que tienen una antiguedad mayor a 2 minutos */
function bajaRequiriendo()
{
        return new Promise(function (resolve, reject) {
                openDatabasex(DBNAME, DBVERSION).then(function(db) {
                        return openObjectStore(db, 'request', "readwrite");
                        }).then( objectStore => {
                                let range = IDBKeyRange.only(ESTADOREQ.REQUIRIENDO);
                                myIndex=objectStore.index('estado');
                                cursor  = myIndex.openCursor(range,'prev');
                                let counter = 0;
                                cursor.onerror   = event => {
                                }
                                cursor.onsuccess = event => {
                                    var cursor1 = event.target.result;
                                    if (cursor1) {
                                       counter++;
                                       var fh=get_fechahora();
                                       var hora = cursor1.value.hora < 10 ? '0' + cursor1.value.hora : cursor1.value.hora;
                                       var minuto = cursor1.value.minutos < 10 ? '0' + cursor1.value.minutos : cursor1.value.minutos;
                                       var fr=cursor1.value.fecha+' '+hora+':'+minuto;
                                       var dif = differenceInMinutes(fh,fr);
                                       if  (dif > REQUIRIENDOMINUTOS) {
                                            objectStore.delete(cursor1.primaryKey);
				       }
                                       cursor1.continue();
                                    } else {
                                       resolve('registros borrados');
                                    };
                                };


                        }).catch(function(err) {
                                reject(err.message);
                });
        })
}


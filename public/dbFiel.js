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
		}).catch( err => { reject (null) })
        })
}

function damePrivada() {
        return new Promise( (resolve, reject) => {
                selObjectUlt('request','url','fiel').then( fiel => {
                        resolve (fiel.value.privada)
                }).catch( err => { reject (null) })
        })
}

function dameRfc() {
        return new Promise( (resolve, reject) => {
                selObjectUlt('request','url','fiel').then( fiel => {
                        resolve (fiel.value.rfc)
                }).catch( err => { reject (null) })
        })
}

async function dameNombre() {
      var x = await selObjectUlt('request','url','fiel').then( fiel => {
                        resolve (fiel.value.nombre)
                }).catch( err => { reject (null) })
      return x;
}

/* funcion que inserta los datos en la tabla de request esta funcion se ejecuta
   cuando se hacer un requermiento */
function inserta_solicitud(passdata)
{
        return new Promise(function (resolve, reject) {
                var json= { };
                json.estado=window.ESTADOREQ.INICIAL.SOLICITUD;
                json.url='/solicita.php';
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
					  console.log(' registro borrado='+cursor1.primaryKey);
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
                                          console.log(' registro borrado='+cursor1.primaryKey);
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


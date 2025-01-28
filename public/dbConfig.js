/* funcion que inserta o actualiza los datos de la configuracion del aplicativo */
function insertaOActualizaConfig(obj,file)
{
        return new Promise( (resolve, reject) => {
               this.selObjectUlt('request','url','Config','prev').then( llave => {
                    llave.value[file]=obj;
                    updObjectByKey('request', llave.value, llave.key).then( x => { resolve(obj) }).catch( err => { console.log('[insertaOActualizaConfig] '+err) })
               }).catch ( err => {
                        var json= { };
                        json.url='Config';
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

function dameMuestraLog() {
        return new Promise( (resolve, reject) => {
		selObjectUlt('request','url','Config').then( fiel => {
			resolve (fiel.value.Log.muestra)
		}).then( pub => { resolve(pub); })
		.catch( err => { reject (null) })
        })
}


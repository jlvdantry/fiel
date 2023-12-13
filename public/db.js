var DBNAME='fiel_menus';
var DBVERSION='11';
var DBNAME=DBNAME;
var DBNAMEM='fiel_firmayfacturacion';
var PERFIL='inven_agn'

var openDatabasex = function(dbName, dbVersion) {
        return new Promise(function (resolve, reject) {
                /* eslint-disable-next-line no-restricted-globals */
                if (!self.indexedDB) {
                reject('IndexedDB not supported');
                }
                /* eslint-disable-next-line no-restricted-globals */
                var request = self.indexedDB.open(dbName, dbVersion);

                request.onerror = function(event) {
                    reject('[db.js] Database error: ' + event.target.error);
                };

                request.onupgradeneeded = function(event) {
                   console.log('[db.js] entro a actualizar la base de datos '+dbName+' version='+dbVersion);
                   var db = event.target.result;
                   if (dbName===DBNAME) {
                      creadb(db);
                      var wlusuario= {}; wlusuario['wl_groname']=PERFIL; 
                   }
                   if (dbName===DBNAMEM) {
                      creadbm(db);
                   }
               };

               request.onsuccess = function(event) {
                        resolve(event.target.result);
               };
        });
};
 
var creadbm = function(db) {
                   var wlobjeto='menus';
                   if(!db.objectStoreNames.contains(wlobjeto)) {
                        console.log('[db.js] va a crear el objeto request');
                        var objectStore = db.createObjectStore(wlobjeto, { autoIncrement : true });
                        objectStore.createIndex('hora', 'hora', { unique: false });
                        objectStore.createIndex('minuto', 'minuto', { unique: false });
                        objectStore.createIndex('dia', 'dia', { unique: false });
                        objectStore.createIndex('mes', 'mes', { unique: false });
                        objectStore.createIndex('ano', 'ano', { unique: false });
                        objectStore.createIndex('estado', 'estado', { unique: false });
                        objectStore.createIndex('idmenu', 'idmenu', { unique: false });
                        objectStore.createIndex('usename', 'usename', { unique: false });
                        objectStore.createIndex('fecha', 'fecha', { unique: false });
                    };
}

var creadb = function(db) {
                   var objectStore='';
                   if(!db.objectStoreNames.contains('encaptura')) { /* datos que se estan capturando en una forma */
                        console.log('[db.js] Va a crear el objeto encaptura');
                        objectStore = db.createObjectStore('encaptura', { autoIncrement : true });
                        objectStore.createIndex('hora', 'hora', { unique: false });
                        objectStore.createIndex('minuto', 'minuto', { unique: false });
                        objectStore.createIndex('dia', 'dia', { unique: false });
                        objectStore.createIndex('mes', 'mes', { unique: false });
                        objectStore.createIndex('ano', 'ano', { unique: false });
                        objectStore.createIndex('estado', 'estado', { unique: false });
                        objectStore.createIndex('idmenu', 'idmenu', { unique: false });
                        objectStore.createIndex('usename', 'usename', { unique: false });
                    };

                   if(!db.objectStoreNames.contains('request')) { /*request hechos a un servidor externo */
                        console.log('[db.js] va a crear el objeto request');
                        objectStore = db.createObjectStore('request', { autoIncrement : true });
                        objectStore.createIndex('url', 'url', { unique: false });
                        objectStore.createIndex('passdata', 'passdata', { unique: false });
                        objectStore.createIndex('hora', 'hora', { unique: false });
                        objectStore.createIndex('minuto', 'minuto', { unique: false });
                        objectStore.createIndex('dia', 'dia', { unique: false });
                        objectStore.createIndex('mes', 'mes', { unique: false });
                        objectStore.createIndex('ano', 'ano', { unique: false });
                        objectStore.createIndex('estadoIndex', 'estado', { unique: false });
                        objectStore.createIndex('idmenu', 'idmenu', { unique: false });
                        objectStore.createIndex('usename', 'usename', { unique: false });
                        objectStore.createIndex('fecha', 'fecha', { unique: false });
                        objectStore.createIndex('idmenu_fecha', 'idmenu_fecha', { unique: false });
                        objectStore.createIndex('url_fecha', 'url_fecha', { unique: false });
                        objectStore.createIndex('url_fechaC', ['url','fecha'], { unique: false });
                        objectStore.createIndex('sello', 'sello', { unique: false });
                    };

                   if(!db.objectStoreNames.contains('catalogos')) { /* Catalogos propios del aplicativo */
                        console.log('[db.js] va a crear el objeto catalogos');
                        objectStore = db.createObjectStore('catalogos', { autoIncrement : true });
                        objectStore.createIndex('hora', 'hora', { unique: false });
                        objectStore.createIndex('minuto', 'minuto', { unique: false });
                        objectStore.createIndex('dia', 'dia', { unique: false });
                        objectStore.createIndex('mes', 'mes', { unique: false });
                        objectStore.createIndex('ano', 'ano', { unique: false });
                        objectStore.createIndex('usename', 'usename', { unique: false });
                        objectStore.createIndex('catalogo', 'catalogo', { unique: false });
                        objectStore.createIndex('label', 'label', { unique: false });
                        objectStore.createIndex('ID', 'ID', { unique: false });
                        objectStore.createIndex('catalogo_label', ['catalogo','label'], { unique: true });
                    };

                   if(!db.objectStoreNames.contains('facturas')) { /* facturas electronicas  */
                        console.log('[db.js] va a crear el objeto catalogos');
                        objectStore = db.createObjectStore('facturas', { autoIncrement : true });
                        objectStore.createIndex('hora', 'hora', { unique: false });
                        objectStore.createIndex('minuto', 'minuto', { unique: false });
                        objectStore.createIndex('dia', 'dia', { unique: false });
                        objectStore.createIndex('mes', 'mes', { unique: false });
                        objectStore.createIndex('ano', 'ano', { unique: false });
                        objectStore.createIndex('sello', 'sello', { unique: true });
                        objectStore.createIndex('ID', 'ID', { unique: false });
                    };


}

/* Abre una tabla */
var openObjectStore = function(db, storeName, transactionMode) {
        return new Promise(function (resolve, reject) {
                var objectStore = db
                .transaction(storeName, transactionMode)
                .objectStore(storeName);
                resolve(objectStore);
        });
};

/* agrega un objeto a una tabla
   objectStore objecto o tabla a adcionar un registro
   object registo a almacenar 
   regresa el id insertado del objeto y el objeto mismo
   */
var addObject = function(objectStore, object) {
        return new Promise( (resolve, reject) => {
        var request = objectStore.add(object);
        request.onsuccess = (event) => {
                console.log('[addObject] inserto el objeto='+event.target.result);
                resolve(event.target.result,object);
             }
        request.onerror = (event) => {
                console.log('[addObject] error al agregar el objeto='+event.target.error);
                reject(event);
             }

        });
};

/* selecciona un especifico objeto 
   objectStore=objeto
   idmenu=identificador del menu o forma
   estado= estado del objeto */
var selObject = function(objectStore, idmenu, estado) {
        return new Promise(function (resolve, reject) {
        var index = objectStore.index("estado");
        var request = index.get(idmenu+"_"+estado);
        request.onsuccess = function (event) {
               resolve(event);
        };
        request.onerror = reject;
        });
};
/* selecciona un especifico objeto por su llave
   objectStore=table u objeto
   key=llave del registro
   */
var selObjectByKey = function(objectStore,key) {
        return new Promise(function (resolve, reject) {
		openDatabasex(DBNAME, DBVERSION).then( db => {
		        return openObjectStore(db, objectStore, "readonly");
		  }).then( oS => {
			var request = oS.get(key);
			request.onsuccess = function (event) { 
                                          resolve(event.target.result); 
                        };
			request.onerror = reject;
  		     });
        });
};


/* obtiene un arreglo de objetos 
   de acuerdo al indice y su valor 
   objectStores object a buscar registros
   indexname    nombre del indice a buscar
   indexvalue   valor del indice a buscar
   si llegan valida indexname e indexvalue se regresan todos los valores del objeto
   */ 
var selObjects = function(objectStore, indexname, indexvalue, direction='next') {
        var regs  = [];
        var cursor = {};
        var myIndex = null;
        return new Promise(function (resolve, reject) {
        if (indexname!==undefined && indexvalue!==undefined) {
           let range = IDBKeyRange.only(indexvalue);
           myIndex=objectStore.index(indexname);  
           cursor  = myIndex.openCursor(range);
           //console.log('[selObjects] cursor='+JSON.stringify(cursor));
        } else {
           cursor = objectStore.openCursor();
        }
        cursor.onerror   = event => {
           console.log('[selObjects] error');
        }
        cursor.onsuccess = event => {
            var cursor1 = event.target.result;
            var json = { };
            if (cursor1) {
               //console.log('[selObjects] key='+cursor1.primaryKey+' value='+cursor1.value);
               json.value=cursor1.value;
               json.key  =cursor1.primaryKey;
               regs.push( json );
               cursor1.continue();
            } else {
               resolve(regs); 
            };
        };
    });
};

/* obtiene el primer registro en el cursor 
   de acuerdo al indice y su valor
   objectStores object a buscar registros
   indexname    nombre del indice a buscar
   indexvalue   valor del indice a buscar
   si llegan valida indexname e indexvalue se regresan todos los valores del objeto
   */
var selObjectUlt = function(objectStore, indexname, indexvalue,direction='next') {
        return new Promise(function (resolve, reject) {
        openDatabasex(DBNAME, DBVERSION).then(function(db) {
          return openObjectStore(db, 'request', "readonly");
        }).then(function(oS) {
        var objects = [];
        var cursor;
        console.log('[db.js] objectStore='+objectStore+' indexname='+indexname+' indexvalue='+indexvalue);
        if (indexname!==undefined && indexvalue!==undefined) {
           cursor  = oS.index(indexname).openCursor(indexvalue,direction);
        } else {
           resolve(objects);
        }

        cursor.onerror = function(event) {
               reject();
        }

        cursor.onsuccess = function(event,indexname,indexvalue) {
            var cursor1 = event.target.result;
            var json = { };
            if (cursor1) {
               console.log('[db.js] selObjectUlt key='+cursor1.primaryKey+' value='+cursor1.value);
               json.valor=cursor1.value;
               json.key  =cursor1.primaryKey;
               resolve(json);
            } else {
              reject();
            };
        };
   });
  });
};


var delObject = function(objectStore, idmenu, estado) {
        return new Promise(function (resolve, reject) {
        var index = objectStore.index("estado");
        var pdestroy = index.openKeyCursor(IDBKeyRange.only(idmenu+"_"+estado)); 
        pdestroy.onsuccess = function() {
            var cursor = pdestroy.result;
            if (cursor) {
                objectStore.delete(cursor.primaryKey);
                console.log('[db.js] borro='+cursor.primaryKey);
                cursor.continue();
            }
            resolve();
        }
        pdestroy.onerror = reject;
        });
};

/* actualiza un objeto de acuerdo a su llave
   objectStore= objeto a actualiza
   object     = datos a actualizar
   id         = id del objeto a actualizar
   */
var updObject_01 = function(objectStore, object, id) {
        return new Promise(function (resolve, reject) {
		console.log('[db.js] updObject_01 va a actualizar registro con id='+id);
		var upd=objectStore.put(object,id);
		upd.onsuccess = function () { console.log('[db.js] updObject_01 actualizo registro con id='+id); resolve(); };
		upd.onerror = function () { console.log('[db.js] updObject_01 error al actualizar el registro con id='+id); reject(); }
	});
};

/* actualiza un objeto de acuerdo a su llave
   objectStore= nombre del objeto a actualizar
   object     = datos a actualizar
   id         = id del objeto a actualizar
   */
var updObjectByKey = function(objectStore, object, id) {
        return new Promise(function (resolve, reject) {
		openDatabasex(DBNAME, DBVERSION).then(function(db) {
		  return openObjectStore(db, objectStore, "readwrite");
		}).then(function(oS) {
				console.log('[db.js] updObjectByKey  va a actualizar registro con id='+id);
				var upd=oS.put(object,id);
				upd.onsuccess = function () { console.log('[db.js] updObjectByKey actualizo registro con id='+id); resolve(); };
				upd.onerror = function () { console.log('[db.js] updObjectByKey error al actualizar el registro con id='+id); reject(); }
		});
        });
};


/* actualiza un objeto 
   objectoStore=tabl en la base de datos
   object=Contiene los datos a actualizar
   idmenu=id de menu que va actualizar
   estado=estado a actualizar
   */
var updObject = function(objectStore, object, idmenu, estado) {
        return new Promise(function (resolve, reject) {
        console.log('[db.js]  creo promesa updObject='+idmenu);
        var index = objectStore.index("estado");
        var request = index.get(idmenu+"_"+estado);
        console.log('[db.js] leyo='+idmenu+"_"+estado);

        request.onsuccess = function(event) {
               var data=object;
               console.log('[db.js]  va a actualizar='+idmenu+' data='+JSON.stringify(data));
               var requestput = objectStore.put(data,idmenu); 
               requestput.onerror = function (event) {
                 console.log('[db.js] error no pudo actualizar');
                 reject(event);
               }
               requestput.onsuccess = function (event) {
                 console.log('[db.js] objecto actualizado'+event.target.result);
                 resolve(event);
               }
            //} else { console.log('no actualizo '); reject; }
        };

        request.onerror = function(event) {
            var requestadd = objectStore.add(object);
            requestadd.onerror = function (event) {
                 console.log('[db.js] error no pudo actualizar');
                 requestadd.onsuccess = reject;
            }
            requestadd.onsuccess = function (event) {
                 console.log('[db.js] objecto agregado al no existir');
                 requestadd.onsuccess = resolve;
            }
        };

        });
};

function datos_comunes(json) {
      var fecha = new Date();
      json.ano=fecha.getFullYear();
      json.mes=fecha.getMonth()+1;
      json.mes=json.mes < 10 ? '0' + json.mes : '' + json.mes;
      json.dia=fecha.getDate();
      json.dia=json.dia < 10 ? '0' + json.dia : '' + json.dia;
      json.hora=fecha.getHours();
      json.minutos=fecha.getMinutes();
      json.minutos=json.minutos < 10 ? '0' + json.minutos : json.minutos;
      json.fecha=fecha.getFullYear()+'-'+json.mes+'-'+json.dia;
      json.idmenu_fecha=json.idmenu+'_'+json.fecha;
      json.url_fecha=json.url+'_'+json.fecha;
      return json;
}

var wl_fecha = function () {
      var fecha = new Date();
      var mes=fecha.getMonth()+1;
      mes=mes < 10 ? '0' + mes : '' + mes;
      var dia=fecha.getDate();
      dia=dia < 10 ? '0' + dia : '' + dia;
      fecha=fecha.getFullYear()+'-'+mes+'-'+dia;
      return fecha;
}

/* funcion que inserta los datos en la tabla de request esta funcion se ejecuta
   cuando se hacer un requermiento */
function inserta_request(wlurl,passdata,idmenu,forma,wlmovto,header,body)
{
        return new Promise(function (resolve, reject) {
                console.log('[inserta_request] va a grabar un request de la opcion ='+idmenu);
                var json= { };
                json.estado=0;
                json.url=wlurl;
                json.passdata=passdata;
                json.forma=forma;
                json.idmenu=idmenu;
                json.header=header;
                json.body=body;
                json=datos_comunes(json);
                openDatabasex(DBNAME, DBVERSION).then(function(db) {
                        return openObjectStore(db, 'request', "readwrite");
                        }).then(function(objectStore) {
                                console.log('[inserta_request] menu a requesitar='+idmenu);
                                addObject(objectStore, json).then( (key) => { 
                                    json.key=key;
                                    resolve(json) ; } );
                        }).catch(function(err) {
                                console.log("[inserta_request] Database error: "+err.message);
                });
        })
}

/* funcion que inserta los datos en la tabla de request esta funcion se ejecuta
 *    cuando se hacer un requermiento */
function inserta_factura(faeljson)
{
        return new Promise(function (resolve, reject) {
                var json= { };
                json.estado=0;
                json.url='factura';
                json.passdata=faeljson;
                json.forma=0;
                json.idmenu=0;
                json=datos_comunes(json);
                json.sello=faeljson["cfdi:Comprobante"]["@attributes"].Sello;
                openDatabasex(DBNAME, DBVERSION).then(function(db) {
                        return openObjectStore(db, 'request', "readwrite");
                        }).then(function(objectStore) {
                                console.log('[inserta_factura] menu a requesitar=');
                                addObject(objectStore, json).then(function(key) {
                                                               resolve(key) ; 
                                                            }).catch(function(err) {  reject(err) });
                        }).catch(function(err) {
                                console.log("[inserta_request] Database error: "+err.message);
                });
        })
}

/* funcion que inserta los datos en la tabla de request esta funcion se ejecuta
 *  *    cuando se hacer un requermiento */
function inserta_firma(faeljson)
{
        return new Promise(function (resolve, reject) {
                var json= { };
                json.estado=0;
                json.url='firma';
                json.passdata=faeljson;
                json.forma=0;
                json.idmenu=0;
                json=datos_comunes(json);
                json.sello=faeljson.sellogen;
                json.passdata.sellogen='';
                openDatabasex(DBNAME, DBVERSION).then(function(db) {
                        return openObjectStore(db, 'request', "readwrite");
                        }).then(function(objectStore) {
                                console.log('[inserta_firma] menu a requesitar=');
                                addObject(objectStore, json).then(function(key) {
                                                               resolve(key) ;
                                                            }).catch(function(err) {  reject(err) });
                        }).catch(function(err) {
                                console.log("[inserta_firma] Database error: "+err.message);
                });
        })
}


function leefacturas()
{
        console.log('[db.js leefacturas] entro');
        return new Promise(function (resolve, reject) {
                openDatabasex(DBNAME, DBVERSION).then(function(db) {
                        return openObjectStore(db, 'request', "readwrite");
                        }).then(function(objectStore) {
                                console.log('[db.js leefacturas] va a seleccionar ');
                                selObjects(objectStore,'url','factura').then(function(requests) {
                                                               resolve(requests) ;
                                                            }).catch(function(err) {  reject(err) });
                        }).catch(function(err) {
                                console.log("[db.js leefacturas] Database error: "+err.message);
                });
        })
}

function leefirmas()
{
        console.log('[db.js leefirmas] entro');
        return new Promise(function (resolve, reject) {
                openDatabasex(DBNAME, DBVERSION).then(function(db) {
                        return openObjectStore(db, 'request', "readwrite");
                        }).then(function(objectStore) {
                                console.log('[db.js leefirmas] va a seleccionar ');
                                selObjects(objectStore,'url','firma').then(function(requests) {
                                                               resolve(requests) ;
                                                            }).catch(function(err) {  reject(err) });
                        }).catch(function(err) {
                                console.log("[db.js leefirmas] Database error: "+err.message);
                });
        })
}

function leeSolicitudes(direccion='next')
{
        console.log('[db.js leeSolicitudes] entro');
        return new Promise(function (resolve, reject) {
                openDatabasex(DBNAME, DBVERSION).then(function(db) {
                        return openObjectStore(db, 'request', "readwrite");
                        }).then(function(objectStore) {
                                console.log('[db.js leeSolicitudes] va a seleccionar ');
                                selObjects(objectStore,'url','/solicita.php',direccion).then(function(requests) {
                                                               resolve(requests) ;
                                                            }).catch(function(err) {  reject(err) });
                        }).catch(function(err) {
                                console.log("[db.js leeSolicitudes] Database error: "+err.message);
                });
        })
}

function leeSolicitudesCorrectas()
{
        var solicitudesCorrectas=[];
        return new Promise(function (resolve, reject) {
               leeSolicitudes('prev').then( a  => {
                    a.forEach( 
                          e => { if (e.valor.passdata!==null) { 
                                //if  (e.valor.passdata.msg=='Solicitud correcta')  { 
                                         solicitudesCorrectas.push(e.valor.passdata) 
                                //    } 
                          } }
                    );
                    resolve(solicitudesCorrectas);
               });
        })
                   
}
        console.log('[db.js leefirmas] entro');


function leefirma(key)
{
        console.log('[db.js leefirmas] entro');
        return new Promise(function (resolve, reject) {
                openDatabasex(DBNAME, DBVERSION).then(function(db) {
                        return openObjectStore(db, 'request', "readwrite");
                        }).then(function(objectStore) {
                                console.log('[db.js leefirmas] va a seleccionar ');
                                selObjects(objectStore,'sello',key).then(function(requests) {
                                                               resolve(requests) ;
                                                            }).catch(function(err) {  reject(err) });
                        }).catch(function(err) {
                                console.log("[db.js leefirmas] Database error: "+err.message);
                });
        })
}



function cuantasfacturas()
{
        return new Promise(function (resolve, reject) {
                openDatabasex(DBNAME, DBVERSION).then(function(db) {
                        return openObjectStore(db, 'request', "readwrite");
                        }).then(function(objectStore) {
                                selObjects(objectStore,'url','factura').then(function(requests) {
                                                               resolve(requests.length) ;
                                                            }).catch(function(err) {  reject(err) });
                        }).catch(function(err) {
                                console.log("error en cuantas facturas: "+err.message);
                });
        })
}

function cuantasfirmas()
{
        return new Promise(function (resolve, reject) {
                openDatabasex(DBNAME, DBVERSION).then(function(db) {
                        return openObjectStore(db, 'request', "readwrite");
                        }).then(function(objectStore) {
                                console.log('cuantasfirmas, leyo');
                                selObjects(objectStore,'url','firma').then(function(requests) {
                                                               console.log('cuantasfirmas, leyo');
                                                               resolve(requests.length) ;
                                                            }).catch(function(err) {  
                                                               console.log('cuantasfirmas, error');
                                                                           reject(err) });
                        }).catch(function(err) {
                                console.log("error en cuantas facturas: "+err.message);
                });
        })
}

function bajafacturas(key)
{
        return new Promise(function (resolve, reject) {
                openDatabasex(DBNAME, DBVERSION).then(function(db) {
                        return openObjectStore(db, 'request', "readwrite");
                        }).then(function(objectStore) {
                                var request = objectStore.delete(Number(key));
                                console.log('dio de baja key='+key);
                                request.onsuccess = function(e) {
                                          console.log("element deleted"); //sadly this always run :-(
                                          resolve();
                                }
                                request.onerror = function(e) {
                                          console.log("error element deleted"); //sadly this always run :-(
                                          reject(e);
                                }
                        }).catch(function(err) {
                                reject(err.message);
                });
        })
}

function bajafirmas(key)
{
        return new Promise(function (resolve, reject) {
                openDatabasex(DBNAME, DBVERSION).then(function(db) {
                        return openObjectStore(db, 'request', "readwrite");
                        }).then(function(objectStore) {
                                var request = objectStore.delete(Number(key));
                                console.log('dio de baja key='+key);
                                request.onsuccess = function(e) {
                                          console.log("element deleted"); //sadly this always run :-(
                                          resolve();
                                }
                                request.onerror = function(e) {
                                          console.log("error element deleted"); //sadly this always run :-(
                                          reject(e);
                                }
                        }).catch(function(err) {
                                reject(err.message);
                });
        })
};






//export  { openDatabasex,DBNAME,DBVERSION,inserta_factura,selObjectUlt,delObject,updObject_01,updObject ,inserta_request,selObject,leefacturas,cuantasfacturas,wl_fecha,bajafacturas,inserta_firma,bajafirmas,cuantasfirmas,leefirmas,leefirma,openObjectStore,selObjects,leeSolicitudesCorrectas,selObjectByKey,updObjectByKey } ;

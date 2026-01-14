var DBNAME='fiel_menus';
var DBVERSION='17';
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

                   if(!db.objectStoreNames.contains('request')) { /*request hechos a un servidor externo */
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
                        objectStore.createIndex('fechaEmision', 'fechaEmision', { unique: false });
                        objectStore.createIndex('yearEmision', 'yearEmision', { unique: false });
                        objectStore.createIndex('fechaPago', 'fechaPago', { unique: false });
                        objectStore.createIndex('yearPago', 'yearPago', { unique: false });
                        objectStore.createIndex('url_yearEmision', ['url','yearEmision'], { unique: false });
                        objectStore.createIndex('url_yearPago', ['url','yearPago'], { unique: false });
                        objectStore.createIndex('estado', 'estado', { unique: false });
                    };

                   if(!db.objectStoreNames.contains('catalogos')) { /* Catalogos propios del aplicativo */
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
                   if(!db.objectStoreNames.contains('log')) { /* tabla donde se registra los mensajes del log */
                        objectStore = db.createObjectStore('log', { autoIncrement : true });
                        objectStore.createIndex('hora', 'hora', { unique: false });
                        objectStore.createIndex('mensaje', 'mensaje', { unique: false });
                        objectStore.createIndex('tipo', 'tipo', { unique: false });
                        objectStore.createIndex('p', 'p', { unique: false });
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
   si llegan indexname e indexvalue undefined se regresan todos los valores del objeto
   */ 
var selObjects = function(objectStore, indexname, indexvalue, direccion='next') {
        var regs  = [];
        var cursor = {};
        var myIndex = null;
        return new Promise(function (resolve, reject) {
        if (indexname!==undefined && indexvalue!==undefined) {
           let range = IDBKeyRange.only(indexvalue);
           myIndex=objectStore.index(indexname);  
           cursor  = myIndex.openCursor(range,direccion);
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
   direction o el orden en que se obtiene las filas o registros next=de menor a mayor, prev=de mayor a menor
   si no llegan valida indexname e indexvalue se regresan todos los valores del objeto
   */
var selObjectUlt = function(objectStore, indexname, indexvalue,direction='next') {
        return new Promise(function (resolve, reject) {
        openDatabasex(DBNAME, DBVERSION).then(function(db) {
          return openObjectStore(db, 'request', "readonly");
        }).then(function(oS) {
        var objects = [];
        var cursor;
        if (indexname!==undefined && indexvalue!==undefined) {
           cursor  = oS.index(indexname).openCursor(indexvalue,direction);
        } else {
           resolve(objects);
        }

        cursor.onerror = (event) => {
               console.log('[db.js] selObjectUlt error ');
               var json = { };
               json.value=0;
               json.key  =0;
               resolve(json);
        }

        cursor.onsuccess = (event) =>  {
            var cursor1 = event.target.result;
            var json = { };
            if (cursor1) {
               json.value=cursor1.value;
               json.key  =cursor1.primaryKey;
               resolve(json);
            } else {
              reject('No encontro registro indexname='+indexname+' value='+indexvalue);
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
		var upd=objectStore.put(object,id);
		upd.onsuccess = function () { /*console.log('[db.js] updObject_01 actualizo registro con id='+id);*/ resolve(); };
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
				var upd=oS.put(object,id);
				upd.onsuccess = function () { /*console.log('[db.js] updObjectByKey actualizo registro con id='+id);*/ resolve(); };
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
        var index = objectStore.index("estado");
        var request = index.get(idmenu+"_"+estado);

        request.onsuccess = function(event) {
               var data=object;
               var requestput = objectStore.put(data,idmenu); 
               requestput.onerror = function (event) {
                 console.log('[db.js] error no pudo actualizar');
                 reject(event);
               }
               requestput.onsuccess = function (event) {
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
                 requestadd.onsuccess = resolve;
            }
        };

        });
};

function datos_comunesCat(json) {
      var fecha = new Date();
      json.ano=fecha.getFullYear();
      json.mes=fecha.getMonth()+1;
      json.mes=json.mes < 10 ? '0' + json.mes : '' + json.mes;
      json.dia=fecha.getDate();
      json.dia=json.dia < 10 ? '0' + json.dia : '' + json.dia;
      json.hora=fecha.getHours();
      json.minutos=fecha.getMinutes();
      return json;
}

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

function inserta_catalogo(catalogo,label)
{
        return new Promise(function (resolve, reject) {
                var json= { };
                json.catalogo=catalogo;
                json.label=label;
                json=datos_comunesCat(json);
                openDatabasex(DBNAME, DBVERSION).then(function(db) {
                        return openObjectStore(db, 'catalogos', "readwrite");
                               }).then(function(objectStore) {
					addObject(objectStore, json).then( (key) => {
					    json.key=key;
					    resolve(json) ; }).
                                        catch( (err) => { resolve(); })
                        }).catch(function(err) {
                                console.log("[inserta_catalogos] Database error: "+err.message);
                });
        })
}


/* funcion que inserta los datos en la tabla de request esta funcion se ejecuta
   cuando se hacer un requermiento */
function inserta_request(wlurl,passdata,idmenu,forma,wlmovto,header,body,urlSAT)
{
        return new Promise(function (resolve, reject) {
                var json= { };
                json.url=wlurl;
                json.estado=wlmovto;
                json.passdata=passdata;
                json.forma=forma;
                json.idmenu=idmenu;
                json.header=header;
                json.body=body;
                json.urlSAT=urlSAT;
                json=datos_comunes(json);
                openDatabasex(DBNAME, DBVERSION).then(function(db) {
                        return openObjectStore(db, 'request', "readwrite");
                        }).then(function(objectStore) {
                                addObject(objectStore, json).then( (key) => { 
                                    json.key=key;
                                    resolve(json) ; } );
                        }).catch(function(err) {
                                console.log("[db.js inserta_request] error: "+err.message);
                });
        })
}

/* funcion que inserta los datos en la tabla de request esta funcion se ejecuta
   cuando se hacer un requermiento */
function inserta_log(obj)
{
        return new Promise(function (resolve, reject) {
                openDatabasex(DBNAME, DBVERSION).then(function(db) {
                        return openObjectStore(db, 'log', "readwrite");
                        }).then((objectStore) => {
                                const ahora = new Date();
                                const soloHora = ahora.toLocaleTimeString();
                                obj.hora=soloHora;
                                addObject(objectStore, obj).then( (key) => {
                                    obj.key=key;
                                    resolve(obj) ; } );
                        }).catch(function(err) {
                                console.log("[db.js inserta_log] error: "+err.message);
                });
        })
}



/* funcion que actualiza los datos en la tabla de request 
   cuando se hacer un requermiento */
function update_request(wlurl,passdata,idmenu,forma,wlmovto,header,body,idkey,urlSAT)
{
        return new Promise(function (resolve, reject) {
                var json= { };
                json.url=wlurl;
                json.estado=wlmovto;
                json.passdata=passdata;
                json.forma=forma;
                json.idmenu=idmenu;
                json.header=header;
                json.body=body;
                json=datos_comunes(json);
                json.urlSAT=urlSAT;
                updObjectByKey('request', json, idkey).then( () => {
                                    resolve(idkey) ; })
                        .catch(function(err) {
                                console.log("[db.js update_request] Database error: "+err.message);
                });
        });
}


/* funcion que inserta los datos en la tabla de request esta funcion se ejecuta
 *    cuando se hacer un requermiento */
function inserta_factura(faeljson)
{
        return new Promise(function (resolve, reject) {
                var json= { };
                var fechaPago=null;
                var yearPago=null;
                json.estado=ESTADOREQ.INSERTADO;
                json.url='factura';
                json.passdata=faeljson;
                json.forma=0;
                json.idmenu=0;
                json=datos_comunes(json);
                json.sello=faeljson["cfdi:Comprobante"]["@attributes"].Sello;
                json.fechaEmision=faeljson["cfdi:Comprobante"]["@attributes"].Fecha.substring(0,10);
                json.yearEmision=faeljson["cfdi:Comprobante"]["@attributes"].Fecha.substring(0,4);
                if (faeljson["cfdi:Comprobante"]["cfdi:Complemento"].hasOwnProperty("nomina12:Nomina")) {
			if (faeljson["cfdi:Comprobante"]["cfdi:Complemento"]["nomina12:Nomina"]["@attributes"]["FechaPago"].length>0 ) {
			   fechaPago=faeljson["cfdi:Comprobante"]["cfdi:Complemento"]["nomina12:Nomina"]["@attributes"].FechaPago
			   yearPago=faeljson["cfdi:Comprobante"]["cfdi:Complemento"]["nomina12:Nomina"]["@attributes"].FechaPago.substring(0,4);
			}
                        json.fechaPago=fechaPago;
                        json.yearPago=yearPago
                }
                openDatabasex(DBNAME, DBVERSION).then(function(db) {
                        return openObjectStore(db, 'request', "readwrite");
                        }).then(function(objectStore) {
                                selObjects(objectStore,'sello',json.sello).then( x => {
                                       if (x.length===0)   { /* no esta registrado el sello y lo da de alta */
                                          addObject(objectStore, json).then(key => { resolve('Guardo factura con id='+key) ; }).catch(function(err)
                                               {  console.log('[inserta_factura] error al insertar la factura '+err); reject(err) });
                                       } else { resolve('factura duplicada');
                                       }
                                })
                        }).catch(function(err) {
                                console.log("[inserta_factura] Database error: "+err.message);
                });
        })
}

/* funcion que inserta los datos en la tabla de request esta funcion se ejecuta
 *  *    cuando se hacer un requermiento */
function inserta_firma(faeljson)
{
        return new Promise(function (resolve, reject) {
                var json= { };
                json.estado=ESTADOREQ.INSERTADO;
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
                                addObject(objectStore, json).then(function(key) {
                                                               resolve(key) ;
                                                            }).catch(function(err) {  reject(err) });
                        }).catch(function(err) {
                                console.log("[inserta_firma] Database error: "+err.message);
                });
        })
}


function leefacturas(filtro={dato:'url',valor:'factura'})
{
        return new Promise(function (resolve, reject) {
                openDatabasex(DBNAME, DBVERSION).then(function(db) {
                        return openObjectStore(db, 'request', "readwrite");
                        }).then(function(objectStore) {
                                selObjects(objectStore,filtro.dato,filtro.valor).then(function(requests) {
                                                               resolve(requests) ;
                                                            }).catch(function(err) {  reject(err) });
                        }).catch(function(err) {
                                console.log("[db.js leefacturas] Database error: "+err.message);
                });
        })
}

function lee_log(filtro={dato:undefined,valor:undefined})
{
        return new Promise(function (resolve, reject) {
                openDatabasex(DBNAME, DBVERSION).then(function(db) {
                        return openObjectStore(db, 'log', "readwrite");
                        }).then(function(objectStore) {
                                selObjects(objectStore,filtro.dato,filtro.valor).then(requests => {
                                                               var reorden=requests.map((row)=>{
					                               return { hora:row['value'].hora,key:row['key'],msg:row['value'].msg,tipo:row['value'].tipo}
							       })
					                       .sort((a, b) => b.key - a.key);
                                                               resolve(reorden) ;
                                                            }).catch(function(err) {  reject(err) });
                        }).catch(function(err) {
                                console.log("[db.js leelog] Database error: "+err.message);
                });
        })
}


function leeRFCS()
{
        return new Promise(function (resolve, reject) {
                openDatabasex(DBNAME, DBVERSION).then(function(db) {
                        return openObjectStore(db, 'catalogos', "readwrite");
                        }).then(function(objectStore) {
                                selObjects(objectStore,'catalogo','rfcs').then(function(requests) {
                                    var rfcs=[];
                                    requests.forEach(
                                          e => { rfcs.push({label : e.value.label})  }
                                    );
                                    resolve(rfcs);
                                }).catch(function(err) {  reject(err) });
                        }).catch(function(err) {
                                console.log("[db.js leefacturas] Database error: "+err.message);
                });
        })
}

function leefirmas()
{
        return new Promise(function (resolve, reject) {
                openDatabasex(DBNAME, DBVERSION).then(function(db) {
                        return openObjectStore(db, 'request', "readwrite");
                        }).then(function(objectStore) {
                                selObjects(objectStore,'url','firma').then(function(requests) {
                                                               resolve(requests) ;
                                                            }).catch(function(err) {  reject(err) });
                        }).catch(function(err) {
                                console.log("[db.js leefirmas] Database error: "+err.message);
                });
        })
}

function leeSolicitudes(direccion='next') {
        return new Promise(function (resolve, reject) {
                openDatabasex(DBNAME, DBVERSION).then(function(db) {
                        return openObjectStore(db, 'request', "readwrite");
                        }).then(function(objectStore) {
                                selObjects(objectStore,'url','/solicita.php',direccion).then(function(requests) {
                                                               resolve(requests) ;
                                                            }).catch(function(err) {  reject(err) });
                        }).catch(function(err) {
                                console.log("[db.js leeSolicitudes] Database error: "+err.message);
                });
        })
}

function leeAutenticaciones(direccion='next') {
        return new Promise(function (resolve, reject) {
                openDatabasex(DBNAME, DBVERSION).then(function(db) {
                        return openObjectStore(db, 'request', "readwrite");
                        }).then(function(objectStore) {
                                selObjects(objectStore,'url','/autentica.php',direccion).then(function(requests) {
                                                               resolve(requests) ;
                                                            }).catch(function(err) {  reject(err) });
                        }).catch(function(err) {
                                console.log("[db.js leeAutenticaciones] Database error: "+err.message);
                });
        })
}


function leeSolicitudesCorrectas() {
        var solicitudesCorrectas=[];
        return new Promise(function (resolve, reject) {
               leeSolicitudes('prev').then( a  => {
                    a.forEach( 
                          e => { if (e.value.passdata!==null) { 
				         if ('msg_v' in e.value.passdata) {
						 e.value.passdata.msg=e.value.passdata.msg_v;
					 }
                                         if ('msg_d' in e.value.passdata & e.value.passdata.msg_d!==undefined) {
                                                 e.value.passdata.msg=e.value.passdata.msg_d;
                                         }
				         if (e.value.estado==ESTADOREQ.ERRORFETCH) {
						 e.value.passdata.msg='Error en el servidor [fetch]';
					 }
				         e.value.passdata.fila=e.key;

                                         solicitudesCorrectas.push(e.value.passdata) 
                          } }
                    );
                    resolve(solicitudesCorrectas);
               });
        })
                   
}

/* lee la ultima solicitud que se esta verificando */
function leeSolicitudesVerificando() { 
        var solicitudesVerificando=[];
        return new Promise(function (resolve, reject) {
               leeSolicitudes('prev').then( a  => {
                    a.forEach(
                          e => { if (e.value.estado===ESTADOREQ.VERIFICANDO) {
                                         solicitudesVerificando.push(e)

                          } }
                    );
                    resolve(solicitudesVerificando);
               });
        })
}

/* Obtiene el ultimo TOKEN generado */
function obtieneelUltimoTokenActivo() {
        return new Promise(function (resolve, reject) {
               this.selObjectUlt('request','url','/autentica.php','prev').then( obj => {
                    if (obj.value.estado===ESTADOREQ.AUTENTICADO) {
                       resolve(obj);
		    } else {
                       reject({'msg':'el token no esta autenticado',key:obj.key,estado:obj.value.estado });
		    }
               });
        })
}

/*  lee si tecleo el pwd de la llave privada */
function tecleoPwdPrivada() {
        return new Promise(function (resolve, reject) {
               this.selObjectUlt('request','url','_X_','prev').then( obj => {
                    resolve(obj);
               });
        })
}




function leefirma(key) {
        return new Promise(function (resolve, reject) {
                openDatabasex(DBNAME, DBVERSION).then(function(db) {
                        return openObjectStore(db, 'request', "readwrite");
                        }).then(function(objectStore) {
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

function cuantaslog()
{
        return new Promise(function (resolve, reject) {
                openDatabasex(DBNAME, DBVERSION).then(function(db) {
                        return openObjectStore(db, 'log', "readwrite");
                        }).then(function(objectStore) {
                                selObjects(objectStore).then(function(requests) {
                                                               resolve(requests.length) ;
                                                            }).catch(function(err) {  reject(err) });
                        }).catch(function(err) {
                                console.log("error en cuantas log: "+err.message);
                });
        })
}


function cuantasfirmas()
{
        return new Promise(function (resolve, reject) {
                openDatabasex(DBNAME, DBVERSION).then(function(db) {
                        return openObjectStore(db, 'request', "readwrite");
                        }).then(function(objectStore) {
                                selObjects(objectStore,'url','firma').then(function(requests) {
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
                                request.onsuccess = function(e) {
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
                                request.onsuccess = function(e) {
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


/* actualiza el estado del request */
var updestado = (request,esta,respuesta) => {
        request.value.estado=esta;
        request.value.respuesta=respuesta;
        return new Promise( (resolve, reject) => {
            var now = new Date();
            openDatabasex(DBNAME, DBVERSION).then(function(db) {
                  return openObjectStore(db, 'request', "readwrite");
                   }).then( objectStore => {
                           return updObject_01(objectStore, request.value, request.key);
                   }).then( objectStore => {
                           //console.log('[updestado] actualizo el estado forma key='+request.key+' Estado='+esta);
                           resolve(request);
                   }).catch(function(err)  {
                           return Promise.reject(err);
                   });
            resolve(request);
        });
};







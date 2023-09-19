import fiel from './fiel';
import {openDatabasex,DBNAME,DBVERSION,inserta_factura,inserta_request,updObject_01,openObjectStore,selObjects,selObjectByKey,updObjectByKey} from './db';
import {MENUS,FORMA,MOVIMIENTO} from './componente/Constantes';
var DescargaMasivaSat = function()
{
   this.mifiel = '';
   this.token = '';

   this.uuid = function () {
                  const url = URL.createObjectURL(new Blob())
                  const [id] = url.toString().split('/').reverse()
                  URL.revokeObjectURL(url)
                  return id
   }

   this.text2Binary = function (string) {
            return string.split('').map(function (char) {
                return char.charCodeAt(0).toString(2);
            }).join(' ');
   }


   this.creafirma = function (digest,urifirmado,keyinfo) {
        //console.log('digest='+digest);
        var md = window.forge.md.sha1.create();
        var digerido = "";
        md.update(digest,'utf8');
        digerido = btoa(md.digest().data);
        console.log('digerido='+digerido);

        var signedinfo = '<SignedInfo xmlns="http://www.w3.org/2000/09/xmldsig#"><CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"></CanonicalizationMethod><SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1"></SignatureMethod><Reference URI="'+urifirmado+'"><Transforms><Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"></Transform></Transforms><DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"></DigestMethod><DigestValue>'+digerido+'</DigestValue></Reference></SignedInfo>';
        var signedinfox = '<SignedInfo><CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"></CanonicalizationMethod><SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1"></SignatureMethod><Reference URI="'+urifirmado+'"><Transforms><Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"></Transform></Transforms><DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"></DigestMethod><DigestValue>'+digerido+'</DigestValue></Reference></SignedInfo>';
        var mdsi = window.forge.md.sha1.create();
        mdsi.update(signedinfo,'utf8');
        var sello=btoa(this.mifiel.rk.sign(mdsi));
        var keyInfo=this.creaLLaveInfoData();
        return { signedinfo : signedinfox, keyInfo:keyInfo , sello: sello, res:true}
   }

   this.creaLLaveInfoData = function () {
        var arma = ''+
            '<KeyInfo>'+
                '<X509Data>'+
                    '<X509IssuerSerial>'+
                        '<X509IssuerName>'+this.cer.issuer.attributes[1].value+'</X509IssuerName>'+
                        '<X509SerialNumber>'+this.cer.serialNumber+'</X509SerialNumber>'+
                    '</X509IssuerSerial>'+
                    '<X509Certificate>'+this.cer.certificado+'</X509Certificate>'+
                '</X509Data>'+
            '</KeyInfo>';
       return arma;
   } 

   this.armaBodySol = function (estado) {
          var solicitud = { 'RfcSolicitante' : estado.firma.rfc, 'TipoSolicitud' : estado.TipoSolicitud,'FechaInicial':estado.start,'FechaFinal': estado.end,'RfcEmisor' : estado.RFCEmisor 
               ,'RFCReceptor': estado.RFCReceptor
              };
          var solicitudAttributesAsText=' FechaInicial="'+solicitud.FechaInicial+'" FechaFinal="'+solicitud.FechaFinal+'" RfcEmisor="'+estado.RFCEmisor+'" RfcSolicitante="'+solicitud.RfcSolicitante+'" TipoSolicitud="'+solicitud.TipoSolicitud+'"';
          var xmlRfcReceived='<des:RfcReceptores><des:RfcReceptor>'+solicitud.RFCReceptor+'</des:RfcReceptor></des:RfcReceptores>';
	  this.vuuid=this.uuid();
          this.toDigestXml =  '<des:SolicitaDescarga xmlns:des="http://DescargaMasivaTerceros.sat.gob.mx">'+
                '<des:solicitud '+solicitudAttributesAsText+'>'+
                    xmlRfcReceived+
                '</des:solicitud>'+
            '</des:SolicitaDescarga>';
          this.datofirmado=this.creafirma(this.toDigestXml);
          this.xmltoken = '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" xmlns:des="http://DescargaMasivaTerceros.sat.gob.mx" xmlns:xd="http://www.w3.org/2000/09/xmldsig#">'+
        '<s:Header/>'+
                '<s:Body>'+
                    '<des:SolicitaDescarga>'+
                        '<des:solicitud '+solicitudAttributesAsText+'>'+
                            xmlRfcReceived+
                        '<Signature xmlns="http://www.w3.org/2000/09/xmldsig#">'+
                                this.datofirmado.signedinfo+
                                '<SignatureValue>'+
                                this.datofirmado.sello+
                                '</SignatureValue>'+
                                this.datofirmado.keyInfo+
                        '</Signature>'+
                        '</des:solicitud>'+
                    '</des:SolicitaDescarga>'+
                '</s:Body>'+
            '</s:Envelope>';
           this.urlAutenticate='https://cfdidescargamasivasolicitud.clouda.sat.gob.mx/SolicitaDescargaService.svc';
           this.urlproxy='/solicita.php?solicitadescarga=""';
           this.xmltoken=this.xmltoken.replace(/(\r\n|\n|\r)/gm, "");
           this.urlproxy='/solicita.php';

   }

   this.armaBodyVer = function (datos) {
          var xmlRequestId =  datos.folioReq;
          var xmlRfc = datos.firma.rfc;
          this.toDigestXml =  '<des:VerificaSolicitudDescarga xmlns:des="http://DescargaMasivaTerceros.sat.gob.mx">'+
                '<des:solicitud IdSolicitud="'+xmlRequestId+'" RfcSolicitante="'+xmlRfc+'">'+
                '</des:solicitud>'+
            '</des:VerificaSolicitudDescarga>';
          this.datofirmado=this.creafirma(this.toDigestXml);
          this.xmltoken = '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" xmlns:des="http://DescargaMasivaTerceros.sat.gob.mx" xmlns:xd="http://www.w3.org/2000/09/xmldsig#">'+
        '<s:Header/>'+
                '<s:Body>'+
                        '<des:VerificaSolicitudDescarga> '+
				'<des:solicitud IdSolicitud="'+xmlRequestId+'" RfcSolicitante="'+xmlRfc+'">'+
                        '<Signature xmlns="http://www.w3.org/2000/09/xmldsig#">'+
                                this.datofirmado.signedinfo+
                                '<SignatureValue>'+
                                this.datofirmado.sello+
                                '</SignatureValue>'+
                                this.datofirmado.keyInfo+
                        '</Signature>'+
				'</des:solicitud>'+
			'</des:VerificaSolicitudDescarga>'+
                '</s:Body>'+
            '</s:Envelope>';
           this.urlAutenticate='https://cfdidescargamasivasolicitud.clouda.sat.gob.mx/VerificaSolicitudDescargaService.svc';
           this.xmltoken=this.xmltoken.replace(/(\r\n|\n|\r)/gm, "");
           this.urlproxy='/verifica.php';
   }

   this.armaBodyDownload = function (datos,packageId) {
          var IdPaquete =  packageId;
          var xmlRfc = datos.firma.rfc;
          this.toDigestXml =  '<des:PeticionDescargaMasivaTercerosEntrada xmlns:des="http://DescargaMasivaTerceros.sat.gob.mx">'+
                '<des:peticionDescarga IdPaquete="'+IdPaquete+'" RfcSolicitante="'+xmlRfc+'">'+
                '</des:peticionDescarga>'+
            '</des:PeticionDescargaMasivaTercerosEntrada>';
          this.datofirmado=this.creafirma(this.toDigestXml);
          this.xmltoken = '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" xmlns:des="http://DescargaMasivaTerceros.sat.gob.mx" xmlns:xd="http://www.w3.org/2000/09/xmldsig#">'+
        '<s:Header/>'+
                '<s:Body>'+
                        '<des:PeticionDescargaMasivaTercerosEntrada> '+
                                '<des:peticionDescarga IdPaquete="'+IdPaquete+'" RfcSolicitante="'+xmlRfc+'">'+
                        '<Signature xmlns="http://www.w3.org/2000/09/xmldsig#">'+
                                this.datofirmado.signedinfo+
                                '<SignatureValue>'+
                                this.datofirmado.sello+
                                '</SignatureValue>'+
                                this.datofirmado.keyInfo+
                        '</Signature>'+
                                '</des:peticionDescarga>'+
                        '</des:PeticionDescargaMasivaTercerosEntrada>'+
                '</s:Body>'+
            '</s:Envelope>';
           this.urlAutenticate='https://cfdidescargamasivasolicitud.clouda.sat.gob.mx/VerificaSolicitudDescargaService.svc';
           this.xmltoken=this.xmltoken.replace(/(\r\n|\n|\r)/gm, "");
           this.urlproxy='/download.php';
   }



   this.armaBodyAut = function () {
	  var x = new fiel();
	  this.cer = x.damecertificadofiel();
	  this.fi=new Date();
	  this.ff=new Date(this.fi);
	  this.ff.setMinutes ( this.fi.getMinutes() + 5 );
	  this.fi=this.fi.toISOString();
	  this.ff=this.ff.toISOString();
	  this.dv='';
	  this.vuuid=this.uuid();
	  this.datofirmado='';

        this.keyInfoData =  ''+
            '<KeyInfo>'+
                '<o:SecurityTokenReference>'+
                    '<o:Reference URI="'+this.vuuid+'" ValueType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-token-profile-1.0#X509v3"/>'+
                '</o:SecurityTokenReference>'+
            '</KeyInfo>\n';

        this.toDigestXml =  '<u:Timestamp xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" u:Id="_0"><u:Created>'+this.fi+'</u:Created><u:Expires>'+this.ff+'</u:Expires></u:Timestamp>';
        this.toDigestXml_ = '<u:Timestamp u:Id="_0"><u:Created>'+this.fi+'</u:Created><u:Expires>'+this.ff+'</u:Expires></u:Timestamp>';

        this.datofirmado=this.creafirma(this.toDigestXml,'#_0',this.keyInfoData);

        this.xmltoken='<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">'+
	'<s:Header>'+
		'<o:Security xmlns:o="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" s:mustUnderstand="1">'+
                       this.toDigestXml_+
			'<o:BinarySecurityToken EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary" ValueType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-token-profile-1.0#X509v3" u:Id="uuid-'+this.vuuid+'-1">'+
                       this.cer.certificado+
                         '</o:BinarySecurityToken>'+
			'<Signature xmlns="http://www.w3.org/2000/09/xmldsig#">'+
                                this.datofirmado.signedinfo+
				'<SignatureValue>'+
                                this.datofirmado.sello+
                                '</SignatureValue>'+
				'<KeyInfo>'+
					'<o:SecurityTokenReference>'+
						'<o:Reference URI="#uuid-'+
                                   this.vuuid+
                                        '-1" ValueType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-token-profile-1.0#X509v3"/>'+
					'</o:SecurityTokenReference>'+
				'</KeyInfo>'+
			'</Signature>'+
		'</o:Security>'+
	'</s:Header>'+
	'<s:Body>'+
		'<Autentica xmlns="http://DescargaMasivaTerceros.gob.mx"/>'+
	'</s:Body>'+
'</s:Envelope>';
	   this.urlAutenticate='https://cfdidescargamasivasolicitud.clouda.sat.gob.mx/Autenticacion/Autenticacion.svc';
	   this.urlproxy='/autentica.php';
	   this.xmltoken=this.xmltoken.replace(/(\r\n|\n|\r)/gm, "");
   }

   this.autenticate_armasoa= function (pwd) {
                this.mifiel = new fiel();
                var res=this.mifiel.validaprivada(pwd);
                if (res.ok) {
                   this.armaBodyAut();
                   return { ok:true, msg :'Fiel correcta', soap:this.xmltoken }
                } else {
                   return { ok:false , msg : res.msg };
                }
   }

   this.autenticate_enviasoa= function (soa,url='/autentica.php') {
                var hs1={ 'Content-Type': 'text/xml;charset=UTF-8', 'Accept': 'text/xml','Accept-Charset':'utf-8','Cache-Control':'no-cache','Access-Control-Allow-Origin':'*','SOAPAction':'Autentica'};
                inserta_request(url,'',MENUS.DESCARGAMASIVA,FORMA.DESCARGAMASIVA,MOVIMIENTO.AUTENTICA,hs1,soa).then( key => {
                                if ("serviceWorker" in navigator && "SyncManager" in window) {
                                   navigator.serviceWorker.ready.then(function(registration) {
                                       registration.sync.register("autentica");
                                       console.log('[inserta_request] envio sincronizacion al service worker ');
                                   }).catch(function(err) {console.log("[broseaing.js] inserta_request El servicio de trabajo no esta listo: "+err.message)});
                                } else { console.log('[inserta_request] no envio la sincronizacion con el service worker '); }
                }).catch(function(err) {
                                console.log("[inserta_request] Database error: "+err.message);
                });
   }

   this.solicita_enviasoa= async function (soa,token,passdata) {
        var url=this.urlproxy;
        var hs1={ 'Content-Type': 'text/xml;charset=UTF-8', 'Accept': 'text/xml','Accept-Charset':'utf-8','Cache-Control':'no-cache','Access-Control-Allow-Origin':'*','SOAPAction':'SolicitaDescarga','token_value':token.value,'token_created':token.created,'token_expired':token.expires};
                inserta_request(url,passdata,MENUS.DESCARGAMASIVA,FORMA.DESCARGAMASIVA,MOVIMIENTO.SOLICITA,hs1,soa).then( key => {
                                if ("serviceWorker" in navigator && "SyncManager" in window) {
                                   navigator.serviceWorker.ready.then(function(registration) {
                                       registration.sync.register("autentica");
                                       console.log('[solicita_enviasoa] envio sincronizacion al service worker ');
                                   }).catch(function(err) {console.log("[broseaing.js] inserta_request El servicio de trabajo no esta listo: "+err.message)});
                                } else { console.log('[solicita_enviasoa] no envio la sincronizacion con el service worker '); }
                }).catch(function(err) {
                                console.log("[solicita_enviasoa] Database error: "+err.message);
                });


/*
        return new Promise(async (resolve, reject) => {
                let hs1 = new Headers();
                var idKey=null;
                hs1.append('Content-Type', 'text/xml;charset=UTF-8');
                hs1.append('Accept', 'text/xml');
                hs1.append('Accept-Charset', 'utf-8');
                hs1.append('Cache-Control', 'no-cache');
                hs1.append('token_value', token.value);
                hs1.append('token_created', token.created);
                hs1.append('token_expired', token.expires);
                hs1.append('SOAPAction', 'http://DescargaMasivaTerceros.sat.gob.mx/ISolicitaDescargaService/SolicitaDescarga');

                var opciones = { method: 'POST', body:soa, headers:hs1 };
		const result = await openDatabasex(DBNAME,DBVERSION).then( () => {
					    inserta_request('SolicitaDescarga',passdata,MENUS.DESCARGAMASIVA,null).then( (json) => {
						idKey=json.key;
						fetch(url, opciones)
						    .then( response => response.json())
						    .then(async (result) => {
						           console.log('idRequest fetch='+idKey);
                                                           passdata.ok=true; passdata.msg = result.status.message; passdata.token = result ; 
                                                           openDatabasex(DBNAME,DBVERSION).then( db => {
                                                                 return openObjectStore(db, 'request', "readwrite");
                                                                     }).then( objectStore => {   
                                                                       objectStore.get(idKey);
                                                                       console.log('obj='+JSON.stringify(json));
                                                                       json.passdata=passdata;
                                                                       updObject_01(objectStore,json,idKey);
                                                                       selObjects(objectStore,'url','SolicitaDescarga','prev').then( f => { 
                                                                                   passdata.solicitudes=f;
                                                                                   passdata.idKey=idKey;
                                                                                   resolve (passdata)
                                                                       })
                                                                     });
							  })
						    .catch(function(err) {
							     reject( { ok:false , msg : err });
							  }
						    );

					    }).catch(function(err)  {
						    console.log('error al guardar solicitud');
				    });
	        });
      });
*/
   }

   this.download_enviasoa= function (soa,token,packageId,idKey) {
        var url=this.urlproxy;
        var thisParent=this;
        return new Promise(function (resolve, reject) {
                let hs1 = new Headers();
                hs1.append('Content-Type', 'text/xml;charset=UTF-8');
                hs1.append('Accept', 'text/xml');
                hs1.append('Accept-Charset', 'utf-8');
                hs1.append('Cache-Control', 'no-cache');
                hs1.append('token_value', token.value);
                hs1.append('token_created', token.created);
                hs1.append('token_expired', token.expires);
                hs1.append('packageId', packageId);
                hs1.append('SOAPAction', 'http://DescargaMasivaTerceros.sat.gob.mx/IDescargaMasivaTercerosService/Descargar');

                var opciones = { method: 'POST', body:soa, headers:hs1 };
                fetch(url, opciones)
                    .then( response => response.json() )
                    .then( result => {
                           selObjectByKey('request',idKey).then ( obj => {
                                   obj.passdata.msg_d = result.message;
                                   updObjectByKey('request',obj,idKey).then ( () => {
					    if (result.msg.includes("El paquete no se ha podido descargar")===true)
						resolve ( { ok:false, msg : result.msg , token : null });
					    else {
						thisParent.leezip(result.xml);
						resolve ( { ok:true, msg : 'Descarga correcta' , token : result })
					    }
                                   });
                            });
                          })
                    .catch(function(err) {
                             reject( { ok:false , msg : err });
                          }
                    );
      });
   }

   this.leezip = async function (xmls){
		        var buffer = this.base64ToBlob01(xmls);

                        let BR=new window.zip.BlobReader(buffer);

			const reader = new window.zip.ZipReader(BR);

			// get all entries from the zip
			const entries =  await reader.getEntries();
			if (entries.length) {
                                var x = new fiel();
				for (let i = 0; i < entries.length; i++) {
			             const text = await entries[i].getData( new window.zip.TextWriter(), { onprogress: (index, max) => { } } );
                                     var stx=x.StringToXMLDom(text);
                                     var vJson=x.xmlToJson(stx);
                                     await openDatabasex(DBNAME,DBVERSION).then(function() {
                                                            inserta_factura(vJson).then(function() {
                                                                    console.log('guardo factura');
                                                            }).catch(function(err)  {
                                                                    console.log('error al guardar la factura');
                                                            });
                                      });
                                 };
			}

			reader.close();
   }

   this.base64ToBuffer= function (str){
	    str = window.atob(str); // creates a ASCII string
	    var buffer = new ArrayBuffer(str.length),
		view = new Uint8Array(buffer);
	    for(var i = 0; i < str.length; i++){
		view[i] = str.charCodeAt(i);
	    }
	    return buffer;
   }


    this.base64ToBlob01= function(base64) {
                                var byteCharacters = atob(base64);
                                var byteNumbers = new Array(byteCharacters.length);
                                for (let i = 0; i < byteCharacters.length; i++) {
                                  byteNumbers[i] = byteCharacters.charCodeAt(i);
                                }
                                var byteArray = new Uint8Array(byteNumbers);
                                var blob = new Blob([byteArray],{ type:'application/zip',name:'archive.zip',lastModified: new Date() });
                                return blob;
    }


   this.verifica_enviasoa= function (soa,token,idKey) {
        var url=this.urlproxy;
        return new Promise(function (resolve, reject) {
                let hs1 = new Headers();
                hs1.append('Content-Type', 'text/xml;charset=UTF-8');
                hs1.append('Accept', 'text/xml');
                hs1.append('Accept-Charset', 'utf-8');
                hs1.append('Cache-Control', 'no-cache');
                hs1.append('token_value', token.value);
                hs1.append('token_created', token.created);
                hs1.append('token_expired', token.expires);
                hs1.append('SOAPAction', 'http://DescargaMasivaTerceros.sat.gob.mx/IVerificaSolicitudDescargaService/VerificaSolicitudDescarga');

                var opciones = { method: 'POST', body:soa, headers:hs1 };
                fetch(url, opciones)
                    .then( response => response.json())
                    .then( result => {
                           selObjectByKey('request',idKey).then ( obj => {
                                   obj.passdata.msg_v = result.statusRequest.message;
                                   obj.passdata.Cfdis = result.numberCfdis;
                                   updObjectByKey('request',obj,idKey).then ( () => {
                                        resolve ( { ok:true, msg : 'Verificación correcta' , resultado : result })
                                   });
                           })
                          }
                         )
                    .catch(function(err) {
                             reject( { ok:false , msg : err });
                          }
                    );
      });
   }


   this.solicita_armasoa = function (estado) {
                this.mifiel = new fiel();
                var res=this.mifiel.validafiellocal(estado.pwdfiel);
                this.cer = this.mifiel.damecertificadofiel();
                if (res.ok) {
                   estado.firma = res;
                   this.armaBodySol(estado);
                   return { ok:true, msg :'Fiel correcta', soap:this.xmltoken }
                } else {
                   return { ok:false , msg : res.msg };
                }

   }

   this.verificando = async function (estado,idKey) {
        return new Promise(function (resolve, reject) {
                 var resv=this.verifica_armasoa(estado,idKey);
		 if (resv.ok===true) {
		       this.verifica_enviasoa(resv.soap,estado.token,idKey).then((ret) => {
			     if (ret.resultado.statusRequest.value===3)  { // solicituda aceptada
				var estado=this.state;
				ret.resultado.packagesIds.forEach( (e) => {
					var resa=this.download_armasoa(estado,e);
					if (resa.ok===true) {
					   this.download_enviasoa(resa.soap,estado.token,e,idKey).then((ret) => {
						 resolve({ ok:'ok', msg:'Descargo facturas'});
					   });
					}
				},undefined,estado);
			     } else {
				 reject({ ok:'no', msg:'Solicitud rechazada'});
			     }
			 })
		 }
         });
   }

   this.verifica_armasoa = function (estado) {
                this.mifiel = new fiel();
                var res=this.mifiel.validafiellocal(estado.pwdfiel);
                if (res.ok) {
                   estado.firma = res;
                   this.armaBodyVer(estado);
                   return { ok:true, msg :'Fiel correcta', soap:this.xmltoken }
                } else {
                   return { ok:false , msg : res.msg };
                }
   }

   this.download_armasoa = function (estado,packageId) {
                this.mifiel = new fiel();
                var res=this.mifiel.validafiellocal(estado.pwdfiel);
                if (res.ok) {
                   estado.firma = res;
                   this.armaBodyDownload(estado,packageId);
                   return { ok:true, msg :'Fiel correcta', soap:this.xmltoken }
                } else {
                   return { ok:false , msg : res.msg };
                }
   }



}

export default DescargaMasivaSat;

var DescargaMasivaSat = function()
{
   this.mifiel = new _fiel();
   this.token = '';

   this.uuid = function () {
	  return [
	    forge.util.bytesToHex(forge.random.getBytesSync(4)), // 8 digits
	    forge.util.bytesToHex(forge.random.getBytesSync(2)), // 4 digits
	    '4' + forge.util.bytesToHex(forge.random.getBytesSync(2)).substr(1), // 4 digits starting with '4' (version 4 UUID)
	    ((parseInt(forge.util.bytesToHex(forge.random.getBytesSync(1)), 16) & 0x3f) | 0x80).toString(16) + forge.util.bytesToHex(forge.random.getBytesSync(1)), // 4 digits starting with '8', '9', 'A', or 'B'
	    forge.util.bytesToHex(forge.random.getBytesSync(6)) // 12 digits
	  ].join('-');
   }

   this.text2Binary = function (string) {
            return string.split('').map(function (char) {
                return char.charCodeAt(0).toString(2);
            }).join(' ');
   }


   this.creafirma = function (digest,urifirmado,keyinfo) {
        //console.log('digest='+digest);
        var md = forge.md.sha1.create();
        var digerido = "";
        md.update(digest,'utf8');
        digerido = btoa(md.digest().data);

        var signedinfo = '<SignedInfo xmlns="http://www.w3.org/2000/09/xmldsig#"><CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"></CanonicalizationMethod><SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1"></SignatureMethod><Reference URI="'+urifirmado+'"><Transforms><Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"></Transform></Transforms><DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"></DigestMethod><DigestValue>'+digerido+'</DigestValue></Reference></SignedInfo>';
        var signedinfox = '<SignedInfo><CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"></CanonicalizationMethod><SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1"></SignatureMethod><Reference URI="'+urifirmado+'"><Transforms><Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"></Transform></Transforms><DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"></DigestMethod><DigestValue>'+digerido+'</DigestValue></Reference></SignedInfo>';
        var mdsi = forge.md.sha1.create();
        mdsi.update(signedinfo,'utf8');
        var sello=btoa(this.mifiel.rk.sign(mdsi));
        var keyInfo=this.creaLLaveInfoData();
        return { signedinfo : signedinfox, keyInfo:keyInfo , sello: sello, res:true}
   }

   this.creaLLaveInfoData = function () {
        this.cer=this.mifiel.damecertificadofiel();
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

   /*
    * arma el body para solicita facturas
    */
   this.armaBodySol = function (estado) {
          var solicitud = { 'RfcSolicitante' : estado.certificado.rfc, 'TipoSolicitud' : estado.passdata.TipoSolicitud,'FechaInicial':estado.passdata.fechaini,'FechaFinal': estado.passdata.fechafin,'RfcEmisor' : estado.passdata.RFCEmisor 
               ,'RfcReceptor': estado.passdata.RFCReceptor
              };
          var solicitudAttributesAsText=' FechaInicial="'+solicitud.FechaInicial+'" FechaFinal="'+solicitud.FechaFinal+'" RfcEmisor="'+solicitud.RfcEmisor+'" RfcSolicitante="'+solicitud.RfcSolicitante+'" TipoSolicitud="'+solicitud.TipoSolicitud+'"';
          var xmlRfcReceived='<des:RfcReceptores><des:RfcReceptor>'+solicitud.RfcReceptor+'</des:RfcReceptor></des:RfcReceptores>';
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

	/* 
	 * arma el body para verificar una solicitud de facturas
	 */
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

	/* Arma el body para descargar las facturas 
	 */
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



	/* arma el body para autenticarse ante el SAT
	 */
   this.armaBodyAut = function () {
	  this.cer = this.mifiel.damecertificadofiel();
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

   this.autenticate_armasoa = async (pwd) => {
                this.mifiel.validaprivada(pwd).then( res => {
			if (res.ok) {
			   var cer=this.mifiel.damecertificadofiel();
			   var mifirmaString=this.mifiel.toString();
			   var cerRecortado= { certificado:cer.certificado, issuer:cer.issuer.attributes[1].value, serialNumber:cer.serialNumber,nombre:cer.subject.attributes[0].value
				               ,rfc:cer.subject.attributes[5].value, mifirma:mifirmaString }
			   this.armaBodyAut();
			   res = { ok:true, msg :'Fiel correcta', soap:this.xmltoken, cer:cerRecortado , mifirma:mifirmaString};
                           this.autenticate_enviasoa(res,pwd);
			   return { ok:true };
			} else {
				console.error('[autenticate_armasoa] error no es valida la privada'+JSON.stringify(res,true));
			}
                });
   }

   this.autenticate_enviasoa= function (res,pwd,url='/autentica.php') {
                var hs1={ 'Content-Type': 'text/xml;charset=UTF-8', 'Accept': 'text/xml','Accept-Charset':'utf-8','Cache-Control':'no-cache','Access-Control-Allow-Origin':'*','SOAPAction':'Autentica'};
                inserta_request(url,res.cer,MENUS.DESCARGAMASIVA,FORMA.DESCARGAMASIVA,MOVIMIENTO.AUTENTICA,hs1,res.soap).then( key => {
                                console.log("[autenticate_enviasoa] request de autenticacion");
                });
   }

   this.solicita_enviasoa= async function (soa,token,passdata,idkey) {
        var url=this.urlproxy;
        var hs1={ 'Content-Type': 'text/xml;charset=UTF-8', 'Accept': 'text/xml','Accept-Charset':'utf-8','Cache-Control':'no-cache','Access-Control-Allow-Origin':'*','SOAPAction':'SolicitaDescarga','token_value':token.value,'token_created':token.created,'token_expired':token.expired};
                update_request(url,passdata,MENUS.DESCARGAMASIVA,FORMA.DESCARGAMASIVA,MOVIMIENTO.SOLICITUD,hs1,soa,idkey).then( key => {
                                console.log("[solicita_enviasoa] el requerimiento de solicitud se actualizo idkey="+key);
                });
   }

   this.download_enviasoa= function (soa,token,packageId,keySolicitud) {
        var url=this.urlproxy;
        var passdata = { keySolicitud : keySolicitud }
        var hs1={ 'Content-Type': 'text/xml;charset=UTF-8', 'Accept': 'text/xml','Accept-Charset':'utf-8','Cache-Control':'no-cache','Access-Control-Allow-Origin':'*','SOAPAction':'Descargar','token_value':token.value,'token_created':token.created,'token_expired':token.expired,'packageId':packageId};
                inserta_request(url,passdata,MENUS.DESCARGAMASIVA,FORMA.DESCARGAMASIVA,MOVIMIENTO.DESCARGA,hs1,soa).then( key => {
                                console.log("[download_enviasoa] inserta request de download");
                });


   }

   this.leezip = async function (xmls){
		        var buffer = this.base64ToBlob01(xmls);

                        let BR=new zip.BlobReader(buffer);

			const reader = new zip.ZipReader(BR);

			// get all entries from the zip
			const entries =  await reader.getEntries();
			if (entries.length) {
                                var x = new _fiel();
                                var vJson = null;
                                var stx=null;
				for (let i = 0; i < entries.length; i++) {
			             const text = await entries[i].getData( new zip.TextWriter(), { onprogress: (index, max) => { } } );
                                     stx=x.StringToXMLDom(text);
                                     vJson=x.xmlToJson(stx);
                                     await openDatabasex(DBNAME,DBVERSION).then( () => {
                                                            inserta_factura(vJson).then( msg =>  {
                                                            }).catch(function(err)  {
                                                                    console.log('error al guardar la factura');
                                                            });
                                      });
                                 };
			}

			reader.close();
   }

   this.base64ToBuffer= function (str){
	    str = atob(str); // creates a ASCII string
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
        var passdata={ keySolicitud:idKey };
        var hs1={ 'Content-Type': 'text/xml;charset=UTF-8', 'Accept': 'text/xml','Accept-Charset':'utf-8','Cache-Control':'no-cache','Access-Control-Allow-Origin':'*','SOAPAction':'VerificaSolicitudDescarga','token_value':token.value,'token_created':token.created,'token_expired':token.expired};
                inserta_request(url,passdata,MENUS.DESCARGAMASIVA,FORMA.DESCARGAMASIVA,MOVIMIENTO.VERIFICA,hs1,soa).then( key => {
                                console.log("[verifica_enviasoa] inserto request de verificacion ");
                });
   }


   this.solicita_armasoa = async function (request,idkey,pwd) {
	        this.mifiel.cer = request.value.certificado;
	        this.mifiel.validaprivada(pwd).then( res => {   /* para poder firmar los mensaje */
                        if (res.ok) {
				this.getTokenEstatusSAT().then( (res) => {
				   if (res.tokenEstatusSAT===TOKEN.ACTIVO) { 
				      request.value.certificado=res.certificado;
				      request.value.token=res.token;
				      this.armaBodySol(request.value);
				      console.log('[solicita_armasoa] ya armo el body del soa y va a solicitar el envio idkey='+idkey);	
				      this.solicita_enviasoa(this.xmltoken,request.value.token,request.value.passdata,idkey)
				   }
				   if (res.tokenEstatusSAT===TOKEN.CADUCADO) { 
				   }
				})
			}
		});

   }

   this.verificando = async function (estado,idKey) {
                 var resv=this.verifica_armasoa(estado,idKey);
		 //if (resv.ok===true) {
		 //      this.verifica_enviasoa(resv.soap,estado.token,idKey);
		 //}
   }

   this.descargando = async (estado,packageId,keySolicitud) => {
                 var resv=this.download_armasoa(estado,packageId[0],keySolicitud);
   }


   this.verifica_armasoa = function (estado,idKey) {
                this.mifiel.validafiellocal(estado.pwdfiel).then( res => {
			this.cer = this.mifiel.damecertificadofiel();
			if (res.ok) {
			   estado.firma = res;
			   this.armaBodyVer(estado);
	                   this.verifica_enviasoa(this.xmltoken,estado.token,idKey);	
			   return { ok:true, msg :'Fiel correcta' }
			} else {
			   return { ok:false , msg : res.msg };
			}
		});
   }

   this.download_armasoa = function (estado,packageId,keySolicitud) {
                this.mifiel.validafiellocal(estado.pwdfiel).then( res => {
			this.cer = this.mifiel.damecertificadofiel();
			if (res.ok) {
			   estado.firma = res;
			   this.armaBodyDownload(estado,packageId);
	                   this.download_enviasoa(this.xmltoken,estado.token,packageId,keySolicitud);	
			   return { ok:true, msg :'Fiel correcta' }
			} else {
			   return { ok:false , msg : res.msg };
			}
		});
   }


   this.queda = (actual,expired) => {
        var difference = (expired-actual)*1000;
	const millisecondsInADay = 24 * 60 * 60 * 1000;
	const days = Math.floor(difference / millisecondsInADay);
	const hours = Math.floor((difference % millisecondsInADay) / (60 * 60 * 1000));
	const minutes = Math.floor((difference % (60 * 60 * 1000)) / (60 * 1000));
	const seconds = Math.floor((difference % (60 * 1000)) / 1000);
	const formattedResult = ` Quedan  ${minutes}:${seconds} segundos`;
        return formattedResult;
   }

   /* revisa si el token este caducado */
   this.getTokenEstatusSAT = () => {
                return new Promise( (resolve, reject) => {
                     selObjectUlt('request','url','/autentica.php','prev').then( obj => {  /*lee la ultima autenticacion */
			     var actual=Math.floor(Date.now() / 1000);
			     if ('respuesta' in obj.value) {
				     if (actual>=obj.value.respuesta.created & actual<=obj.value.respuesta.expired) {
					 var cuantoQueda=this.queda(actual,obj.value.respuesta.expired); 
					 //console.log('[getTokenEstatusSAT] token activo id='+obj.key);
					 resolve({ tokenEstatusSAT:TOKEN.ACTIVO, certificado:obj.value.passdata, token:obj.value.respuesta, queda:cuantoQueda })
				     } else {
					 console.log('[getTokenEstatusSAT] token caducado id='+obj.key);
					 updestado(obj,TOKEN.CADUCADO,'Token caducado').then( x =>  {
						resolve({ tokenEstatusSAT:TOKEN.CADUCADO }) 
					 });
				     }
			     } else { 
					 //console.log('[getTokenEstatusSAT] no se ha generadon un token  id='+obj.key);
					 resolve({ tokenEstatusSAT:TOKEN.NOGENERADO }); 
			     } 
		}).catch( err => {
			                 console.log('[getTokenEstatusSAT] err='+err);
				         resolve({ tokenEstatusSAT:TOKEN.NOSOLICITADO }); 
		     });
                });
   }

}


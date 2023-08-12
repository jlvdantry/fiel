import fiel from './fiel';
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
                        '<X509IssuerName>'+this.cer.emisor+'</X509IssuerName>'+
                        '<X509SerialNumber>'+this.cer.serialNumber+'</X509SerialNumber>'+
                    '</X509IssuerSerial>'+
                    '<X509Certificate></X509Certificate>'+
                '</X509Data>'+
            '</KeyInfo>';
       return arma;
   } 

   this.armaBodySol = function (estado) {
          var solicitud = { 'RfcSolicitante' : estado.firma.rfc, 'TipoSolicitud' : estado.TipoSolicitud,'FechaInicial':estado.start,'FechaFinal': estado.end,'RfcEmisor' : estado.firma.rfc };
          var solicitudAttributesAsText='';
          var xmlRfcReceived='';
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
                        '<des:solicitud '+solicitudAttributesAsText+
                            +xmlRfcReceived+
                            +this.datofirmado+
                        '</des:solicitud>'+
                    '</des:SolicitaDescarga>'+
                '</s:Body>'+
            '</s:Envelope>';
           this.urlAutenticate='https://cfdidescargamasivasolicitud.clouda.sat.gob.mx/SolicitaDescargaService.svc';
           this.urlproxy='/solicita.php?solicitadescarga=""';
           this.xmltoken=this.xmltoken.replace(/(\r\n|\n|\r)/gm, "");

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
   //console.log('xmltoken='+this.xmltoken);
   this.autenticate_enviasoa= function (soa,url) {
        url=this.urlproxy;
        return new Promise(function (resolve, reject) {
                let hs1 = new Headers();
                hs1.append('Content-Type', 'text/xml;charset=UTF-8');
                hs1.append('Accept', 'text/xml');
                hs1.append('Accept-Charset', 'utf-8');
                hs1.append('Cache-Control', 'no-cache');
                hs1.append('Access-Control-Allow-Origin', '*');
                hs1.append('SOAPAction', 'http://DescargaMasivaTerceros.gob.mx/IAutenticacion/Autentica');

                var opciones = { method: 'POST', body:soa, headers:hs1 };
                fetch(url, opciones)
                    .then(
                          response => 
                                response.text()
                         ) 
                    .then(function (result) {
                           resolve ( { ok:true, msg : 'Firma correcta' , token : result })
                          }
                         )
                    .catch(function(err) {
                             reject( { ok:false , msg : err });
                          }
                    );
      });
   }

   this.solicita_enviasoa= function (soa,token) {
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
                hs1.append('SOAPAction', 'http://DescargaMasivaTerceros.sat.gob.mx/ISolicitaDescargaService/SolicitaDescarga');

                var opciones = { method: 'POST', body:soa, headers:hs1 };
                fetch(url, opciones)
                    .then(
                          response =>
                                response.text()
                         )
                    .then(function (result) {
                           resolve ( { ok:true, msg : 'Solicitud correcta' , token : result })
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
                if (res.ok) {
                   estado.firma = res;
                   this.armaBodySol(estado);
                   return { ok:true, msg :'Fiel correcta', soap:this.xmltoken }
                } else {
                   return { ok:false , msg : res.msg };
                }

   }

}

export default DescargaMasivaSat;

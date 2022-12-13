import fiel from './fiel';
var DescargaMasivaSat = function()
{

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
        var digerido = btoa(md.digest().data);
        //console.log('digest='+btoa(md.update(digest)));
        //console.log('digest='+digest);
        console.log('digerido='+digerido);
        //console.log('sin data to hext='+btoa(md.digest().tohex()));

        var signedinfo = '<SignedInfo xmlns="http://www.w3.org/2000/09/xmldsig#"><CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"></CanonicalizationMethod><SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1"></SignatureMethod><Reference URI="'+urifirmado+'"><Transforms><Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"></Transform></Transforms><DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"></DigestMethod><DigestValue>'+digerido+'</DigestValue></Reference></SignedInfo>';
        var signedinfox = '<SignedInfo><CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"></CanonicalizationMethod><SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1"></SignatureMethod><Reference URI="'+urifirmado+'"><Transforms><Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"></Transform></Transforms><DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"></DigestMethod><DigestValue>'+digerido+'</DigestValue></Reference></SignedInfo>';
        //var signedinfo = '<SignedInfo xmlns="http://www.w3.org/2000/09/xmldsig#"><CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"></CanonicalizationMethod><SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1"></SignatureMethod><Reference URI="#_0"><Transforms><Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"></Transform></Transforms><DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"></DigestMethod><DigestValue>FG221Y03ZZJMIR7GWADUTrhgWuo=</DigestValue></Reference></SignedInfo>';
        var mdsi = window.forge.md.sha1.create();
        mdsi.update(signedinfo,'utf8');
        var x = new fiel();
        console.log('signedinfo='+signedinfo);
        console.log('validaprivada='+x.validaprivada('888aDantryR'));
        var sello=btoa(x.rk.sign(mdsi));
        console.log('sello='+sello);
        var keyInfo=this.creaLLaveInfoData();
        return { signedinfo : signedinfox, keyInfo:keyInfo , sello: sello}
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
       //this.toDigestXml =  '<u:Timestamp xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" u:Id="_0"><u:Created>2022-12-12T18:01:42.000Z</u:Created><u:Expires>2022-12-12T18:06:42.000Z</u:Expires></u:Timestamp>';

        console.log('toDigestXml='+this.toDigestXml);

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
   this.urlproxy='/prueba_fiel.php';
   this.xmltoken=this.xmltoken.replace(/(\r\n|\n|\r)/gm, "");
   console.log('xmltoken='+this.xmltoken);
   this.autenticate= function () {
                let hs1 = new Headers();
                hs1.append('Content-Type', 'text/xml;charset=UTF-8');
                hs1.append('Accept', 'text/xml');
                hs1.append('Accept-Charset', 'utf-8');
                hs1.append('Cache-Control', 'no-cache');
                hs1.append('Access-Control-Allow-Origin', '*');
                hs1.append('SOAPAction', 'http://DescargaMasivaTerceros.gob.mx/IAutenticacion/Autentica');
                //var hss1 = {'Content-Type':'text/xml','SOAPAction':'http://DescargaMasivaTerceros.gob.mx/IAutenticacion/Autentica'}

                //console.log('hs1='+hs1);
                var opciones = { method: 'POST', body:this.xmltoken, headers:hs1 };
                fetch(this.urlproxy, opciones)
                    .then(
                          response => 
                                response.text()
                         ) 
                    .then(
                           result => console.log(result)
                         )
                    .catch(err => console.log(err));
   }

}
export default DescargaMasivaSat;

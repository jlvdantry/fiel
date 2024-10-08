var _fiel = function()
{

  this.wlrfc = ""; // rfc
  this.llaves = "";
  this.rk = "";
  this.cer = "";
  this.cer1 = "";
  this.privada = {};
  this.publica = {};
  console.log('[_fiel] instancio');

  damePrivada().then(privada => { 
	  console.log('[_fiel] seteo la privada');
	  this.privada = privada; 
  }).catch(er => { this.privada.key = null;console.log('[_fiel] aun no esta cargada la privada') });

  damePublica().then(publica => { 
	  console.log('[_fiel] seteo la publica');
	  this.publica = publica; 
  }).catch(er => { this.publica.cer = null;console.log('[_fiel] aun no esta cargada la publica') });

  this.leefael = (evt) =>
  {
     localStorage.clear();
     for (var i=0 ; i<this.files.length; i++) {
             var file=this.files[i];
	     var reader = new FileReader();
	     var readertxt = new FileReader();
	     reader.onload = (function(theFile) {
		  return function(e) {
			  if (theFile.name.toLowerCase().indexOf(".xml")!==-1) {
			     var namelen=theFile.name.length;
			     var nombre=(namelen>20 ? theFile.name.substring(namelen-20,namelen) : theFile.name);
			     localStorage.setItem("xml_"+nombre,e.target.result);
			     localStorage.setItem("xml_name_"+nombre,nombre);
			  }  else {
			     alert('La factura electronica debe de contar con extension xml');
			     return false;
			  }};
		 })(file,i);

	      reader.onloadend = function () {
	      }

	     readertxt.onload = (function(theFile) {
		  return function(e) {
		  if (theFile.name.toLowerCase().indexOf(".xml")!==-1) {
                     var namelen=theFile.name.length;
                     var nombre=(namelen>20 ? theFile.name.substring(namelen-20,namelen) : theFile.name);
		     localStorage.setItem("xmltxt_"+nombre,e.target.result);
		  }  else {
		     alert('La factura electronica debe de contar con extension xml');
		     return false;
		  }};
		 })(file);
	     reader.readAsDataURL(file);
	     readertxt.readAsText(file);
     }
  }

  this.leefael_xslt = (evt) =>
  {
     var reader = new FileReader();
     reader.onload = (function(theFile) {
          return function(e) {
          if (theFile.name.toLowerCase().indexOf(".xslt")!==-1) {
             localStorage.setItem("xslt",e.target.result);
          }  else {
             alert('El Xslt de la factura electronica debe de contar con extension xslt');
             return false;
          }};
         })('cadenaoriginal_3_3.xslt');
     reader.readAsText('cadenaoriginal_3_3.xslt');
  }

  this.damecertificadofiel = () => {
       this.cer=this.publica.cer.substring(this.publica.cer.indexOf('base64,')+7);
       this.cer1=this.cer;
       this.cer="-----BEGIN CERTIFICATE-----"+this.cer.chunkString(64)+"-----END CERTIFICATE-----";
       var pki = forge.pki;
       try {var rce=pki.certificateFromPem(this.cer);} catch (err) { alert ('Error al leer el certificado de la firma electronica'+err); return false;}
       rce.certificado=this.cer1;
       return rce;
  }

  this.validafiellocal = async (pwd,cadena='prueba') =>
  {
       var x = await this.validaprivada(pwd,cadena).then( ret => {
              console.log('[validafiellocal] termino validaprivada');
	      if (ret.ok) {
		  var md = forge.md.sha256.create();
		  md.update(cadena);
		  try {var firmado=btoa(this.rk.sign(md));} catch(err) { alert(err); return false; }
		  var certificado=this.damecertificadofiel();
		  var actual=new Date().toISOString();
		  if (actual>certificado.validity.notAfter.toJSON() || actual<certificado.validity.notBefore.toJSON()) {
		    return { 'ok'  : false, "msg" : "La firma electrónica no esta vigente" }
		  }
		  if (typeof(certificado)=='object') {
		     md = forge.md.sha256.create();
		     md.update(cadena);
		     var esValido = certificado.publicKey.verify(md.digest().bytes(),atob(firmado));
		     if (esValido) {
                        insertaOActualizaFiel(certificado.subject.attributes[5].value,"rfc").then( x => {;
                                     insertaOActualizaFiel(certificado.subject.attributes[0].value,"nombre");
			});
			console.log('[validaprivada] va a retornar que es valida la firma'); 
			return { 'ok'  : true, "msg" : "La firma electronica es correcta", nombre: certificado.subject.attributes[0].value
											 , rfc   : certificado.subject.attributes[5].value
											 , curp   : certificado.subject.attributes[6].value
											 , email   : certificado.subject.attributes[4].value
											 , emisor   : certificado.issuer.attributes[0].value
											 , desde   : certificado.validity.notBefore.toJSON()
											 , hasta   : certificado.validity.notAfter.toJSON()
											 , cer: certificado.certificado
											 , sellogen : firmado
			       };
		     } return { 'ok'  : false, "msg" : "La Firma electronica es incorrecta" };
		  } else { return { 'ok'  : false, "msg" : "El certificado es erroneo" }; }
	      } else { return  { 'ok'  : false, "msg" : "La contraseña de la llave privada es erronea "}; }
       }).then( 
	       x => { console.log('validaprivada] va a retornar'); return x }
       );
       return x;
  }

  this.validafielSAT = async (pwd) =>
  {
	  console.log('[validafielSAT]');
	  var x = new DescargaMasivaSat();
  }


  /** lee el certificado o la llave publica **/
  this.leefiel = function (evt)
  {
     console.log('leefiel empezo'+JSON.stringify(evt.target.files[0]));
     var reader = new FileReader();
     reader.onload = (function(theFile) {
          return function(e) {
                  console.log('empezo onload'+theFile.name);
                  var namelen='';
		  if (theFile.name.indexOf(".cer")!==-1) {
		     localStorage.setItem("cer",e.target.result);
                     namelen=theFile.name.length;
		     localStorage.setItem("cer_name",(namelen>20 ? theFile.name.substring(namelen-20,namelen) : theFile.name));
		  } else {
		  if (theFile.name.indexOf(".key")!==-1) {
		     localStorage.setItem("key",e.target.result);
                     namelen=theFile.name.length;
		     localStorage.setItem("key_name",(namelen>20 ? theFile.name.substring(namelen-20,namelen) : theFile.name));
		  } else {
		     alert('La firma digital debe de contar con extension cer y key');
		     return false;
		  }};
                  console.log('termino onload '+theFile.name);
        };
      })(evt.target.files[0]);

      reader.onloadend = function () {
          console.log('leefiel termino de cargar');
      }
      reader.readAsDataURL(evt.target.files[0]);
     console.log('leefiel paso'+evt.target.files[0]);
  }

  this.leefielkey = (evt) =>
  {
     console.log('leefielkey empezo'+JSON.stringify(evt.target.files[0]));
     var reader = new FileReader();
     reader.onload = (function(theFile) {
          return function(e) {
                  console.log('empezo onload'+theFile.name);
                  if (theFile.name.indexOf(".cer")!==-1) {
                     localStorage.setItem("cer",e.target.result);
                     localStorage.setItem("cer_name",theFile.name);
                  } else {
                  if (theFile.name.indexOf(".key")!==-1) {
                     localStorage.setItem("key",e.target.result);
                     localStorage.setItem("key_name",theFile.name);
                  } else {
                     alert('La firma digital debe de contar con extension cer y key');
                     return false;
                  }};
                  console.log('termino onload '+theFile.name);
        };
      })(evt.target.files[0]);

      reader.onloadend = function () {
          console.log('leefielkey termino de cargar');
          /* cargofiel();        * cahce si se cargo la file */
      }
      reader.readAsDataURL(evt.target.files[0]);
     console.log('leefielkey paso'+evt.target.files[0]);
  }


  this.firmacadena = function(cadena)
  {
        this.rk.updateString(cadena);
        return this.rk.sign();
  }

  this.damecertificado = function()
  {
        return this.cer1;
  }

  this.damecertiJson = function(certi) {
     var nombre=certi.subject.attributes.filter(d => d.type==="2.5.4.3" );
     var rfc=certi.subject.attributes.filter(d => d.type==="2.5.4.45");
     var curp=certi.subject.attributes.filter(d => d.type==="2.5.4.5");
     var email=certi.subject.attributes.filter(d => d.type==="1.2.840.113549.1.9.1");
     return { 
                 nombre: nombre.length===1 ? nombre[0].value : ''
        	 , rfc   : rfc.length===1 ? rfc[0].value : ''
		 , curp   : curp.length===1 ? curp[0].value : ''
		 , email   : email.length===1 ? email[0].value : ''
		 , emisor   : certi.issuer.attributes[0].value
		 , desde   : certi.validity.notBefore.toJSON()
		 , hasta   : certi.validity.notAfter.toJSON()

                            }
  }



  this.firmafael = function ()
  {
       var fael=atob(localStorage.getItem('xml').substring(localStorage.getItem('xml').indexOf('base64,')+7));
       fael=fael.replace(/[\s\S]+<\?xml/, '<?xml');
       var faelxml=this.StringToXMLDom(fael);
       //faelxsd=this.loadXMLDoc("xslt/cadenaoriginal_3_3.xslt");
       var faelxsd=cadenaoriginal_3_3;
       var cadena=this.damecadena(faelxml,faelxsd); 
       this.validaprivada('xxxxxxx',cadena);
       var md = forge.md.sha256.create();
       md.update(cadena);
       try {var firmado=btoa(this.rk.sign(md));} catch(err) { alert(err); return false; }
       return firmado;
  }

  this.validaprivada = async (pwd,cadena='prueba') =>
  {
       if(pwd==="")
       { return { ok: false, msg:'La contraseña es obligatorio' } }

       if (this.privada.key===null) {
		        return { ok: false, msg:'La llave privada no esta definida'}
       }

       if (this.publica.cer===null) {
                       return { ok: false, msg:'El certificado no esta definido'} 
       }

       var pki = forge.pki;
       var pk=this.privada.key.substring(this.privada.key.indexOf('base64,')+7);
       pk="-----BEGIN ENCRYPTED PRIVATE KEY-----\r\n"+pk.chunkString(64)+"-----END ENCRYPTED PRIVATE KEY-----";
       try {
            this.rk=pki.decryptRsaPrivateKey(pk,pwd);
           } catch (err) {
             return { ok: false, msg:err}}
       if (!this.rk) return { ok: false, msg:'No checa la firma' } ;
       return { ok: true, msg:'La fiel es correcta' };
  }


  this.damefaelxml = (valor='') => {
       valor='xml'+(valor!=='' ? '_'+valor : '');
       if (localStorage.getItem(valor)==null) {
             throw new Error('Falta ubicar la factura electrónica');
       }
       var fael=atob(localStorage.getItem(valor).substring(localStorage.getItem(valor).indexOf('base64,')+7));
       fael=fael.replace(/[\s\S]+<\?xml/, '<?xml');
       var faelxml=this.StringToXMLDom(fael);
       return faelxml;
  }
  this.damefaelxmltxt = (valor) => {
       valor='xmltxt' + (valor!=='' ? '_'+valor : '')
       var fael=localStorage.getItem(valor);
       fael=fael.replace(/[\s\S]+<\?xml/, '<?xml');
       var faelxml=this.StringToXMLDom(fael);
       return faelxml;
  }


  this.dameesquema = (faelxml,variable) => {
       var esquema=faelxml.getElementsByTagName("cfdi:Comprobante")[0].getAttribute(variable);
       return esquema; 
  }

  this.validafael = (valor) => 
  {
    try {
       var faelxml=this.damefaelxml(valor);
       var faelxsd=cadenaoriginal_3_3;
       var faelxmltxt=this.damefaelxmltxt(valor);
       var cadena=this.damecadena(faelxml,faelxsd);
       var certificado=this.damecertificadofael(valor);
       if (typeof(certificado)==='object') {
          if ('ok' in certificado && certificado.ok===false) {
             return certificado;
          }
          var md = forge.md.sha256.create();
          md.update(cadena); 
          var sello=this.damesello(faelxml);
          if (!sello) {
               return { 'ok' : false, 'msg' : 'No se localizo el sello en la factura' }
          }
          var esValido = certificado.publicKey.verify(md.digest().bytes(),atob(sello));
          if (esValido) {
               var jsonText = this.xmlToJson(faelxmltxt);
               var certijson=this.damecertiJson(certificado);
               return { 'ok' : true, 'msg' : "Factura electrónica valida" ,'certijson' : certijson,'faeljson':jsonText}; 
           } return { 'ok' : false, 'msg' : "Factura electrónica no valida" };
       } else { return { 'ok' : false, 'msg' : "No puede leer el certificado" };  }
    } catch (err) { return { 'ok' : false, 'msg' : err.message };}
  }

  this.damesello =  (xml) =>
  {
       var sello=xml.getElementsByTagName("cfdi:Comprobante")[0].getAttribute("Sello");
       return sello;
  }

  this.damecertificadofael = (valor='') =>
  {
       valor='xml'+(valor!=='' ? '_'+valor : '');
       var fael=atob(localStorage.getItem(valor).substring(localStorage.getItem(valor).indexOf('base64,')+7));
       fael=fael.replace(/[\s\S]+<\?xml/, '<?xml');
       var xml=this.StringToXMLDom(fael);
       var certi=xml.getElementsByTagName("cfdi:Comprobante")[0].getAttribute("Certificado");
       var version=xml.getElementsByTagName("cfdi:Comprobante")[0].getAttribute("version");
       if (!version) {
          version=xml.getElementsByTagName("cfdi:Comprobante")[0].getAttribute("Version");
          if (!version) {
              return { 'ok' : false , 'msg' : 'No se encontro la version de la factura electrónica' }
          }
       }
       if (version!=='3.3') {
          return { 'ok' : false , 'msg' : 'Solo se valida factura electrónica con version 3.3' }
       }
       if (!certi) {
           certi=xml.getElementsByTagName("cfdi:Comprobante")[0].getAttribute("certificado");
           if (!certi) {
               return { 'ok' : false , 'msg' : 'No se encontro un certificado en la factura' }
           }
       }
       var cert="-----BEGIN CERTIFICATE-----"+certi.chunkString(64)+"-----END CERTIFICATE-----";
       var pki = forge.pki;
       try {var rce=pki.certificateFromPem(cert);} catch (err) { alert ('Error al leer el certificado de la factura electronica'+err); return false;}
       return rce;
  }


  this.damecadena = (xml,xsd) =>
  {
     if (window.ActiveXObject || "ActiveXObject" in window) {
        this.ie();
     } else {
       if (document.implementation && document.implementation.createDocument) {
         var xsltProcessor = new XSLTProcessor();
         xsltProcessor.importStylesheet(xsd);
         var resultDocument = xsltProcessor.transformToDocument(xml, document);
         //var serializer = new XMLSerializer();
         //var transformed = serializer.serializeToString(resultDocument.documentElement);
         //alert(transformed);
         return resultDocument.documentElement.innerText.trim();
      }
    }
  }

        /* funcion para cargar los XSLT del SAT */
        this.loadXMLDoc = (filename) => {
                if (window.ActiveXObject) {
                     var xhttp = new window.ActiveXObject("Msxml2.XMLHTTP");
                } else {
                     xhttp = new XMLHttpRequest();
                }
                xhttp.open("GET", filename, false);
                xhttp.send("");
                return xhttp.responseXML;
        }

        this.StringToXMLDom = (string) =>{
             var xmlDoc=null;
             if (window.DOMParser)
             {
                var parser=new DOMParser();
                xmlDoc=parser.parseFromString(string,"text/xml");
		    if(this.isParseError(xmlDoc)) {
			throw new Error('La factura electrónica no tiene un formato XML');
		    }
             }
             else // Internet Explorer
             {
                xmlDoc=new window.ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.async="false";
                xmlDoc.loadXML(string);
             }
             return xmlDoc;
        }

	this.isParseError = (parsedDocument) => {
	    // parser and parsererrorNS could be cached on startup for efficiency
	    var parser = new DOMParser(),
		errorneousParse = parser.parseFromString('<', 'application/xml'),
		parsererrorNS = errorneousParse.getElementsByTagName("parsererror")[0].namespaceURI;

	    if (parsererrorNS === 'http://www.w3.org/1999/xhtml') {
		// In PhantomJS the parseerror element doesn't seem to have a special namespace, so we are just guessing here :(
		return parsedDocument.getElementsByTagName("parsererror").length > 0;
	    }

	    return parsedDocument.getElementsByTagNameNS(parsererrorNS, 'parsererror').length > 0;
	};

	this.xml2json = (xml) => {
		  try {
		    var obj = {};
		    if (xml.children.length > 0) {
		      for (var i = 0; i < xml.children.length; i++) {
			var item = xml.children.item(i);
			var nodeName = item.nodeName;

			if (typeof (obj[nodeName]) == "undefined") {
			  obj[nodeName] = this.xml2json(item);
			} else {
			  if (typeof (obj[nodeName].push) == "undefined") {
			    var old = obj[nodeName];

			    obj[nodeName] = [];
			    obj[nodeName].push(old);
			  }
			  obj[nodeName].push(this.xml2json(item));
			}
		      }
		    } else {
		      obj = xml.textContent;
		    }
		    return obj;
		  } catch (e) {
		      console.log(e.message);
		  }
	}
	// Changes XML to JSON
	this.xmlToJson= (xml) => {
		
		// Create the return object
		var obj = {};

		if (xml.nodeType === 1) { // element
			// do attributes
			if (xml.attributes.length > 0) {
			obj["@attributes"] = {};
				for (var j = 0; j < xml.attributes.length; j++) {
					var attribute = xml.attributes.item(j);
					obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
				}
			}
		} else if (xml.nodeType === 3) { // text
			obj = xml.nodeValue;
		}

		// do children
		if (xml.hasChildNodes()) {
			for(var i = 0; i < xml.childNodes.length; i++) {
				var item = xml.childNodes.item(i);
				var nodeName = item.nodeName;
				if (typeof(obj[nodeName]) == "undefined") {
					obj[nodeName] = this.xmlToJson(item);
				} else {
					if (typeof(obj[nodeName].push) == "undefined") {
						var old = obj[nodeName];
						obj[nodeName] = [];
						obj[nodeName].push(old);
					}
					obj[nodeName].push(this.xmlToJson(item));
				}
			}
		}
		return obj;
        };


}

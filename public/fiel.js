var fiel = function()
{

  this.wlrfc = ""; // rfc
  this.llaves = "";
  this.rk = "";
  this.cer = "";
  this.cer1 = "";
  this.creainputfile = function (ext) {
        var doc = document;
        var _desc = doc.createElement( "input" );
        _desc.className = "foco";
        _desc.setAttribute("type", "file");
        _desc.setAttribute("title", "hola");
        _desc.setAttribute("name", "ficheroin");
        _desc.setAttribute("id", "ficheroin");
        _desc.setAttribute("value", "jala");
        _desc.setAttribute("accept", ext);
        _desc.setAttribute("size", "30");
        return _desc;
  }

  this.leefael = function (evt)
  {
     var reader = new FileReader();
     reader.onload = (function(theFile) {
          return function(e) {
          if (theFile.name.toLowerCase().indexOf(".xml")!=-1) {
             localStorage.setItem("xml",e.target.result);
          }  else {
             alert('La factura electronica debe de contar con extension xml');
             return false;
          }};
         })(evt.target.files[0]);

      reader.onloadend = function () {
          /* cargofael(); checa si ya esta cargada la factura electronica */
      }

     reader.readAsDataURL(evt.target.files[0]);
  }

  this.leefael_xslt = function (evt)
  {
     var reader = new FileReader();
     reader.onload = (function(theFile) {
          return function(e) {
          if (theFile.name.toLowerCase().indexOf(".xslt")!=-1) {
             localStorage.setItem("xslt",e.target.result);
          }  else {
             alert('El Xslt de la factura electronica debe de contar con extension xslt');
             return false;
          }};
         })('cadenaoriginal_3_3.xslt');
     reader.readAsText('cadenaoriginal_3_3.xslt');
  }


  this.leefiel = function (evt)
  {
     var reader = new FileReader();
     reader.onload = (function(theFile) {
          return function(e) {
          if (theFile.name.indexOf(".cer")!=-1) {
             localStorage.setItem("cer",e.target.result);
          } else {
          if (theFile.name.indexOf(".key")!=-1) {
             localStorage.setItem("key",e.target.result);
          } else {
             alert('La firma digital debe de contar con extension cer y key');
             return false;
          }};
        };
      })(evt.target.files[0]);

      reader.onloadend = function () {
          /* cargofiel();        * cahce si se cargo la file */
      }
      reader.readAsDataURL(evt.target.files[0]);
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

  this.validaprivada = function(pwd,cadena='prueba')
  {
       if(pwd=="")
       { alert('El password es obligatorio'); return false; }
       if(localStorage.getItem('key')==null)
       { alert('La llave privada no esta definida'); return false; }
       if(localStorage.getItem('cer')==null)
       { alert('El certificado no esta definido'); return false; }
       var pki = forge.pki;
       pk=localStorage.getItem('key').substring(localStorage.getItem('key').indexOf('base64,')+7);
       pk="-----BEGIN ENCRYPTED PRIVATE KEY-----\r\n"+pk.chunkString(64)+"-----END ENCRYPTED PRIVATE KEY-----";
       try {
            this.rk=pki.decryptRsaPrivateKey(pk,pwd);
           } catch (err) {
             return false;} ;
       if (!this.rk) return false ;
       return true;
  }

  this.validafiellocal = function(pwd,cadena='prueba')
  {
       if (this.validaprivada(pwd,cadena)) {
          var md = forge.md.sha256.create();
          md.update(cadena);
          try {var firmado=btoa(this.rk.sign(md));} catch(err) { alert(err); return false; }
          console.log('Firmado='+firmado);
          var certificado=this.damecertificadofiel();
          if (typeof(certificado)=='object') {
             var md = forge.md.sha256.create();
             md.update(cadena);
             var esValido = certificado.publicKey.verify(md.digest().bytes(),atob(firmado));
             if (esValido) {
                return { 'ok'  : true, "msg" : "La firma electronica es correcta", nombre: certificado.subject.attributes[0].value
                                                                                 , rfc   : certificado.subject.attributes[5].value
                                                                                 , curp   : certificado.subject.attributes[6].value
                                                                                 , email   : certificado.subject.attributes[4].value
                                                                                 , emisor   : certificado.issuer.attributes[0].value
                                                                                 , desde   : certificado.validity.notBefore.toJSON()
                                                                                 , hasta   : certificado.validity.notAfter.toJSON()
                                                                                 , cer: certificado};
             } return { 'ok'  : false, "msg" : "La Firma electronica es incorrecta" };
          } else { return { 'ok'  : false, "msg" : "El certificado es erroneo" }; }
      } else { return  { 'ok'  : false, "msg" : "El password de la llave privada es erronea "}; }
  }

  /* carga la factura electoronica */
  this.cargafael = function ()
  {
     var x = this.creainputfile("*.xml");
     x.addEventListener('change',this.leefael,false);
     x.click();
     return true;
  }

  this.firmafael = function ()
  {
       fael=atob(localStorage.getItem('xml').substring(localStorage.getItem('xml').indexOf('base64,')+7));
       fael=fael.replace(/[\s\S]+<\?xml/, '<?xml');
       faelxml=StringToXMLDom(fael);
       faelxsd=loadXMLDoc("xslt/cadenaoriginal_3_3.xslt");
       var cadena=this.damecadena(faelxml,faelxsd); 
       this.validaprivada('888aDantryR',cadena);
       var md = forge.md.sha256.create();
       md.update(cadena);
       try {var firmado=btoa(this.rk.sign(md));} catch(err) { alert(err); return false; }
       alert('Firmado='+firmado);
  }

  this.damefaelxml = function () {
       fael=atob(localStorage.getItem('xml').substring(localStorage.getItem('xml').indexOf('base64,')+7));
       fael=fael.replace(/[\s\S]+<\?xml/, '<?xml');
       faelxml=StringToXMLDom(fael);
       return faelxml;
  }

  this.validafael = function ()
  {
    try {
       faelxsd=loadXMLDoc("xslt/cadenaoriginal_3_3.xslt");
       faelxml=this.damefaelxml();
       var cadena=this.damecadena(faelxml,faelxsd);
       var certificado=this.damecertificadofael();
       if (typeof(certificado)=='object') {
          var md = forge.md.sha256.create();
          md.update(cadena); 
          var sello=this.damesello(faelxml);
          var esValido = certificado.publicKey.verify(md.digest().bytes(),atob(sello));
          if (esValido) {
               return { 'ok' : true, 'msg' : "factura Electronica Valida" }; 
           } return { 'ok' : false, 'msg' : "factura Electronica No Valida" };
       } else { return { 'ok' : false, 'msg' : "No puede leer el certificado" };  }
    } catch (err) { return { 'ok' : false, 'msg' : err.message };}
  }

  this.damesello = function (xml)
  {
       var sello=xml.getElementsByTagName("cfdi:Comprobante")[0].getAttribute("Sello");
       return sello;
  }

  this.damecertificadofael = function ()
  {
       fael=atob(localStorage.getItem('xml').substring(localStorage.getItem('xml').indexOf('base64,')+7));
       fael=fael.replace(/[\s\S]+<\?xml/, '<?xml');
       xml=StringToXMLDom(fael);
       var certi=xml.getElementsByTagName("cfdi:Comprobante")[0].getAttribute("Certificado");
       var cert="-----BEGIN CERTIFICATE-----"+certi.chunkString(64)+"-----END CERTIFICATE-----";
       var pki = forge.pki;
       try {rce=pki.certificateFromPem(cert);} catch (err) { alert ('Error al leer el certificado de la factura electronica'+err); return false;}
       return rce;
  }

  this.damecertificadofiel = function ()
  {
       this.cer=localStorage.getItem('cer').substring(localStorage.getItem('cer').indexOf('base64,')+7);
       this.cer1=this.cer;
       this.cer="-----BEGIN CERTIFICATE-----"+this.cer.chunkString(64)+"-----END CERTIFICATE-----";
       var pki = forge.pki;
       try {rce=pki.certificateFromPem(this.cer);} catch (err) { alert ('Error al leer el certificado de la firma electronica'+err); return false;}
       return rce;
  }



  this.damecadena = function (xml,xsd)
  {
     if (window.ActiveXObject || "ActiveXObject" in window) {
        this.ie();
     } else {
       if (document.implementation && document.implementation.createDocument) {
         xsltProcessor = new XSLTProcessor();
         xsltProcessor.importStylesheet(xsd);
         resultDocument = xsltProcessor.transformToDocument(xml, document);
         var serializer = new XMLSerializer();
         //var transformed = serializer.serializeToString(resultDocument.documentElement);
         //alert(transformed);
         return resultDocument.documentElement.innerText.trim();
      }
    }
  }

  this.cargafiellocal = function ()
  {
     var x = this.creainputfile(".cer");
     x.addEventListener('change',this.leefiel,false);
     x.click();
     var y = this.creainputfile(".key");
     y.addEventListener('change',this.leefiel,false);
     y.click();
     return false;
  }
}

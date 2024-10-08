var cargaFael = function()
{

  /* carga la factura electoronica */
  this.cargafael = function()
  {
     var x = this.creainputfile("*.xml");
     x.addEventListener('change',this.leefael,false);
     x.click();
     return true;
  }

  this.leefael = function (evt)
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

  this.leefael_xslt = function(evt)
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

}

var cargaFiel = function (){

  this.rk = "";
  this.cer = "";
  this.cer1 = "";

  /** da el click al elemento input para poder seleccionar el archivo **/
  this.cargafiellocal = function (ext)
  {
     console.log('cargafiellocal empezo cambio  akey');
     var x = this.creainputfile("."+ext);
     x.addEventListener('change',this.leefiel,false);
     x.click();
     console.log('cargafiellocal termino');
     return {file:x};
 }

   /** crea el input file **/
   this.creainputfile = function(ext) {
    try {
        var doc = document;
        var _desc = doc.createElement( "input" );
        _desc.className = "foco";
        _desc.setAttribute("type", "file");
        _desc.setAttribute("title", "hola");
        _desc.setAttribute("name", "ficheroin"+ext);
        _desc.setAttribute("id", "ficheroin"+ext);
        _desc.setAttribute("value", null);
        _desc.setAttribute("accept", ext);
        _desc.setAttribute("size", "255");
        _desc.setAttribute("multiple", true);
        console.log('creainputfile va a regresar'+ext);
        return _desc;
    } catch (err) { console.error('hubo errror en creainputfile'+err.message); }
  }

  /** lee el certificado el certificado y lo guarda en localstorage o indexdb **/
  this.leefiel = function(evt)
  {
     console.log('[cargaFiel] leefiel empezo'+JSON.stringify(evt.target.files[0]));
     var reader = new FileReader();
     reader.onload = (function(theFile) {
          return function(e) {
                  console.log('empezo onload'+theFile.name);
                  var namelen='';
                  if (theFile.name.indexOf(".cer")!==-1) {
                     var namelen=theFile.name.length;
                     var obj= { "cer":e.target.result, "cer_name":(namelen>20 ? theFile.name.substring(namelen-20,namelen) : theFile.name) }
                     insertaOActualizaFiel(obj,'publica');
                  } else {
                  if (theFile.name.indexOf(".key")!==-1) {
                     var namelen=theFile.name.length;
                     var obj= { "key":e.target.result, "key_name":(namelen>20 ? theFile.name.substring(namelen-20,namelen) : theFile.name) }
                     insertaOActualizaFiel(obj,'privada');
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

}

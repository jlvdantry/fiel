var  TC = { I:'Ingreso', E:'Egreso',N:'Nomina',P:'Pagos',T:'Trapaso' }; /* tipo de comprobante */
var  MENUS = { DESCARGAMASIVA:'1'  };
var  FORMA = { DESCARGAMASIVA:'1'  };
var  MOVIMIENTO = { AUTENTICA:'11',SOLICITUD:'12',VERIFICA:'13',DESCARGA:'14'  };   /* moviento requerido ante el sat */
var  ESTADOREQ = { 'INICIAL':MOVIMIENTO, 'AUTENTICADO':10 , 'RESPUESTADESCONOCIDA':99, 'RECIBIDO':1,'ERROR':500,'ACEPTADO':5000,'REQUIRIENDO':2,'TOKENINVALIDO':300,'VERIFICANDO':5001,'DESCARGADO':5002};  /* Estado del requerimiento */
var  TOKEN = { TIMELIVE : 5, ACTIVO:1, CADUCADO:0, NOGENERADO:2, NOSOLICITADO:3 }   // tiempo en que vigente el token proporcionado por el SAT, para controlar si esta aun viente el token
     // NOGENERADO ya se solicito pero aun no se ha generado
     // NOSOLICITADO no se ha solicitado
var  REVISA = { VIGENCIATOKEN : 10, ESTADOREQ:60 }; // segundos
var  PWDFIEL = null;   /* password de la llave privada */

var  TC = { I:'Ingreso', E:'Egreso',N:'Nomina',P:'Pagos',T:'Trapaso' };
var  MENUS = { DESCARGAMASIVA:'1'  };
var  FORMA = { DESCARGAMASIVA:'1'  };
var  MOVIMIENTO = { AUTENTICA:'1',SOLICITUD:'2',VERIFICA:'3',DESCARGA:'4'  };
var  ESTADOREQ = { INICIAL:0, AUTENTICADO:10 , RESPUESTADESCONOCIDA:99, RECIBIDO:1,ERROR:500,ACEPTADO:5000,REQUIRIENDO:2};  /* Estado del requerimiento */
var  TOKEN = { TIMELIVE : 5 }   // tiempo en que vigente el token proporcionado por el SAT, para controlar si esta aun viente el token
var  REVISA = { VIGENCIATOKEN : 60, ESTADOREQ:20 } // revisa la vigencia del token ante el sat cada 60 segundos
var  PWDFIEL = null;
//export { TC,MENUS,FORMA,MOVIMIENTO,ESTADOREQ }

var  TC = { I:'Ingreso', E:'Egreso',N:'Nomina',P:'Pagos',T:'Trapaso' };
var  MENUS = { DESCARGAMASIVA:'1'  };
var  FORMA = { DESCARGAMASIVA:'1'  };
var  MOVIMIENTO = { AUTENTICA:'1',SOLICITUD:'2',VERIFICA:'3',DESCARGA:'4'  };
var  ESTADOREQ = { INICIAL:0, AUTENTICADO:10 , RESPUESTADESCONOCIDA:99, RECIBIDO:1,ERROR:500};  /* Estado del requerimiento */
var  REVISA = { VIGENCIATOKEN : 60 } // segundos
export { TC,MENUS,FORMA,MOVIMIENTO,ESTADOREQ,REVISA }

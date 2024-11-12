var  TC = { I:'Ingreso', E:'Egreso',N:'Nomina',P:'Pagos',T:'Trapaso' }; /* tipo de comprobante */
var  MENUS = { DESCARGAMASIVA:'1'  };
var  FORMA = { DESCARGAMASIVA:'1'  };
var  MOVIMIENTO = { AUTENTICA:'11',SOLICITUD:'12',VERIFICA:'13',DESCARGA:'14'  };   /* moviento requerido ante el sat */
var  ESTADOREQ = { 
          INICIAL:MOVIMIENTO
	, AUTENTICADO:'10' 
        , SOLICITUDTERMINADA : '123'
        , VERIFICACIONTERMINADA : '124'
        , SOLICITUDSININFORMACION : '125'
	, RESPUESTADESCONOCIDA:'99'
	, RECIBIDO:'1'   /* recibio respuesta del servidor */
	, ERROR:'500'
	, ACEPTADO:5000   /* la solicitud y/o verificacion fue aceptada por el sat */
	, REQUIRIENDO:'2'   /* se va a requerir  el servicor */
	, TOKENINVALIDO:'300'
	, VERIFICANDO:'5001' /* estado de la verificacion antes de enviar la verficacion  */
	, DESCARGADO:'5002'
	, INSERTADO:'0'  /* Insertardo el requerimiento localmente */
	}; /* Estado del requerimiento */

var  TOKEN = { TIMELIVE : 5, ACTIVO:1, CADUCADO:301, NOGENERADO:2, NOSOLICITADO:3 }   // tiempo en que vigente el token proporcionado por el SAT, para controlar si esta aun viente el token
     // NOGENERADO ya se solicito pero aun no se ha generado
     // NOSOLICITADO no se ha solicitado
var  REVISA = { 
	  VIGENCIATOKEN : 1 /* cada cuando se revisa si el token esta vigente */
	, ESTADOREQ:30   /* cada cuando se revisa el estado del requerimiento */
              }; // segundos
var  PWDFIEL = null;   /* password de la llave privada */
var VERSION='1.0.289';

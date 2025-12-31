var  TC = { I:'Ingreso', E:'Egreso',N:'Nomina',P:'Pagos',T:'Trapaso' }; /* tipo de comprobante */
var  MENUS = { DESCARGAMASIVA:'1'  };
var  FORMA = { DESCARGAMASIVA:'1'  };
var  MOVIMIENTO = { AUTENTICA:'11',SOLICITUD:'12',VERIFICA:'13',DESCARGA:'14'  };   /* moviento requerido ante el sat */
var  ESTADOSOLICITUD = { 
	ACEPTADA:1
	,ENPROCESO:2
	,TERMINADA:3
	,ERROR:4
	,RECHAZADA:5
	,VENCIDA:6
}

var  ESTADOREQ = { 
          INICIAL:MOVIMIENTO
	, AUTENTICADO:'10' 
        , SOLICITUDTERMINADA : '123'
        , SOLICITUDPENDIENTEDOWNLOAD : '127'
        , SOLICITUDDESCARGANDO : '128'
        , SOLICITUDVENCIDA : '126'
        , VERIFICACIONTERMINADA : '124'
        , SOLICITUDSININFORMACION : '125'
	, RESPUESTADESCONOCIDA:'99'
	, RECIBIDO:'1'   /* recibio respuesta del servidor */
	, ERROR:500
	, SOLICITUDACEPTADA:'5000'   /* desde la version 1.5 este estats lo maneja la solicitud asi como la verificacion */
	, REQUIRIENDO:'2'   /* se va a requerir  el servicor */
	, TOKENINVALIDO:'300'
	, VERIFICANDO:'5001' /* estado de la verificacion antes de enviar la verficacion  */
	, DESCARGADO:'5002'
	, INSERTADO:'0'  /* Insertardo el requerimiento localmente */
	, ERRORFETCH:'5003'
	}; /* Estado del requerimiento */

var  TOKEN = { TIMELIVE : 5, ACTIVO:1, CADUCADO:301, NOGENERADO:2, NOSOLICITADO:3 }   // tiempo en que vigente el token proporcionado por el SAT, para controlar si esta aun viente el token
     // NOGENERADO ya se solicito pero aun no se ha generado
     // NOSOLICITADO no se ha solicitado
var  REVISA = { 
	  VIGENCIATOKEN   : 1 /* cada cuando se revisa si el token esta vigente en el cargafaelMasiva browser en segundos */
	, ESTADOREQ       :20   /* cada cuando se revisa el estado del requerimiento en segundos */
	, VIGENCIATOKEN_SW:10   /* revisa si el token esta activo caso contrario intenta conectarse en el sw en segundos */
              }; // segundos
var  PWDFIEL = null;   /* password de la llave privada */
var  REQUIRIENDOMINUTOS = 1 ; /* si el tiempo de duracion del requerimiento es mayor a este se borra */
var VERSION='1.0.556.17';
var ENDPOINTSSAT = { AUTENTICA:'https://cfdidescargamasivasolicitud.clouda.sat.gob.mx/Autenticacion/Autenticacion.svc'
	            ,SOLICITUD:'https://cfdidescargamasivasolicitud.clouda.sat.gob.mx/SolicitaDescargaService.svc'
	            ,VERIFICA: 'https://cfdidescargamasivasolicitud.clouda.sat.gob.mx/VerificaSolicitudDescargaService.svc'
	            ,DESCARGA: 'https://cfdidescargamasiva.clouda.sat.gob.mx/DescargaMasivaService.svc'  };

var SOAPACTION = {   AUTENTICA:'http://DescargaMasivaTerceros.gob.mx/IAutenticacion/Autentica'
	            ,SOLICITUDRECIBIDOS:'http://DescargaMasivaTerceros.sat.gob.mx/ISolicitaDescargaService/SolicitaDescargaRecibidos'
	            ,SOLICITUDEMITIDOS:'http://DescargaMasivaTerceros.sat.gob.mx/ISolicitaDescargaService/SolicitaDescargaEmitidos'
	            ,SOLICITUDFOLIO:'http://DescargaMasivaTerceros.sat.gob.mx/ISolicitaDescargaService/SolicitaDescargaFolio'
	            ,VERIFICA: 'http://DescargaMasivaTerceros.sat.gob.mx/IVerificaSolicitudDescargaService/VerificaSolicitudDescarga'
	            ,DESCARGA: 'http://DescargaMasivaTerceros.sat.gob.mx/IDescargaMasivaTercerosService/Descargar'
}

export function  ExtraeComprobantes(fact,RFC) {
		 var datosFactura=fact.map( (x,index) => {
			 try {
		
			       var datoFactura={};
			       var descripcion='';
			       var ivaAcreditado=0;
			       var ivaCobrado=0;
			       var iva=0;
			       var ingreso='desconocido', egreso='desconocido';
			       var tc=x.value.passdata["cfdi:Comprobante"]["@attributes"].TipoDeComprobante;
			       var rfcEmisor=x.value.passdata["cfdi:Comprobante"]["cfdi:Emisor"]["@attributes"].Rfc;
			       var rfcReceptor=x.value.passdata["cfdi:Comprobante"]["cfdi:Receptor"]["@attributes"].Rfc;
			       var total=Number(x.value.passdata["cfdi:Comprobante"]["@attributes"].Total).toLocaleString('en-US');

                               if (x.value.passdata["cfdi:Comprobante"].hasOwnProperty("cfdi:Impuestos")) {
			          try { iva = Number(x.value.passdata["cfdi:Comprobante"]["cfdi:Impuestos"]["@attributes"].TotalImpuestosTrasladados).toLocaleString('en-US') } 
				                catch (err) { iva=0 };
			       }
				const comprobante = x.value.passdata["cfdi:Comprobante"];

				// 1. Extraer Conceptos (Productos/Servicios)
				let conceptos = [];
				if (comprobante["cfdi:Conceptos"] && comprobante["cfdi:Conceptos"]["cfdi:Concepto"]) {
				    const lista = comprobante["cfdi:Conceptos"]["cfdi:Concepto"];
				    // Forzamos a que sea array (si es solo uno, el parser a veces lo da como objeto)
				    const conceptosArray = Array.isArray(lista) ? lista : [lista];
				    
				    conceptos = conceptosArray.map(c => ({
					cantidad: c["@attributes"].Cantidad,
					clave: c["@attributes"].ClaveProdServ,
					descripcion: c["@attributes"].Descripcion,
					valorUnitario: c["@attributes"].ValorUnitario,
					importe: c["@attributes"].Importe,
					unidad: c["@attributes"].Unidad
				    }));
				}

				// 2. Extraer Timbre Fiscal (Para el UUID y Sellos)
				const complemento = comprobante["cfdi:Complemento"];
				const tfd = complemento["tfd:TimbreFiscalDigital"] ? complemento["tfd:TimbreFiscalDigital"]["@attributes"] : {};

				// 3. Extraer Impuestos detallados
				let impuestosTrasladados = [];
				if (comprobante["cfdi:Impuestos"] && comprobante["cfdi:Impuestos"]["cfdi:Traslados"]) {
				    const traslados = comprobante["cfdi:Impuestos"]["cfdi:Traslados"]["cfdi:Traslado"];
				    const trasladosArray = Array.isArray(traslados) ? traslados : [traslados];
				    impuestosTrasladados = trasladosArray.map(imp => ({
					impuesto: imp["@attributes"].Impuesto === '002' ? 'IVA' : imp["@attributes"].Impuesto,
					tasa: imp["@attributes"].TasaOCuota,
					importe: imp["@attributes"].Importe
				    }));
				}

			       var fechaPago=null;
			       if ( x.value.passdata["cfdi:Comprobante"]["cfdi:Conceptos"].length===1 ) {
				  descripcion=x.value.passdata["cfdi:Comprobante"]["cfdi:Conceptos"]["cfdi:Concepto"]["@attributes"].Descripcion;
			       } else { descripcion='Varios conceptos' }
			       if (RFC===rfcReceptor) {
				  if (tc==='E' ) { ingreso=total; egreso=0; ivaAcreditado=0; ivaCobrado=iva; }
				  if (tc==='I' ) { ingreso=0; egreso=total; ivaAcreditado=iva  ; ivaCobrado=0 }
				  if (tc==='N') { ingreso=total; egreso=0;  ivaAcreditado=0  ; ivaCobrado=0 }
				  if (tc==='P') { ingreso=0; egreso=0;  ivaAcreditado=0  ; ivaCobrado=0 }
			       }
			       if (RFC===rfcEmisor) {
				  if (tc==='E' ) { ingreso=0; egreso=total; ivaAcreditado=iva; ivaCobrado=0; }
				  if (tc==='I') { ingreso=total; egreso=0;  ivaAcreditado=0  ; ivaCobrado=iva}
				  if (tc==='N') { ingreso=0; egreso=total;  ivaAcreditado=0  ; ivaCobrado=0 }
				  if (tc==='P') { ingreso=0; egreso=0;  ivaAcreditado=0  ; ivaCobrado=0 }
			       }
			       if (x.value.passdata["cfdi:Comprobante"]["cfdi:Complemento"].hasOwnProperty("nomina12:Nomina")) {
				       if ( x.value.passdata["cfdi:Comprobante"]["cfdi:Complemento"]["nomina12:Nomina"]["@attributes"]["FechaPago"].length>0 ) {
					  fechaPago=x.value.passdata["cfdi:Comprobante"]["cfdi:Complemento"]["nomina12:Nomina"]["@attributes"].FechaPago
				       }
			       }
			       datoFactura={         "Emisor" : rfcEmisor
						    ,"Nombre Emisor" : x.value.passdata["cfdi:Comprobante"]["cfdi:Emisor"]["@attributes"].Nombre
				                    ,"Nombre Receptor" : x.value.passdata["cfdi:Comprobante"]["cfdi:Receptor"]["@attributes"].Nombre || 'Sin Nombre'
						    ,"Receptor": rfcReceptor
						    ,"Fecha Emision" : x.value.passdata["cfdi:Comprobante"]["@attributes"].Fecha.substring(0,10)
						    ,"Fecha Pago" : fechaPago
						    //,"Descuento" : Number(x.value.passdata["cfdi:Comprobante"]["@attributes"].Descuento).toLocaleString('en-US')
						    ,"Descripcion": descripcion
						    ,"Tipo de Comprobante": x.value.passdata["cfdi:Comprobante"]["@attributes"].TipoDeComprobante
						    ,"Ingreso": ingreso
				                    ,"Iva Cobrado": ivaCobrado
				                    ,"Iva Acreditado": ivaAcreditado
						    ,"Egreso": egreso
						    ,"Subtotal": comprobante["@attributes"].SubTotal
						    ,"Moneda": comprobante["@attributes"].Moneda,
						    "MetodoPago": comprobante["@attributes"].MetodoPago,
						    "LugarExpedicion": comprobante["@attributes"].LugarExpedicion,
						    "SelloCFD": tfd.SelloCFD,
						    "NoCertificadoSAT": tfd.NoCertificadoSAT,
						    "UUID": tfd.UUID, // El ID fiscal completo
						    "Conceptos": conceptos, // <--- LISTA DE PRODUCTOS
						    "Impuestos": impuestosTrasladados, // <--- IVA, IEPS, etc.
						    "Total": total 

						  };
			      return datoFactura;
			 }
			 catch (err) { console.log('[ExtraeComprobantes]  err='+err+" "+JSON.stringify(x.value,true));
			 }
			});
	        //console.log('[ExtraeComprobantes]  datosFactura='+JSON.stringify(datosFactura,true));
	        return datosFactura;
};


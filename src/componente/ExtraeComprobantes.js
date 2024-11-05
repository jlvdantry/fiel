export function  ExtraeComprobantes(fact,RFC) {
			var datosFactura=fact.map( (x) => {
			       var datoFactura={};
			       var descripcion='';
			       var ingreso='desconocido', egreso='desconocido';
			       var tc=x.value.passdata["cfdi:Comprobante"]["@attributes"].TipoDeComprobante;
			       var rfcEmisor=x.value.passdata["cfdi:Comprobante"]["cfdi:Emisor"]["@attributes"].Rfc;
			       var rfcReceptor=x.value.passdata["cfdi:Comprobante"]["cfdi:Receptor"]["@attributes"].Rfc;
			       var total=Number(x.value.passdata["cfdi:Comprobante"]["@attributes"].Total).toLocaleString('en-US');
			       var fechaPago=null;
			       if ( x.value.passdata["cfdi:Comprobante"]["cfdi:Conceptos"].length===1 ) {
				  descripcion=x.value.passdata["cfdi:Comprobante"]["cfdi:Conceptos"]["cfdi:Concepto"]["@attributes"].Descripcion;
			       } else { descripcion='Varios conceptos' }
			       if (RFC===rfcReceptor) {
				  if (tc==='I' ) { ingreso=0; egreso=total; }
				  if (tc==='N') { ingreso=total; egreso=0; }
			       }
			       if (RFC===rfcEmisor) {
				  if (tc==='E' ) { ingreso=0; egreso=total; }
				  if (tc==='I') { ingreso=total; egreso=0; }
				  if (tc==='N') { ingreso=0; egreso=total; }
			       }
			       if (x.value.passdata["cfdi:Comprobante"]["cfdi:Complemento"].hasOwnProperty("nomina12:Nomina")) {
				       if ( x.value.passdata["cfdi:Comprobante"]["cfdi:Complemento"]["nomina12:Nomina"]["@attributes"]["FechaPago"].length>0 ) {
					  fechaPago=x.value.passdata["cfdi:Comprobante"]["cfdi:Complemento"]["nomina12:Nomina"]["@attributes"].FechaPago
				       }
			       }
			       datoFactura={         "Emisor" : rfcEmisor
						    ,"Nombre Emisor" : x.value.passdata["cfdi:Comprobante"]["cfdi:Emisor"]["@attributes"].Nombre
						    ,"Receptor": rfcReceptor
						    ,"Fecha Emision" : x.value.passdata["cfdi:Comprobante"]["@attributes"].Fecha.substring(0,10)
						    ,"Fecha Pago" : fechaPago
						    ,"Descuento" : Number(x.value.passdata["cfdi:Comprobante"]["@attributes"].Descuento).toLocaleString('en-US')
						    ,"Descripcion": descripcion
						    ,"Tipo de Comprobante": x.value.passdata["cfdi:Comprobante"]["@attributes"].TipoDeComprobante
						    ,"Ingreso": ingreso
						    ,"Egreso": egreso
						  };

			      return datoFactura;
			});
	        return datosFactura;
};


import React, {Component} from 'react';
import { leefacturas } from '../db';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip as ReactTooltip } from "react-tooltip";
import { exportToExcel } from "react-json-to-excel";

class ExportaAExcel extends Component {

  exportaExcel(){
        var datosFactura=[];
        leefacturas().then( (cuantas) => {
                datosFactura=cuantas.map( (x) => {
                       var datoFactura={};
                       var descripcion='';
                       var ingreso='desconocido', egreso='desconocido';
                       var tc=x.valor.passdata["cfdi:Comprobante"]["@attributes"].TipoDeComprobante;
                       var rfcEmisor=x.valor.passdata["cfdi:Comprobante"]["cfdi:Emisor"]["@attributes"].Rfc;
                       var rfcReceptor=x.valor.passdata["cfdi:Comprobante"]["cfdi:Receptor"]["@attributes"].Rfc;
                       var total=Number(x.valor.passdata["cfdi:Comprobante"]["@attributes"].Total).toLocaleString('en-US');
                       var fechaPago=null;
                       if ( x.valor.passdata["cfdi:Comprobante"]["cfdi:Conceptos"].length===1 ) {
                          descripcion=x.valor.passdata["cfdi:Comprobante"]["cfdi:Conceptos"]["cfdi:Concepto"]["@attributes"].Descripcion;
                       } else { descripcion='Varios conceptos' }
                       var rfc=localStorage.getItem('rfc');
                       if (rfc===rfcReceptor) {
                          if (tc==='I' ) { ingreso=0; egreso=total; }
                          if (tc==='N') { ingreso=total; egreso=0; }
                       }
                       if (rfc===rfcEmisor) {
                          if (tc==='E' ) { ingreso=0; egreso=total; }
                          if (tc==='I') { ingreso=total; egreso=0; }
                          if (tc==='N') { ingreso=0; egreso=total; }
                       }
                       if (x.valor.passdata["cfdi:Comprobante"]["cfdi:Complemento"].hasOwnProperty("nomina12:Nomina")) {
                               if ( x.valor.passdata["cfdi:Comprobante"]["cfdi:Complemento"]["nomina12:Nomina"]["@attributes"]["FechaPago"].length>0 ) {
                                  fechaPago=x.valor.passdata["cfdi:Comprobante"]["cfdi:Complemento"]["nomina12:Nomina"]["@attributes"].FechaPago
                               }
                       }
                       datoFactura={  "Emisor" : rfcEmisor
                                            ,"Nombre Emisor" : x.valor.passdata["cfdi:Comprobante"]["cfdi:Emisor"]["@attributes"].Nombre
                                            ,"Receptor": rfcReceptor
                                            ,"Fecha Emision" : x.valor.passdata["cfdi:Comprobante"]["@attributes"].Fecha.substring(0,10)
                                            ,"Fecha Pago" : fechaPago
                                            ,"Descuento" : Number(x.valor.passdata["cfdi:Comprobante"]["@attributes"].Descuento).toLocaleString('en-US')
                                            ,"Descripcion": descripcion
                                            ,"Tipo de Comprobante": x.valor.passdata["cfdi:Comprobante"]["@attributes"].TipoDeComprobante
                                            ,"Ingreso": ingreso
                                            ,"Egreso": egreso
                                          };

                      return datoFactura;
                });
                exportToExcel(datosFactura,'MisFacturas')
        });
  }


  render() {
    return  (
      <>
	<button className="border-0 mt-2" onClick={this.exportaExcel} >
		<FontAwesomeIcon size="3x" data-tooltip-id="my-tooltip-1" className="text-primary" icon={['fas' , 'file-excel']} />
	</button>
        <ReactTooltip id="my-tooltip-1" style={{ zIndex:9999 }} className="text-center border border-info z-9999 " place="bottom" variant="info" html="<div >Exporta las <br>facturas electrónicas a excel</div>" />
      </>
    )
  }
};

export default  ExportaAExcel;

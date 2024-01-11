import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Card,CardBody,CardHeader,Dropdown,DropdownToggle,DropdownMenu,DropdownItem } from 'reactstrap';
import { leefacturas } from '../db';
import {Doughnut,HorizontalBar,Bar,Pie,Line} from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip as ReactTooltip } from "react-tooltip";
import { exportToExcel } from "react-json-to-excel";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend,BarElement,LineController,DoughnutController,ArcElement,PieController } from 'chart.js';

const labels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',' Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend
  ,LineController
  ,PointElement
  ,DoughnutController
  ,PieController
  ,ArcElement
);


class Graficafael extends Component {
  constructor(props){
    super(props);
    this.state = { data:{},dropdownOpen:false,dropdownValue:'Barras Horizontales', refresca:true, exportaExcel:false, datosExcel:null}
    this.toggle =  this.toggle.bind(this)
    this.changeValue = this.changeValue.bind(this);
    this.actuaFacturas = this.actuaFacturas.bind(this);
    this.exportaExcel = this.exportaExcel.bind(this);
  }

    toggle(event) {

        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    changeValue(e) {
        this.setState({dropdownValue: e.currentTarget.textContent});
       this.actuaFacturas();
    }

  componentWillMount(){
       console.log('Graficafael labels='+labels);
       this.actuaFacturas();
  }

  exportaExcel(){
        var datosFactura=[];
        leefacturas().then( (cuantas) => {
                cuantas.map( (x) => {
                       var descripcion='';
                       var ingreso='desconocido', egreso='desconocido';
                       var tc=x.valor.passdata["cfdi:Comprobante"]["@attributes"].TipoDeComprobante;
                       var rfcEmisor=x.valor.passdata["cfdi:Comprobante"]["cfdi:Emisor"]["@attributes"].Rfc;
                       var rfcReceptor=x.valor.passdata["cfdi:Comprobante"]["cfdi:Receptor"]["@attributes"].Rfc;
                       var total=Number(x.valor.passdata["cfdi:Comprobante"]["@attributes"].Total).toLocaleString('en-US');
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
                       if ( x.valor.passdata["cfdi:Comprobante"]["cfdi:Complemento"]["nomina12:Nomina"]["@attributes"]["FechaPago"].length>0 ) {
                          var fechaPago=x.valor.passdata["cfdi:Comprobante"]["cfdi:Complemento"]["nomina12:Nomina"]["@attributes"].FechaPago
                       }
                       datosFactura.push( {  "Emisor" : rfcEmisor
                                            ,"Nombre Emisor" : x.valor.passdata["cfdi:Comprobante"]["cfdi:Emisor"]["@attributes"].Nombre
                                            ,"Receptor": rfcReceptor
                                            ,"Fecha Emision" : x.valor.passdata["cfdi:Comprobante"]["@attributes"].Fecha.substring(0,10)
                                            ,"Fecha Pago" : fechaPago
                                            ,"Descuento" : Number(x.valor.passdata["cfdi:Comprobante"]["@attributes"].Descuento).toLocaleString('en-US')
                                            ,"Descripcion": descripcion
                                            ,"Tipo de Comprobante": x.valor.passdata["cfdi:Comprobante"]["@attributes"].TipoDeComprobante
                                            ,"Ingreso": ingreso
                                            ,"Egreso": egreso 
                                          }
                                        );
                });
                exportToExcel(datosFactura,'MisFacturas')
        });
  }

  actuaFacturas(){
        var that=this;
        that.setState({data:{}});
        leefacturas().then(function(cuantas) {
                    var datae = Array(12).fill(0);   /* egresos */ var datai = Array(12).fill(0);   /* ingresos */ var datan = Array(12).fill(0);   /* neto */
                    let usedColors = new Set();
		    var dynamicColors = function() {
			    var r = Math.floor(Math.random() * 255); var g = Math.floor(Math.random() * 255); var b = Math.floor(Math.random() * 255);
			    let color = "rgb(" + r + "," + g + "," + b + ")";
			    if (!usedColors.has(color)) {
				usedColors.add(color);
                                console.log('actuaFacturas coolor='+color);
				return color;
			    } else {
				return dynamicColors();
			    }
		    };
		    const colors = [dynamicColors(),dynamicColors(),dynamicColors(),dynamicColors(),dynamicColors(),dynamicColors(),dynamicColors(),dynamicColors(),dynamicColors(),dynamicColors(),dynamicColors(),dynamicColors()];
                    console.log('actuaFacturas colors='+colors);

                    cuantas.map((x) => {
                       var ingreso=0, egreso=0;
                       var tc=x.valor.passdata["cfdi:Comprobante"]["@attributes"].TipoDeComprobante;
                       var rfcEmisor=x.valor.passdata["cfdi:Comprobante"]["cfdi:Emisor"]["@attributes"].Rfc;
                       var rfcReceptor=x.valor.passdata["cfdi:Comprobante"]["cfdi:Receptor"]["@attributes"].Rfc;
                       var total=parseFloat(x.valor.passdata["cfdi:Comprobante"]["@attributes"].Total);

		       var rfc=localStorage.getItem('rfc');
                       var mes=parseInt(x.valor.passdata["cfdi:Comprobante"]["@attributes"].Fecha.substring(5,7))-1;
				   if (rfc===rfcReceptor) {
					  if (tc==='I' ) { ingreso=0; egreso=total; }
					  if (tc==='N') { ingreso=total; egreso=0; }
				   }
				   if (rfc===rfcEmisor) {
					  if (tc==='E' ) { ingreso=0; egreso=total; }
					  if (tc==='I') { ingreso=total; egreso=0; }
					  if (tc==='N') { ingreso=0; egreso=total; }
				   }
                                    // I=ingreso para el emisor  egreso  para el receptor
                                    // E=egresos para el emisor  ingreso para el receptor
                                    // N=nomina egreso para el emisor  ingreso para el receptor
                                    // T=Traslado
                                    // P=Pago
                                    datai[mes]=datai[mes]+ingreso; datae[mes]=datae[mes]+egreso; datan[mes]=datan[mes]+(ingreso-egreso);
                                    return null;
                    })
                    var colori=dynamicColors();
                    var colore=dynamicColors();
                    var colorn=dynamicColors();
                    //console.log('Graficafael actuaFacturas that.state.dropdownValue='+JSON.stringify(that.state.dropdownValue));
                    if (that.state.dropdownValue==="Dona" || that.state.dropdownValue==="Pie") {
                            that.setState({
                                    data:{labels : labels
                                         ,datasets: [
                                                {data:datai,label:'Ingreso'
                                              ,backgroundColor:[colors[0],colors[1],colors[2],colors[3],colors[4],colors[5],colors[6],colors[7],colors[8],colors[9],colors[10],colors[11]]}
                                                ,{data:datae,label:'Egreso'
                                              ,backgroundColor:[colors[0],colors[1],colors[2],colors[3],colors[4],colors[5],colors[6],colors[7],colors[8],colors[9],colors[10],colors[11]]}
                                                ,{data:datan,label:'Neto'
                                              ,backgroundColor:[colors[0],colors[1],colors[2],colors[3],colors[4],colors[5],colors[6],colors[7],colors[8],colors[9],colors[10],colors[11]]}
                                         ]
                                         },
                            });
                    } else {
			    that.setState({
				    data:{labels : labels 
					 ,datasets: [ 
						{label:'Ingreso',data:datai,backgroundColor:colori,borderColor:colori} 
					       ,{label:'Egreso',data:datae,backgroundColor:colore,borderColor:colore} 
					       ,{label:'Neto',data:datan,backgroundColor:colorn,borderColor:colorn} 
					 ]
					 },
			    });
                    }
         }).catch(function(err)  {
                    that.setState({datai:{},datae:{},datan:{}});
         });
  }

  render() {
    console.log('Graficafael render data='+JSON.stringify(this.state.data));
    const dropdownValue = this.state.dropdownValue
    const datosExcel = this.state.datosExcel
    var options={};
    if (dropdownValue==='Barras Horizontales') {
       options={    indexAxis: 'y',
		    elements: {
			    bar: {
			      borderWidth: 2,
			    },
	       	    },
                    responsive:true,
		    plugins: {
			    legend: {
			      position: 'right',
			    },
			    title: {
			      display: true,
			      text: 'Ingresos y Egresos',
			    },
		   },
                   locale: 'es-MX'
                }
    }
    if (dropdownValue==='Barras Verticales') {
       options={ 
                    elements: {
                            bar: {
                              borderWidth: 2,
                            },
                    },
                    responsive:true,
                    plugins: {
                            legend: {
                              position: 'top',
                            },
                            title: {
                              display: true,
                              text: 'Ingresos y Egresos',
                            },
                   },
                   locale: 'es-MX'
              }
    }
    if (dropdownValue==='Dona' || dropdownValue==='Pie') {
       options={ 
         elements: {
              center: {
                legend: { display: true, position: "right" },
                text: "Red is 2/3 the total numbers",
                color: "#FF6384", // Default is #000000
                fontStyle: "Arial", // Default is Arial
                sidePadding: 20, // Default is 20 (as a percentage)
                minFontSize: 20, // Default is 20 (in px), set to false and text will not wrap.
                lineHeight: 25 // Default is 25 (in px), used for when text wraps
              }
            },
         locale: 'es-MX'
       }
    }

    return  (
      <>
        <Card className="p-2 m-2">
			<h2 className="text-center mb-3">Grafica de Ingresos y Egresos por el total de la factura </h2>
                        <div className="d-flex justify-content-around align-content-end flex-wrap mb-2">
				<Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}  className="d-flex justify-content-center " >
				      <DropdownToggle caret color="primary">
						   Grafica {dropdownValue}
				      </DropdownToggle>
				      <DropdownMenu>
					<DropdownItem onClick={this.changeValue} >Barras Horizontales</DropdownItem>
					<DropdownItem onClick={this.changeValue} >Barras Verticales</DropdownItem>
					<DropdownItem onClick={this.changeValue} >Pie</DropdownItem>
					<DropdownItem onClick={this.changeValue} >Dona</DropdownItem>
				      </DropdownMenu>
				</Dropdown>
                                <button className="border-0" onClick={this.exportaExcel} >
					<FontAwesomeIcon size="3x" data-tooltip-id="my-tooltip-1" className="text-primary" icon={['fas' , 'file-excel']} />
                                </button>
                        </div>
                        { this.state.data.labels && this.state.data.labels.length>0 &&
				<Card className="m-1">
					<CardBody>
						{ (dropdownValue==='Barras Verticales') && <Bar data={this.state.data} options={options}> </Bar> }
						{ (dropdownValue==='Barras Horizontales') && <Bar data={this.state.data} options={options}> </Bar> }
						{ (dropdownValue==='Dona') && <Doughnut data={this.state.data} options={options}> </Doughnut> }
						{ (dropdownValue==='Pie') && <Pie data={this.state.data} options={options}> </Pie> }
					</CardBody>
				</Card>
                         }
                      <ReactTooltip id="my-tooltip-1" className="text-center border border-info" place="bottom" variant="info" html="<div >Exporta las facturas electrónicas a excel</div>" />
        </Card>
      </>
    )
  }
};

Graficafael.propTypes = {
  refresca: PropTypes.bool
}

Graficafael.defaultProps = {
  refresca: true
}


export default Graficafael;

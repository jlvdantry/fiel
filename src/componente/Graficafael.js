import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Card,CardBody,CardHeader,Dropdown,DropdownToggle,DropdownMenu,DropdownItem } from 'reactstrap';
import { leefacturas } from '../db';
import {Doughnut,HorizontalBar,Bar,Pie} from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip as ReactTooltip } from "react-tooltip";
import { JsonToExcel } from "react-json-to-excel";


class Graficafael extends Component {
  constructor(props){
    super(props);
    this.state = { datai:{},datae:{},datan:{},dropdownOpen:false,dropdownValue:'Barras Horizontales', refresca:true, exportaExcel:false, datosExcel:null}
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
    }

  componentWillMount(){
       this.actuaFacturas();
  }

  exportaExcel(){
        var datosFactura=[];
        leefacturas().then( (cuantas) => {
                cuantas.map( (x) => {
                       datosFactura.push( { Emisor : x.valor.passdata["cfdi:Comprobante"]["cfdi:Emisor"]["@attributes"].Rfc,
                                            Receptor:x.valor.passdata["cfdi:Comprobante"]["cfdi:Receptor"]["@attributes"].Rfc} );
                });
                console.log('[Graficafael] exportaExcel termino leefacturas datosFactura='+datosFactura);
		this.setState(  { exportaExcel:true, datosExcel:datosFactura },() => { ; 
			    console.log('[Graficafael] exportaExcel datosExcel='+this.state.datosExcel);
		});
        });
  }

  actuaFacturas(){
        var that=this;
        that.setState({datai:{},datae:{},datan:{}});
        leefacturas().then(function(cuantas) {
                       var labels = [];
                       var colors = [];
                       var datase = [];   /* egresos */
                       var datasr = [];   /* ingresos */
                       var datasn = [];   /* neto */
		    var dynamicColors = function() {
			var r = Math.floor(Math.random() * 255);
			var g = Math.floor(Math.random() * 255);
			var b = Math.floor(Math.random() * 255);
			return "rgb(" + r + "," + g + "," + b + ")";
		    };
                       cuantas.map((x) => {
                                   var rfce=x.valor.passdata["cfdi:Comprobante"]["cfdi:Emisor"]["@attributes"].Rfc;
                                   var rfcr=x.valor.passdata["cfdi:Comprobante"]["cfdi:Receptor"]["@attributes"].Rfc;
                                   var total=Number(parseFloat(x.valor.passdata["cfdi:Comprobante"]["@attributes"].Total).toFixed(2));
                                   var tc=x.valor.passdata["cfdi:Comprobante"]["@attributes"].TipoDeComprobante; //tipo de comprobante
                                    // I=ingreso para el emisor  egreso  para el receptor
                                    // E=egresos para el emisor  ingreso para el receptor
                                    // N=nomina egreso para el emisor  ingreso para el receptor
                                    // T=Traslado
                                    // P=Pago
                                   if (labels.indexOf(rfce) ===-1) {
                                          labels.push(rfce);
                                          datase.push(0);
                                          datasr.push(0);
                                          datasn.push(0);
                                   }
                                   if (labels.indexOf(rfcr) ===-1) {
                                          labels.push(rfcr);
                                          datase.push(0);
                                          datasr.push(0);
                                          datasn.push(0);
                                   }
                                    if (tc==='E') {
                                      datase[labels.indexOf(rfce)]+=total;
                                      datasn[labels.indexOf(rfce)]-=total;
                                      datasr[labels.indexOf(rfcr)]+=total;
                                      datasn[labels.indexOf(rfcr)]+=total;
                                    }
                                    if (tc==='I') {
                                      datase[labels.indexOf(rfcr)]+=total;
                                      datasn[labels.indexOf(rfcr)]-=total;
                                      datasr[labels.indexOf(rfce)]+=total;
                                      datasn[labels.indexOf(rfce)]+=total;
                                    }
                                    if (tc==='N') {
                                      datase[labels.indexOf(rfce)]+=total;
                                      datasn[labels.indexOf(rfce)]-=total;
                                      datasr[labels.indexOf(rfcr)]+=total;
                                      datasn[labels.indexOf(rfcr)]+=total;
                                    }
                                    datase[labels.indexOf(rfce)]=Number(datase[labels.indexOf(rfce)].toFixed(2));
                                    datasn[labels.indexOf(rfce)]=Number(datasn[labels.indexOf(rfce)].toFixed(2));
                                    datasr[labels.indexOf(rfce)]=Number(datasr[labels.indexOf(rfce)].toFixed(2));
                                    datase[labels.indexOf(rfcr)]=Number(datase[labels.indexOf(rfcr)].toFixed(2));
                                    datasn[labels.indexOf(rfcr)]=Number(datasn[labels.indexOf(rfcr)].toFixed(2));
                                    datasr[labels.indexOf(rfcr)]=Number(datasr[labels.indexOf(rfcr)].toFixed(2));
                                   return null;
                       })
                       labels.map((x) => {
                                   colors.push(dynamicColors());
                                   return null;
                       })
                       labels.map((x) => {
                                   colors.push(dynamicColors());
                                   return null;
                       })

                       console.log('labels='+labels);
                                                            that.setState({
                                                                             datai:{labels : labels ,datasets: [
                                                                                        {data:datasr,backgroundColor:colors}
                                                                                         ],
                                                                                    options: { legend: { display: false }}
                                                                                   },
                                                                             datae:{labels : labels ,datasets: [
                                                                                        {data:datase,backgroundColor:colors}
                                                                                         ]},
                                                                             datan:{labels : labels ,datasets: [
                                                                                        {data:datasn,backgroundColor:colors}
                                                                                         ]},
                                                                           });
                                                    }).catch(function(err)  {
                                                            that.setState({datai:{},datae:{},datan:{}});
                                                    });
  }

  render() {
    const datai = this.state.datai
    const datae = this.state.datae
    const datan = this.state.datan
    const dropdownValue = this.state.dropdownValue
    const datosExcel = this.state.datosExcel
    const optionsc={ legend: { display:false },
		    tooltips: {
		      callbacks: {
			title: function(tooltipItem, data) {
			  return data['labels'][tooltipItem[0]['index']];
			},
			label: function(tooltipItem, data) {
			  return data['datasets'][0]['data'][tooltipItem['index']].toLocaleString('en-US', { style: 'currency', currency: 'USD' });
			},
		      }
                    }
                   }
    console.log('[Graficafael] render datosExcel='+JSON.stringify(datosExcel)+' this.state.exportaExcel='+this.state.exportaExcel)
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
                                <button onClick={ this.exportaExcel } >
					<FontAwesomeIcon size="3x" data-tooltip-id="my-tooltip-1" className="text-primary" icon={['fas' , 'file-excel']} />
                                </button>
                        </div>
                        { datai.labels && datai.labels.length>0 &&
				<Card className="m-1">
					<CardHeader color="success" className="text-center" >Ingreso</CardHeader>
					<CardBody>
						{ (dropdownValue==='Dona') && <Doughnut data={datai} options={optionsc}> </Doughnut> }
						{ (dropdownValue==='Barras Horizontales') && <HorizontalBar data={datai} options={optionsc}> </HorizontalBar> }
						{ (dropdownValue==='Barras Verticales') && <Bar data={datai} options={optionsc}> </Bar> }
						{ (dropdownValue==='Pie') && <Pie data={datai} options={optionsc}> </Pie> }
					</CardBody>
				</Card>
                         }
                         { datae.labels && datai.labels.length>0 &&
				<Card className="m-1">
					<CardHeader color="success" className="text-center" >Egreso</CardHeader>
					<CardBody>
						{ (dropdownValue==='Pie') && <Pie data={datae}  options={optionsc}> </Pie> }
						{ (dropdownValue==='Barras Horizontales') && <HorizontalBar data={datae} options={optionsc}> </HorizontalBar> }
                                                { (dropdownValue==='Dona') && <Doughnut data={datae} options={optionsc}> </Doughnut> }
                                                { (dropdownValue==='Barras Verticales') && <Bar data={datae} options={optionsc}> </Bar> }
					</CardBody>
				</Card>
                          }
                          { datan.labels && datai.labels.length>0 &&
                                <Card className="m-1">
                                        <CardHeader color="success" className="text-center" >Neto</CardHeader>
                                        <CardBody>
                                                { (dropdownValue==='Pie') && <Pie data={datan} options={optionsc}> </Pie> }
                                                { (dropdownValue==='Barras Horizontales') && <HorizontalBar data={datan} options={optionsc}> </HorizontalBar> }
                                                { (dropdownValue==='Dona') && <Doughnut data={datan}  options={optionsc}> </Doughnut> }
                                                { (dropdownValue==='Barras Verticales') && <Bar data={datan} options={optionsc}> </Bar> }
                                        </CardBody>
                                </Card>
                          }
                      <ReactTooltip id="my-tooltip-1" className="text-center border border-info" place="bottom" variant="info" html="<div >Exporta la facturas electronicas a excel</div>" />
        </Card>
        { this.state.exportaExcel===true && <JsonToExcel
		title="Download as Excel"
		data={this.state.datosExcel}
		fileName="sample-file"
        />
        }
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

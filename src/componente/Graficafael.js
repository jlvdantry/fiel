import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Card,CardBody,CardHeader,Dropdown,DropdownToggle,DropdownMenu,DropdownItem } from 'reactstrap';
import { leefacturas } from '../db';
import {Doughnut,HorizontalBar,Bar,Pie} from 'react-chartjs-2';


class Graficafael extends Component {
  constructor(props){
    super(props);
    this.state = { datai:{},datae:{},datan:{},dropdownOpen:false,dropdownValue:'Pie', refresca:true}
    this.toggle =  this.toggle.bind(this)
    this.changeValue = this.changeValue.bind(this);
    this.actuaFacturas = this.actuaFacturas.bind(this);
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

  actuaFacturas(){
        var that=this;
        that.setState({datai:{},datae:{},datan:{}});
        leefacturas().then(function(cuantas) {
                       var labels = [];
                       var colors = [];
                       var datase = [];
                       var datasr = [];
                       var datasn = [];
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
                                   if (labels.indexOf(rfce) ===-1) {
                                          labels.push(rfce);
                                          datase.push(total);
                                          datasr.push(0);
                                          datasn.push(total);
                                   } else {
                                      datase[labels.indexOf(rfce)]=datase[labels.indexOf(rfce)]+total;
                                      datasn[labels.indexOf(rfce)]=datasn[labels.indexOf(rfce)]+total;
                                      datase[labels.indexOf(rfce)]=Number(datase[labels.indexOf(rfce)].toFixed(2));
                                      datasn[labels.indexOf(rfce)]=Number(datasn[labels.indexOf(rfce)].toFixed(2));
                                   }
                                   if (labels.indexOf(rfcr) ===-1) {
                                          labels.push(rfcr);
                                          datasr.push(total);
                                          datasn.push(total*-1);
                                          datase.push(0);
                                   } else {
                                      datasr[labels.indexOf(rfcr)]+=total;
                                      datasn[labels.indexOf(rfcr)]-=total;
                                      datasr[labels.indexOf(rfcr)]=Number(datasr[labels.indexOf(rfcr)].toFixed(2));
                                      datasn[labels.indexOf(rfcr)]=Number(datasn[labels.indexOf(rfcr)].toFixed(2));
                                   }
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
                                                                                        {data:datase,backgroundColor:colors}
                                                                                         ],
                                                                                    options: { legend: { display: false }}
                                                                                   },
                                                                             datae:{labels : labels ,datasets: [
                                                                                        {data:datasr,backgroundColor:colors}
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
    console.log('datai='+datai.datasets)
    return  (
      <>
        <Card className="p-2 m-2">
			<h2 className="text-center mb-3">Grafica de Ingresos y Egresos por el total de la factura </h2>
			<Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}  className="d-flex justify-content-center mb-2" >
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
                        { datai.datasets && 
				<Card className="m-1">
					<CardHeader color="success" className="text-center" >Ingreso</CardHeader>
					<CardBody>
						{ (dropdownValue==='Dona') && <Doughnut data={datai}>
						</Doughnut> }
						{ (dropdownValue==='Barras Horizontales') && <HorizontalBar data={datai} options={{ legend: { display: false }}}>
						</HorizontalBar> }
						{ (dropdownValue==='Barras Verticales') && <Bar data={datai} options={{ legend: { display: false }}}>
						</Bar> }
						{ (dropdownValue==='Pie') && <Pie data={datai}>
						</Pie> }
					</CardBody>
				</Card>
                         }
                         { datae.datasets &&
				<Card className="m-1">
					<CardHeader color="success" className="text-center" >Egreso</CardHeader>
					<CardBody>
						{ (dropdownValue==='Pie') && <Pie data={datae}>
						</Pie> }
						{ (dropdownValue==='Barras Horizontales') && <HorizontalBar data={datae} options={{ legend: { display: false }}}>
						</HorizontalBar> }
                                                { (dropdownValue==='Dona') && <Doughnut data={datae}>
                                                </Doughnut> }
                                                { (dropdownValue==='Barras Verticales') && <Bar data={datae} options={{ legend: { display: false }}}>
                                                </Bar> }
					</CardBody>
				</Card>
                          }
                          { datan.datasets &&
                                <Card className="m-1">
                                        <CardHeader color="success" className="text-center" >Neto</CardHeader>
                                        <CardBody>
                                                { (dropdownValue==='Pie') && <Pie data={datan}>
                                                </Pie> }
                                                { (dropdownValue==='Barras Horizontales') && <HorizontalBar data={datan} options={{ legend: { display: false }}}>
                                                </HorizontalBar> }
                                                { (dropdownValue==='Dona') && <Doughnut data={datan}>
                                                </Doughnut> }
                                                { (dropdownValue==='Barras Verticales') && <Bar data={datan} options={{ legend: { display: false }}}>
                                                </Bar> }
                                        </CardBody>
                                </Card>
                          }
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

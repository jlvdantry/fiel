import React, {Component} from 'react';
import { Button, Container, Card,CardBody,CardSubtitle,CardText,CardHeader, CardDeck, Badge} from 'reactstrap';
import { leefacturas, cuantasfacturas } from '../db';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


class Consultafael extends Component {
  constructor(props){
    super(props);
    this.state = { facturas:[],totalfacturas:0}
    this.consulta = this.consulta.bind(this)
  }

  componentWillMount(){
        var that=this;
        cuantasfacturas().then(function(cuantas) {
                                                            that.setState({totalfacturas:cuantas});
                                                    }).catch(function(err)  {
                                                            that.setState({totalfacturas:0});
                                                    });
  }

  consulta(){
        var that=this;
        leefacturas().then(function(facturas) {
                                                            that.setState({facturas:facturas});
                                                    }).catch(function(err)  {
                                                            that.setState({facturas:[]});
                                                    });
  }

  render() {
    const { facturas,totalfacturas } = this.state;
    return  (
        <Card id="ayuda" className="p-2 m-2">
	      <h2 className="text-center" >Historial de factura electrónica <Badge>{totalfacturas}</Badge></h2>
              <Container className="p-2">
                      <div class="flex-col d-flex justify-content-center">
		           <Button color="primary" onClick={this.consulta}> <FontAwesomeIcon icon={['fas' , 'search']} className='mr-2' /> Consultar historial</Button>
                      </div>
              </Container>
              <Container id="ok" className="p-2 mb-3">
              { facturas.map((data) => { 
                  return (
                 <CardDeck className="border p-2 m-2 rounded">
                     <Card>
			<CardHeader color="success" className="text-center" >Comprobante</CardHeader>
			<CardBody>
			  <CardSubtitle className="text-center">Fecha: {data.valor.passdata["cfdi:Comprobante"]["@attributes"].Fecha}</CardSubtitle>
			  <CardSubtitle className="text-center">SubTotal: {data.valor.passdata["cfdi:Comprobante"]["@attributes"].SubTotal}</CardSubtitle>
			  <CardSubtitle className="text-center">Total: {data.valor.passdata["cfdi:Comprobante"]["@attributes"].Total}</CardSubtitle>
			</CardBody>
                     </Card>

                     <Card>
                        <CardHeader color="success" className="text-center" >Emisor</CardHeader>
                        <CardBody>
                          <CardText color="success" className="text-center" >{ data.valor.passdata["cfdi:Comprobante"]["cfdi:Emisor"]["@attributes"].Rfc} </CardText>
                          <CardText color="success" className="text-center" >{ data.valor.passdata["cfdi:Comprobante"]["cfdi:Emisor"]["@attributes"].Nombre}</CardText>
                        </CardBody>
                     </Card>
                     <Card>
                        <CardHeader color="success" className="text-center" >Receptor</CardHeader>
                        <CardBody>
                          <CardText color="success" className="text-center" >{ data.valor.passdata["cfdi:Comprobante"]["cfdi:Receptor"]["@attributes"].Rfc} </CardText>
                          <CardText color="success" className="text-center" >{ data.valor.passdata["cfdi:Comprobante"]["cfdi:Receptor"]["@attributes"].Nombre}</CardText>
                        </CardBody>
                     </Card>
                 </CardDeck>
                         )}) }

              </Container> 
        </Card>
    )
  }
};
export default Consultafael;

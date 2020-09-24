import React, {Component} from 'react';
import PropTypes from 'prop-types'
import { Button, Container, Card,CardBody,CardSubtitle,CardText,CardHeader, CardDeck, Badge} from 'reactstrap';
import { leefacturas, cuantasfacturas,bajafacturas } from '../db';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


class Consultafael extends Component {
  constructor(props){
    super(props);
    this.state = { facturas:[],totalfacturas:0}
    this.consulta = this.consulta.bind(this)
    this.totalFacturas = this.totalFacturas.bind(this)
    this.bajaFactura = this.bajaFactura.bind(this)
  }

  componentWillMount(){
       this.totalFacturas();
  }

  totalFacturas() {
        var that=this;
        cuantasfacturas().then(function(cuantas) {
                                                            that.setState({totalfacturas:cuantas});
                                                    }).catch(function(err)  {
                                                            that.setState({totalfacturas:0});
                                                    });
  }

  bajaFactura(event){
        console.log('[Consultafael.js] bajaFactura '+event.currentTarget.dataset.id);
        var that=this;
        bajafacturas(event.currentTarget.dataset.id).then(function() {
              that.setState({facturas:[]});
              that.totalFacturas();
              that.consulta();
              that.props.onRefresca();
        }).catch(function(err)  {
              console.log('error al dar de baja la factura'+err);
        });
  }

  consulta(){
        console.log('[Consultafael.js] consulta entro');
        var that=this;
        leefacturas().then(function(facturas) {
                                                            console.log('[Consultafael.js] consulta='+facturas.length);
                                                            that.setState({facturas:facturas});
                                                    }).catch(function(err)  {
                                                            that.setState({facturas:[]});
                                                    });
  }

  render() {
    const { facturas,totalfacturas } = this.state;
    return  (
        <Card className="p-2 m-2">
	      <h2 className="text-center" >Historial de factura electrónica <Badge>{totalfacturas}</Badge></h2>
              <Container className="p-2">
                      <div className="flex-col d-flex justify-content-center">
		           <Button color="primary" onClick={this.consulta}> <FontAwesomeIcon icon={['fas' , 'search']} className='mr-2' /> Consultar historial</Button>
                      </div>
              </Container>
              <Container className="p-2 mb-3">
              { facturas.map((data) => { 
                  console.log('map='+data.key);
                  return (
                 <CardDeck key={data.key} className="border p-2 m-2 rounded">
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
                          <CardText color="success" className="text-center" >{ data.valor.passdata["cfdi:Comprobante"]["cfdi:Receptor"]["@attributes"].Nombre}
                                  </CardText>
                        </CardBody>
                     </Card>
                     <Button data-id={data.key} color="primary" onClick={this.bajaFactura}> <FontAwesomeIcon icon={['fas' , 'trash-alt']} className='mr-2' /></Button> 
                 </CardDeck>
                         )}) }
              </Container> 
        </Card>
    )
  }
};

Consultafael.propTypes = {
  onRefresca: PropTypes.func.isRequired
};

Consultafael.defaultProps = {
  onRefresca: () => null
}

export default Consultafael;

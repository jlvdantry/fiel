import React, {Component} from 'react';
import { browserHistory  } from 'react-router';
import { Button, Container, Alert,Card,CardBody,CardSubtitle,CardText,CardHeader, CardDeck} from 'reactstrap';
import fiel from '../fiel';
import {openDatabasex,DBNAME,DBVERSION,inserta_factura} from '../db';


class Validafael extends Component {
  constructor(props){
    super(props);
    this.nextPath = this.nextPath.bind(this);
    this.state = { ok : false , nook:false , msg:'', certijson:{}, faeljson:{}, seintegro:0}
    this.validafael = this.validafael.bind(this)
    this.insertafael = this.insertafael.bind(this)
  }

  nextPath(path) {
      browserHistory.push(path);
  }

  componentDidMount(){
  }

  insertafael(){
        const faeljson=this.state.faeljson;
        var that=this;
        openDatabasex(DBNAME,DBVERSION).then(function() {
                             inserta_factura(faeljson).then(function() {
                                                            console.log('agrego la factura al historia');
                                                            that.setState({seintegro:1});
                                                    }).catch(function(err)  {
                                                            console.log('No pudo agregar la factura al historial');
                                                            that.setState({seintegro:2});
                                                    });
                  });
  }

  validafael(){
    var x = new fiel();
    var res=x.validafael();
    if (res.ok===true) {
       //console.log('res.jsonText='+JSON.stringify(res.faeljson));
       this.setState({ ok: true, nook:false, certijson : res.certijson , faeljson : res.faeljson,seintegro:0  });
    }
    if (res.ok===false) {
       this.setState({ ok: false, nook:true,msg:res.msg , seintegro:0 });
    }

  }
  render() {
    const { ok, nook, msg, certijson, faeljson ,seintegro} = this.state;
    //console.log('render carga'+JSON.stringify(faeljson));
    return  (
        <Card id="ayuda" className="p-2 m-2">
	      <h2 className="text-center" >Validar factura electrónica</h2>
              <Container className="border p-2 mb-3">
                      <div class="flex-col d-flex justify-content-center">
		           <Button color="primary" onClick={this.validafael}>Validar</Button>
                      </div>
              </Container>
              { ok && <Container id="ok" className="border p-2 mb-3">
                     <Alert color="success" className="text-center" >Felicidades el sello de la factura electrónica checa contra el certificado del emisor</Alert>
                 <CardDeck>
                     <Card>
			<CardHeader color="success" className="text-center" >Factura electrónica</CardHeader>
			<CardBody>
			  <CardSubtitle className="text-center">Fecha: {faeljson["cfdi:Comprobante"]["@attributes"].Fecha}</CardSubtitle>
			  <CardSubtitle className="text-center">SubTotal: {faeljson["cfdi:Comprobante"]["@attributes"].SubTotal}</CardSubtitle>
			  <CardSubtitle className="text-center">Total: {faeljson["cfdi:Comprobante"]["@attributes"].Total}</CardSubtitle>
			</CardBody>
                     </Card>

                     <Card>
                        <CardHeader color="success" className="text-center" >Emisor</CardHeader>
                        <CardBody>
                          <CardText color="success" className="text-center" >{ faeljson["cfdi:Comprobante"]["cfdi:Emisor"]["@attributes"].Rfc} </CardText>
                          <CardText color="success" className="text-center" >{ faeljson["cfdi:Comprobante"]["cfdi:Emisor"]["@attributes"].Nombre}</CardText>
                        </CardBody>
                     </Card>
                     <Card>
                        <CardHeader color="success" className="text-center" >Receptor</CardHeader>
                        <CardBody>
                          <CardText color="success" className="text-center" >{ faeljson["cfdi:Comprobante"]["cfdi:Receptor"]["@attributes"].Rfc} </CardText>
                          <CardText color="success" className="text-center" >{ faeljson["cfdi:Comprobante"]["cfdi:Receptor"]["@attributes"].Nombre}</CardText>
                        </CardBody>
                     </Card>
                 </CardDeck>
                 <div class="flex-col d-flex justify-content-center mt-3">
                           <Button color="primary" onClick={this.insertafael}>¿Desea agregar al historial de facturas?</Button>
                 </div>
                 <div class="flex-col d-flex justify-content-center mt-3">
			 <Alert color="success" className={ seintegro!==1 ? 'd-none' : '' }>Se integro la factura al historico</Alert> 
			 <Alert color="danger"  className={ seintegro!==2 ? 'd-none' : ''  }>La factura ya esta integrada al historico</Alert> 
                 </div>

              </Container> }
              { nook && <Container id="nook" className="border p-2 mb-3">
                     <Alert color="danger"> {msg} </Alert>
              </Container> }
        </Card>
    )
  }
};
export default Validafael;

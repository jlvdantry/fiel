import React, {Component} from 'react';
import { browserHistory  } from 'react-router';
import { Button, Container, Alert,Card,CardBody,CardSubtitle,CardText,CardHeader,CardFooter, CardDeck} from 'reactstrap';
import fiel from '../fiel';


class Validafael extends Component {
  constructor(props){
    super(props);
    this.nextPath = this.nextPath.bind(this);
    this.state = { ok : false , nook:false , msg:'', certijson:{}, faeljson:{}}
    this.validafael = this.validafael.bind(this)
  }
  nextPath(path) {
      browserHistory.push(path);
  }
  componentDidMount(){
    //var x = new window.fiel;
    //console.log('monto el componente');
    //x.cargafiellocal();
  }
  validafael(){
    var x = new fiel();
    var res=x.validafael();
    if (res.ok===true) {
       console.log('res.jsonText='+JSON.stringify(res.faeljson));
       this.setState({ ok: true, nook:false, certijson : res.certijson , faeljson : res.faeljson
                    });
    }
    if (res.ok===false) {
       this.setState({ ok: false, nook:true,msg:res.msg  });
    }

  }
  render() {
    const { ok, nook, msg, certijson, faeljson } = this.state;
    console.log('render carga'+JSON.stringify(faeljson));
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

              </Container> }
              { nook && <Container id="nook" className="border p-2 mb-3">
                     <Alert color="danger"> {msg} </Alert>
              </Container> }
        </Card>
    )
  }
};
export default Validafael;

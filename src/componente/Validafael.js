import React, {Component} from 'react';
import { browserHistory  } from 'react-router';
import { Button, FormGroup, Label, Input, Container, Alert,Card,CardBody,CardSubtitle,CardText,CardHeader,CardFooter} from 'reactstrap';


class Validafael extends Component {
  constructor(props){
    super(props);
    this.nextPath = this.nextPath.bind(this);
    this.state = { ok : false , nook:false , msg:'', certijson:{}}
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
    var x = new window.fiel;
    var res=x.validafael();
    console.log('x='+JSON.stringify(res));
    if (res.ok===true) {
       this.setState({ ok: true, nook:false, certijson : res.certijson 
                    //  ,nombre:res.nombre,rfc:res.rfc, curp:res.curp,email:res.email,emisor:res.emisor,desde:res.desde,hasta:res.hasta 
                    });
    }
    if (res.ok===false) {
       this.setState({ ok: false, nook:true,msg:res.msg  });
    }

  }
  render() {
    console.log('render carga');
    const { ok, nook, msg, certijson } = this.state;
    return  (
        <div id="ayuda" class="container">
	      <h2 className="text-center" >Validar firma electrónica</h2>
              <Container className="border p-2 mb-3">
{/*
		      <FormGroup class="container">
			<Label for="pwdfiel">Password de la llave privada</Label>
			<Input type="password" name="password" id="pwdfiel" placeholder="contraseña" />
		      </FormGroup>
*/}
                      <div class="flex-col d-flex justify-content-center">
		           <Button color="primary" onClick={this.validafael}>Validar</Button>
                      </div>
              </Container>
              { ok && <Container id="ok" className="border p-2 mb-3">
                     <Alert color="success" className="text-center" >Felicidades la factura electrónica checa el sello contra el certificado</Alert>
                     <Card>
			<CardHeader color="success" className="text-center" >Certificado</CardHeader>
			<CardBody>
			  <CardSubtitle className="text-center">{certijson.rfc}</CardSubtitle>
			  <CardText color="success" className="text-center" >{certijson.nombre}</CardText>
			  <CardText className="text-center">{certijson.curp}</CardText>
			  <CardText className="text-center">{certijson.email}</CardText>
			  <CardText className="text-center">Vigencia del <b>{certijson.desde}</b> al <b>{certijson.hasta}</b></CardText>
			</CardBody>
			<CardFooter  className="text-center">{certijson.emisor}</CardFooter>
                     </Card>
              </Container> }
              { nook && <Container id="nook" className="border p-2 mb-3">
                     <Alert color="danger"> {msg} </Alert>
              </Container> }
        </div>
    )
  }
};
export default Validafael;

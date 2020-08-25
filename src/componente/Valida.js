import React, {Component} from 'react';
import { browserHistory  } from 'react-router';
import { Button, FormGroup, Label, Input, Container, Alert,Card,CardBody,CardSubtitle,CardText,CardHeader,CardFooter} from 'reactstrap';
import fiel from '../fiel';


class Valida extends Component {
  constructor(props){
    super(props);
    this.nextPath = this.nextPath.bind(this);
    this.state = { ok : false , nook:false , msg:'', nombre:'',rfc:'',curp:'',email:'',emisor:'',desde:null,hasta:null}
    this.validafirma = this.validafirma.bind(this)
  }
  nextPath(path) {
      browserHistory.push(path);
  }
  componentDidMount(){
    //var x = new window.fiel;
    //console.log('monto el componente');
    //x.cargafiellocal();
  }
  validafirma(){
    var x = new fiel();
    var res=x.validafiellocal(document.querySelector('#pwdfiel').value);
    console.log('x='+JSON.stringify(res));
    if (res.ok===true) {
       this.setState({ ok: true, nook:false,nombre:res.nombre,rfc:res.rfc, curp:res.curp,email:res.email,emisor:res.emisor,desde:res.desde,hasta:res.hasta });
    }
    if (res.ok===false) {
       this.setState({ ok: false, nook:true,msg:res.msg  });
    }

  }
  render() {
    console.log('render carga');
    const { ok, nook, msg, nombre,rfc,curp,email,emisor,desde,hasta } = this.state;
    return  (
        <div id="ayuda" class="container">
	      <h2 className="text-center" >Validar firma electrónica</h2>
              <Container className="border p-2 mb-3">
		      <FormGroup class="container">
			<Label for="pwdfiel">Contraseña de la llave privada</Label>
			<Input type="password" name="password" id="pwdfiel" placeholder="contraseña" />
		      </FormGroup>
                      <div class="flex-col d-flex justify-content-center">
		           <Button color="primary" onClick={this.validafirma}>Validar</Button>
                      </div>
              </Container>
              { ok && <Container id="ok" className="border p-2 mb-3">
                     <Alert color="success" className="text-center" >Felicidades tu llave pública y privada corresponden entre si y tu password corresponde a tu llave privada</Alert>
                     <Card>
			<CardHeader color="success" className="text-center" >{nombre}</CardHeader>
			<CardBody>
			  <CardSubtitle className="text-center">{rfc}</CardSubtitle>
			  <CardText className="text-center">{curp}</CardText>
			  <CardText className="text-center">{email}</CardText>
			  <CardText className="text-center">Vigencia del <b>{desde}</b> al <b>{hasta}</b></CardText>
			</CardBody>
			<CardFooter  className="text-center">{emisor}</CardFooter>
                     </Card>
              </Container> }
              { nook && <Container id="nook" className="border p-2 mb-3">
                     <Alert color="danger"> {msg} </Alert>
              </Container> }
        </div>
    )
  }
};
export default Valida;

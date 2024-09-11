import React, {Component} from 'react';
import { Button, FormGroup, Label, Input, Container, Alert,Card,CardBody,CardSubtitle,CardText,CardHeader,CardFooter,InputGroup,InputGroupAddon} from 'reactstrap';
import fiel from '../fiel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DMS from '../descargaMasivaSat';


class Valida extends Component {
  constructor(props){
    super(props);
    this.state = { ok : false , nook:false , msg:'', nombre:'',rfc:'',curp:'',email:'',emisor:'',desde:null,hasta:null,type:'password',ojos:'eye'}
    this.validafirma = this.validafirma.bind(this)
    this.showHide = this.showHide.bind(this)
    this.autenticaContraSAT = this.autenticaContraSAT.bind(this);
  }

  validafirma(){
    var x = new fiel();
    var res=x.validafiellocal(document.querySelector('#pwdfiel').value);
    if (res.ok===true) {
       this.setState({ ok: true, nook:false,nombre:res.nombre,rfc:res.rfc, curp:res.curp,email:res.email,emisor:res.emisor,desde:res.desde,hasta:res.hasta });
       window.PWDFIEL=document.querySelector('#pwdfiel').value;
	    this.autenticaContraSAT(); 
    }
    if (res.ok===false) {
       this.setState({ ok: false, nook:true,msg:res.msg  });
    }
  }

  showHide(e){
    this.setState({
      type: this.state.type === 'input' ? 'password' : 'input',
      ojos: this.state.ojos === 'eye' ? 'eye-slash' : 'eye'
    })  
  }

  autenticaContraSAT () {
            var x = new DMS();
            var res=x.autenticate_armasoa(window.PWDFIEL);  /* solo arma al SOA ya firmado */
            if (res.ok===true) {
                      this.setState({ ok: true, nook:false });
                      x.autenticate_enviasoa(res,window.PWDFIEL)  /* Envia el soa para autentica al rfc o a la FIEL */
            } else {
               this.setState({ ok: false, nook:true,msg:res.msg  });
            }
  }


  render() {
    const { ok, nook, msg, nombre,rfc,curp,email,emisor,desde,hasta,type,ojos } = this.state;
    return  (
        <Card id="validafiel" className="p-2 m-2">
	      <h2 className="text-center" >Validar firma electrónica</h2>
              <Container className="border p-2 mb-3">
		      <FormGroup className="container">
			<Label for="pwdfiel">Contraseña de la llave privada</Label>
                        <InputGroup>
				<Input type={type} name="password" id="pwdfiel" placeholder="contraseña" />
                                <InputGroupAddon addonType="append">
					<Button onClick={this.showHide} ><FontAwesomeIcon icon={['fas' , ojos]} /></Button>
                                </InputGroupAddon>
                        </InputGroup>
		      </FormGroup>
                      <div className="flex-col d-flex justify-content-center">
		           <Button color="primary" onClick={this.validafirma}>Validar</Button>
                      </div>
              </Container>
              { ok && <Container id="ok" className="border p-2 mb-3">
                     <Alert color="success" className="text-center d-flex justify-content-between align-items-center" ><FontAwesomeIcon icon={['fas' , 'thumbs-up']} /> Felicidades tu llave pública y privada corresponden entre si y tu contraseña corresponde a tu llave privada</Alert>
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
                     <Alert color="danger" className="text-center  d-flex justify-content-between align-items-center"><FontAwesomeIcon icon={['fas' , 'thumbs-down']} /> {msg} </Alert>
              </Container> }
        </Card>
    )
  }
};
export default Valida;

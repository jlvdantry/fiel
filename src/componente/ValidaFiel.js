import React, {Component} from 'react';
import { Button, FormGroup, Label, Input, Container, Alert,Card,CardBody,CardSubtitle,CardText,CardHeader,CardFooter,InputGroup,InputGroupAddon} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

let DMS=null;
class CargaFiel extends Component {
  constructor(props){
    super(props);
    this.state = { loading:false,pwdfiel:'',ok : false , nook:false , msg:'', nombre:'',rfc:'',curp:'',email:'',emisor:'',desde:null,hasta:null,type:'password',ojos:'eye'}
    this.validafirma = this.validafirma.bind(this)
    this.showHide = this.showHide.bind(this)
    this.revisaFirma = this.revisaFirma.bind(this);
    this.yaCargoFirma = this.yaCargoFirma.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.timeryaCargo = null; // Timer en la instancia
    this.mifiel=null;
  }

  revisaFirma(){
       // Si ya está procesando, ignoramos cualquier clic extra
       if (this.state.loading) return;

       this.setState({ loading: true, ok: false, nook: false }); // Iniciamos bloqueo
       if (this.timeryaCargo) {
           clearInterval(this.timeryaCargo);
       }
       this.mifiel = new window._fiel();
       this.timeryaCargo = setInterval(() => this.yaCargoFirma(), 1000)
  };

  // Capturar el texto del input
  handleInputChange = (e) => {
    this.setState({ pwdfiel: e.target.value });
  }


  yaCargoFirma() {
      if (this.mifiel && this.mifiel.privada !== null && this.mifiel.publica !== null) {
          clearInterval(this.timeryaCargo); 
          this.validafirma();
      }
  }



  componentDidMount() {
          DMS = new window.DescargaMasivaSat();
  }

  componentWillUnmount() {
      // Detener cualquier proceso si el usuario cambia de menú
      if (this.timeryaCargo) {
          clearInterval(this.timeryaCargo);
      }
  }

  validafirma() {
            const { pwdfiel } = this.state;
	    this.mifiel.validafiellocal(pwdfiel).then( res => {
		    console.log('[validafirma] despues de terminar validafiellocal');
		    if (res.ok===true) {
		       this.setState({ loading:false, ok: true, nook:false,nombre:res.nombre,rfc:res.rfc, curp:res.curp,email:res.email,emisor:res.emisor,desde:res.desde,hasta:res.hasta });
		       window.PWDFIEL=pwdfiel;

		       if ('serviceWorker' in navigator) {
			  navigator.serviceWorker.ready.then((registration) => {
			    if (registration.active) {
			      registration.active.postMessage({ action: 'setContra',PWDFIEL:window.PWDFIEL });
			    }
			  });
		       } 
                       DMS.autenticate_armasoa(window.PWDFIEL);  // generar el request para autenticarse contra el set
                       window.inserta_nonce({});                 // genera el request del nonce para autenticarse con la fiel parra hacer syc-request contra el sata cada 15 minutos
		    }
		    else {
		       this.setState({ loading:false,ok: false, nook:true,msg:res.msg  });
		    }
	    }).catch(err => {
		// Siempre desbloquear en caso de error inesperado
		this.setState({ loading: false, nook: true, msg: "Error inesperado" });
	    });
  }

  showHide(e){
    this.setState({
      type: this.state.type === 'input' ? 'password' : 'input',
      ojos: this.state.ojos === 'eye' ? 'eye-slash' : 'eye'
    })  
  }



  render() {
    const { pwdfiel, loading, ok, nook, msg, nombre,rfc,curp,email,emisor,desde,hasta,type,ojos } = this.state;
    return  (
        <Card id="validafiel" className="p-2 m-2">
	      <h2 className="text-center" >Validar firma electrónica</h2>
              <Container className="border p-2 mb-3">
		      <FormGroup className="container">
			<Label for="pwdfiel">Contraseña de la llave privada</Label>
                        <InputGroup>
				<Input type={type} value={pwdfiel} onChange={this.handleInputChange} name="password" id="pwdfiel" placeholder="contraseña" />
                                <InputGroupAddon addonType="append">
					<Button onClick={this.showHide} ><FontAwesomeIcon icon={['fas' , ojos]} /></Button>
                                </InputGroupAddon>
                        </InputGroup>
		      </FormGroup>
                      <div className="flex-col d-flex justify-content-center">
		           <Button color="primary" onClick={this.revisaFirma} disabled={loading || !pwdfiel} >
	                         {loading ? ( <> <FontAwesomeIcon icon={['fas', 'spinner']} spin className="mr-2" /> Validando...  </>) : "Validar"}
	                   </Button>
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
export default CargaFiel;

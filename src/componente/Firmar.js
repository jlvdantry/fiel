import React, {Component} from 'react';
import { Button, FormGroup, Label, Input, Container, Alert,Card,CardBody,CardSubtitle,CardText,CardHeader,CardFooter,InputGroup,InputGroupAddon} from 'reactstrap';
import fiel from '../fiel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import ShowMoreText from 'react-show-more-text';


class Firmar extends Component {
  constructor(props){
    super(props);
    this.state = { ok : false , nook:false , msg:'', nombre:'',rfc:'',curp:'',email:'',emisor:'',desde:null,hasta:null,type:'password'
                              ,ojos:'eye', sellogen:'', cer:''}
    this.validafirma = this.validafirma.bind(this)
    this.showHide = this.showHide.bind(this)
  }

  validafirma(){
    var x = new fiel();
    var res=x.validafiellocal(document.querySelector('#pwdfiel').value,this.props.value);
    if (res.ok===true) {
       this.setState({ ok: true, nook:false,nombre:res.nombre,rfc:res.rfc, curp:res.curp,email:res.email,emisor:res.emisor,desde:res.desde,hasta:res.hasta
                               ,sellogen:res.sellogen, cer:res.cer });
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

  render() {
    console.log('render carga');
    const { ok, nook, msg, nombre,rfc,curp,email,emisor,desde,hasta,type,ojos,sellogen,cer } = this.state;
    return  (
        <Card id="validafiel" className="p-2 m-2">
	      <h2 className="text-center" >Firmar electrónica </h2>
              <Container className="border p-2 mb-3">
		      <FormGroup class="container">
			<Label for="pwdfiel">Contraseña de la llave privada</Label>
                        <InputGroup>
				<Input type={type} name="password" id="pwdfiel" placeholder="contraseña" />
                                <InputGroupAddon addonType="append">
					<Button onClick={this.showHide} ><FontAwesomeIcon icon={['fas' , ojos]} /></Button>
                                </InputGroupAddon>
                        </InputGroup>
		      </FormGroup>
                      <div class="flex-col d-flex justify-content-center">
		           <Button color="primary" onClick={this.validafirma}>Firmar</Button>
                      </div>
              </Container>
              { ok && <Container id="ok" className="border p-2 mb-3">
                     <Alert color="success" className="text-center d-flex justify-content-between align-items-center" ><FontAwesomeIcon icon={['fas' , 'thumbs-up']} /> Felicidades se pudo realizar la firma eletrónica</Alert>
                     <Card>
			<CardHeader color="success" className="text-center" >{'Firmado por ' + nombre}</CardHeader>
			<CardBody>
			  <CardSubtitle className="text-center">FIRMA: 
                                    <ShowMoreText
                                        lines={3}
                                        more='Ver mas'
                                        less='Ver menos'
                                        anchorClass=''
                                        expanded={false}
                                        width={280}
                                    >{ sellogen } </ShowMoreText>
                          </CardSubtitle>
			  <CardText className="text-center">{'CADENA: ' +this.props.value}</CardText>
			  <CardText className="text-center">CERTIFICADO: 
				    <ShowMoreText
					lines={3}
					more='Ver mas'
					less='Ver menos'
					anchorClass=''
					expanded={false}
					width={280}
				    >{ cer } </ShowMoreText>
                          </CardText>
			  <CardText className="text-center">Vigencia del <b>{desde}</b> al <b>{hasta}</b></CardText>
			</CardBody>
                     </Card>
              </Container> }
              { nook && <Container id="nook" className="border p-2 mb-3">
                     <Alert color="danger" className="text-center  d-flex justify-content-between align-items-center"><FontAwesomeIcon icon={['fas' , 'thumbs-down']} /> {msg} </Alert>
              </Container> }
        </Card>
    )
  }
};

        Firmar.propTypes = {
          value: PropTypes.string
        };

        Firmar.defaultProps = {
          value: 'prueba'
        };

export default Firmar
 

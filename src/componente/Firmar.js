import React, {Component} from 'react';
import { Button, FormGroup, Label, Input, Container, Alert,Card,CardBody,CardSubtitle,CardText,CardHeader,InputGroup,InputGroupAddon} from 'reactstrap';
import fiel from '../fiel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import ShowMoreText from 'react-show-more-text';


class Firmar extends Component {
  constructor(props){
    super(props);
    this.state = { ok : false , nook:false , msg:'', nombre:'',desde:null,hasta:null,type:'password'
                              ,ojos:'eye', sellogen:'', cer:'', seintegro:0}
    this.validafirma = this.validafirma.bind(this)
    this.insertafirma = this.insertafirma.bind(this)
    this.showHide = this.showHide.bind(this)
  }

  insertafirma(){
        const firmajson={ sellogen: this.state.sellogen, cadena : this.props.value, cer: this.state.cer };
        var that=this;
        window.openDatabasex(window.DBNAME,window.DBVERSION).then(function() {
                             window.inserta_firma(firmajson).then(function() {
                                                            that.setState({seintegro:1});
                                                            that.props.onRefresca();
                                                    }).catch(function(err)  {
                                                            that.setState({seintegro:2});
                                                    });
                  });
  }


  validafirma(){
    var x = new fiel();
    var res=x.validafiellocal(document.querySelector('#pwdfiel').value,this.props.value);
    if (res.ok===true) {
       this.setState({ ok: true, nook:false,nombre:res.nombre,desde:res.desde,hasta:res.hasta
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
    const { ok, nook, msg, nombre,desde,hasta,type,ojos,sellogen,cer,seintegro } = this.state;
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
		           <Button color="primary" onClick={this.validafirma}><FontAwesomeIcon icon={['fas' , 'signature']} /> Firmar</Button>
                      </div>
              </Container>
              { ok && <Container id="ok" className="border p-2 mb-3">
                     <Alert color="success" className="text-center d-flex justify-content-between align-items-center" ><FontAwesomeIcon icon={['fas' , 'thumbs-up']} /> Felicidades se pudo firmar electrónicamente</Alert>
                     <Card>
			<CardHeader color="success" className="text-center" >{'Firmado por ' + nombre}</CardHeader>
			<CardBody>
			  <CardSubtitle className="text-center"><b>FIRMA:</b>
                                    <ShowMoreText
                                        lines={3}
                                        more='Ver mas'
                                        less='Ver menos'
                                        anchorClass=''
                                        expanded={false}
                                        width={280}
                                    >{ sellogen } </ShowMoreText>
                          </CardSubtitle>
		          <CardText className="text-center"><b>CADENA:</b> 
                                    <ShowMoreText
                                        lines={3}
                                        more='Ver mas'
                                        less='Ver menos'
                                        anchorClass=''
                                        expanded={false}
                                        width={280}
                                    >{ this.props.value } </ShowMoreText>
                          </CardText>
			  <CardText className="text-center"><b>CERTIFICADO: </b>
				    <ShowMoreText
					lines={3}
					more='Ver mas'
					less='Ver menos'
					anchorClass=''
					expanded={false}
					width={280}
				    >{ cer } </ShowMoreText>
                          </CardText>
			  <CardText className="text-center">Vigencia del certificado <b>{desde}</b> al <b>{hasta}</b></CardText>
			</CardBody>
				 <div className="flex-col d-flex justify-content-center m-1">
					   <Button color="primary" onClick={this.insertafirma}> <FontAwesomeIcon icon={['fas' , 'plus-circle']} /> 
							      ¿Desea agregar al historial de firmas?</Button>
				 </div>
                     </Card>
                 <div className="flex-col d-flex justify-content-center mt-3">
                         { seintegro===1 && <Alert color="success" >
                                      <FontAwesomeIcon icon={['fas' , 'thumbs-up']} /> Se integro la firma al historico</Alert> }
                         { seintegro===2 && <Alert color="danger"  className={ seintegro===2 ? 'd-none d-flex align-items-center' : ''  } >
                                      <FontAwesomeIcon icon={['fas' , 'thumbs-down']} className='mr-2' /> La firma ya esta integrada al historico</Alert>  }
                 </div>

              </Container> }
              { nook && <Container id="nook" className="border p-2 mb-3">
                     <Alert color="danger" className="text-center  d-flex justify-content-between align-items-center"><FontAwesomeIcon icon={['fas' , 'thumbs-down']} /> {msg} </Alert>
              </Container> }
        </Card>
    )
  }
};

        Firmar.propTypes = {
          value: PropTypes.string,
          onRefresca: PropTypes.func.isRequired
        };

        Firmar.defaultProps = {
          value: 'prueba',
          onRefresca: () => null
        };

export default Firmar
 

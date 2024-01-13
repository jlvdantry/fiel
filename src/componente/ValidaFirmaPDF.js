import React, {Component} from 'react';
import { Button, FormGroup, Label, Input, Container, Alert,Card,CardBody,CardSubtitle,CardText,CardHeader,CardFooter,InputGroup,InputGroupAddon} from 'reactstrap';
import fiel from '../fiel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import pdfjsLib from 'pdfjs-dist/build/pdf';
const pdfjs = require('pdfjs-dist');

class ValidaFirmaPDF extends Component {
  constructor(props){
    super(props);
    this.state = { ok : false , nook:false , msg:'', nombre:'',rfc:'',curp:'',email:'',emisor:'',desde:null,hasta:null,type:'password',ojos:'eye',pdfText:''}
    this.validafirma = this.validafirma.bind(this)
    this.showHide = this.showHide.bind(this)
  }

  validafirma(){
/*
    var x = new fiel();
    var res=x.validafiellocal(document.querySelector('#pwdfiel').value);
    if (res.ok===true) {
       this.setState({ ok: true, nook:false,nombre:res.nombre,rfc:res.rfc, curp:res.curp,email:res.email,emisor:res.emisor,desde:res.desde,hasta:res.hasta });
    }
    if (res.ok===false) {
       this.setState({ ok: false, nook:true,msg:res.msg  });
    }
*/
    var pdfData = atob(localStorage.getItem('pdf').substring(localStorage.getItem('pdf').indexOf('base64,')+7));
    var loadingTask = pdfjs.getDocument({data: pdfData});
    loadingTask.promise.then(function(pdf) {
                console.log('PDF loaded');
	      let text = '';
	      for (let i = 1; i <= pdf.numPages; i++) {
		  pdf.getPage(i).then( (page) => {
		      page.getTextContent().then( (pageText) => {
		           text += pageText.items.map((item) => item.str).join(' ');
                           })
                      })
	      }
              this.setState({ pdfText: text} );

                
    }, function (reason) {
       // PDF loading error
       console.error(reason);
    });
  }

  showHide(e){
    this.setState({
      type: this.state.type === 'input' ? 'password' : 'input',
      ojos: this.state.ojos === 'eye' ? 'eye-slash' : 'eye'
    })  
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
      <div>
        <h2>Extracted Text:</h2>
        <pre>{this.state.pdfText}</pre>
      </div>
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
export default ValidaFirmaPDF;

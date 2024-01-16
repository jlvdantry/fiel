import React, {Component} from 'react';
import { Button, FormGroup, Label, Input, Container, Alert,Card,CardBody,CardSubtitle,CardText,CardHeader,CardFooter,InputGroup,InputGroupAddon} from 'reactstrap';
import fiel from '../fiel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as pdfjsWorker from "pdfjs-dist/build/pdf.worker";
import * as PDFJS from 'pdfjs-dist/build/pdf';
//import PdfViewer from './PdfViewer';
window.PDFJS = PDFJS;
class ValidaFirmaPDF extends Component {
  constructor(props){
    super(props);
    this.state = { ok : false , nook:false , msg:'', nombre:'',rfc:'',curp:'',email:'',emisor:'',desde:null,hasta:null,type:'password',ojos:'eye',pdfText:''}
    this.validafirma = this.validafirma.bind(this)
    this.showHide = this.showHide.bind(this)
    this.ordenapaginas = this.ordenapaginas.bind(this)
  }

  validafirma(){
    PDFJS.GlobalWorkerOptions.workerSrc = pdfjsWorker;
    var pdfData = atob(localStorage.getItem('pdf').substring(localStorage.getItem('pdf').indexOf('base64,')+7));
    var loadingTask = PDFJS.getDocument({data: pdfData});
    loadingTask.promise.then( (pdf)=>{
              console.log('PDF loaded');
              this.ordenapaginas(pdf).then( (paginas) => {
                    console.log('paginas:'+JSON.stringify(paginas));
              })
                
    }, function (reason) {
       console.error(reason);
    });
  }

  ordenapaginas(pdf) {
         
      return new Promise(async (resolve) => {
              var lineas = [];
              var paginas = [];
              for (let i = 1; i <= pdf.numPages; i++) {
                  await pdf.getPage(i).then( async (page) => {
                      await page.getTextContent().then( (pageText) => {
                               //console.log('pageText:'+JSON.stringify(pageText));
                               var pagina=pageText.items[pageText.items.length-1].str.substr(7,1)
                               console.log('pagina:'+pagina);
                               paginas[pagina]=pageText.items;
                           })
                      })
               }
               resolve(paginas);
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
    const pdfUrl = 'path/to/your/pdf/file.pdf';
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

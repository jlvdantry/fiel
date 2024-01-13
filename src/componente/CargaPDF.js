import React, {Component} from 'react';
import {FormGroup, Alert, Button, Card} from 'reactstrap';
import { browserHistory  } from 'react-router';
import fiel from '../fiel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


let timer = null;
class CargaPDF extends Component {

  constructor(props){
    super(props);
    this.nextPath = this.nextPath.bind(this);
    this.state = { cer_name : '', pdf_name:'' };
    this.cargarpub = this.cargarpub.bind(this);
    this.cargarpdf = this.cargarpdf.bind(this);
    this.cambio = this.cambio.bind(this);
  }

  nextPath(path) {
      browserHistory.push(path);
  }
  componentDidMount(){
      timer = setInterval(() => this.cambio(), 2000)
  }
  componentWillUnmount() {
    clearTimeout(timer);
  }

  onChangeHandler=event=>{
    console.log(event.target.files[0])
  }

  cambio() {
       if (localStorage.getItem('cer_name')!=null) {
          this.setState({cer_name : localStorage.getItem('cer_name')})
       } else {  this.setState({cer_name : null })  }
       if (localStorage.getItem('pdf_name')!=null) {
          this.setState({pdf_name : localStorage.getItem('pdf_name')})
       } else { this.setState({pdf_name : null }) }
  }

  cargarpub() {
    var x = new fiel();
    x.cargafiellocal('cer');
  }

  cargarpdf() {
    var x = new fiel();
    x.cargaarchivolocal('pdf');
  }

  render() {
    const { cer_name, pdf_name } = this.state;
    return  (
        <Card id="cargafiel" className="m-2 p-2">
                  <h2 className="text-center">Ubicar documento que fue firmado con la FIEL emitida por el SAT</h2>
                      <FormGroup className="container">
                        { cer_name && <Alert className="text-center d-flex justify-content-between align-items-center"> 
                                     <FontAwesomeIcon icon={['fas' , 'thumbs-up']} /> Ubicacion de la llave pública {cer_name}</Alert> }
                        { pdf_name && <Alert className="text-center d-flex justify-content-between align-items-center">
                                     <FontAwesomeIcon icon={['fas' , 'thumbs-up']} /> Ubicación del documento {pdf_name}</Alert> }
                        { !cer_name && <Alert color="danger" className="text-center d-flex justify-content-between align-items-center">
                                     <FontAwesomeIcon icon={['fas' , 'thumbs-down']} /> Aún no esta la llave pública </Alert> }
                        { !pdf_name && <Alert color="danger" className="text-center  d-flex justify-content-between align-items-center">
                                     <FontAwesomeIcon icon={['fas' , 'thumbs-down']} /> Aún no esta ubicada el documento con formato PDF</Alert> }
                      <div className="flex-col d-flex justify-content-around">
				<Button color="primary"  onClick={this.cargarpub}>
                                     <FontAwesomeIcon icon={['fas' , 'certificate']} className="mr-2"/> Ubicar llave pública</Button>
				<Button color="primary"  className="ml-2" onClick={this.cargarpdf}>
                                     <FontAwesomeIcon icon={['fas' , 'key']} className="mr-2"/> Ubicar documento PDF firmado con la FIEL</Button>
                      </div>
                      </FormGroup>
        </Card>
    )
  }
};
export default CargaPDF;

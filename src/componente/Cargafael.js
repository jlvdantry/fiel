import React, {Component} from 'react';
import {FormGroup, Alert, Button, Card} from 'reactstrap';
import { browserHistory  } from 'react-router';
import fiel from '../fiel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


let timer = null;
class Cargafael extends Component {

  constructor(props){
    super(props);
    this.nextPath = this.nextPath.bind(this);
    this.state = { xml_name : '' };
    this.cargar = this.cargar.bind(this);
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
       if (localStorage.getItem('xml_name')!=null) {
          this.setState({xml_name : localStorage.getItem('xml_name')})
       } else {  this.setState({xml_name : null })  }
  }

  cargar() {
    var x = new fiel();
    x.cargafael();
  }

  render() {
    const { xml_name } = this.state;
    return  (
        <Card id="cargafael" className="p-2 m-2">
                  <h2 class="text-center">Ubicar factura electrónica</h2>
                      <FormGroup class="container">
                        { xml_name && <Alert className="text-center d-flex justify-content-between align-items-center"><FontAwesomeIcon icon={['fas' , 'thumbs-up']} /> Ubicación de la factura electrónica {xml_name}</Alert> }
                        { !xml_name && <Alert color="danger" className="text-center d-flex justify-content-between align-items-center">
                                          <FontAwesomeIcon icon={['fas' , 'thumbs-down']} /> Aún no esta ubicada la factura</Alert> }
			      <div class="flex-col d-flex justify-content-center">
				<Button color="primary" onClick={this.cargar}>Ubicar factura</Button>
			      </div>
                      </FormGroup>
        </Card>
    )
  }
};
export default Cargafael;

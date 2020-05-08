import React, {Component} from 'react';
import {FormGroup, Alert, Button} from 'reactstrap';
import { browserHistory  } from 'react-router';


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
       console.log('entro en cambio');
       if (localStorage.getItem('xml_name')!=null) {
          this.setState({xml_name : localStorage.getItem('xml_name')})
       } else {  this.setState({xml_name : null })  }
  }

  cargar() {
    var x = new window.fiel;
    x.cargafael();
  }

  render() {
    const { xml_name } = this.state;
    return  (
        <div id="ayuda" >
                  <h2 class="text-center">Cargar factura electrónica</h2>
                      <FormGroup class="container">
                        { xml_name && <Alert >Ubicacion de la factura electrónica {xml_name}</Alert> }
                        { !xml_name && <Alert color="danger">Aún no esta ubicada la factura</Alert> }
                        <Button color="primary" onClick={this.cargar}>Cargar</Button>
                      </FormGroup>
        </div>
    )
  }
};
export default Cargafael;

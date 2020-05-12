import React, {Component} from 'react';
import {FormGroup, Alert, Button} from 'reactstrap';
import { browserHistory  } from 'react-router';
import fiel from '../fiel';


let timer = null;
class Carga extends Component {

  constructor(props){
    super(props);
    this.nextPath = this.nextPath.bind(this);
    this.state = { cer_name : '', key_name:'' };
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
       if (localStorage.getItem('cer_name')!=null) {
          this.setState({cer_name : localStorage.getItem('cer_name')})
       } else {  this.setState({cer_name : null })  }
       if (localStorage.getItem('key_name')!=null) {
          this.setState({key_name : localStorage.getItem('key_name')})
       } else { this.setState({key_name : null }) }
  }

  cargar() {
    var x = new fiel;
    console.log('cargar');
    x.cargafiellocal();
  //  archivos.cer.addEventListener('change', this.cambio());
  //  archivos.cer.onchange = this.cambiokey();
  }

  render() {
    const { cer_name, key_name } = this.state;
    return  (
        <div id="ayuda" >
                  <h2 class="text-center">Cargar firma electrónica</h2>
                      <FormGroup class="container">
                        { cer_name && <Alert >Ubicacion de la llave pública {cer_name}</Alert> }
                        { key_name && <Alert >Ubicación de la llave privada {key_name}</Alert> }
                        { !cer_name && <Alert color="danger">Aún no esta ubicada la llave pública</Alert> }
                        { !key_name && <Alert color="danger">Aún no esta ubicada la llave privada</Alert> }
                        <Button color="primary" onClick={this.cargar}>Cargar</Button>
                      </FormGroup>
        </div>
    )
  }
};
export default Carga;

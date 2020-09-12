import React, {Component} from 'react';
import {FormGroup, Alert, Button, ButtonGroup, Card} from 'reactstrap';
import { browserHistory  } from 'react-router';
import fiel from '../fiel';


let timer = null;
class Carga extends Component {

  constructor(props){
    super(props);
    this.nextPath = this.nextPath.bind(this);
    this.state = { cer_name : '', key_name:'' };
    this.cargarpub = this.cargarpub.bind(this);
    this.cargarkey = this.cargarkey.bind(this);
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
       if (localStorage.getItem('key_name')!=null) {
          this.setState({key_name : localStorage.getItem('key_name')})
       } else { this.setState({key_name : null }) }
  }

  cargarpub() {
    var x = new fiel();
    x.cargafiellocal('cer');
  }

  cargarkey() {
    var x = new fiel();
    x.cargafiellocal('key');
  }

  render() {
    const { cer_name, key_name } = this.state;
    return  (
        <Card id="cargafiel" className="m-2 p-2">
                  <h2 class="text-center">Ubicar firma electrónica</h2>
                      <FormGroup class="container">
                        { cer_name && <Alert className="text-center">Ubicacion de la llave pública {cer_name}</Alert> }
                        { key_name && <Alert className="text-center">Ubicación de la llave privada {key_name}</Alert> }
                        { !cer_name && <Alert color="danger" className="text-center">Aún no esta ubicada la llave pública</Alert> }
                        { !key_name && <Alert color="danger" className="text-center">Aún no esta ubicada la llave privada</Alert> }
                      <div class="flex-col d-flex justify-content-around">
				<Button color="primary"  onClick={this.cargarpub}>Ubicar llave pública</Button>
				<Button color="primary"  onClick={this.cargarkey}>Ubicar llave privada</Button>
                      </div>
                      </FormGroup>
        </Card>
    )
  }
};
export default Carga;

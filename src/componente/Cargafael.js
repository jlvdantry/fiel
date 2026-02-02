import React, {Component} from 'react';
import {FormGroup, Alert, Button, Card} from 'reactstrap';
import { browserHistory  } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


class Cargafael extends Component {

  constructor(props){
    super(props);
    this.nextPath = this.nextPath.bind(this);
    this.state = { xml_name : [] };
    this.cargar = this.cargar.bind(this);
    this.cambio = this.cambio.bind(this);
    this.time   = null;
  }

  nextPath(path) {
      browserHistory.push(path);
  }
  componentDidMount(){
      this.timer = setInterval(() => this.cambio(), 2000)
  }


  componentWillUnmount() {
    // Limpiar usando la referencia de la instancia
    if (this.timer) {
        clearInterval(this.timer);
    }
  }

  onChangeHandler=event=>{
    console.log(event.target.files[0])
  }

  cambio() {
       var xml_name=[];
	for (var i = 0; i < localStorage.length; i++) {
          var key = localStorage.key(i);
          if (key.indexOf('xml_name_')!==-1) {
             xml_name.push(localStorage.getItem(key));
          }
	}
        this.setState({xml_name : xml_name });
  }

  cargar() {
    var x = new fiel();
    x.cargafael();
  }

  render() {
    const { xml_name } = this.state;
    const mos = xml_name.map((x) => <Alert className="text-center d-flex justify-content-between align-items-center"><FontAwesomeIcon icon={['fas' , 'thumbs-up']} />{"Ubicación de la factura electrónica "  + x }</Alert> );
    return  (
        <Card id="cargafael" className="p-2 m-2">
                  <h2 className="text-center">Ubicar factura electrónica</h2>
                      <FormGroup className="container">
                        { xml_name.length!==0 && mos }
                        { xml_name.length===0 && <Alert color="danger" className="text-center d-flex justify-content-between align-items-center">
                                          <FontAwesomeIcon icon={['fas' , 'thumbs-down']} /> Aún no esta ubicada la factura</Alert> }
			      <div className="flex-col d-flex justify-content-center">
				<Button color="primary" onClick={this.cargar}>Ubicar factura</Button>
			      </div>
                      </FormGroup>
        </Card>
    )
  }
};
export default Cargafael;

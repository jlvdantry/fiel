import React, {Component }  from 'react';
import { Alert,Card,CardBody,Input,Label,Button } from 'reactstrap';
import { selObjectUlt,inserta_dias_token } from "./../db.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
class About extends Component {
  constructor(props) {
    super(props);
    this.cambiar  = this.cambiar.bind(this);
    this.damedias = this.damedias.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  state={ dias:0, key:0, actualizo:false }

  damedias(){
       selObjectUlt('configuracion',undefined,undefined,'prev').then( d => {
             this.setState({ dias:d.valor.dias_token,key:d.key });
       });
  }

  cambiar(){
      inserta_dias_token(document.querySelector('#dias_token').value);
      this.damedias();
      this.setState({ actualizo:true });
      console.log('cambio dias_token');
  }

  handleInputChange = (event) => {
    let value = event.target.value.replace(/[^\d.]/g, '');

    const parts = value.split('.');
    if (parts[0].length > 3) {
      parts[0] = parts[0].slice(0, 3);
    }
    if (parts[1] && parts[1].length > 3) {
      parts[1] = parts[1].slice(0, 3);
    }
    value = parts.join('.');

    this.setState({dias : value, actualizo:false});
    console.log('manejo el cambio de dias_token');
  };

  componentDidMount(){
      this.damedias();
  }

  render() {

     return  (
        <div>
                 <div className="mb-2" >
                                { this.state.actualizo===true &&
                                <div id="nook" className="mt-1">
                                       <Alert color="success" className="text-center  d-flex justify-content-between align-items-center">
                                          <FontAwesomeIcon icon={['fas' , 'thumbs-up']} /> Se actualizo el día de duración del token </Alert>
                                </div> }

			<Card >
			  <CardBody>
                      <div className="d-flex justify-content-center">
                        <Label className="col-lg-6" for="dias_token">Días de duración del token</Label>
                        <Input className="col-lg-1 pr-0" maxlength="7" type="text" name="dias_token" id="dias_token" placeholder="999" onChange={this.handleInputChange} value={this.state.dias} />
                      </div>
                      <div className="flex-col d-flex justify-content-center mt-3">
                           <Button color="primary" onClick={this.cambiar}>Cambiar</Button>
                      </div>
			  </CardBody>
			</Card>
                  </div>
        </div>
    )
  };
};
export default About;

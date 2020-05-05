import React, {Component} from 'react';
import { browserHistory  } from 'react-router';
import { Badge } from 'reactstrap';


class Carga extends Component {
  constructor(props){
    super(props);
    this.nextPath = this.nextPath.bind(this);
  }
  nextPath(path) {
      browserHistory.push(path);
  }
  componentDidMount(){
    var x = new window.fiel;
    console.log('monto el componente');
    x.cargafiellocal();
  }
  render() {
    console.log('render carga');
    return  (
        <div id="ayuda" >
                  <h2>Cargar firma electronica</h2>
        </div>
    )
  }
};
export default Carga;

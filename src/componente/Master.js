import React, {Component} from 'react';
import { Container} from 'reactstrap';
import  Menumi  from '../componente/Menu';


class Master extends Component {
/*
  constructor(props){
    super(props);
  }
*/

  render() {
    return  (
      <div>
	      <Menumi />
	      <Container id="contenedor" className="container mt-4 col-lg-8">
		  {this.props.children}
	      </Container>
      </div>
    )
  }
};
export default Master;

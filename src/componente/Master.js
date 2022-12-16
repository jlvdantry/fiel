import React, {Component} from 'react';
import { Container} from 'reactstrap';
import  Menumi  from '../componente/Menu';


class Master extends Component {
  constructor(props){
    super(props);
  }

  render() {
    return  (
      <div>
	      <Menumi />
	      <Container className="mt-4">
		  {this.props.children}
	      </Container>
      </div>
    )
  }
};
export default Master;

import React, {Component} from 'react';
import { Container} from 'reactstrap';
import { browserHistory  } from 'react-router';
import  Menumi  from '../componente/Menu';


class Master extends Component {
  constructor(props){
    console.log('entro en el constructor');
    super(props);
    this.nextPath = this.nextPath.bind(this);
  }
  nextPath(path) {
      browserHistory.push(path);
  }

  render() {
    console.log('va a renderiar Master.js');
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

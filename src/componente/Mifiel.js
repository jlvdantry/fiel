import React, { Component } from 'react';
import Carga from './Carga';
import Valida from './Valida';
class Mifiel extends Component {
  render() {
    console.log('renderieo mifiel');
    return (
      <div>
	      <Carga />
	      <Valida />
      </div> 
    );
  }
}
export default Mifiel;

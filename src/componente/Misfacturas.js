import React, { Component } from 'react';
import Cargafael from './Cargafael';
import Validafael from './Validafael';
class Misfacturas extends Component {
  render() {
    console.log('renderieo mifiel');
    return (
      <div>
	      <Cargafael />
	      <Validafael />
      </div> 
    );
  }
}
export default Misfacturas;

import React, { Component } from 'react';
import Cargafael from './Cargafael';
import Validafael from './Validafael';
import Consultafael from './Consultafael';
class Misfacturas extends Component {
  render() {
    console.log('renderieo mifiel');
    return (
      <div>
	      <Cargafael />
	      <Validafael />
	      <Consultafael />
      </div> 
    );
  }
}
export default Misfacturas;

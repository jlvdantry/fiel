import React, { Component } from 'react';
import Cargafael from './Cargafael';
import Validafael from './Validafael';
import Consultafael from './Consultafael';
import Graficafael from './Graficafael';
class Misfacturas extends Component {
  render() {
    console.log('renderieo mifiel');
    return (
      <div>
	      <Cargafael />
	      <Validafael />
	      <Graficafael />
	      <Consultafael />
      </div> 
    );
  }
}
export default Misfacturas;

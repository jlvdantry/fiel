import React, { Component } from 'react';
import CargaPDF from './CargaPDF';
import ValidaFirmaPDF from './ValidaFirmaPDF';
class ChecaFirmasPDF extends Component {
  render() {
    return (
      <div>
	      <CargaPDF />
	      <ValidaFirmaPDF />
      </div> 
    );
  }
}
export default ChecaFirmasPDF;

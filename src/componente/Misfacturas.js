import React, { Component } from 'react';
import Cargafael from './Cargafael';
import Validafael from './Validafael';
import Consultafael from './Consultafael';
import Graficafael from './Graficafael';
import CargaMasiva from './CargafaelMasiva';
class Misfacturas extends Component {
  constructor(props){
     super(props);
     this.state = { refresca:true };
     this.onRefresca = this.onRefresca.bind(this)
     this.changeGrafica=React.createRef()
     this.changeConsulta=React.createRef()
  }

  onRefresca() {
      console.log('entro a refrescar');
      this.setState({ refresca: true });
      this.changeGrafica.current.actuaFacturas();
      this.changeConsulta.current.totalFacturas();
  }

  render() {
    console.log('rendereo misfacturas');
    return (
      <div>
	      <CargaMasiva />
	      <Cargafael />
	      <Validafael onRefresca={this.onRefresca}/>
	      <Graficafael ref={this.changeGrafica}/>
	      <Consultafael ref={this.changeConsulta} onRefresca={this.onRefresca}/>
      </div> 
    );
  }
}
export default Misfacturas;

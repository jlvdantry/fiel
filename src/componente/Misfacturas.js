import React, { Component } from 'react';
import Consultafael from './Consultafael';
import Graficafael from './Graficafael';
import Filtros from './Filtros';
class Misfacturas extends Component {
  constructor(props){
     super(props);
     this.state = { refresca:true, filtro:'' , tipoGrafica:'Barras Horizontales' };
     this.onRefresca = this.onRefresca.bind(this)
     this.changeGrafica=React.createRef()
     this.changeConsulta=React.createRef()
     this.cambiaFiltro= this.cambiaFiltro.bind(this)
     this.cambiaGrafica= this.cambiaGrafica.bind(this)
  }

  onRefresca() {
      console.log('entro en onRefresca');
      this.setState({ refresca: true });
      this.changeGrafica.current.actuaFacturas();
      this.changeConsulta.current.totalFacturas();
  }

  cambiaFiltro(Filtro) {
     console.log('entro a cambiar el filtro');
     this.setState({filtro:Filtro}, () => this.onRefresca())
  }

  cambiaGrafica(TipoGrafica) {
     this.setState({tipoGrafica:TipoGrafica}, () => this.changeGrafica.current.actuaFacturas())
  }

  render() {
    return (
      <div >
	      <Filtros cambiaGrafica={this.cambiaGrafica} cambiaFiltro={this.cambiaFiltro} onRefresca={this.onRefresca}/>
	      <Graficafael ref={this.changeGrafica} filtro={this.state.filtro} tipoGrafica={this.state.tipoGrafica}/>
	      <Consultafael ref={this.changeConsulta} onRefresca={this.onRefresca} filtro={this.state.filtro}/>
      </div> 
    );
  }
}
export default Misfacturas;

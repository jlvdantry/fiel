import React, { Component } from 'react';
import Consultafael from './Consultafael';
import Graficafael from './Graficafael';
class Misfacturas extends Component {
  constructor(props){
     super(props);
     this.state = { refresca:true };
     this.onRefresca = this.onRefresca.bind(this)
     this.changeGrafica=React.createRef()
     this.changeConsulta=React.createRef()
  }

  onRefresca() {
      this.setState({ refresca: true });
      this.changeGrafica.current.actuaFacturas();
      this.changeConsulta.current.totalFacturas();
  }

  render() {
    return (
      <div>
	      <Graficafael ref={this.changeGrafica}/>
	      <Consultafael ref={this.changeConsulta} onRefresca={this.onRefresca}/>
      </div> 
    );
  }
}
export default Misfacturas;

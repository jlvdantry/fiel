import React, { Component } from 'react';
import Graficafael from './Graficafael';
import DataGridFacturas from './DataGridFacturas';
import { ExtraeComprobantes as EC } from './ExtraeComprobantes';

class Misfacturas extends Component {
  constructor(props){
     super(props);
     // Agregamos rfc al estado inicial
     this.state = { refresca:true, facturas:[], totalfacturas:0, rfc: '' };
     this.onRefresca = this.onRefresca.bind(this);
     this.totalFacturas = this.totalFacturas.bind(this);
     this.consulta = this.consulta.bind(this);
  }

  async componentDidMount(){
       // 1. Obtenemos el RFC de forma segura dentro del ciclo de vida
       const rfcObtenido = await window.dameRfc();
       this.setState({ rfc: rfcObtenido }, () => {
           this.totalFacturas();
           this.consulta();
       });
  }

  onRefresca() {
      // En lugar de usar .current.actuaFacturas(), 
      // simplemente refrescamos los datos del padre y React se encarga del resto
      this.setState({ refresca: true });
      this.totalFacturas();
      this.consulta();
  }

  totalFacturas() {
        var that = this;
        window.cuantasfacturas().then(function(cuantas) {
            that.setState({ totalfacturas: cuantas });
        }).catch(function(err) {
            that.setState({ totalfacturas: 0 });
        });
  }

  consulta(){
        var that = this;
        window.leefacturas().then(factu => {
            // Usamos el RFC que guardamos en el state
            that.setState({ facturas: EC(factu, this.state.rfc) });
        }).catch(function(err) {
            that.setState({ facturas: [] });
        });
  }

  render() {
    return (
      <div>
             <Graficafael />
	         <div className="text-center mt-2">
                 Total de facturas <b>{this.state.totalfacturas}</b>
             </div>
	         <DataGridFacturas className="mt-2" />  
      </div> 
    );
  }
}

export default Misfacturas;

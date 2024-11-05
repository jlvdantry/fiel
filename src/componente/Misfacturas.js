import React, { Component } from 'react';
import Graficafael from './Graficafael';
import DataGridFacturas from './DataGridFacturas';
import { ExtraeComprobantes as EC } from './ExtraeComprobantes';
const RFC = await window.dameRfc();
class Misfacturas extends Component {
  constructor(props){
     super(props);
     this.state = { refresca:true,facturas:[],totalfacturas:0 };
     this.onRefresca = this.onRefresca.bind(this)
     this.changeGrafica=React.createRef()
     this.changeConsulta=React.createRef()
     this.totalFacturas = this.totalFacturas.bind(this)
     this.consulta = this.consulta.bind(this)
  }

  componentWillMount(){
       this.totalFacturas();
       this.consulta();
  }


  onRefresca() {
      this.setState({ refresca: true });
      this.changeGrafica.current.actuaFacturas();
      this.changeConsulta.current.totalFacturas();
  }

  totalFacturas() {
        var that=this;
        window.cuantasfacturas().then(function(cuantas) {
                                                            that.setState({totalfacturas:cuantas});
                                                    }).catch(function(err)  {
                                                            that.setState({totalfacturas:0});
                                                    });
  }

  bajaFactura(event){
        console.log('[Consultafael.js] bajaFactura '+event.currentTarget.dataset.id);
        var that=this
        window.bajafacturas(event.currentTarget.dataset.id).then(function() {
              that.setState({facturas:[]});
              that.totalFacturas();
              that.consulta();
              that.props.onRefresca();
        }).catch(function(err)  {
              console.log('error al dar de baja la factura'+err);
        });
  }

  consulta(){
        console.log('[Consultafael.js] consulta entro');
        var that=this;
        window.leefacturas().then( factu=> {
                                                            console.log('[Consultafael.js] consulta='+factu.length);
                                                            that.setState({facturas:EC(factu,RFC)});
                                                    }).catch(function(err)  {
                                                            that.setState({facturas:[]});
                                                    });
  }




  render() {
    return (
      <div>
             <Graficafael ref={this.changeGrafica}/>
	     <div className="text-center mt-2">Total de facturas <b>{this.state.totalfacturas}</b></div>
	     <DataGridFacturas className="mt-2" filas={this.state.facturas}/>  }
      </div> 
    );
  }
}

export default Misfacturas;

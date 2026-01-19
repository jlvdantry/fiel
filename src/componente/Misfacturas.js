import React, { Component } from 'react';
import Graficafael from './Graficafael';
import DataGridFacturas from './DataGridFacturas';
import { ExtraeComprobantes as EC } from './ExtraeComprobantes';
import { useFamilyFiltro } from './FamilyFiltros';

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
    // Access the totals passed from the Wrapper below
    const { totalIngreso, totalEgreso, facturasProcesadas } = this.props;
    return (
      <div>
	     <div className="row text-center mt-3 mx-2">
		 <div className="col-md-4">
		     <h6 className="text-muted">Total Ingresos</h6>
		     <h4 className="text-success">${totalIngreso.toLocaleString('en-MX')}</h4>
		 </div>
		 <div className="col-md-4">
		     <h6 className="text-muted">Total Egresos</h6>
		     <h4 className="text-danger">${totalEgreso.toLocaleString('en-MX')}</h4>
		 </div>
		 <div className="col-md-4">
		     <h6 className="text-muted">Neto</h6>
		     <h4 className="text-primary">${(totalIngreso - totalEgreso).toLocaleString('en-MX')}</h4>
		 </div>
	     </div>
             <Graficafael />
	     <div className="text-center mt-2"> Total de facturas <b>{facturasProcesadas.length}</b> </div>
	     <DataGridFacturas className="mt-2" />  
      </div> 
    );
  }
}

// THE WRAPPER: This allows the Class Component to use the Hook
const MisfacturasWrapper = (props) => {
    const facturasProcesadas = useFamilyFiltro((state) => state.facturasProcesadas);
    const totalIngreso = useFamilyFiltro((state) => state.totalIngreso);
    const totalEgreso = useFamilyFiltro((state) => state.totalEgreso);

    return (
        <Misfacturas
            {...props}
            totalIngreso={totalIngreso}
            totalEgreso={totalEgreso}
            facturasProcesadas={facturasProcesadas}
        />
    );
};

export default MisfacturasWrapper;

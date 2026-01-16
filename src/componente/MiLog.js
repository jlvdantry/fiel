import React, { Component } from 'react';
import DataGridLog from './DataGridLog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class MiLog extends Component {
  constructor(props){
     super(props);
     // Agregamos rfc al estado inicial
     this.state = { refresca:true, logs:[], totallog:0 };
     this.onRefresca = this.onRefresca.bind(this);
     this.onBajaLog = this.onBajaLog.bind(this);
     this.totalLog = this.totalLog.bind(this);
     this.consultaLog = this.consultaLog.bind(this);
  }

  async componentDidMount(){
           this.totalLog();
           this.consultaLog();
  }

  onRefresca() {
      this.setState({ refresca: true });
      this.totalLog();
      this.consultaLog();
  }
  onBajaLog() {
	    if (window.confirm("¿Estás seguro de que quieres borrar todos los logs?")) {
		try {
		    window.borrarTodoDeTabla('log').then( x => {
			    this.totalLog();
			    this.consulta();
		    });
		} catch (error) {
		    console.error("No se pudieron borrar los registros", error);
		}
	    }
  }

  totalLog() {
        var that = this;
        window.cuantaslog().then(function(cuantas) {
            that.setState({ totallog: cuantas });
        }).catch(function(err) {
            that.setState({ totallog: 0 });
        });
  }

  consultaLog(){
        var that = this;
        window.lee_log().then(log => {
            // Usamos el RFC que guardamos en el state
            that.setState({ logs: log });
        }).catch(function(err) {
            that.setState({ logs: [] });
        });
  }

  render() {
    // Access the totals passed from the Wrapper below
    return (
      <div>
	      <div className="row g-3 justify-content-center align-items-center mt-3">
		{/* Botón de borrar con icono grande */}
		<div className="text-danger btn p-2" onClick={this.onBajaLog} title="Borrar historial"> 
		  <FontAwesomeIcon icon={['fas', 'trash-alt']} size="2x" />
		</div>

		{/* Botón de refrescar con icono grande */}
		<div className="text-primary btn p-2" onClick={this.onRefresca} title="Refrescar"> 
		  <FontAwesomeIcon icon={['fas', 'redo-alt']} size="2x" />
		</div>
	      </div>
	     <div className="text-center mt-2"> Total de registros <b>{this.state.totallog}</b> </div>
	     <DataGridLog className="mt-2" filasAMostrar={this.state.logs} />  
      </div> 
    );
  }
}

// THE WRAPPER: This allows the Class Component to use the Hook
const MisLogWrapper = (props) => {
    return (
        <MiLog
            {...props}
        />
    );
};

export default MisLogWrapper;


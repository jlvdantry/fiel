import React, { Component } from 'react';
import DataGridLog from './DataGridLog';

class MiLog extends Component {
  constructor(props){
     super(props);
     // Agregamos rfc al estado inicial
     this.state = { refresca:true, logs:[], totallog:0 };
     this.onRefresca = this.onRefresca.bind(this);
     this.totalLog = this.totalLog.bind(this);
     this.consultaLog = this.consultaLog.bind(this);
  }

  async componentDidMount(){
           this.totalLog();
           this.consultaLog();
  }

  onRefresca() {
      // En lugar de usar .current.actuaFacturas(), 
      // simplemente refrescamos los datos del padre y React se encarga del resto
      this.setState({ refresca: true });
      this.totalLog();
      this.consultaLog();
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
        window.leelog().then(log => {
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


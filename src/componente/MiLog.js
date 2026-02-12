import React, { Component } from 'react';
import DataGridLog from './DataGridLog';

class MiLog extends Component {
  constructor(props){
     super(props);
     // Agregamos rfc al estado inicial
     this.state = { refresca:true, logs:[], totallog:0 };
     this.consultaLog = this.consultaLog.bind(this);
  }

  async componentDidMount(){
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


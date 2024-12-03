
import React, { Component } from 'react';
import { Router, browserHistory, Route, Redirect } from 'react-router';
import './App.css';
import Ayuda from './componente/Ayuda';
import Master from './componente/Master';
import Carga from './componente/Carga';
import Mifiel from './componente/Mifiel';
import Misfacturas from './componente/Misfacturas';
import Valida from './componente/Valida';
import Graficafael from './componente/Graficafael';
import MisFirmas from './componente/Misfirmas';
import CargafaelMasiva from './componente/CargafaelMasiva';
import About from './componente/About';
import './fontawesome';;

/*
const logContainer = document.getElementById('logContainer');

function logToDocument(message) {
    const logMessage = document.createElement('div');
    logMessage.textContent = message;
    logContainer.appendChild(logMessage);

    // Auto-scroll to the bottom
    logContainer.scrollTop = logContainer.scrollHeight;
}

(function() {
    const originalLog = console.log;
    console.log = function(...args) {
        // Display logs on the document
        logToDocument(args.join(' '));
        // Also call the original console.log
        originalLog.apply(console, args);
    };
})();
*/


class App extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={Master}>
	  <Route path="/ayuda" component={Ayuda}/>
	  <Route path="/carga" component={Carga}/>
	  <Route path="/validar" component={Valida}/>
	  <Route path="/mifiel" component={Mifiel}/>
	  <Route path="/misfacturas" component={Misfacturas}/>
	  <Route path="/cargafaelMasiva" component={CargafaelMasiva}/>
	  <Route path="/Graficafael" component={Graficafael}/>
	  <Route path="/misfirmas" component={MisFirmas}/>
	  <Route path="/about" component={About}/>
          <Redirect to="/"/>
        </Route>
      </Router>
    );
  }
}
browserHistory.push('/');
export default App;


import React, { Component } from 'react';
import { Router, browserHistory, Route, Redirect } from 'react-router';
import './App.css';
import Ayuda from './componente/Ayuda';
import Master from './componente/Master';
import Carga from './componente/Carga';
import Mifiel from './componente/Mifiel';
import MisfacturasWrapper from './componente/Misfacturas';
import Valida from './componente/Valida';
import Graficafael from './componente/Graficafael';
import MisFirmas from './componente/Misfirmas';
import CargafaelMasiva from './componente/CargafaelMasiva';
import About from './componente/About';
import Config from './componente/Config';
import PanelControlSync from './componente/HistorialSync';
import './fontawesome';

/*
const logContainer = document.getElementById('logContainer');
function logToDocument(message) {
    const logMessage = document.createElement('div');
    logMessage.textContent = message;
    logContainer.appendChild(logMessage);
    logContainer.scrollTop = logContainer.scrollHeight;
}
function logToDocumentE(message) {
    const logMessageE = document.createElement('div');
    logMessageE.classList.add('text-danger');
    logMessageE.textContent = message;
    logContainer.appendChild(logMessageE);
    logContainer.scrollTop = logContainer.scrollHeight;
}
*/

/*
(function() {
    const originalLog = console.log;
    const originalLogE = console.error;
    console.log = function(...args) {
        logToDocument(args.join(' '));
        originalLog.apply(console, args);
    };
    console.error = function(...args) {
        logToDocumentE(args.join(' '));
        originalLogE.apply(console, args);
    };

})();
*/

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', event => {
        if (event.data && event.data.action === 'log') {
            console.log(event.data.message); // Call a function to display the log
        }
    });
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    console.log("[App.js] Tab is now hidden.");
  } else {
    console.log("[App.js] Tab is now visible.");
    // Optionally send a message to the Service Worker
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ action: "TAB_VISIBLE" });
    }
  }
});



class App extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={Master}>
	  <Route path="/ayuda" component={Ayuda}/>
	  <Route path="/carga" component={Carga}/>
	  <Route path="/validar" component={Valida}/>
	  <Route path="/mifiel" component={Mifiel}/>
	  <Route path="/misfacturas" component={MisfacturasWrapper}/>
	  <Route path="/cargafaelMasiva" component={CargafaelMasiva}/>
	  <Route path="/Graficafael" component={Graficafael}/>
	  <Route path="/misfirmas" component={MisFirmas}/>
	  <Route path="/config" component={Config}/>
	  <Route path="/about" component={About}/>
	  <Route path="/historialSync" component={PanelControlSync}/>
          <Redirect to="/"/>
        </Route>
      </Router>
    );
  }
}
browserHistory.push('/');
export default App;

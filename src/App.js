
import React, { Component } from 'react';
import { Router, browserHistory, Route, Redirect } from 'react-router';
import './App.css';
import Ayuda from './componente/Ayuda';
import Master from './componente/Master';
import CargaFiel from './componente/CargaFiel';
import Mifiel from './componente/Mifiel';
import MisfacturasWrapper from './componente/Misfacturas';
import ValidaFiel from './componente/ValidaFiel';
import Graficafael from './componente/Graficafael';
import MisFirmas from './componente/Misfirmas';
import SolicitaFacturas from './componente/SolicitaFacturas';
import About from './componente/About';
import Config from './componente/Config';
import PanelControlSync from './componente/HistorialSync';
import './fontawesome';
import MisLogWrapper from './componente/MiLog';

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', event => {
        if (event.data && event.data.action === 'log') {
            console.log(event.data.message); // Call a function to display the log
        }
    });
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    
  } else {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ action: "REVISA_REQUERIMIENTOS" });
    }
  }
});



class App extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={Master}>
	  <Route path="/ayuda" component={Ayuda}/>
	  <Route path="/carga" component={CargaFiel}/>
	  <Route path="/validaFiel" component={ValidaFiel}/>
	  <Route path="/mifiel" component={Mifiel}/>
	  <Route path="/misfacturas" component={MisfacturasWrapper}/>
	  <Route path="/SolicitaFacturas" component={SolicitaFacturas}/>
	  <Route path="/Graficafael" component={Graficafael}/>
	  <Route path="/misfirmas" component={MisFirmas}/>
	  <Route path="/config" component={Config}/>
	  <Route path="/about" component={About}/>
	  <Route path="/historialSync" component={PanelControlSync}/>
	  <Route path="/miLog" component={MisLogWrapper}/>
          <Redirect to="/"/>
        </Route>
      </Router>
    );
  }
}
browserHistory.push('/');
export default App;

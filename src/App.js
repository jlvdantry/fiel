
import React, { Component } from 'react';
import { Router, browserHistory, Route, Redirect } from 'react-router';
import './App.css';
import Ayuda from './componente/Ayuda';
import Master from './componente/Master';
import Carga from './componente/Carga';
import Mifiel from './componente/Mifiel';
import Misfacturas from './componente/Misfacturas';
import Valida from './componente/Valida';
import Validarfael from './componente/Validarfael';
import Graficafael from './componente/Graficafael';
import CargafaelMasiva from './componente/CargafaelMasiva';
import About from './componente/About';
import './fontawesome';;


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
	  <Route path="/validarfael" component={Validarfael}/>
	  <Route path="/Graficafael" component={Graficafael}/>
	  <Route path="/about" component={About}/>
          <Redirect to="/"/>
        </Route>
      </Router>
    );
  }
}
browserHistory.push('/');
export default App;

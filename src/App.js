
import React, { Component } from 'react';
import { Router, browserHistory, Route, Redirect } from 'react-router';
import './App.css';
import Ayuda from './componente/Ayuda';
import Master from './componente/Master';
import Carga from './componente/Carga';
import Valida from './componente/Valida';

class App extends Component {
  render() {
    console.log('renderieo app');
    return (
      <Router history={browserHistory}>
        <Route path="/" component={Master}>
	  <Route path="/ayuda" component={Ayuda}/>
	  <Route path="/carga" component={Carga}/>
	  <Route path="/validar" component={Valida}/>
        </Route>
        <Redirect from="/" to="/"/>
      </Router>
    );
  }
}
browserHistory.push('/');
export default App;


import React, { Component } from 'react';
import { Router, browserHistory, Route } from 'react-router';
import './App.css';
import Ayuda from './componente/Ayuda';
import Master from './componente/Master';

class App extends Component {
  render() {
    console.log('renderieo app');
    return (
      <Router history={browserHistory}>
        <Route path="/" component={Master}>
	  <Route path="/ayuda" component={Ayuda}/>
        </Route>
      </Router>
    );
  }
}
browserHistory.push('/');
export default App;

import React, { Component } from 'react';
import {  Link } from 'react-router';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


class Menumi extends Component {

  constructor(props) {
    super(props);
    this.state = { isOpen: false, online: true };
    this.toggle = this.toggle.bind(this);
    this.closeNavbar = this.closeNavbar.bind(this);
    this.setOnlineStatus = this.setOnlineStatus.bind(this);
    this.defaultlink = React.createRef();
  }
 
  defaultlink(e)  {
      e.click();
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  closeNavbar() {
        this.setState({
            isOpen: false
        });
  }

  componentDidMount() {
    console.log('Monto el componente');
    if (!navigator.onLine)
       {  this.setOnlineStatus(false)  }
    else { this.setOnlineStatus(true) }
    window.addEventListener('online', () => this.setOnlineStatus(true));
    window.addEventListener('offline', () => this.setOnlineStatus(false));
    //this.defaultlink.current.click(); 
    document.querySelector('#ayuda').click();
  }

  componentWillUnmount() {
    window.removeEventListener('online');
    window.removeEventListener('offline');
  }

  setOnlineStatus = isOnline => { this.setState({ online: isOnline }) ; console.log('cambio estado'); }

  render() {
    console.log('rendereo el menu');
    return (
      <div>
        <Navbar color="blue" light expand="md">
          <NavbarBrand to="/">FIEL</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto " navbar>
              <Link to='/ayuda' id='ayuda' className='rounded mr-1' onClick={this.closeNavbar} activeClassName="active" onlyActiveOnIndex><FontAwesomeIcon icon={['fas', 'question']} /> AYUDA</Link>
              <Link to='/mifiel' className='rounded mr-1' onClick={this.closeNavbar}  activeClassName="active" onlyActiveOnIndex><FontAwesomeIcon icon={['fas' , 'pen-fancy']} /> MI FIEL</Link>
              <Link to='/misfacturas' className='rounded  mr-1' onClick={this.closeNavbar}  activeClassName="active" onlyActiveOnIndex>
                           <FontAwesomeIcon icon={['fas' , 'receipt']} /> MIS FACTURAS</Link>
              <Link to='/misfirmas' className='rounded  mr-1' onClick={this.closeNavbar}  activeClassName="active" onlyActiveOnIndex>
                           <FontAwesomeIcon icon={['fas' , 'signature']} /> MIS FIRMAS</Link>
            </Nav>
          </Collapse>
        </Navbar>
        { !this.state.online && <Alert color="danger">Aplicativo sin internet</Alert> }
      </div>
    );
  }
}
export default Menumi

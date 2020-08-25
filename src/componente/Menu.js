import React, { Component } from 'react';
import {  Link } from 'react-router';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  Alert
} from 'reactstrap';


class Menumi extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      online: true
    };
   
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
        <Navbar color="blue" className='fixed-top' light expand="md">
          <NavbarBrand to="/">FIEL</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto " navbar>
              <Link to='/ayuda' id='ayuda' className='rounded mr-1' onClick={this.closeNavbar} activeClassName="active" onlyActiveOnIndex>AYUDA</Link>
              <Link to='/carga' className='rounded mr-1' onClick={this.closeNavbar}  activeClassName="active" onlyActiveOnIndex>Cargar FIEL</Link>
              <Link to='/validar' className='rounded mr-1' onClick={this.closeNavbar}  activeClassName="active" onlyActiveOnIndex>Validar fiel</Link>
              <Link to='/cargafael' className='rounded mr-1' onClick={this.closeNavbar}  activeClassName="active" onlyActiveOnIndex>Cargar fael</Link>
              <Link to='/validarfael' className='rounded  mr-1' onClick={this.closeNavbar}  activeClassName="active" onlyActiveOnIndex>Validar fael</Link>
              <Link to='/firmar' className='rounded  mr-1' onClick={this.closeNavbar}  activeClassName="active" onlyActiveOnIndex>Firmar electrónicamente</Link>
            </Nav>
          </Collapse>
        </Navbar>
        { !this.state.online && <Alert color="danger">Aplicativo sin internet</Alert> }
      </div>
    );
  }
}
export default Menumi

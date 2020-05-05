import React, { Component } from 'react';
import {  Link } from 'react-router';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem
} from 'reactstrap';

const links = [
  { href: '/ayuda', text: 'Ayuda', className: 'text-info', cierra:'{this.closeNavbar}' },
  { href: '/carga', text: 'Carga fiel', className: 'text-info'},
  { href: '/validafiel', text: 'Valida fiel',className: 'text-info' },
  { href: '/cargafael', text: 'Carga factura electrónica',className: 'text-info' },
  { href: '/validafael', text: 'Valida factura electrónica',className: 'text-info' },
  { href: '/firmafiel', text: 'firma electrónica',className: 'text-info' },
];

const createNavItem = ({ href, text, className }) => (
 <NavItem>
    <Link to={href} className={className} onClick={this.closeNavbar}>{text}</Link>
 </NavItem>
);

class Menumi extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    };

    this.toggle = this.toggle.bind(this);
    this.closeNavbar = this.closeNavbar.bind(this);
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
  
  render() {
    return (
      <div>
        <Navbar color="blue" light expand="md">
          <NavbarBrand to="/">FIEL</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto bg-dark" navbar>
              {/*{links.map(createNavItem)}  */}
              <Link to='/ayuda' className='text-info' onClick={this.closeNavbar} >Ayuda</Link>
              <Link to='/carga' className='text-info' onClick={this.closeNavbar} >Cargar fiel</Link>
              <Link to='/validar' className='text-info' onClick={this.closeNavbar} >Validar fiel</Link>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}
export default Menumi

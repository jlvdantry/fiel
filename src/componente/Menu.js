import React, { Component } from 'react';
import {  Link } from 'react-router';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
} from 'reactstrap';


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
    console.log('va a renderear Menu.js');
    return (
      <div>
        <Navbar color="blue" light expand="md">
          <NavbarBrand to="/">FIEL</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto bg-dark" navbar>
              <Link to='/ayuda' className='text-info' onClick={this.closeNavbar} >Ayuda</Link>
              <Link to='/carga' className='text-info' onClick={this.closeNavbar} >Cargar FIEL</Link>
              <Link to='/validar' className='text-info' onClick={this.closeNavbar} >Validar fiel</Link>
              <Link to='/cargafael' className='text-info' onClick={this.closeNavbar} >Cargar fael</Link>
              <Link to='/validarfael' className='text-info' onClick={this.closeNavbar} >Validar fael</Link>
              <Link to='/firmar' className='text-info' onClick={this.closeNavbar} >Firmar electrónicamente</Link>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}
export default Menumi

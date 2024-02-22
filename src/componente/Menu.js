import React, { Component } from 'react';
import {  Link } from 'react-router';
import { Collapse, Navbar, NavbarToggler, Nav, Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { browserHistory  } from 'react-router';
import { Tooltip as ReactTooltip } from "react-tooltip";

let timer = null;
class Menumi extends Component {

  constructor(props) {
    super(props);
    this.state = { isOpen: false, online: true , showInstallMessage:false, windowWidth: window.innerWidth, windowHeigth : window.innerHeight, nombre:null };
    this.toggle = this.toggle.bind(this);
    this.closeNavbar = this.closeNavbar.bind(this);
    this.quitainstala = this.quitainstala.bind(this);
    this.setOnlineStatus = this.setOnlineStatus.bind(this);
    this.defaultlink = React.createRef();
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.cambio = this.cambio.bind(this);
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
  cierra() {
       browserHistory.replace('/');
       window.close();
  }

  componentDidMount() {
    if (!navigator.onLine)
       {  this.setOnlineStatus(false)  }
    else { this.setOnlineStatus(true) }
    window.addEventListener('online', () => this.setOnlineStatus(true));
    window.addEventListener('offline', () => this.setOnlineStatus(false));
    window.addEventListener('resize', this.updateWindowDimensions)
	// Detects if device is on iOS
	const isIos = () => {
	  const userAgent = window.navigator.userAgent.toLowerCase();
	  return /iphone|ipad|ipod/.test( userAgent );
	}
	// Detects if device is in standalone mode
	const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);

	// Checks if should display install popup notification:
	if (isIos() && !isInStandaloneMode()) {
	  this.setState({ showInstallMessage: true });
          timer=setInterval(() => this.quitainstala(), 5000)
	}
	  //this.setState({ showInstallMessage: true });
    document.querySelector('#ayuda').click();
      timer = setInterval(() => this.cambio(), 2000)
  }

  cambio() {
       if (localStorage.getItem('nombre')!=null) {
          this.setState({nombre : localStorage.getItem('nombre')})
       } else {  this.setState({nombre : null })  }
  }

  
  quitainstala() {
    document.querySelector('#instalar').classList.remove("d-flex");
    document.querySelector('#instalar').classList.add("d-none");
    clearTimeout(timer);
  }

	updateWindowDimensions() {
	  this.setState({ windowWidth: window.innerWidth, windowHeight: window.innerHeight });
	}

  componentWillUnmount() {
    window.removeEventListener('online');
    window.removeEventListener('offline');
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  setOnlineStatus = isOnline => { this.setState({ online: isOnline }) ; }

  render() {
    return (
      <div id='menu'>
        <Navbar color="blue" light expand="md">
          <h5>FIEL-{this.state.nombre!==null ? this.state.nombre.split(' ')[0]+' '+this.state.nombre.split(' ')[1] : null}</h5>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto " navbar>
              <Link to='/ayuda' id='ayuda' className='rounded mr-1' onClick={this.closeNavbar} activeClassName="active" onlyActiveOnIndex><FontAwesomeIcon icon={['fas', 'question']} /> AYUDA</Link>
              <Link to='/mifiel' className='rounded mr-1' onClick={this.closeNavbar}  activeClassName="active" onlyActiveOnIndex><FontAwesomeIcon icon={['fas' , 'pen-fancy']} /> MI FIEL</Link>
              <Link to='/cargafaelMasiva' className='rounded  mr-1' onClick={this.closeNavbar}  activeClassName="active" onlyActiveOnIndex>
                           <FontAwesomeIcon icon={['fas' , 'cloud-download-alt']} /> DESCARGA MASIVA</Link>
              <Link to='/misfacturas' className='rounded  mr-1' onClick={this.closeNavbar}  activeClassName="active" onlyActiveOnIndex>
                           <FontAwesomeIcon icon={['fas' , 'receipt']} /> MIS FACTURAS</Link>
              <Link to='/validarfael'  data-tooltip-id="validarfael" className='rounded  mr-1' onClick={this.closeNavbar}  activeClassName="active" onlyActiveOnIndex>
                           <FontAwesomeIcon icon={['fas' , 'check-double']} /></Link>
              <Link to='/about' data-tooltip-id="acercade" className='rounded  mr-1' onClick={this.closeNavbar}  activeClassName="active" onlyActiveOnIndex>
                           <FontAwesomeIcon icon={['fas' , 'info-circle']} /></Link>
              <Link to='/cog' data-tooltip-id="config" className='rounded  mr-1' onClick={this.closeNavbar}  activeClassName="active" onlyActiveOnIndex>
                           <FontAwesomeIcon  icon={['fas' , 'cog']} /></Link>
            </Nav>
          </Collapse>
        </Navbar>
        <ReactTooltip style={{ zIndex:9999 }} id="validarfael" className="text-justify border border-info col-12" place="bottom" variant="info" html="<div>Checa que una factura no sea falsa, esta debe esta en formato XML</div>" />
        <ReactTooltip style={{ zIndex:9999 }} id="acercade" className="text-justify border border-info col-12" place="bottom" variant="info" html="<div>Muestra información relacionada con el aplicativo</div>" />
        <ReactTooltip style={{ zIndex:9999 }} id="config" className="text-justify border border-info col-12" place="bottom" variant="info" html="<div>Configuración de opciones del aplicativo</div>" />
        { !this.state.online && <Alert color="danger">Aplicativo sin internet</Alert> }
        { this.state.showInstallMessage && <div  className='fixed-bottom d-flex text-justify justify-content-center' id="instalar">
          <Alert className='d-flex align-items-center justify-content-between' > 
                 <FontAwesomeIcon className="fa-2x " icon={['fas', 'plus-square']} />
                 <div className='pl-2'> Instala esta aplicación en tu iphone dando click y despues agregalo al inicio</div>
          </Alert>
          <div id='pico'></div></div>}
      </div>
    );
  }
}
export default Menumi

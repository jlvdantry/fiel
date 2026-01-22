import React, { Component } from 'react';
import {  Link } from 'react-router';
import { Collapse, Navbar, NavbarToggler, Nav, Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { browserHistory  } from 'react-router';

let timer = null;
let timerc = null;
let timerR = null;
class Menumi extends Component {

  constructor(props) {
    super(props);
    this.state = { isOpen: false, online: true , showInstallMessage:false, windowWidth: window.innerWidth, windowHeigth : window.innerHeight, nombre:null,isConected:false };
    this.toggle = this.toggle.bind(this);
    this.closeNavbar = this.closeNavbar.bind(this);
    this.quitainstala = this.quitainstala.bind(this);
    this.setOnlineStatus = this.setOnlineStatus.bind(this);
    this.defaultlink = React.createRef();
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.cambio = this.cambio.bind(this);
    this.estaAutenticado =this.estaAutenticado.bind(this);
    this.revisaRequest = this.revisaRequest.bind(this);
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
    document.querySelector('#ayuda').click();
    timer = setInterval(() => this.cambio(), 2000)
    //window.log_en_bd(undefined,'1');

    // 1. Listen for the event dispatched by the shared code
    window.addEventListener('authStatusChanged', (e) => {
        this.setState({ isConected: e.detail });
    });

    // 2. Also listen for Service Worker messages (if SW runs it in background)
    if (navigator.serviceWorker) {
        navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data.type === 'AUTH_STATUS') {
                this.setState({ isConected: event.data.value });
            }
        });
    }
    timerc=setInterval(this.estaAutenticado, (window.REVISA.VIGENCIATOKEN * 1000));
    timerR=setInterval(this.revisaRequest, (window.REVISA.ESTADOREQ * 1000));
  }

  estaAutenticado() {
	    if (typeof window.revisaSiEstaAutenticado === 'function') {
		window.revisaSiEstaAutenticado();
	    }
  }
  revisaRequest() {
	    if (navigator.serviceWorker.controller) {
	      navigator.serviceWorker.controller.postMessage({ action: "REVISA_REQUERIMIENTOS" });
	    } else {
		    console.log('No esta funcionando el controller');
	    }
  }

  cambio() {
	  window.dameNombre().then( nombre => {
	       if (nombre!=null) {
		  this.setState({nombre : nombre})
                  clearInterval(timer);
	       } else {  this.setState({nombre : null })  }
	   }).catch( err => { this.setState({nombre : null })});
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
    clearInterval(timerc); // Tells the browser: "Stop running "
    clearInterval(timerR); // Tells the browser: "Stop running '"
  }

  setOnlineStatus = isOnline => { this.setState({ online: isOnline }) ; }

  render() {
    return (
      <div id='menu'>
        <Navbar color="blue" light expand="md">
          <h5>FIEL-{this.state.nombre!==null ? this.state.nombre.split(' ')[0]+' '+this.state.nombre.split(' ')[1] : null}
		    <div className="ml-auto d-flex align-items-center">
			<span style={{ color: this.state.isConected ? 'green' : 'red' }}>
			    <FontAwesomeIcon icon={['fas', 'circle']} className="mr-1" />
			</span>
            </div>
	  </h5>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto " navbar>
              <Link to='/ayuda' id='ayuda' className='rounded mr-1' onClick={this.closeNavbar} activeClassName="active" onlyActiveOnIndex>
	                   <FontAwesomeIcon icon={['fas', 'question']} /> AYUDA</Link>
              <Link to='/mifiel' className='rounded mr-1' onClick={this.closeNavbar}  activeClassName="active" onlyActiveOnIndex>
	                   <FontAwesomeIcon icon={['fas' , 'pen-fancy']} /> MI FIEL</Link>
              <Link to='/cargafaelMasiva' className='rounded  mr-1' onClick={this.closeNavbar}  activeClassName="active" onlyActiveOnIndex>
                           <FontAwesomeIcon icon={['fas' , 'cloud-download-alt']} /> DESCARGA MASIVA</Link>
              <Link to='/misfacturas' className='rounded  mr-1' onClick={this.closeNavbar}  activeClassName="active" onlyActiveOnIndex>
                           <FontAwesomeIcon icon={['fas' , 'receipt']} /> MIS FACTURAS</Link>
              <Link to='/config' className='rounded  mr-1' onClick={this.closeNavbar}  activeClassName="active" onlyActiveOnIndex>
                           <FontAwesomeIcon icon={['fas' , 'cog']} /> CONFIGURACIÓN</Link>
              <Link to='/historialSync' className='rounded  mr-1' onClick={this.closeNavbar}  activeClassName="active" onlyActiveOnIndex>
                           <FontAwesomeIcon icon={['fas' , 'cog']} /> HISTORIAL SINCRONIZACION</Link>
              <Link to='/miLog' className='rounded  mr-1' onClick={this.closeNavbar}  activeClassName="active" onlyActiveOnIndex>
                           <FontAwesomeIcon icon={['fas' , 'cog']} /> Ver log</Link>
              <Link to='/about' className='rounded  mr-1' onClick={this.closeNavbar}  activeClassName="active" onlyActiveOnIndex>
                           <FontAwesomeIcon icon={['fas' , 'info-circle']} /> ACERCA DE</Link>
            </Nav>
          </Collapse>
        </Navbar>
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

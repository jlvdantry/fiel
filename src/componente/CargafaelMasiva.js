
import React, { Component } from 'react';
import { FormGroup, Alert, Button, Card,Label,InputGroup,Input,Dropdown,DropdownToggle,DropdownMenu,DropdownItem } from 'reactstrap';
import { browserHistory  } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  DatePicker } from "reactstrap-date-picker";
import { MiDataGrid } from './DataGridSolicitud';
import Autocomplete from "react-autocomplete";

let handleMessage = null;
let estaAutenticadoInter = null;  // funcion de que se se ejecuta en el intervalo

        const days = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa']
        const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
        var DMS = '';

class CargafaelMasiva extends Component {

  constructor(props){
    super(props);
    this.nextPath = this.nextPath.bind(this);
    this.state = { xml_name : [],ojos:'eye',type:'password',msg:'',ok:'',nook:'',start:new Date("1/1/"+ new Date().getFullYear()).toISOString(),end:new Date().toISOString(),formattedValueIni:null
                   ,formattedValueFin:null,dropdownOpen:false,dropdownValue:'por rango de fechas',token:'',folio:'' ,okfolio:true, okfechai:true, okfechaf:true, msgfecha:''
                   ,dropdownOpenC:false,TipoSolicitud:'CFDI',pwdfiel:'',okfolioReq:true, estatusDownload : null, estatusDownloadMsg : null, solicitudes: []
                   ,resultadoVerifica:null,resultadoDownload:null,resultadoAutenticate:null,RFCEmisor:'',RFCEmisorIsValid:null,OKRFCEmisor:null,RFCReceptor:''
                   ,RFCReceptorIsValid:null,OKRFCReceptor:null,folioReq:null,tokenEstatusSAT:false,RFCS:[],tecleoPWD:false,isDisabled:false,queda:''
    };
    this.cargar = this.cargar.bind(this);
    this.showHide = this.showHide.bind(this)
    this.handleChangeini = this.handleChangeini.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    this.handleChangefin = this.handleChangefin.bind(this)
    this.toggle =  this.toggle.bind(this)
    this.changeValue = this.changeValue.bind(this);
    this.toggleC =  this.toggleC.bind(this)
    this.changeValueC = this.changeValueC.bind(this);
    this.cambioRFCEmisor = this.cambioRFCEmisor.bind(this);
    this.selectRFCEmisor = this.selectRFCEmisor.bind(this);
    this.autenticaContraSAT = this.autenticaContraSAT.bind(this);
    this.haysolicitudesVerificando = this.haysolicitudesVerificando.bind(this);
    this.dame_pwdSW  = this.dame_pwdSW.bind(this);
  };

    
    toggle(event) {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    toggleC(event) {
        this.setState({
            dropdownOpenC: !this.state.dropdownOpenC
        });
    }

    changeValue(e) {
        this.setState({dropdownValue: e.currentTarget.textContent});
    }


    cambioRFCEmisor(event) {
        this.setState({RFCEmisor : event.target.value.toUpperCase()});
	    const inputValue = event.target.value.toUpperCase();
	    const isValid = /^([A-Z,Ñ,&]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])([A-Z]|[0-9]){2}([A]|[0-9]){1})$/.test(inputValue);
            this.setState({ RFCEmisorIsValid: isValid }) 
	    window.dameRfc().then( rfc => {
		    if (rfc!==null) {
			    if (inputValue!==rfc) {
			       this.setState({RFCReceptor:rfc}); }
			    else { this.setState({ RFCReceptor:''}); }
		    }
	    });
    }

    selectRFCEmisor(value) {
        this.setState({RFCEmisor : value});
            const inputValue = value;
            // Use a regular expression pattern to define your validation criteria
            const isValid = /^([A-Z,Ñ,&]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])([A-Z]|[0-9]){2}([A]|[0-9]){1})$/.test(inputValue);
            this.setState({ RFCEmisorIsValid: isValid });
	    window.dameRfc().then( rfc => {
		    if (rfc!==null) {
			    if (inputValue!==rfc) {
			       this.setState({ RFCReceptor:rfc}); }
			    else { this.setState({ RFCReceptor:''}); }
		    }
	    });
    }


    cambioRFCReceptor(event) {
        this.setState({RFCReceptor : event.target.value.toUpperCase()});
            const inputValue = event.target.value.toUpperCase();
            const isValid = /^([A-Z,Ñ,&]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])([A-Z]|[0-9]){2}([A]|[0-9]){1})$/.test(inputValue);
            this.setState({ RFCReceptorIsValid: isValid, });

    }


    changeValueC(e) {
        this.setState({TipoSolicitud: e.currentTarget.textContent});
    }


  nextPath(path) {
      browserHistory.push(path);
  }

  /* revisa si esta autenticado recibe el objeto del aplicativo */
  revisaSiEstaAutenticado = () => {
	      DMS.getTokenEstatusSAT().then( res => {
		      //console.log('[rSEA] res='+JSON.stringify(res));
		      if (res!==undefined) {
			       if (res.tokenEstatusSAT!== this.state.tokenEstatusSAT || res.queda!==this.state.queda) {
				   this.setState({ tokenEstatusSAT : res.tokenEstatusSAT , queda:res.queda});
			       }
                      } else { console.log('[rSEA] res undefinido');}
	      });

  }

  /* intenta autenticarse contra el sat */
  autenticaContraSAT () {
	    console.log('[autenticaContraSAT]');
	    if (!window.PWDFIEL) {
		    console.error('sin pwd de la fiel');
	    }
	    DMS.autenticate_armasoa(window.PWDFIEL).then( x => { this.setState({ ok: true, nook:false }); })
	       .then( err => {
		       this.setState({ ok: false, nook:true,msg:err  });
	    });
  }

  /* hay solicitudes en estado de verificando */
  haysolicitudesVerificando () {
	         window.obtieneelUltimoTokenActivo().then ( a =>  {
			 var token = { created: a.value.respuesta.created,Expires:a.value.respuesta.Expires,token:a.value.respuesta.token }
			 this.setState(state => ({ token:token,pwdfiel:window.PWDFIEL, folioReq:a.folioReq}));
			 window.leeSolicitudesVerificando().then( req =>  {
			       console.log('[CFM] total de solicitudes verificando='+req.length)
				    req.forEach( e => {
					    this.setState(state => ({ folioReq:e.value.folioReq}));
					    console.log('[CFM] '+JSON.stringify(e.key));
					    DMS.verificando(this.state,e.key)
				    }	     
				    );

			 });
		 }).catch( e => { console.log('[CFM] no encontro un token activo');
		 });
  }
 
  /* obtiene el pwd del sw */
  dame_pwdSW() {
	        console.log('[dame_pwdSW]');
                if ('serviceWorker' in navigator) {
                  navigator.serviceWorker.ready.then((registration) => {
                    if (registration.active) {
                      registration.active.postMessage({ action: 'dameContra' });
                    }
                  });
                }
  }


  componentDidMount(){
      DMS = new window.DescargaMasivaSat();
      estaAutenticadoInter = setInterval(this.revisaSiEstaAutenticado, (window.REVISA.VIGENCIATOKEN * 1000));
      window.tecleoPwdPrivada().then(pwd => {
             if ('pwd' in pwd.value) {
                     this.setState({ tecleoPWD:true });
                     this.dame_pwdSW();
                     window.leeSolicitudesCorrectas().then( a => { this.setState({ solicitudes: a }); });
                     window.leeRFCS().then( a => { this.setState({ RFCS: a }) });
             }
      });

      /* maneja los mensaje provenientes del sw */
      handleMessage = (event) => {
	      if (event.data.action!=='log')  {
                      console.log('[hM] ='+JSON.stringify(event.data.action,true));
		      window.leeSolicitudesCorrectas().then( a => { this.setState({ solicitudes: a }) });
		      if (event.data.action==='CONTRA') {
			      window.PWDFIEL=event.data.value;
			      this.setState({ pwdfiel:  window.PWDFIEL });
			      return;
		      }

		      if (event.data.request.value.estado===window.ESTADOREQ.AUTENTICADO & event.data.request.value.url==="/autentica.php") {
			 this.setState({ token: event.data.respuesta,pwdfiel:  window.PWDFIEL });
		      }

		      if (event.data.action==='token-invalido') { this.haysolicitudesVerificando() }

		      if (event.data.request.value.url==="/download.php") {
				 DMS.leezip(event.data.respuesta.xml);
		      }

		      window.leeSolicitudesCorrectas().then( a => { this.setState({ solicitudes: a }) });
              }
      };

      navigator.serviceWorker.addEventListener('message', handleMessage);

  }

  componentWillUnmount() {
    navigator.serviceWorker.removeEventListener('message',handleMessage)
    clearInterval(estaAutenticadoInter);
  }

  onChangeHandler=event=>{
    console.log(event.target.files[0])
  }

  cargar() {

    if (this.state.dropdownValue==='por folio') {
       this.setState({folio:document.querySelector('#folio').value});
       if (this.state.folio==='') {
           this.setState({okfolio:false});
           return;
       } else {
           this.setState({okfolio:true});
       }
    }



    if (this.state.dropdownValue==='por rango de fechas') {

       this.setState({start:document.querySelector('#fechainicial').value});
       if (this.state.start===null || this.state.start==='') {
           this.setState({okfechai:false});
           return;
       } else {
           this.setState({okfechai:true});
       }

       this.setState({end:document.querySelector('#fechafinal').value});
       if (this.state.end===null || this.state.end==='') {
           this.setState({okfechaf:false,msgfecha:'La fecha final es obligatoria' });
           return;
       } else {
           this.setState({okfechaf:true});
       }

       if (this.state.end<this.state.start) {
           this.setState({okfechaf:false,msgfecha:'La fecha final no puede ser menor a la inicial'});
           return;
       } else {
           this.setState({okfechaf:true});
       }
       this.setState({RFCEmisor:document.querySelector('#RFCEmisor').value});
       if (this.state.RFCEmisor===null || this.state.RFCEmisor==='') {
           this.setState({okRFCEmisor:false,msgRFCEmisor:'El RFC del emisor es obligatorio' });
           return;
       } else {
           this.setState({okRFCEmisor:true,msgRFCEmisor:'' });
       }
       this.setState({RFCReceptor:document.querySelector('#RFCReceptor').value});
       if (this.state.RFCReceptor===null || this.state.RFCReceptors==='') {
           this.setState({okRFCReceptor:false,msgRFCReceptor:'El RFC del receptor es obligatoria' });
           return;
       } else {
           this.setState({okRFCReceptor:true,msgRFCReceptor:'' });
       }
       if (this.state.RFCReceptor===this.state.RFCEmisor) {
           this.setState({okRFCEmisor:false,msgRFCEmisor:'El RFC del emisor y del receptor no pueden ser iguales' });
           return;
       }
       if (this.state.RFCEmisorIsValid===false || this.state.RFCReceptorIsValid===false) {
           return;
       }
    }
    this.setState({isDisabled:true});
    this.inserta_solicitud();
  }

  /* inserta una solicitud en request */
  inserta_solicitud() {
                      var passdata = { 'fechaini':this.state.start.substring(0,10),'fechafin':this.state.end.substring(0,10),
                                                  'RFCEmisor':this.state.RFCEmisor,'RFCReceptor':this.state.RFCReceptor,'TipoSolicitud':this.state.TipoSolicitud };
	              window.inserta_solicitud(passdata).then(idkey => {
                               window.leeSolicitudesCorrectas().then( a => { this.setState({ solicitudes: a, isDisabled:false }) });
		      });
  }

  showHide(e){
    this.setState({
      type: this.state.type === 'input' ? 'password' : 'input',
      ojos: this.state.ojos === 'eye' ? 'eye-slash' : 'eye'
    })
  }

  handleChangeini(value, formattedValue) {
    this.setState({
      start: value, // ISO String, ex: "2016-11-19T12:00:00.000Z"
      formattedValueIni: formattedValue // Formatted String, ex: "11/19/2016"
    })
  }

  handleFocus() {
    clearTimeout(estaAutenticadoInter);
  }

  handleBlur() {
    estaAutenticadoInter = setInterval(this.revisaSiEstaAutenticado, (window.REVISA.VIGENCIATOKEN * 1000));
  }



  handleChangefin(value, formattedValue) {
    this.setState({
      end: value, // ISO String, ex: "2016-11-19T12:00:00.000Z"
      formattedValueFin: formattedValue // Formatted String, ex: "11/19/2016"
    })
  }

  handle_inserta_catalogo(catalogo,rfc) {
       window.inserta_catalogo('rfcs',this.state.RFCEmisor).then( r  => {
                window.leeRFCS().then( a => { this.setState({ RFCS: a }) });
       });
  }



  render() {
	 const wrapperStyle = {
	    'position': 'relative', // Adjust position as needed
	    'width': '100%',        // Adjust width as needed
	    'z-index': '1000'
	  };
	 const wrapperStyle1 = {
	    'position': 'relative', // Adjust position as needed
	    'width': '100%',        // Adjust width as needed
	    'z-index': '999'
	  };

          const onBlurRFCEmisor = (e) => {
                if (this.state.RFCEmisorIsValid===true) {
			  const matchingItems = this.state.RFCS.filter((x) =>
			    x.label.toLowerCase().includes(e.target.value.toLowerCase())
			  );
                          if (matchingItems.length===0) {
                              this.handle_inserta_catalogo('rfcs',this.state.RFCEmisor);
                          }
                };
          }
          const onBlurRFCReceptor = (e) => {
                if (this.state.RFCReceptorIsValid===true) {
                          const matchingItems = this.state.RFCS.filter((x) =>
                            x.label.toLowerCase().includes(e.target.value.toLowerCase())
                          );
                          if (matchingItems.length===0) {
                              this.handle_inserta_catalogo('rfcs',this.state.RFCReceptor);
                          }
                };
          }

    return  (
        <Card id="cargafael" className="p-2 m-2">
                  <h2 className="text-center">Carga masiva de la factura electrónica</h2>
                            { this.state.tecleoPWD===false &&
                                <div  className="mt-1">
                                       <Alert color="danger" className="text-center  d-flex justify-content-between align-items-center">
                                          <FontAwesomeIcon icon={['fas' , 'thumbs-down']} /> Primero debe de cargar su fiel para poder solicitar facturas al SAT </Alert>
                                </div> }

                  { this.state.tecleoPWD===true && <div>
                        <FormGroup className="container col-lg-12 justify-content-around">
                          <div className="col-lg-12 d-flex justify-content-center">
				<Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}  className="d-flex justify-content-center mb-2" >
				      <DropdownToggle caret color="primary" >
						   Solicitud {this.state.dropdownValue} 
				      </DropdownToggle>
				      <DropdownMenu>
					<DropdownItem onClick={this.changeValue} >por rango de fechas</DropdownItem>
					<DropdownItem onClick={this.changeValue} >por folio</DropdownItem>
				      </DropdownMenu>
				</Dropdown>
                          </div>

                          <div className="col-lg-12 d-flex justify-content-center">
				<Dropdown isOpen={this.state.dropdownOpenC} toggle={this.toggleC}  className="d-flex justify-content-center mb-2" >
				      <DropdownToggle caret color="primary" >
						   Solicitud de {this.state.TipoSolicitud}
				      </DropdownToggle>
				      <DropdownMenu>
					<DropdownItem onClick={this.changeValueC} >CFDI</DropdownItem>
					<DropdownItem onClick={this.changeValueC} >Metadata</DropdownItem>
				      </DropdownMenu>
				</Dropdown>
                          </div>
                      </FormGroup>

		      <FormGroup className="container">
	              { this.state.tokenEstatusSAT===window.TOKEN.ACTIVO  &&  <Label className="text-success">Esta conectado con el SAT { this.state.queda }</Label> }
	              { this.state.tokenEstatusSAT!==window.TOKEN.ACTIVO &&  <Label className="text-danger">Esta desconectado con el SAT</Label> }
		      </FormGroup>

                      { this.state.dropdownValue==='por rango de fechas' && <FormGroup className="container row col-lg-12">
                          <div className="col-lg-6 mt-1">
				<Label>RFC Emisor</Label>
                                <div className="col-lg-12 px-0">
					      <Autocomplete 
						items={this.state.RFCS}
						getItemValue={item => item.label}
						renderItem={(item, highlighted) =>
						  <div key={item.id} style={{ backgroundColor: highlighted ? '#eee' : 'transparent'}} > {item.label} </div>
						}
					        inputProps={{ id: 'RFCEmisor',  placeholder: 'Teclee y seleccione...', className:'form-control', onBlur:onBlurRFCEmisor, maxLength:13 }}
						value={this.state.RFCEmisor}
						onChange={this.cambioRFCEmisor}
						onSelect={ value => this.selectRFCEmisor(value)}
                                                wrapperStyle={wrapperStyle} 
					      />
                                </div>
                                { this.state.okRFCEmisor===false &&
					<div id="nook" className="mt-1">
					       <Alert color="danger" className="text-center  d-flex justify-content-between align-items-center">
						  <FontAwesomeIcon icon={['fas' , 'thumbs-down']} /> { this.state.msgRFCEmisor } </Alert>
					</div>
                                }
                                { this.state.RFCEmisorIsValid===false &&
					<div id="nook" className="mt-1">
					       <Alert color="danger" className="text-center  d-flex justify-content-between align-items-center">
						  <FontAwesomeIcon icon={['fas' , 'thumbs-down']} /> El RFC Emisor esta mal tecleado </Alert>
					</div>
                                }
                          </div>
                          <div className="col-lg-6 mt-1">
                                <Label>RFC Receptor</Label>

                                <div className="col-lg-12 px-0">
                                              <Autocomplete
                                                items={this.state.RFCS}
                                                getItemValue={item => item.label}
                                                renderItem={(item, highlighted) =>
                                                  <div key={item.id} style={{ backgroundColor: highlighted ? '#eee' : 'transparent'}} > {item.label} </div>
                                                }
                                                inputProps={{ id: 'RFCReceptor',  placeholder: 'Teclee y seleccione...', className:'form-control', onBlur:onBlurRFCReceptor, maxLength:13 }}
                                                value={this.state.RFCReceptor}
                                                onChange={this.cambioRFCReceptor}
                                                onSelect={ value => this.setState({ RFCReceptor: value, okRFCReceptor:true, RFCReceptorIsValid:true }) }
                                                wrapperStyle={wrapperStyle1}
                                              />
                                </div>


                                { this.state.okRFCReceptor===false &&
					<div id="nook" className="mt-1">
					       <Alert color="danger" className="text-center  d-flex justify-content-between align-items-center">
						  <FontAwesomeIcon icon={['fas' , 'thumbs-down']} /> { this.state.msgRFCReceptor } </Alert>
					</div>
                                }
                                { this.state.RFCReceptorIsValid===false &&
                                        <div id="nook" className="mt-1">
                                               <Alert color="danger" className="text-center  d-flex justify-content-between align-items-center">
                                                  <FontAwesomeIcon icon={['fas' , 'thumbs-down']} />  El RFC Receptor  esta mal tecleado  </Alert>
                                        </div>
                                }
                          </div>

                      </FormGroup> }


                      { this.state.dropdownValue==='por rango de fechas' && <FormGroup className="container row col-lg-12">
                          <div className="col-lg-6 mt-1">
                            <Label>Fecha Inicial</Label>
                            <DatePicker dayLabels={days} monthLabels={months} onFocus={this.handleFocus} onBlur={this.handleBlur} defaultValue={this.state.start} id="fechainicial" maxDate={new Date().toISOString()} onChange={(v,f) => this.handleChangeini(v, f)} />
                            { this.state.okfechai===false &&
                                <div  className="mt-1">
                                       <Alert color="danger" className="text-center  d-flex justify-content-between align-items-center">
                                          <FontAwesomeIcon icon={['fas' , 'thumbs-down']} /> La fecha inicial es obligatoria </Alert>
                                </div> }
                          </div>
                          <div className="col-lg-6 mt-1">
                            <Label>Fecha Final</Label>
                            <DatePicker dayLabels={days} monthLabels={months}  id="fechafinal" onFocus={this.handleFocus} onBlur={this.handleBlur} defaultValue={this.state.end} maxDate={new Date().toISOString()} onChange={(v,f) => this.handleChangefin(v, f)} />
                            { this.state.okfechaf===false &&
                                <div className="mt-1">
                                       <Alert color="danger" className="text-center  d-flex justify-content-between align-items-center">
                                          <FontAwesomeIcon icon={['fas' , 'thumbs-down']} /> { this.state.msgfecha } </Alert>
                                </div> }
                          </div>
                      </FormGroup> }

                      { this.state.dropdownValue==='por folio' && <FormGroup className="container row col-lg-12">
				<InputGroup>
					<Input type="input" name="password" id="folio" placeholder="Folio de la factura" />
				</InputGroup>
                                { this.state.okfolio===false && 
                                <div id="nook" className="mt-1">
                                       <Alert color="danger" className="text-center  d-flex justify-content-between align-items-center">
                                          <FontAwesomeIcon icon={['fas' , 'thumbs-down']} /> El folio es obligatorio </Alert>
                                </div> }
                      </FormGroup> }


                      <div className="flex-col d-flex justify-content-center mb-2">
                           <Button color="primary" onClick={this.cargar} disabled={this.state.isDisabled} >{this.state.isDisabled ? 'Solicitando' : 'Solicitar' }</Button>
                      </div>
                      <MiDataGrid className="container" filas={this.state.solicitudes}/>
      <style>
        {`
          /* Media query for screens smaller than 600px */
          @media (max-width: 600px) {
            .tooltip {
              /* Adjust tooltip font size and padding for smaller screens */
              font-size: 12px;
              padding: 8px;
            }
          }
        `}
      </style>
				  </div> }
        </Card>


    )
  }
};
export default CargafaelMasiva;

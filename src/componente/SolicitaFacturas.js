
import React, { Component } from 'react';
import { FormGroup, Alert, Button, Card,Label,Dropdown,DropdownToggle,DropdownMenu,DropdownItem } from 'reactstrap';
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

class SolicitaFacturas extends Component {

  constructor(props){
    super(props);
    this.nextPath = this.nextPath.bind(this);
    this.state = { xml_name : [],ojos:'eye',type:'password',msg:'',ok:'',nook:'',start:new Date("1/1/"+ new Date().getFullYear()).toISOString(),end:new Date().toISOString(),formattedValueIni:null
                   ,formattedValueFin:null,dropdownOpen:false,TipoDescarga:'Recibidos',token:'',folio:'' ,okfolio:true, okfechai:true, okfechaf:true, msgfecha:''
                   ,dropdownOpenC:false,TipoSolicitud:'CFDI',pwdfiel:'',okfolioReq:true, estatusDownload : null, estatusDownloadMsg : null, solicitudes: []
                   ,resultadoVerifica:null,resultadoDownload:null,resultadoAutenticate:null,RFCEmisor:'',RFCEmisorIsValid:null,OKRFCEmisor:null
	           ,RFCReceptor:[],Receptores_Seleccionados: []
                   ,RFCReceptorIsValid:null,OKRFCReceptor:null,folioReq:null,tokenEstatusSAT:false,RFCS:[],tecleoPWD:false,isDisabled:false,queda:'',RFC_FIEL:''
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
        if (e.currentTarget.textContent==='Emitidos') {
           this.setState({TipoDescarga: e.currentTarget.textContent,RFCEmisor:this.state.RFC_FIEL,RFCReceptor:''});
	}
        if (e.currentTarget.textContent==='Recibidos') {
           this.setState({TipoDescarga: e.currentTarget.textContent,RFCReceptor:this.state.RFC_FIEL,RFCEmisor:''});
        }

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

    selectRFCReceptor(value) {
	    // Solo permitimos múltiples si es 'Emitidos'
	    if (this.state.TipoDescarga === 'Emitidos') {
		const itemCompleto = this.state.RFCS.find(item => item.label === value);
		
		if (this.state.RFCReceptor.length < 5) {
		    if (!this.state.RFCReceptor.includes(value)) {
			this.setState({
			    RFCReceptor: [...this.state.RFCReceptor, value],
			    Receptores_Seleccionados: [...this.state.Receptores_Seleccionados, itemCompleto]
			});
		    }
		} else {
		    alert("Máximo 5 receptores permitidos para descargas emitidas.");
		}
	    } else {
		// Comportamiento normal para otros tipos
		this.setState({ RFCReceptor: value, RFCReceptorIsValid: true });
	    }
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
                     window.leeSolicitudesCorrectas().then( a => { 
			     this.setState({ solicitudes: a }); 
		     });
                     window.leeRFCS().then( a => { this.setState({ RFCS: a }) });
             }
      });

      /* maneja los mensaje provenientes del sw */
      handleMessage = (event) => {
	      if (event.data.action!=='log')  {
		      window.leeSolicitudesCorrectas().then( a => { this.setState({ solicitudes: a }) });
		      if (event.data.action==='CONTRA') {
			      window.PWDFIEL=event.data.value;
			      this.setState({ pwdfiel:  window.PWDFIEL });
			      return;
		      }

		      // ADD THIS CHECK HERE: Ensure event.data.request exists
		      if (!event.data.request || !event.data.request.value) {
			    return; 
		      }

		      if (event.data.request.value.estado===window.ESTADOREQ.AUTENTICADO & event.data.request.value.url==="/autentica.php") {
			 this.setState({ token: event.data.respuesta,pwdfiel:  window.PWDFIEL });
		      }

		      if (event.data.action==='token-invalido') { this.haysolicitudesVerificando() }

		      if (event.data.request.value.url==="/download.php") {
				 DMS.leezip(event.data.respuesta.Paquete);
		      }

		      window.leeSolicitudesCorrectas().then( a => { this.setState({ solicitudes: a }) });
              }
      };

      window.dameRfc().then( rfc => {
                    if (rfc!==null) {
                               this.setState({RFC_FIEL:rfc,RFCReceptor:rfc,end:window.get_fechahora()}); 
                    }
      });


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
    // 1. Bloqueo inmediato para evitar doble clic si ya se está procesando
    if (this.state.isDisabled) return;
    this.setState({ isDisabled: true }, () => {
       setTimeout(() => {

	       this.setState({start:document.querySelector('#fechainicial').value});
	       if (this.state.start===null || this.state.start==='') {
		   this.setState({okfechai:false, isDisabled: false});
		   return;
	       } else {
		   this.setState({okfechai:true});
	       }

	       this.setState({end:document.querySelector('#fechafinal').value});
	       if (this.state.end===null || this.state.end==='') {
		   this.setState({okfechaf:false,msgfecha:'La fecha final es obligatoria', isDisabled: false });
		   return;
	       } else {
		   this.setState({okfechaf:true});
	       }

	       if (this.state.end<this.state.start) {
		   this.setState({okfechaf:false,msgfecha:'La fecha final no puede ser menor a la inicial', isDisabled: false});
		   return;
	       } else {
		   this.setState({okfechaf:true});
	       }

	       if (this.TipoDescarga==='Emitidos') {
		       this.setState({RFCEmisor:document.querySelector('#RFCEmisor').value});
		       if ((this.state.RFCEmisor===null || this.state.RFCEmisor==='') ) {
			   this.setState({okRFCEmisor:false,msgRFCEmisor:'El RFC del emisor es obligatorio', isDisabled: false });
			   return;
		       } else {
			   this.setState({okRFCEmisor:true,msgRFCEmisor:'' });
		       }
               }

	       this.setState({RFCReceptor:document.querySelector('#RFCReceptor').value});
	       if (this.state.RFCReceptor===null || this.state.RFCReceptors==='') {
		   this.setState({okRFCReceptor:false,msgRFCReceptor:'El RFC del receptor es obligatoria', isDisabled: false });
		   return;
	       } else {
		   this.setState({okRFCReceptor:true,msgRFCReceptor:'' });
	       }
	       if (this.state.RFCReceptor===this.state.RFCEmisor) {
		   this.setState({okRFCEmisor:false,msgRFCEmisor:'El RFC del emisor y del receptor no pueden ser iguales', isDisabled: false });
		   return;
	       }
	       if (this.state.RFCEmisorIsValid===false || this.state.RFCReceptorIsValid===false) {
		   return;
	       }
	       this.setState({isDisabled:true});
	       this.inserta_solicitud();
          },1000);
    });
  }

  /* inserta una solicitud en request */
  inserta_solicitud() {
                      var passdata = { 'fechaini':this.state.start.substring(0,10),'fechafin':this.state.end.substring(0,10),
                                                  'RFCEmisor':this.state.RFCEmisor,'RFCReceptor':this.state.RFCReceptor,'TipoSolicitud':this.state.TipoSolicitud 
			                ,TipoDescarga:this.state.TipoDescarga
		      };
	              window.inserta_solicitud(passdata).then(idkey => {
                               window.leeSolicitudesCorrectas().then( a => { this.setState({ solicitudes: a, isDisabled:false }) });
		      }).catch(err => {
			  // Siempre liberar en caso de error para no bloquear la UI
			  this.setState({ isDisabled: false });
			  console.error(err);
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
                  <h2 className="text-center">Solicitar facturas electrónicas</h2>
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
						   {this.state.TipoDescarga} 
				      </DropdownToggle>
				      <DropdownMenu>
					<DropdownItem onClick={this.changeValue} >Emitidos</DropdownItem>
					<DropdownItem onClick={this.changeValue} >Recibidos</DropdownItem>
				      </DropdownMenu>
				</Dropdown>
                          </div>
                      </FormGroup>

		      <FormGroup className="container">
	              { this.state.tokenEstatusSAT===window.TOKEN.ACTIVO  &&  <Label className="text-success">Esta conectado con el SAT { this.state.queda }</Label> }
	              { this.state.tokenEstatusSAT!==window.TOKEN.ACTIVO &&  <Label className="text-danger">Esta desconectado con el SAT</Label> }
		      </FormGroup>

                      <FormGroup className="container row col-lg-12">
                          {this.state.TipoDescarga !== 'Recibidos' && (
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
							wrapperStyle={{
							      ...wrapperStyle1,
							      pointerEvents: this.state.TipoDescarga === "Recibidos" ? 'none' : 'auto',
							      opacity: this.state.TipoDescarga === "Recibidos" ? 0.6 : 1
							}}

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
		         )}
				  <div className={this.state.TipoDescarga === 'Recibidos' ? "col-lg-12 mt-1" : "col-lg-6 mt-1"}>
					<Label>RFC Receptor {this.state.TipoDescarga === 'Emitidos' && "(Hasta 5)"}</Label>
					<div className="col-lg-12 px-0">
						      <Autocomplete
							items={this.state.RFCS}
							getItemValue={item => item.label}
			                                renderItem={(item, highlighted) =>
									    <div key={item.id} style={{ backgroundColor: highlighted ? '#eee' : 'transparent', padding: '5px' }}>
										<strong>{item.alias || 'Sin Alias'}</strong> - <small>{item.label}</small>
									    </div>
							}
                                                        inputProps={{ id: 'RFCReceptor', placeholder: 'Seleccione receptores...', className:'form-control', onBlur:onBlurRFCReceptor }}
							value={this.state.TipoDescarga === 'Emitidos' ? '' : this.state.RFCReceptor} 
							onSelect={value => this.selectRFCReceptor(value)}
							onChange={this.cambioRFCReceptor}
							//onSelect={ value => this.setState({ RFCReceptor: value, okRFCReceptor:true, RFCReceptorIsValid:true }) }
							wrapperStyle={{
							      ...wrapperStyle1,
							      pointerEvents: this.state.TipoDescarga === "Recibidos" ? 'none' : 'auto',
							      opacity: this.state.TipoDescarga === "Recibidos" ? 0.6 : 1
							}}
						      />
						    {/* Etiquetas de los seleccionados */}
			                            {this.state.TipoDescarga !== 'Recibidos' &&
							    <div className="d-flex flex-wrap mt-2" >
								{this.state.Receptores_Seleccionados.map((rfc, index) => (
								    <span key={index} className="badge badge-info m-1 p-2">
									{rfc.alias ? `${rfc.alias} (${rfc.label})` : rfc.label}
									<FontAwesomeIcon 
									    icon={['fas', 'times']} 
									    className="ml-2" 
									    style={{ cursor: 'pointer' }}
									    onClick={() => {
										const r = this.state.RFCReceptor.filter(val => val !== rfc.label);
										const s = this.state.Receptores_Seleccionados.filter(obj => obj.label !== rfc.label);
										this.setState({ RFCReceptor: r, Receptores_Seleccionados: s });
									    }}
									/>
								    </span>
								))}
							    </div>
						    }
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
                      </FormGroup> 


                      <FormGroup className="container row col-lg-12">
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
                      </FormGroup> 


                      <div className="flex-col d-flex justify-content-center mb-2">
                           <Button color="primary" onClick={this.cargar} disabled={this.state.isDisabled} style={{ minWidth: '140px' }}>
			          {this.state.isDisabled ? ( <> <FontAwesomeIcon icon={['fas', 'spinner']} spin className="mr-2" /> Solicitando...  </>) : "Solicitar"}
			   </Button>
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
export default SolicitaFacturas;

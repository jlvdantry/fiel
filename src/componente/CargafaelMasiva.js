import React, { Component } from 'react';
import { FormGroup, Alert, Button, Card,Label,InputGroup,Input,InputGroupAddon,Dropdown,DropdownToggle,DropdownMenu,DropdownItem } from 'reactstrap';
import { browserHistory  } from 'react-router';
import DMS from '../descargaMasivaSat';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  DatePicker } from "reactstrap-date-picker";


let timer = null;

        const days = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa']
        const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

class CargafaelMasiva extends Component {

  constructor(props){
    super(props);
    this.nextPath = this.nextPath.bind(this);
    this.state = { xml_name : [],ojos:'eye',type:'password',msg:'',ok:'',nook:'',start:new Date("1/1/"+ new Date().getFullYear()),end:new Date(),formattedValueIni:null,formattedValueFin:null,dropdownOpen:false,dropdownValue:'por rango de fechas',token:'',folio:'' ,okfolio:true, okfechai:true, okfechaf:true, msgfecha:'',dropdownOpenC:false,TipoSolicitud:'CFDI',pwdfiel:'',okfolioReq:true};
    this.cargar = this.cargar.bind(this);
    this.cambio = this.cambio.bind(this);
    this.showHide = this.showHide.bind(this)
    this.handleChangeini = this.handleChangeini.bind(this)
    this.handleChangefin = this.handleChangefin.bind(this)
    this.toggle =  this.toggle.bind(this)
    this.changeValue = this.changeValue.bind(this);
    this.toggleC =  this.toggleC.bind(this)
    this.changeValueC = this.changeValueC.bind(this);
  }

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

    changeValueC(e) {
        this.setState({TipoSolicitud: e.currentTarget.textContent});
    }


  nextPath(path) {
      browserHistory.push(path);
  }
  componentDidMount(){
      timer = setInterval(() => this.cambio(), 2000)
  }
  componentWillUnmount() {
    clearTimeout(timer);
  }

  onChangeHandler=event=>{
    console.log(event.target.files[0])
  }

  cambio() {
       var xml_name=[];
	for (var i = 0; i < localStorage.length; i++) {
          var key = localStorage.key(i);
          if (key.indexOf('xml_name_')!==-1) {
             xml_name.push(localStorage.getItem(key));
          }
	}
        this.setState({xml_name : xml_name });
  }

  cargar() {

    if (document.querySelector('#pwdfiel').value==='') {
       this.setState({ ok: false, nook:true,msg:'La contraseña es obligatoria'  });
       return;
    } else {
       this.setState({ ok: true, nook:false });
    }

    if (this.state.dropdownValue==='por folio') {
       this.setState({folio:document.querySelector('#folio').value});
       if (this.state.folio==='') {
           this.setState({okfolio:false});
           return;
       } else {
           this.setState({okfolio:true});
       }
    }

    if (this.state.dropdownValue==='Verificar Solicitud') {
       this.setState({folioReq:document.querySelector('#folioReq').value});
       if (this.state.folioReq==='') {
           this.setState({okfolioReq:false});
           return;
       } else {
           this.setState({okfolioReq:true});
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

    }

    var x = new DMS();
    var res=x.autenticate_armasoa(document.querySelector('#pwdfiel').value);
    if (res.ok===true) {
       if (this.state.dropdownValue!=='Verificar Solicitud') {
	       this.setState({ ok: true, nook:false });
	       x.autenticate_enviasoa(res.soap).then((ret) =>  {
			 this.setState(state => ({ ok:ret.ok, msg:ret.msg, token:JSON.parse(ret.token),pwdfiel:document.querySelector('#pwdfiel').value}));
			 var resa=x.solicita_armasoa(this.state);
			 if (resa.ok===true) {
				 this.setState({ ok: true, nook:false });
				 x.solicita_enviasoa(resa.soap,this.state.token).then((ret) => {
					 this.setState(state => ({ ok:ret.ok, msg:ret.msg, token:JSON.parse(ret.token),pwdfiel:document.querySelector('#pwdfiel').value}));
				 })
			 }
	       });
       } else {
	       this.setState({ ok: true, nook:false });
	       x.autenticate_enviasoa(res.soap).then((ret) =>  {
			 this.setState(state => ({ ok:ret.ok, msg:ret.msg, token:JSON.parse(ret.token),pwdfiel:document.querySelector('#pwdfiel').value,folioReq:document.querySelector('#folioReq').value}));
			 var resa=x.verifica_armasoa(this.state);
			 if (resa.ok===true) {
				 this.setState({ ok: true, nook:false });
			         x.verifica_enviasoa(resa.soap,this.state.token).then((ret) => {
				     this.setState(state => ({ ok:ret.ok, msg:ret.msg, token:JSON.parse(ret.token),pwdfiel:document.querySelector('#pwdfiel').value}));
				 })
                         }          
              });
       }
    }

    if (res.ok===false) {
       this.setState({ ok: false, nook:true,msg:res.msg  });
    }

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

  handleChangefin(value, formattedValue) {
     console.log('entro en handleChangefin');
    this.setState({
      end: value, // ISO String, ex: "2016-11-19T12:00:00.000Z"
      formattedValueFin: formattedValue // Formatted String, ex: "11/19/2016"
    })
  }



  render() {
    return  (
        <Card id="cargafael" className="p-2 m-2">
                  <h2 className="text-center">Carga masiva de la factura electrónica</h2>
                        <FormGroup className="container row col-lg-12 justify-content-around">
                          <div className="col-lg-6 d-flex justify-content-center">
				<Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}  className="d-flex justify-content-center mb-2" >
				      <DropdownToggle caret color="primary" size="lg">
						   Solicitud {this.state.dropdownValue} 
				      </DropdownToggle>
				      <DropdownMenu>
					<DropdownItem onClick={this.changeValue} >por rango de fechas</DropdownItem>
					<DropdownItem onClick={this.changeValue} >por folio</DropdownItem>
					<DropdownItem onClick={this.changeValue} >Verificar Solicitud</DropdownItem>
				      </DropdownMenu>
				</Dropdown>
                          </div>

                          <div className="col-lg-6 d-flex justify-content-center">
				<Dropdown isOpen={this.state.dropdownOpenC} toggle={this.toggleC}  className="d-flex justify-content-center mb-2" >
				      <DropdownToggle caret color="primary" size="lg">
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
                        <Label>Contraseña de la llave privada</Label>
                        <InputGroup>
                                <Input type={this.state.type} name="password" id="pwdfiel" placeholder="contraseña" />
                                <InputGroupAddon addonType="append">
                                        <Button onClick={this.showHide} ><FontAwesomeIcon icon={['fas' , this.state.ojos]} /></Button>
                                </InputGroupAddon>
                        </InputGroup> 
		        { this.state.nook && <div id="nook" className="mt-1">
			               <Alert color="danger" className="text-center  d-flex justify-content-between align-items-center">
                                          <FontAwesomeIcon icon={['fas' , 'thumbs-down']} /> {this.state.msg} </Alert>
		                </div> }
                      </FormGroup>

                      { this.state.dropdownValue==='por rango de fechas' && <FormGroup className="container row col-lg-12">
                          <div className="col-lg-6 mt-1">
                            <Label>Fecha Inicial</Label>
                            <DatePicker dayLabels={days} monthLabels={months} id="fechainicial" value={this.state.start} maxDate={new Date().toISOString()} onChange={(v,f) => this.handleChangeini(v, f)} />
                            { this.state.okfechai===false &&
                                <div  className="mt-1">
                                       <Alert color="danger" className="text-center  d-flex justify-content-between align-items-center">
                                          <FontAwesomeIcon icon={['fas' , 'thumbs-down']} /> La fecha inicial es obligatoria </Alert>
                                </div> }
                          </div>
                          <div className="col-lg-6 mt-1">
                            <Label>Fecha Final</Label>
                            <DatePicker dayLabels={days} monthLabels={months}  id="fechafinal" maxDate={new Date().toISOString()} defaultValue={this.state.end} onChange={(v,f) => this.handleChangefin(v, f)} />
                            { this.state.okfechaf===false &&
                                <div className="mt-1">
                                       <Alert color="danger" className="text-center  d-flex justify-content-between align-items-center">
                                          <FontAwesomeIcon icon={['fas' , 'thumbs-down']} /> { this.state.msgfecha } </Alert>
                                </div> }
                          </div>
                      </FormGroup> }

                      { this.state.dropdownValue==='por folio' && <FormGroup className="container row col-lg-12">
				<Label>Folio de la factura</Label>
				<InputGroup>
					<Input type="input" name="password" id="folio" placeholder="Folio de la factura" />
				</InputGroup>
                                { this.state.okfolio===false && 
                                <div id="nook" className="mt-1">
                                       <Alert color="danger" className="text-center  d-flex justify-content-between align-items-center">
                                          <FontAwesomeIcon icon={['fas' , 'thumbs-down']} /> El folio es obligatorio </Alert>
                                </div> }

                      </FormGroup> }

                      { this.state.dropdownValue==='Verificar Solicitud' && <FormGroup className="container">
                                <Label>Folio del requerimiento</Label>
                                <InputGroup>
                                        <Input type="input" name="password" id="folioReq" placeholder="Folio del requerimiento" />
                                </InputGroup>
                                { this.state.okfolioReq===false &&
                                <div id="nook" className="mt-1">
                                       <Alert color="danger" className="text-center  d-flex justify-content-between align-items-center">
                                          <FontAwesomeIcon icon={['fas' , 'thumbs-down']} /> El folio del requerimiento es obligatorio </Alert>
                                </div> }

                      </FormGroup> }


                      <div className="flex-col d-flex justify-content-center">
                           <Button color="primary" onClick={this.cargar}>Solicitar</Button>
                      </div>
        </Card>
    )
  }
};
export default CargafaelMasiva;

import React, { Component } from 'react';
import { FormGroup, Alert, Button, Card, Label, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Row, Col } from 'reactstrap';
import { browserHistory } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DatePicker } from "reactstrap-date-picker";
import { MiDataGrid } from './DataGridSolicitud';
import Autocomplete from "react-autocomplete";

let handleMessage = null;
let estaAutenticadoInter = null;
const days = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
var DMS = '';

class SolicitaFacturas extends Component {
    constructor(props) {
        super(props);
        this.nextPath = this.nextPath.bind(this);
        this.state = {
            xml_name: [], ojos: 'eye', type: 'password', msg: '', ok: '', nook: '',
            start: new Date("1/1/" + new Date().getFullYear()).toISOString(),
            end: new Date().toISOString(),
            formattedValueIni: null, formattedValueFin: null, dropdownOpen: false,
            TipoDescarga: 'Recibidos', token: '', folio: '', okfolio: true, okfechai: true, okfechaf: true, msgfecha: '',
            dropdownOpenC: false, TipoSolicitud: 'CFDI', pwdfiel: '', okfolioReq: true, estatusDownload: null,
            estatusDownloadMsg: null, solicitudes: [], resultadoVerifica: null, resultadoDownload: null,
            resultadoAutenticate: null, RFCEmisor: '', RFCEmisorIsValid: null, OKRFCEmisor: null,
            RFCReceptor: [], Receptores_Seleccionados: [], RFCReceptorIsValid: null, OKRFCReceptor: null,
            folioReq: null, tokenEstatusSAT: false, RFCS: [], tecleoPWD: false, isDisabled: false, queda: '', RFC_FIEL: '',
            windowWidth: window.innerWidth // Control de ancho de pantalla
        };
        this.cargar = this.cargar.bind(this);
        this.showHide = this.showHide.bind(this);
        this.handleChangeini = this.handleChangeini.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleChangefin = this.handleChangefin.bind(this);
        this.toggle = this.toggle.bind(this);
        this.changeValueTipoDescarga = this.changeValueTipoDescarga.bind(this);
        this.toggleC = this.toggleC.bind(this);
        this.changeValueC = this.changeValueC.bind(this);
        this.cambioRFCEmisor = this.cambioRFCEmisor.bind(this);
        this.selectRFCEmisor = this.selectRFCEmisor.bind(this);
        this.autenticaContraSAT = this.autenticaContraSAT.bind(this);
        this.haysolicitudesVerificando = this.haysolicitudesVerificando.bind(this);
        this.dame_pwdSW = this.dame_pwdSW.bind(this);
    }

    handleResize = () => this.setState({ windowWidth: window.innerWidth });

    toggle(event) { this.setState({ dropdownOpen: !this.state.dropdownOpen }); }
    toggleC(event) { this.setState({ dropdownOpenC: !this.state.dropdownOpenC }); }

    changeValueTipoDescarga(e) {
        if (e.currentTarget.textContent === 'Emitidos') {
            this.setState({ TipoDescarga: e.currentTarget.textContent, RFCEmisor: this.state.RFC_FIEL, RFCReceptor: [] });
        }
        if (e.currentTarget.textContent === 'Recibidos') {
            this.setState({ TipoDescarga: e.currentTarget.textContent, RFCReceptor: this.state.RFC_FIEL, RFCEmisor: '' });
        }
    }

    cambioRFCEmisor(event) {
        const inputValue = event.target.value.toUpperCase();
        const isValid = /^([A-Z,Ñ,&]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])([A-Z]|[0-9]){2}([A]|[0-9]){1})$/.test(inputValue);
        this.setState({ RFCEmisor: inputValue, RFCEmisorIsValid: isValid });
        window.dameRfc().then(rfc => {
            if (rfc !== null) {
                this.setState({ RFCReceptor: inputValue !== rfc ? rfc : '' });
            }
        });
    }

    selectRFCEmisor(value) {
        const isValid = /^([A-Z,Ñ,&]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])([A-Z]|[0-9]){2}([A]|[0-9]){1})$/.test(value);
        this.setState({ RFCEmisor: value, RFCEmisorIsValid: isValid });
        window.dameRfc().then(rfc => {
            if (rfc !== null) {
                this.setState({ RFCReceptor: value !== rfc ? rfc : '' });
            }
        });
    }

    selectRFCReceptor(value) {
        if (this.state.TipoDescarga === 'Emitidos') {
            const itemCompleto = this.state.RFCS.find(item => item.label === value);
            if (this.state.RFCReceptor.length < 5) {
                if (!this.state.RFCReceptor.includes(value)) {
                    const rfcLimpio = typeof value === 'object' ? value.label : value;
                    this.setState({
                        RFCReceptor: [...this.state.RFCReceptor, rfcLimpio],
                        Receptores_Seleccionados: [...this.state.Receptores_Seleccionados, itemCompleto]
                    });
                }
            } else {
                alert("Máximo 5 receptores permitidos.");
            }
        } else {
            this.setState({ RFCReceptor: value, RFCReceptorIsValid: true });
        }
    }

    cambioRFCReceptor(event) {
        const inputValue = event.target.value.toUpperCase();
        const isValid = /^([A-Z,Ñ,&]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])([A-Z]|[0-9]){2}([A]|[0-9]){1})$/.test(inputValue);
        this.setState({ RFCReceptor: inputValue, RFCReceptorIsValid: isValid });
    }

    changeValueC(e) { this.setState({ TipoSolicitud: e.currentTarget.textContent }); }
    nextPath(path) { browserHistory.push(path); }

    revisaSiEstaAutenticado = () => {
        DMS.getTokenEstatusSAT().then(res => {
            if (res !== undefined && (res.tokenEstatusSAT !== this.state.tokenEstatusSAT || res.queda !== this.state.queda)) {
                this.setState({ tokenEstatusSAT: res.tokenEstatusSAT, queda: res.queda });
            }
        });
    }

    autenticaContraSAT() {
        DMS.autenticate_armasoa(window.PWDFIEL).then(() => { this.setState({ ok: true, nook: false }); })
            .catch(err => { this.setState({ ok: false, nook: true, msg: err }); });
    }

    haysolicitudesVerificando() {
        window.obtieneelUltimoTokenActivo().then(a => {
            const token = { created: a.value.respuesta.created, Expires: a.value.respuesta.Expires, token: a.value.respuesta.token };
            this.setState({ token, pwdfiel: window.PWDFIEL, folioReq: a.folioReq });
            window.leeSolicitudesVerificando().then(req => {
                req.forEach(e => {
                    this.setState({ folioReq: e.value.folioReq });
                    DMS.verificando(this.state, e.key);
                });
            });
        }).catch(() => console.log('Sin token activo'));
    }

    dame_pwdSW() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then((reg) => {
                if (reg.active) reg.active.postMessage({ action: 'dameContra' });
            });
        }
    }

    componentDidMount() {
        DMS = new window.DescargaMasivaSat();
        window.addEventListener("resize", this.handleResize);
        estaAutenticadoInter = setInterval(this.revisaSiEstaAutenticado, (window.REVISA.VIGENCIATOKEN * 1000));
        
        window.tecleoPwdPrivada().then(pwd => {
            if ('pwd' in pwd.value) {
                this.setState({ tecleoPWD: true });
                this.dame_pwdSW();
                window.leeSolicitudesCorrectas().then(a => this.setState({ solicitudes: a }));
                window.leeRFCS().then(a => this.setState({ RFCS: a }));
            }
        });

        handleMessage = (event) => {
            if (event.data.action !== 'log') {
                window.leeSolicitudesCorrectas().then(a => this.setState({ solicitudes: a }));
                if (event.data.action === 'CONTRA') {
                    window.PWDFIEL = event.data.value;
                    this.setState({ pwdfiel: window.PWDFIEL });
                    return;
                }
                if (!event.data.request || !event.data.request.value) return;
                if (event.data.request.value.estado === window.ESTADOREQ.AUTENTICADO && event.data.request.value.url === "/autentica.php") {
                    this.setState({ token: event.data.respuesta, pwdfiel: window.PWDFIEL });
                }
                if (event.data.action === 'token-invalido') this.haysolicitudesVerificando();
                if (event.data.request.value.url === "/download.php") DMS.leezip(event.data.respuesta.Paquete);
            }
        };

        window.dameRfc().then(rfc => {
            if (rfc !== null) this.setState({ RFC_FIEL: rfc, RFCReceptor: rfc, end: window.get_fechahora() });
        });

        navigator.serviceWorker.addEventListener('message', handleMessage);
    }

    componentWillUnmount() {
        navigator.serviceWorker.removeEventListener('message', handleMessage);
        window.removeEventListener("resize", this.handleResize);
        clearInterval(estaAutenticadoInter);
    }

    cargar() {
        if (this.state.isDisabled) return;
        this.setState({ isDisabled: true }, () => {
            setTimeout(() => {
                const startVal = document.querySelector('#fechainicial').value;
                const endVal = document.querySelector('#fechafinal').value;

                if (!startVal) return this.setState({ okfechai: false, isDisabled: false });
                if (!endVal) return this.setState({ okfechaf: false, msgfecha: 'Obligatoria', isDisabled: false });
                if (endVal < startVal) return this.setState({ okfechaf: false, msgfecha: 'Menor a inicial', isDisabled: false });

                this.setState({ start: startVal, end: endVal, okfechai: true, okfechaf: true });
                this.inserta_solicitud();
            }, 500);
        });
    }

    inserta_solicitud() {
        const passdata = {
            'fechaini': this.state.start.substring(0, 10),
            'fechafin': this.state.end.substring(0, 10),
            'RFCEmisor': this.state.RFCEmisor,
            'RFCReceptor': this.state.RFCReceptor,
            'TipoSolicitud': this.state.TipoSolicitud,
            'TipoDescarga': this.state.TipoDescarga
        };
        window.inserta_solicitud(passdata).then(() => {
            window.leeSolicitudesCorrectas().then(a => this.setState({ solicitudes: a, isDisabled: false }));
        }).catch(() => this.setState({ isDisabled: false }));
    }

    showHide(e) { this.setState({ type: this.state.type === 'input' ? 'password' : 'input', ojos: this.state.ojos === 'eye' ? 'eye-slash' : 'eye' }); }
    handleChangeini(v, f) { this.setState({ start: v, formattedValueIni: f }); }
    handleChangefin(v, f) { this.setState({ end: v, formattedValueFin: f }); }
    handleFocus() { clearInterval(estaAutenticadoInter); }
    handleBlur() { estaAutenticadoInter = setInterval(this.revisaSiEstaAutenticado, (window.REVISA.VIGENCIATOKEN * 1000)); }

    handle_inserta_catalogo(catalogo, rfc) {
        window.inserta_catalogo('rfcs', rfc).then(() => {
            window.leeRFCS().then(a => this.setState({ RFCS: a }));
        });
    }

    render() {
        const isMobile = this.state.windowWidth < 768;
        const wrapperStyle1 = { position: 'relative', width: '100%', zIndex: '999' };

        return (
            <Card className="shadow-sm border-0 p-2 p-md-4 m-2">
                <div className="text-center mb-4">
                    <h2 className={isMobile ? "h4" : ""}>Solicitar facturas electrónicas</h2>
                </div>

                {this.state.tecleoPWD === false ? (
                    <Alert color="danger" className="text-center shadow-sm">
                        <FontAwesomeIcon icon={['fas', 'lock']} className="me-2" />
                        Cargue su FIEL para solicitar facturas.
                    </Alert>
                ) : (
                    <div>
                        {/* Selector Tipo Descarga */}
                        <div className="d-flex justify-content-center mb-4">
                            <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                                <DropdownToggle caret color="primary" block={isMobile} className="px-5 shadow-sm">
                                    {this.state.TipoDescarga}
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem onClick={this.changeValueTipoDescarga}>Emitidos</DropdownItem>
                                    <DropdownItem onClick={this.changeValueTipoDescarga}>Recibidos</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>

                        {/* Estado Conexión */}
                        <div className="text-center mb-3">
                            <span className={`badge p-2 ${this.state.tokenEstatusSAT === window.TOKEN.ACTIVO ? 'bg-success' : 'bg-danger'}`}>
                                <FontAwesomeIcon icon={['fas', 'signal']} className="me-2" />
                                {this.state.tokenEstatusSAT === window.TOKEN.ACTIVO ? `Conectado: ${this.state.queda}` : 'Desconectado'}
                            </span>
                        </div>

                        {/* RFCs - Grid Responsivo */}
                        <Row className="g-3">
                            {this.state.TipoDescarga !== 'Recibidos' && (
                                <Col xs={12} md={6}>
                                    <Label className="small font-weight-bold">RFC Emisor</Label>
                                    <Autocomplete
                                        items={this.state.RFCS}
                                        getItemValue={item => item.label}
                                        renderItem={(item, highlighted) => <div key={item.id} className={`p-2 ${highlighted ? 'bg-light' : ''}`}>{item.label}</div>}
                                        inputProps={{ id: 'RFCEmisor', className: 'form-control', placeholder: 'Buscar...', disabled: this.state.TipoDescarga === 'Emitidos' }}
                                        value={this.state.RFCEmisor}
                                        onChange={this.cambioRFCEmisor}
                                        onSelect={v => this.selectRFCEmisor(v)}
                                        wrapperStyle={wrapperStyle1}
                                    />
                                </Col>
                            )}
                            <Col xs={12} md={this.state.TipoDescarga === 'Recibidos' ? 12 : 6}>
                                <Label className="small font-weight-bold">RFC Receptor {this.state.TipoDescarga === 'Emitidos' && "(Max 5)"}</Label>
                                <Autocomplete
                                    items={this.state.RFCS}
                                    getItemValue={item => item.label}
                                    renderItem={(item, highlighted) => (
                                        <div key={item.id} className={`p-2 small ${highlighted ? 'bg-info text-white' : ''}`}>
                                            <strong>{item.alias || 'Sin Alias'}</strong> - {item.label}
                                        </div>
                                    )}
                                    inputProps={{ id: 'RFCReceptor', className: 'form-control', placeholder: 'Seleccionar...', disabled: this.state.TipoDescarga === 'Recibidos' }}
                                    value={this.state.TipoDescarga === 'Emitidos' ? '' : this.state.RFCReceptor}
                                    onSelect={v => this.selectRFCReceptor(v)}
                                    onChange={this.cambioRFCReceptor}
                                    wrapperStyle={wrapperStyle1}
                                />
                                {/* Badges de Selección Multiples */}
                                <div className="d-flex flex-wrap gap-1 mt-2">
                                    {this.state.Receptores_Seleccionados.map((rfc, i) => (
                                        <span key={i} className="badge bg-info text-white p-2 d-flex align-items-center">
                                            {rfc.alias || rfc.label}
                                            <FontAwesomeIcon icon={['fas', 'times']} className="ms-2 pointer" onClick={() => {
                                                this.setState({
                                                    RFCReceptor: this.state.RFCReceptor.filter(v => v !== rfc.label),
                                                    Receptores_Seleccionados: this.state.Receptores_Seleccionados.filter(o => o.label !== rfc.label)
                                                });
                                            }} />
                                        </span>
                                    ))}
                                </div>
                            </Col>
                        </Row>

                        {/* Fechas */}
                        <Row className="mt-3 g-3">
                            <Col xs={12} md={6}>
                                <FormGroup>
                                    <Label className="small font-weight-bold">Fecha Inicial</Label>
                                    <DatePicker 
                                        dayLabels={days} monthLabels={months} id="fechainicial"
                                        defaultValue={this.state.start} maxDate={new Date().toISOString()}
                                        onChange={(v, f) => this.handleChangeini(v, f)}
                                        customControl={<input className="form-control" />}
                                    />
                                    {!this.state.okfechai && <Alert color="danger" className="mt-1 py-1 small">Campo obligatorio</Alert>}
                                </FormGroup>
                            </Col>
                            <Col xs={12} md={6}>
                                <FormGroup>
                                    <Label className="small font-weight-bold">Fecha Final</Label>
                                    <DatePicker 
                                        dayLabels={days} monthLabels={months} id="fechafinal"
                                        defaultValue={this.state.end} maxDate={new Date().toISOString()}
                                        onChange={(v, f) => this.handleChangefin(v, f)}
                                        customControl={<input className="form-control" />}
                                    />
                                    {!this.state.okfechaf && <Alert color="danger" className="mt-1 py-1 small">{this.state.msgfecha}</Alert>}
                                </FormGroup>
                            </Col>
                        </Row>

                        {/* Botón Solicitar */}
                        <div className="mt-4">
                            <Button 
                                color="primary" 
                                onClick={this.cargar} 
                                disabled={this.state.isDisabled}
                                block={isMobile}
                                size="lg"
                                className="shadow shadow-primary py-3 py-md-2"
                            >
                                {this.state.isDisabled ? (
                                    <><FontAwesomeIcon icon={['fas', 'spinner']} spin className="me-2" /> Procesando...</>
                                ) : (
                                    <><FontAwesomeIcon icon={['fas', 'paper-plane']} className="me-2" /> Solicitar</>
                                )}
                            </Button>
                        </div>

                        {/* Tabla de Resultados */}
                        <div className="mt-4 shadow-sm rounded overflow-hidden" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                            <MiDataGrid filas={this.state.solicitudes} />
                        </div>
                    </div>
                )}
            </Card>
        );
    }
}

export default SolicitaFacturas

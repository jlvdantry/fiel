import React, { Component } from 'react';
import { Table, Button, Input, Card, CardHeader, CardBody, Alert, Form, Badge, Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const RFC_REGEX = /^([A-Z,Ñ,&]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])([A-Z]|[0-9]){2}([A]|[0-9]){1})$/;

class AdminCatalogos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rfcs: [],
            nuevoRFC: '',
            nuevoAlias: '',
            mensaje: '',
            tipoMensaje: 'success',
            windowWidth: window.innerWidth
        };
    }

    componentDidMount() {
        this.cargarDatos();
        window.addEventListener('resize', this.updateDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    updateDimensions = () => {
        this.setState({ windowWidth: window.innerWidth });
    }

    cargarDatos = () => {
        if (window.leeRFCS) {
            window.leeRFCS().then(datos => {
                const soloRFCS = datos.filter(item => item.catalogo === 'rfcs');
                const ordenados = soloRFCS.sort((a, b) => (a.alias || "").localeCompare(b.alias || ""));
                this.setState({ rfcs: ordenados });
            });
        }
    }

    handleUpdate = (item) => {
        item.alias = item.alias.toUpperCase();
        item.catalogo = 'rfcs';
        if (window.inserta_catalogo) {
            window.inserta_catalogo('catalogos', item).then(() => this.cargarDatos());
        }
    }

    handleBajaLogica = (item) => {
        item.activo = !item.activo;
        this.handleUpdate(item);
    }

    handleAlta = (e) => {
        e.preventDefault();
        const rfcLimpio = this.state.nuevoRFC.toUpperCase().trim();
        const aliasLimpio = this.state.nuevoAlias.toUpperCase().trim();

        if (!RFC_REGEX.test(rfcLimpio)) {
            this.setState({ mensaje: "RFC Inválido", tipoMensaje: "danger" });
            return;
        }

        const nuevo = {
            id: Date.now(),
            catalogo: 'rfcs',
            label: rfcLimpio,
            alias: aliasLimpio,
            activo: true
        };

        window.inserta_catalogo('catalogos', nuevo).then(() => {
            this.setState({ nuevoRFC: '', nuevoAlias: '', mensaje: 'Agregado', tipoMensaje: 'success' });
            this.cargarDatos();
        });
    }

    render() {
        const isMobile = this.state.windowWidth < 768;

        return (
            <div className="p-2 p-md-4">
                <Card className="shadow-sm border-0">
                    <CardHeader className="bg-primary text-white d-flex justify-content-between align-items-center">
                        <h5 className="mb-0"><FontAwesomeIcon icon={['fas', 'address-book']} /> Administración de RFCs</h5>
                        <Button color="light" size="sm" onClick={this.cargarDatos}><FontAwesomeIcon icon={['fas', 'sync']} /></Button>
                    </CardHeader>
                    <CardBody>
                        {/* Formulario responsivo */}
                        <Form onSubmit={this.handleAlta} className="mb-4">
                            <Row className="g-2">
                                <Col xs={12} md={4}>
                                    <Input 
                                        placeholder="RFC" 
                                        className="form-control-lg-mobile"
                                        value={this.state.nuevoRFC} 
                                        onChange={e => this.setState({ nuevoRFC: e.target.value.toUpperCase() })} 
                                        required 
                                    />
                                </Col>
                                <Col xs={12} md={5}>
                                    <Input 
                                        placeholder="Nombre de la Empresa" 
                                        className="form-control-lg-mobile"
                                        value={this.state.nuevoAlias} 
                                        onChange={e => this.setState({ nuevoAlias: e.target.value.toUpperCase() })} 
                                        required 
                                    />
                                </Col>
                                <Col xs={12} md={3}>
                                    <Button color="primary" block className="h-100"><FontAwesomeIcon icon={['fas', 'plus']} /> Agregar</Button>
                                </Col>
                            </Row>
                        </Form>

                        {this.state.mensaje && <Alert color={this.state.tipoMensaje}>{this.state.mensaje}</Alert>}

                        {/* VISTA DE ESCRITORIO (TABLA) */}
                        {!isMobile && (
                            <Table hover responsive className="d-none d-md-table">
                                <thead className="table-light">
                                    <tr>
                                        <th>RFC</th>
                                        <th>Alias (Editable)</th>
                                        <th>Estado</th>
                                        <th className="text-center">Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.rfcs.map(item => (
                                        <tr key={item.id} style={{ opacity: item.activo ? 1 : 0.6 }}>
                                            <td className="align-middle"><strong>{item.label}</strong></td>
                                            <td>
                                                <Input 
                                                    defaultValue={item.alias} 
                                                    style={{textTransform: 'uppercase'}}
                                                    onBlur={(e) => { item.alias = e.target.value; this.handleUpdate(item); }}
                                                />
                                            </td>
                                            <td className="align-middle">
                                                <Badge color={item.activo ? "success" : "secondary"}>{item.activo ? "Activo" : "Inactivo"}</Badge>
                                            </td>
                                            <td className="text-center">
                                                <Button outline color={item.activo ? "success" : "danger"} onClick={() => this.handleBajaLogica(item)}>
                                                    <FontAwesomeIcon icon={item.activo ? ['fas', 'check-circle'] : ['fas', 'times-circle']} />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}

                        {/* VISTA MÓVIL (TARJETAS) */}
                        {isMobile && (
                            <div className="d-md-none">
                                {this.state.rfcs.map(item => (
                                    <Card key={item.id} className="mb-3 border shadow-sm" style={{ opacity: item.activo ? 1 : 0.7 }}>
                                        <CardBody className="p-3">
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <div>
                                                    <small className="text-muted d-block">RFC</small>
                                                    <strong className="h6">{item.label}</strong>
                                                </div>
                                                <Badge color={item.activo ? "success" : "secondary"}>
                                                    {item.activo ? "Activo" : "Inactivo"}
                                                </Badge>
                                            </div>
                                            <div className="mb-3">
                                                <small className="text-muted d-block">Alias (Toca para editar)</small>
                                                <Input 
                                                    type="text"
                                                    defaultValue={item.alias} 
                                                    className="form-control-sm"
                                                    style={{textTransform: 'uppercase', fontSize: '16px'}}
                                                    onBlur={(e) => { item.alias = e.target.value; this.handleUpdate(item); }}
                                                />
                                            </div>
                                            <Button 
                                                block 
                                                color={item.activo ? "outline-danger" : "outline-success"} 
                                                size="sm"
                                                onClick={() => this.handleBajaLogica(item)}
                                            >
                                                <FontAwesomeIcon icon={item.activo ? ['fas', 'times-circle'] : ['fas', 'check-circle']} />
                                                {item.activo ? " Desactivar RFC" : " Reactivar RFC"}
                                            </Button>
                                        </CardBody>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </CardBody>
                </Card>

                <style>{`
                    @media (max-width: 768px) {
                        .form-control-lg-mobile {
                            height: 48px !important;
                            font-size: 16px !important;
                            margin-bottom: 8px;
                        }
                        .container-fluid { padding: 0 !important; }
                    }
                `}</style>
            </div>
        );
    }
}

export default AdminCatalogos;

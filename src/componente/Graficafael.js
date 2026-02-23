import React, { Component } from 'react';
import { Card, CardBody, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Row, Col, Button } from 'reactstrap';
import { Doughnut, Bar, Pie } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { exportToExcel } from "react-json-to-excel";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, LineController, DoughnutController, ArcElement, PieController } from 'chart.js';
import { ExtraeComprobantes } from './ExtraeComprobantes';
import { useFamilyFiltro } from './FamilyFiltros';

ChartJS.register(
    CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend,
    LineController, PointElement, DoughnutController, PieController, ArcElement
);

const labelsShort = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

class Graficafael extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            years: [],
            dropdownOpenYear: false,
            dropdownOpen: false,
            dropdownValueYear: '',
            dropdownValue: 'Barras Verticales',
            windowWidth: window.innerWidth,
            filtro: null,
            rfc: window.localStorage.getItem('rfc') || '' 
        };
    }

    async componentDidMount() {
        // Obtenemos el RFC de forma asíncrona dentro del ciclo de vida
        const rfcObtenido = await window.dameRfc();
        this.setState({ rfc: rfcObtenido }, () => {
            this.queYears();
        });
        this.handleResize();
        window.addEventListener("resize", this.handleResize);

    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    updateDimensions = () => {
        this.setState({ windowWidth: window.innerWidth });
    }

    // --- LÓGICA DE DATOS RECUPERADA ---

    queYears() {
        if (window.leefacturas) {
            window.leefacturas().then(cuantas => {
                const uniqueYearsSet = new Set();
                let year = 0;
                cuantas.forEach((x) => {
                    if (x.value.passdata && x.value.passdata["cfdi:Comprobante"]) {
                        const fullDate = x.value.passdata["cfdi:Comprobante"]["@attributes"].Fecha;
                        year = fullDate.substring(0, 4);
                        uniqueYearsSet.add(year);
                    }
                });
                const uniqueYearsArray = Array.from(uniqueYearsSet).sort((a, b) => b - a);
                let firstYear = uniqueYearsArray.length === 0 ? '' : uniqueYearsArray[0];
                
                this.setState({ 
                    years: uniqueYearsArray, 
                    dropdownValueYear: firstYear,
                    filtro: { dato: 'url_yearEmision', valor: ['factura', firstYear] }
                }, () => this.actuaFacturas());
            });
        }
    }

    actuaFacturas() {
        if (!window.leefacturas) return;

        window.leefacturas(this.state.filtro).then(cuantas => {
            var datae = Array(12).fill(0); 
            var datai = Array(12).fill(0); 
            var datan = Array(12).fill(0);
            const RFC = this.state.rfc;
            let totalI = 0;
            let totalE = 0;

            cuantas.map((x) => {
                var ingreso = 0, egreso = 0;
                var tc = x.value.passdata["cfdi:Comprobante"]["@attributes"].TipoDeComprobante;
                var rfcEmisor = x.value.passdata["cfdi:Comprobante"]["cfdi:Emisor"]["@attributes"].Rfc;
                var rfcReceptor = x.value.passdata["cfdi:Comprobante"]["cfdi:Receptor"]["@attributes"].Rfc;
                var total = parseFloat(x.value.passdata["cfdi:Comprobante"]["@attributes"].Total);
                var mes = parseInt(x.value.passdata["cfdi:Comprobante"]["@attributes"].Fecha.substring(5, 7)) - 1;

                if (RFC === rfcReceptor) {
                    if (tc === 'I') egreso = total;
                    if (tc === 'N') ingreso = total;
                }
                if (RFC === rfcEmisor) {
                    if (tc === 'E') egreso = total;
                    if (tc === 'I') ingreso = total;
                    if (tc === 'N') egreso = total;
                }
                
                totalI += ingreso;
                totalE += egreso;

                datai[mes] += ingreso;
                datae[mes] += egreso;
                datan[mes] += (ingreso - egreso);
                return null;
            });

            this.props.setSharedFiltro(cuantas);
            if(this.props.setTotals) this.props.setTotals(totalI, totalE);

            this.generaDataGrafica(datai, datae);
        });
    }

    generaDataGrafica = (ingresos, egresos) => {
        const chartData = {
            labels: labelsShort,
            datasets: [
                {
                    label: 'Ingresos',
                    data: ingresos,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                },
                {
                    label: 'Gastos',
                    data: egresos,
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                }
            ]
        };
        this.setState({ data: chartData });
    }

    // --- EXPORTACIÓN ---

    exportaExcel() {
        const datosFactura = ExtraeComprobantes(this.props.facturasProcesadas, this.state.rfc);
        exportToExcel(datosFactura, 'MisFacturas');
    }

    // --- INTERFAZ ---

    toggleYear = () => this.setState({ dropdownOpenYear: !this.state.dropdownOpenYear });
    toggle = () => this.setState({ dropdownOpen: !this.state.dropdownOpen });

    handleYearSelect = (year) => {
        this.setState({ 
            dropdownValueYear: year,
            filtro: { dato: 'url_yearEmision', valor: ['factura', year] }
        }, () => this.actuaFacturas());
    }

    render() {
        const isMobile = this.state.windowWidth < 768;

        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: isMobile ? 'bottom' : 'right',
                    labels: {
                        boxWidth: 12,
                        font: { size: isMobile ? 10 : 12 }
                    }
                },
                tooltip: {
                    enabled: true,
                    callbacks: {
                        label: (context) => {
                            let label = context.dataset.label || '';
                            let val = context.parsed.y || 0;
                            return `${label}: ${new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(val)}`;
                        }
                    }
                }
            },
            scales: this.state.dropdownValue.includes('Barras') ? {
                y: { beginAtZero: true },
                x: {
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45,
                        font: { size: isMobile ? 8 : 11 }
                    }
                }
            } : {}
        };

        return (
            <Card className="shadow-sm border-0 mb-4">
                <div className="p-2 p-md-3 border-bottom bg-light">
                    <Row className="g-2 align-items-center">
                        <Col xs={6} md="auto">
                            <Dropdown isOpen={this.state.dropdownOpenYear} toggle={this.toggleYear} size="sm">
                                <DropdownToggle caret color="white" className="w-100 border shadow-sm">
                                    {this.state.dropdownValueYear || 'Año'}
                                </DropdownToggle>
                                <DropdownMenu>
                                    {this.state.years.map(y => (
                                        <DropdownItem key={y} onClick={() => this.handleYearSelect(y)}>{y}</DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </Dropdown>
                        </Col>
                        <Col xs={6} md="auto">
                            <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle} size="sm">
                                <DropdownToggle caret color="white" className="w-100 border shadow-sm">
                                    <FontAwesomeIcon icon={['fas', 'chart-bar']} className="mr-1" /> 
                                    {isMobile ? "Tipo" : this.state.dropdownValue}
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem onClick={() => this.setState({dropdownValue: 'Barras Verticales'})}>Barras Verticales</DropdownItem>
                                    <DropdownItem onClick={() => this.setState({dropdownValue: 'Barras Horizontales'})}>Barras Horizontales</DropdownItem>
                                    <DropdownItem onClick={() => this.setState({dropdownValue: 'Dona'})}>Dona</DropdownItem>
                                    <DropdownItem onClick={() => this.setState({dropdownValue: 'Pie'})}>Pie</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </Col>
                        <Col xs={12} md="auto" className="ml-md-auto d-flex justify-content-end">
                            <Button color="success" size="sm" className="shadow-sm w-100 w-md-auto" onClick={() => this.exportaExcel()}>
                                <FontAwesomeIcon icon={['fas', 'file-excel']} /> {isMobile ? " Exportar Excel" : " Excel"}
                            </Button>
                        </Col>
                    </Row>
                </div>

                <CardBody style={{ 
                    position: 'relative', 
                    height: isMobile ? '450px' : '400px', 
                    padding: isMobile ? '5px' : '20px' 
                }}>
                    {this.state.data.labels ? (
                        <div style={{ width: '100%', height: '100%' }}>
                            {(this.state.dropdownValue === 'Barras Verticales' || this.state.dropdownValue === 'Barras Horizontales') && (
                                <Bar 
                                    data={this.state.data} 
                                    options={{
                                        ...options,
                                        indexAxis: this.state.dropdownValue === 'Barras Horizontales' ? 'y' : 'x'
                                    }} 
                                />
                            )}
                            {this.state.dropdownValue === 'Dona' && <Doughnut data={this.state.data} options={options} />}
                            {this.state.dropdownValue === 'Pie' && <Pie data={this.state.data} options={options} />}
                        </div>
                    ) : (
                        <div className="d-flex h-100 justify-content-center align-items-center text-muted">
                            <div className="text-center">
                                <FontAwesomeIcon icon={['fas', 'sync']} spin size="2x" className="mb-2" />
                                <p>Procesando Facturas...</p>
                            </div>
                        </div>
                    )}
                </CardBody>
            </Card>
        );
    }
}

const GraficafaelWrapper = (props) => {
    const setSharedFiltro = useFamilyFiltro((state) => state.setSharedFiltro);
    const setTotals = useFamilyFiltro((state) => state.setTotals);
    const facturasProcesadas = useFamilyFiltro((state) => state.facturasProcesadas);

    return (
        <Graficafael 
            {...props} 
            setSharedFiltro={setSharedFiltro} 
            setTotals={setTotals} 
            facturasProcesadas={facturasProcesadas} 
        />
    );
};

export default GraficafaelWrapper;

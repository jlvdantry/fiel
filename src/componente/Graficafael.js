import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Doughnut, Bar, Pie } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip as ReactTooltip } from "react-tooltip";
import { exportToExcel } from "react-json-to-excel";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, LineController, DoughnutController, ArcElement, PieController } from 'chart.js';
import { ExtraeComprobantes } from './ExtraeComprobantes';
import { useFamilyFiltro } from './FamilyFiltros';

// Configuración de ChartJS
ChartJS.register(
    CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend,
    LineController, PointElement, DoughnutController, PieController, ArcElement
);

const labels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', ' Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const labelsShort = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', ' Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

class Graficafael extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {}, dropdownOpenYear: false, dropdownOpen: false, dropdownValueYear: 'Año Emisión Actual', dropdownValue: 'Barras Horizontales',
            refresca: true, exportaExcel: false, datosExcel: null, filtroYearValue: 0, filtro: '', isMobile: false,
            rfc: '' // Guardaremos el RFC aquí
        }
        this.toggle = this.toggle.bind(this);
        this.toggleYear = this.toggleYear.bind(this);
        this.changeValue = this.changeValue.bind(this);
        this.changeValueYear = this.changeValueYear.bind(this);
        this.actuaFacturas = this.actuaFacturas.bind(this);
        this.exportaExcel = this.exportaExcel.bind(this);
        this.queYear = this.queYear.bind(this);
        this.handleResize = this.handleResize.bind(this);
    }

    async componentDidMount() { // Cambiado de componentWillMount a componentDidMount (más seguro)
        // Obtenemos el RFC de forma asíncrona dentro del ciclo de vida
        const rfcObtenido = await window.dameRfc();
        this.setState({ rfc: rfcObtenido }, () => {
            this.queYear();
        });
        
        this.handleResize();
        window.addEventListener("resize", this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
    }

    handleResize() {
        this.setState({ isMobile: (window.innerWidth < 768) });
    }

    toggle() { this.setState({ dropdownOpen: !this.state.dropdownOpen }); }
    toggleYear() { this.setState({ dropdownOpenYear: !this.state.dropdownOpenYear }); }

    changeValue(e) {
        this.setState({ dropdownValue: e.currentTarget.textContent }, () => this.actuaFacturas());
    }

    changeValueYear(e) {
        this.setState({ dropdownValueYear: e.currentTarget.textContent }, () => this.queYear());
    }

    queYear() {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear().toString();
        const lastYear = (currentDate.getFullYear() - 1).toString();
        let nuevoFiltro = '';

        if (this.state.dropdownValueYear === 'Año Emisión Actual') nuevoFiltro = { dato: 'url_yearEmision', valor: ['factura', currentYear] };
        if (this.state.dropdownValueYear === 'Año Emisión Anterior') nuevoFiltro = { dato: 'url_yearEmision', valor: ['factura', lastYear] };
        if (this.state.dropdownValueYear === 'Año Pago Actual') nuevoFiltro = { dato: 'url_yearPago', valor: ['factura', currentYear] };
        if (this.state.dropdownValueYear === 'Año Pago Anterior') nuevoFiltro = { dato: 'url_yearPago', valor: ['factura', lastYear] };

        this.setState({ filtro: nuevoFiltro }, () => this.actuaFacturas());
    }

    exportaExcel() {
        window.leefacturas().then((cuantas) => {
            const datosFactura = ExtraeComprobantes(cuantas, this.state.rfc);
            exportToExcel(datosFactura, 'MisFacturas');
        });
    }

    actuaFacturas() {
        this.setState({ data: {} });
        window.leefacturas(this.state.filtro).then(cuantas => {
            

            var datae = Array(12).fill(0); var datai = Array(12).fill(0); var datan = Array(12).fill(0);
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
		    // Accumulate grand totals
		    totalI += ingreso;
		    totalE += egreso;

		    datai[mes] += ingreso; 
		    datae[mes] += egreso; 
		    datan[mes] += (ingreso - egreso);
		    return null;

            });

            // Push values to the store via the Wrapper props
            this.props.setSharedFiltro(cuantas);
            if(this.props.setTotals) this.props.setTotals(totalI, totalE);



            // Lógica de colores y actualización de estado de la gráfica...
            const randomColor = () => `rgb(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)})`;
            const colors = Array(12).fill().map(() => randomColor());

            this.setState({
                data: {
                    labels: (this.state.isMobile ? labelsShort : labels),
                    datasets: [
                        { label: 'Ingreso', data: datai, backgroundColor: randomColor() },
                        { label: 'Egreso', data: datae, backgroundColor: randomColor() },
                        { label: 'Neto', data: datan, backgroundColor: randomColor() }
                    ]
                }
            });
        }).catch(err => console.error(err));
    }

    render() {
        const { dropdownValue } = this.state;
        // ... (tus opciones de gráfica se mantienen igual)
        return (
            <Card className="p-2 m-2">
                <h2 className="text-center mb-3">Grafica de Ingresos y Egresos</h2>
                <div className="d-flex justify-content-around mb-2">

                    <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                        <DropdownToggle caret color="primary">Grafica {dropdownValue}</DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem onClick={this.changeValue}>Barras Horizontales</DropdownItem>
                            <DropdownItem onClick={this.changeValue}>Barras Verticales</DropdownItem>
                            <DropdownItem onClick={this.changeValue}>Pie</DropdownItem>
                            <DropdownItem onClick={this.changeValue}>Dona</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>

		    <Dropdown isOpen={this.state.dropdownOpenYear} toggle={this.toggleYear}>
		      <DropdownToggle caret color="primary">
				 Filtrar por  {this.state.dropdownValueYear}
		      </DropdownToggle>
		      <DropdownMenu>
			<DropdownItem onClick={this.changeValueYear} >Año Emisión Actual</DropdownItem>
			<DropdownItem onClick={this.changeValueYear} >Año Emisión Anterior</DropdownItem>
			<DropdownItem onClick={this.changeValueYear} >Año Pago Actual</DropdownItem>
			<DropdownItem onClick={this.changeValueYear} >Año Pago Anterior</DropdownItem>
		      </DropdownMenu>
		    </Dropdown>

		    <button className="border-0 " onClick={this.exportaExcel} >
			<FontAwesomeIcon size="2x" data-tooltip-id="my-tooltip-1" className="text-primary" icon={['fas' , 'file-excel']} />
		    </button>

                </div>
                {this.state.data.labels && (
                    <CardBody style={{ height: '400px' }}>
                        {this.state.dropdownValue.includes('Barras') && <Bar data={this.state.data} options={{ responsive: true, maintainAspectRatio: false }} />}
                        {this.state.dropdownValue === 'Dona' && <Doughnut data={this.state.data} />}
                        {this.state.dropdownValue === 'Pie' && <Pie data={this.state.data} />}
                    </CardBody>
                )}
                <ReactTooltip id="my-tooltip-1" />
            </Card>
        );
    }
}

// --- EL CAMBIO CLAVE: EL WRAPPER ---
const GraficafaelWrapper = (props) => {
    // Escuchamos la acción para guardar datos
    const setSharedFiltro = useFamilyFiltro((state) => state.setSharedFiltro);
    // Aquí sí podemos usar el Hook porque esto es una Función
    const setTotals = useFamilyFiltro((state) => state.setTotals); // Add this line	

    return (
        <Graficafael 
            {...props} 
            setSharedFiltro={setSharedFiltro} 
            setTotals={setTotals} // Pass it down
        />
    );
    
};

export default GraficafaelWrapper;

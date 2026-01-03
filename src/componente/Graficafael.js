import React, { Component } from 'react';
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
            data: {}, dropdownOpenYear: false, dropdownOpen: false, dropdownValueYear: '', dropdownValue: 'Barras Horizontales',
            refresca: true, exportaExcel: false, datosExcel: null, filtroYearValue: 0, filtro: '', isMobile: false,
            rfc: '', years:[]
        }
        this.toggle = this.toggle.bind(this);
        this.toggleYear = this.toggleYear.bind(this);
        this.changeValue = this.changeValue.bind(this);
        this.changeValueYear = this.changeValueYear.bind(this);
        this.actuaFacturas = this.actuaFacturas.bind(this);
        this.exportaExcel = this.exportaExcel.bind(this);
        this.queYears = this.queYears.bind(this);
        this.handleResize = this.handleResize.bind(this);
    }

    async componentDidMount() { // Cambiado de componentWillMount a componentDidMount (más seguro)
        // Obtenemos el RFC de forma asíncrona dentro del ciclo de vida
        const rfcObtenido = await window.dameRfc();
        this.setState({ rfc: rfcObtenido }, () => {
            this.queYears();
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
        this.setState({ dropdownValueYear: e.currentTarget.textContent , filtro:{dato: 'url_yearEmision', valor: ['factura',e.currentTarget.textContent] }, data: {} }
		      ,() => this.actuaFacturas());
    }

    queYears() {
        window.leefacturas().then(cuantas => {

            // 1. Create a Set to store unique dates
            const uniqueYearsSet = new Set();
            let year=0;
            cuantas.forEach((x) => {
                const fullDate = x.value.passdata["cfdi:Comprobante"]["@attributes"].Fecha;
                year=fullDate.substring(0, 4);
                uniqueYearsSet.add(year);
	    })
            const uniqueYearsArray = Array.from(uniqueYearsSet).sort((a, b) => b - a);
            let firstYear= uniqueYearsArray.length===0 ? '' : uniqueYearsArray[0];
            this.setState({ years:uniqueYearsArray,dropdownValueYear: firstYear,filtro:{dato: 'url_yearEmision', valor: ['factura',firstYear]}},()  => this.actuaFacturas() );
	});
    }

    exportaExcel() {
            const datosFactura = ExtraeComprobantes(this.props.facturasProcesadas, this.state.rfc);
            exportToExcel(datosFactura, 'MisFacturas');
    }

    actuaFacturas() {
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
        const  dropdownValue  = this.state.dropdownValue;
        // ... (tus opciones de gráfica se mantienen igual)
	    

    var options={};
    if (dropdownValue==='Barras Horizontales') {
       options={    indexAxis: 'y',
                    elements: {
                            bar: {
                              borderWidth: 1,
                            },
                    },
                    responsive:true,
                    maintainAspectRatio: false,
                    plugins: {
                            legend: {
                              position: 'top',
                            },
                            title: {
                              display: true,
                              text: 'Ingresos y Egresos',
                            },
                   },
                   locale: 'es-MX'
                }
    }
    if (dropdownValue==='Barras Verticales') {
       options={
                    elements: {
                            bar: {
                              borderWidth: 1,
                            },
                    },
                    responsive:true,
                    maintainAspectRatio: false,
                    plugins: {
                            legend: {
                              position: 'top',
                            },
                            title: {
                              display: true,
                              text: 'Ingresos y Egresos',
                            },
                   },
                   locale: 'es-MX'
              }
    }
    if (dropdownValue==='Dona' || dropdownValue==='Pie') {
       options={
         responsive:true,
         maintainAspectRatio: false,
         elements: {
              center: {
                legend: { display: true, position: "right" },
                text: "Red is 2/3 the total numbers",
                color: "#FF6384", // Default is #000000
                fontStyle: "Arial", // Default is Arial
                sidePadding: 20, // Default is 20 (as a percentage)
                minFontSize: 20, // Default is 20 (in px), set to false and text will not wrap.
                lineHeight: 25 // Default is 25 (in px), used for when text wraps
              }
            },
         locale: 'es-MX'
       }
    }

        return (
            <Card className="p-2 m-2">
                <h2 className="text-center mb-3">Grafica de Ingresos y Egresos</h2>
                <div className="row g-2 justify-content-center align-items-center ">
                    <div className="col-12 col-md-auto text-center mb-2">
			    <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle} >
				<DropdownToggle caret color="primary">Grafica {dropdownValue}</DropdownToggle>
				<DropdownMenu>
				    <DropdownItem onClick={this.changeValue}>Barras Horizontales</DropdownItem>
				    <DropdownItem onClick={this.changeValue}>Barras Verticales</DropdownItem>
				    <DropdownItem onClick={this.changeValue}>Pie</DropdownItem>
				    <DropdownItem onClick={this.changeValue}>Dona</DropdownItem>
				</DropdownMenu>
			    </Dropdown>
		    </div>

                    <div className="col-12 col-md-auto text-center mb-2">
			    <Dropdown isOpen={this.state.dropdownOpenYear} toggle={this.toggleYear} >
			      <DropdownToggle caret color="primary">
					 {this.state.dropdownValueYear}
			      </DropdownToggle>
				<DropdownMenu>
				    {this.state.years.map((x) => (
					<DropdownItem 
					    key={x} 
					    onClick={this.changeValueYear}
					>
					    {x}
					</DropdownItem>
				    ))}
				</DropdownMenu>
			     </Dropdown>
		    </div>

                    <div className="col-12 col-md-auto text-center mb-2">
			    <button className="border-0 " onClick={this.exportaExcel} >
				<FontAwesomeIcon size="2x" data-tooltip-id="my-tooltip-1" className="text-primary" icon={['fas' , 'file-excel']} />
			    </button>
		    </div>

                </div>
                {this.state.data.labels && (
                    <CardBody style={{ height: '400px' }}>
                        {this.state.dropdownValue === 'Barras Horizontales' && <Bar data={this.state.data} options={options} />}
                        {this.state.dropdownValue === 'Barras Verticales' && <Bar data={this.state.data} options={options} />}
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
    const facturasProcesadas = useFamilyFiltro((state) => state.facturasProcesadas); // Add this line	

    return (
        <Graficafael 
            {...props} 
            setSharedFiltro={setSharedFiltro} 
            setTotals={setTotals} // Pass it down
            facturasProcesadas={facturasProcesadas} // Pass it down
        />
    );
    
};

export default GraficafaelWrapper;

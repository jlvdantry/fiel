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
            rfc: '' ,
            archivoListo: null,
            mostrandoConfirmacion: false,
            nombreArchivo: ""
        };
    }

    // --- TU COMPONENTDIDMOUNT ASYNC RECUPERADO ---
    async componentDidMount() {
        const rfcObtenido = await window.dameRfc();
        this.setState({ rfc: rfcObtenido }, () => {
            this.queYears();
        });
        this.handleResize();
        window.addEventListener("resize", this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    handleResize = () => {
        this.setState({ windowWidth: window.innerWidth });
    }

    queYears() {
        if (window.leefacturas) {
            window.leefacturas().then(cuantas => {
                const uniqueYearsSet = new Set();
                cuantas.forEach((x) => {
                    if (x.value.passdata && x.value.passdata["cfdi:Comprobante"]) {
                        const fullDate = x.value.passdata["cfdi:Comprobante"]["@attributes"].Fecha;
                        const year = fullDate.substring(0, 4);
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

            cuantas.forEach((x) => {
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
                totalI += ingreso; totalE += egreso;
                datai[mes] += ingreso; datae[mes] += egreso;
                datan[mes] += (ingreso - egreso);
            });

            this.props.setSharedFiltro(cuantas);
            if(this.props.setTotals) this.props.setTotals(totalI, totalE);
            this.generaDataGrafica(datai, datae, datan);
        });
    }

    generaDataGrafica = (ingresos, egresos, netos) => {
        const chartData = {
            labels: labelsShort,
            datasets: [
                {
                    label: 'Ingresos',
                    data: ingresos,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Gastos',
                    data: egresos,
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Neto',
                    data: netos,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }
            ]
        };
        this.setState({ data: chartData });
    }

	limpiarNumero = (valor) => {
	    if (typeof valor === 'number') return valor;
	    if (!valor || valor === "" || valor === 'desconocido') return 0;
	    // Eliminamos $, comas y espacios para dejar solo números y puntos
	    const limpio = valor.toString().replace(/[^0-9.-]+/g, "");
	    const resultado = parseFloat(limpio);
	    return isNaN(resultado) ? 0 : resultado;
	};



	compartirReporte = async () => {
	    try {
		let datos = ExtraeComprobantes(this.props.facturasProcesadas, this.state.rfc);
		if (!datos || datos.length === 0) return;

		// 1. ORDENAR POR FECHA (De más antigua a más reciente)
		// Asumiendo que el campo se llama "Fecha Emision" o "Fecha"
		datos.sort((b, a) => new Date(a["Fecha Emision"]) - new Date(b["Fecha Emision"]));

		// 2. CALCULAR TOTALES
		let sumaSubtotal = 0;
		let sumaTotal = 0;
		let sumaIvaAcreditado = 0;
		let sumaIvaCobrado = 0;
		let sumaIngreso = 0;
		let sumaEgreso = 0;

		const headers = Object.keys(datos[0]);
		const filas = datos.map(f => {
		    // Sumamos los valores numéricos para el total final
		    sumaSubtotal += this.limpiarNumero(f.Subtotal);
		    sumaTotal += this.limpiarNumero(f.Total);
		    sumaIvaAcreditado += this.limpiarNumero(f["Iva Acreditado"]);
		    sumaIvaCobrado += this.limpiarNumero(f["Iva Cobrado"]);
		    sumaIngreso += this.limpiarNumero(f["Ingreso"]);
		    sumaEgreso += this.limpiarNumero(f["Egreso"]);

		    return headers.map(h => {
			let v = f[h];
			if (typeof v === 'object' && v !== null) v = JSON.stringify(v);
			let s = (v === null || v === undefined) ? "" : String(v);
			if (s.includes(',') || s.includes('"') || s.includes('\n')) {
			    s = `"${s.replace(/"/g, '""')}"`;
			}
			return s;
		    }).join(",");
		});

		// 3. CREAR FILA DE TOTALES
		// Creamos una fila vacía con la misma cantidad de columnas que los headers
		let filaTotales = headers.map(h => {
		    if (h === headers[0]) return "TOTALES"; // Etiqueta en la primera columna
		    if (h === "Subtotal") return sumaSubtotal.toFixed(2);
		    if (h === "Total") return sumaTotal.toFixed(2);
		    if (h === "Iva Acreditado") return sumaIvaAcreditado.toFixed(2);
		    if (h === "Iva Cobrado") return sumaIvaCobrado.toFixed(2);
		    if (h === "Ingreso") return sumaIngreso.toFixed(2);
		    if (h === "Egreso") return sumaEgreso.toFixed(2);
		    return ""; // Columnas vacías para el resto
		}).join(",");

		// 4. ENSAMBLAR CONTENIDO
		const csvContent = "\uFEFF" + headers.join(",") + "\n" + filas.join("\n") + "\n" + filaTotales;
		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
		const nombre = `Reporte_${this.state.dropdownValueYear}.csv`;
		const file = new File([blob], nombre, { type: 'text/csv' });

		// 5. COMPARTIR
		if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
		    await navigator.share({
			files: [file],
			title: 'Reporte Ordenado',
			text: `Totales - Subtotal: ${sumaSubtotal.toFixed(2)}, Total: ${sumaTotal.toFixed(2)}`
		    });
		} else {
		    this.descargarCSV(blob, nombre);
		}
	    } catch (err) {
		console.error("Error:", err);
		if (err.name !== 'AbortError') alert("Error al generar reporte");
	    }
	}

	// Función auxiliar de descarga
	descargarCSV = (blob, nombre) => {
	    const url = URL.createObjectURL(blob);
	    const a = document.createElement('a');
	    a.href = url;
	    a.download = nombre;
	    a.click();
	    URL.revokeObjectURL(url);
	}

    exportaExcel() {
        const datosFactura = ExtraeComprobantes(this.props.facturasProcesadas, this.state.rfc);

        if (datosFactura && datosFactura.length > 0) {

            const datosNumericos = datosFactura.map(fila => ({
                ...fila,
                Subtotal: this.limpiarNumero(fila.Subtotal),
                "Iva Acreditado": this.limpiarNumero(fila['Iva Acreditado']),
                "Iva Cobrado": this.limpiarNumero(fila['Iva Cobrado']),
                Ingreso: this.limpiarNumero(fila.Ingreso),
                Egreso: this.limpiarNumero(fila.Egreso),
                Total: this.limpiarNumero(fila.Total)
            }));

            const totales = datosFactura.reduce((acc, curr) => {
                acc.ingreso += this.limpiarNumero(curr.Ingreso);
                acc.ivacobrado += this.limpiarNumero(curr['Iva Cobrado']);
                acc.ivaacreditado += this.limpiarNumero(curr['Iva Acreditado']);
                acc.egreso += this.limpiarNumero(curr.Egreso);
                acc.subtotal += this.limpiarNumero(curr.Subtotal);
                acc.total += this.limpiarNumero(curr.Total);
                return acc;
            }, { ingreso: 0, egreso: 0, subtotal: 0, ivaTrasladado: 0, ivaRetenido: 0, total: 0,ivacobrado:0,ivaacreditado:0 });

            const filaTotal = {
                [Object.keys(datosFactura[0])[0]]: "TOTALES:", 
                Subtotal: totales.subtotal,
                "Iva Cobrado": totales.ivacobrado,
                "Iva Acreditado": totales.ivaacreditado,
                Ingreso: totales.ingreso,
                Egreso: totales.egreso,
                Total: totales.total
            };

            const datosFinales = [...datosNumericos, {}, filaTotal];
            exportToExcel(datosFinales, 'Reporte_Facturacion_Totales');
        } else {
            exportToExcel(datosFactura, 'Reporte_Vacio');
        }
    }

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
        const { data, dropdownValue } = this.state;
        const isCircular = dropdownValue === 'Dona' || dropdownValue === 'Pie';

        // Dataset dinámico para evitar el error de 'axis'
        const finalData = {
            ...data,
            datasets: (data.datasets || []).map(ds => {
                if (ds.label === 'Neto') {
                    return {
                        ...ds,
                        type: isCircular ? undefined : 'line', 
                        fill: !isCircular,
                        tension: 0.4
                    };
                }
                return ds;
            })
        };

        const commonOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: isMobile ? 'bottom' : 'right' },
                tooltip: {
                    callbacks: {
                        label: (ctx) => {
                            const label = ctx.dataset.label || ctx.label || '';
                            const value = ctx.raw || 0;
                            return `${label}: ${new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value)}`;
                        }
                    }
                }
            }
        };

        const barOptions = {
            ...commonOptions,
            scales: !isCircular ? {
                y: { beginAtZero: true },
                x: { ticks: { font: { size: isMobile ? 8 : 11 } } }
            } : undefined
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
                                    {dropdownValue}
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem onClick={() => this.setState({dropdownValue: 'Barras Verticales'})}>Barras Verticales</DropdownItem>
                                    <DropdownItem onClick={() => this.setState({dropdownValue: 'Barras Horizontales'})}>Barras Horizontales</DropdownItem>
                                    <DropdownItem onClick={() => this.setState({dropdownValue: 'Dona'})}>Dona</DropdownItem>
                                    <DropdownItem onClick={() => this.setState({dropdownValue: 'Pie'})}>Pie</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </Col>

			{/* Sección de Botones de Acción */}
			<Col xs={12} className="mt-3">
			    <div className="d-flex justify-content-center px-2">
				<div className="btn-group w-100 shadow-sm" role="group" style={{ borderRadius: '8px', overflow: 'hidden' }}>
				    <Button 
					color="white" 
					className="border-end text-success py-2" 
					style={{ flex: 1, backgroundColor: '#f8f9fa', fontWeight: '500' }}
					onClick={() => this.exportaExcel()}
				    >
					<FontAwesomeIcon icon={['fas', 'file-excel']} className="me-2" />
					Excel
				    </Button>
				    <Button 
					    color="white" 
					    className="text-info py-2" 
					    style={{ flex: 1, backgroundColor: '#f8f9fa', fontWeight: '500' }}
					    onClick={this.compartirReporte}
					>
					    <FontAwesomeIcon icon={['fas', 'share-alt']} className="me-2" />
					    Compartir
				    </Button>
				</div>
			    </div>
			</Col>

                    </Row>
                </div>

                <CardBody style={{ position: 'relative', height: isMobile ? '450px' : '400px' }}>
                    {data.labels ? (
                        <div style={{ width: '100%', height: '100%' }}>
                            {dropdownValue === 'Barras Verticales' && <Bar data={finalData} options={barOptions} />}
                            {dropdownValue === 'Barras Horizontales' && <Bar data={finalData} options={{ ...barOptions, indexAxis: 'y' }} />}
                            {dropdownValue === 'Dona' && <Doughnut data={finalData} options={commonOptions} />}
                            {dropdownValue === 'Pie' && <Pie data={finalData} options={commonOptions} />}
                        </div>
                    ) : (
                        <div className="d-flex h-100 justify-content-center align-items-center text-muted">
                            <p>Procesando Facturas...</p>
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
    return <Graficafael {...props} setSharedFiltro={setSharedFiltro} setTotals={setTotals} facturasProcesadas={facturasProcesadas} />;
};

export default GraficafaelWrapper;

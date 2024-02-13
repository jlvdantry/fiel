import React, {Component} from 'react';
import { Dropdown,DropdownToggle,DropdownMenu,DropdownItem } from 'reactstrap';
import PropTypes from 'prop-types';
import ExportaAExcel from './ExportaAExcel';
class Filtros extends Component {
  constructor(props){
    super(props);
    this.state = { data:{},dropdownOpenYear:false,dropdownOpen:false,dropdownValueYear:'Año Emisión Actual',dropdownValue:'Barras Horizontales'
                   ,refresca:true, exportaExcel:false, datosExcel:null, filtroYearValue:0, filtro:''}
    this.toggle =  this.toggle.bind(this)
    this.toggleYear =  this.toggleYear.bind(this)
    this.changeValue = this.changeValue.bind(this);
    this.changeValueYear = this.changeValueYear.bind(this);
    this.queYear = this.queYear.bind(this);
  }



    toggle(event) {

        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    changeValue(e) {
       this.setState({dropdownValue: e.currentTarget.textContent},() => {
                        console.log('actualizo el tipo de grafica');
                       this.props.cambiaGrafica(this.state.dropdownValue);
              });
    }

    changeValueYear(e) {
       this.setState({dropdownValueYear: e.currentTarget.textContent},() => {
                       console.log('actualizo el año');
                       this.queYear();
             });
    }

    toggleYear(event) {
        this.setState({
            dropdownOpenYear: !this.state.dropdownOpenYear
        });
    }

    componentDidMount(){
        console.log('va a ver que año');
        this.queYear();
    }

    queYear() {
                       if (this.state.dropdownValueYear==='Año Emisión Actual') {
                           const currentDate = new Date();
                           const currentYear = currentDate.getFullYear().toString();
                           this.setState({ filtro : { dato: 'url_yearEmision',valor : ['factura',currentYear]}}
                                           ,() => { this.props.cambiaFiltro(this.state.filtro) }
                                        );
                       }
                       if (this.state.dropdownValueYear==='Año Emisión Anterior') {
                           const currentDate = new Date();
                           const currentYear = (currentDate.getFullYear()-1).toString();
                           this.setState({ filtro : { dato: 'url_yearEmision',valor : ['factura',currentYear]}}
                                           ,() =>  { this.props.cambiaFiltro(this.state.filtro) }
                                        );
                       }
                       if (this.state.dropdownValueYear==='Año Pago Actual') {
                           const currentDate = new Date();
                           const currentYear = currentDate.getFullYear().toString();
                           this.setState({ filtro : { dato: 'url_yearPago',valor : ['factura',currentYear]}}
                                           ,() => { this.props.cambiaFiltro(this.state.filtro) }
                                        );
                       }
                       if (this.state.dropdownValueYear==='Año Pago Anterior') {
                           const currentDate = new Date();
                           const currentYear = (currentDate.getFullYear()-1).toString();
                           this.setState({ filtro : { dato: 'url_yearPago',valor : ['factura',currentYear]}}
                                           ,() => { this.props.cambiaFiltro(this.state.filtro) }
                                        );
                       }
    }


  render() {
    return  (
      <>
                        <div className="d-flex justify-content-around align-content-end flex-wrap mb-2 ">
                                <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}  className="d-flex justify-content-center mt-2" >
                                      <DropdownToggle caret color="primary" className="text-wrap">
                                                   Grafica {this.state.dropdownValue}
                                      </DropdownToggle>
                                      <DropdownMenu>
                                        <DropdownItem onClick={this.changeValue}  >Barras Horizontales</DropdownItem>
                                        <DropdownItem onClick={this.changeValue}  >Barras Verticales</DropdownItem>
                                        <DropdownItem onClick={this.changeValue}  >Pie</DropdownItem>
                                        <DropdownItem onClick={this.changeValue}  >Dona</DropdownItem>
                                      </DropdownMenu>
                                </Dropdown>
                                <Dropdown isOpen={this.state.dropdownOpenYear} toggle={this.toggleYear}  className="d-flex justify-content-center mt-2" >
                                      <DropdownToggle caret color="primary" className="text-wrap">
                                                 Filtrar por  {this.state.dropdownValueYear}
                                      </DropdownToggle>
                                      <DropdownMenu>
                                        <DropdownItem onClick={this.changeValueYear}  >Año Emisión Actual</DropdownItem>
                                        <DropdownItem onClick={this.changeValueYear}  >Año Emisión Anterior</DropdownItem>
                                        <DropdownItem onClick={this.changeValueYear} >Año Pago Actual</DropdownItem>
                                        <DropdownItem onClick={this.changeValueYear} >Año Pago Anterior</DropdownItem>
                                      </DropdownMenu>
                                </Dropdown>

                                <ExportaAExcel> </ExportaAExcel>
                        </div>
      </>
    )
  }
};

Filtros.propTypes = {
  onRefresca: PropTypes.func.isRequired
};

Filtros.defaultProps = {
  onRefresca: () => null
}

export default Filtros;

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Card, CardBody, UncontrolledCollapse } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Ayuda extends Component {

  state = { collapseID: "toggler" }
  
  toggle = collapseID => () => {
    console.log('si dio click');
    this.setState(prevState => ({
      collapseID: prevState.collapseID !== collapseID ? collapseID : ""
    }));
  }

  componentDidMount() {
    ReactDOM.findDOMNode(this).addEventListener('touchstart', (e) => {
      console.log("touchstart triggered");
    }, { passive: true });
  }

  ponpasivo = () => {
    ReactDOM.findDOMNode(this).addEventListener('touchstart', (e) => {
      console.log("touchstart triggered");
    }, { passive: true });
  }

  render() {
    const { collapseID } = this.state;
    return (
      <div id="ayuda" data-role="dialog" data-url="ayuda" data-theme="d">
        <div data-role="header">
          <h2 className="text-center">Ayuda</h2>
        </div>
        <div data-role="content">
          
          {/* SECCIÓN 1 */}
          <div className="mb-2">
            <button className="link-button text-info text-left" id="toggler" href="#" onTouchEnd={this.toggle('toggler')} onClick={this.toggle('toggler')} style={{ marginBottom: '1rem' }}>
              <h5>¿Qué es la <b>FIEL</b>?</h5>
            </button>
            <UncontrolledCollapse toggler="#toggler" isOpen={collapseID === 'toggler'}>
              <Card>
                <CardBody>
                  <p className="text-justify">La <b>FIEL</b> también es conocida como la e.firma o firma electrónica y consta de dos archivos y una contraseña; uno de los archivos viene en formato <b>.cer</b> (certificado), llamado llave pública, y el otro archivo en formato <b>.key</b>, llamado llave privada. La <b>FIEL</b> permite generar sellos electrónicos de las facturas que se emitan. Este sello electrónico tiene la misma validez que la firma autógrafa.</p>
                </CardBody>
              </Card>
            </UncontrolledCollapse>
          </div>

          {/* SECCIÓN 2 */}
          <div className="mb-2">
            <button className="link-button text-info text-left" id="toggler1" onTouchEnd={this.toggle('toggler1')} onClick={this.toggle('toggler1')} style={{ marginBottom: '1rem' }}>
              <h5>¿En qué le ayuda este aplicativo?</h5>
            </button>
            <UncontrolledCollapse toggler="#toggler1" isOpen={collapseID === 'toggler1'}>
              <Card>
                <CardBody>
                  <p className="text-justify"><b className="text-info">1.</b> Solicitar al SAT las facturas electrónicas emitidas y/o recibidas y  poder exportarlas a <b>Excel y o PDF</b>.</p>
                  <p className="text-justify"><b className="text-info">2.</b> Para solicitar facturas se tiene que validar la llave privada y pública generada por el <b>SAT</b>. La ventaja  principal de este aplicativo es que la llave privada y pública <b>no</b> viajan por internet. Esto incrementa la seguridad de sus datos confidenciales, previniendo ser víctima de un ciber-crimen al no exponer sus llaves y evitar que su firma electrónica pueda ser <b>hackeada</b>.</p>
                </CardBody>
              </Card>
            </UncontrolledCollapse>
          </div>

          {/* SECCIÓN 3 */}
          <div className="mb-2">
            <button className="link-button text-info text-left" id="toggler2" onTouchEnd={this.toggle('toggler2')} onClick={this.toggle('toggler2')} style={{ marginBottom: '1rem' }}>
              <h5>¿Cuáles son los requisitos?</h5>
            </button>
            <UncontrolledCollapse toggler="#toggler2" isOpen={collapseID === 'toggler2'}>
              <Card>
                <CardBody>
                  <p className="text-justify"><b className="text-info">1.</b> Contar con la llave privada y pública, las cuales deberán estar almacenadas en el móvil, computador o en la nube.</p>
                  <p className="text-justify"><b className="text-info">2.</b> Conocer la contraseña de la llave privada.</p>
                </CardBody>
              </Card>
            </UncontrolledCollapse>
          </div>

          {/* SECCIÓN 4 */}
          <div className="mb-2">
            <button className="link-button text-info text-left" id="toggler3" onTouchEnd={this.toggle('toggler3')} onClick={this.toggle('toggler3')} style={{ marginBottom: '1rem' }}>
              <h5>¿Cómo validar la <b>FIEL</b>?</h5>
            </button>
            <UncontrolledCollapse toggler="#toggler3" isOpen={collapseID === 'toggler3'}>
              <Card>
                <CardBody>
                  <p className="text-justify"><b className="text-info">1.</b> Dé clic en la opción <b className="text-info">"<FontAwesomeIcon icon={['fas', 'pen-fancy']} /> MI FIEL"</b>. Aquí el aplicativo le mostrará tres botones: dos de ellos son para ubicar la <b>FIEL</b> y el tercero para validar la llave privada contra su contraseña.</p>
                  <p className="text-justify"><b className="text-info">2.</b> Dé clic en el botón <b className="text-info">"<FontAwesomeIcon icon={['fas', 'certificate']} className="mr-2" />Ubicar llave pública"</b>. Aquí el aplicativo le solicitará la ubicación del certificado, que es un archivo con extensión <b>.cer</b>.</p>
                  <p className="text-justify"><b className="text-info">3.</b> Dé clic en el botón <b className="text-info">"<FontAwesomeIcon icon={['fas', 'key']} className="mr-2" />Ubicar llave privada"</b>. Aquí el aplicativo le solicitará la ubicación de la llave privada, que es un archivo con extensión <b>.key</b>.</p>
                  <p className="text-justify"><b className="text-info">4.</b> Una vez que ya cargó la <b>FIEL</b>, se debe ingresar la contraseña de la llave privada y posteriormente dar clic en el botón <b className="text-info">"Validar"</b>. Si todo está correcto, el aplicativo le indicará que la <b>FIEL</b> y la contraseña coinciden entre sí; caso contrario, indicará que no coinciden.</p>
                  <p className="text-justify"><b>Nota:</b> Si la <b>FIEL</b> es correcta, se podrán solicitar las facturas electrónicas emitidas y/o recibidas y exportarlas a <b>Excel</b>.</p>
                </CardBody>
              </Card>
            </UncontrolledCollapse>
          </div>

          {/* SECCIÓN 5 */}
          <div className="mb-2">
            <button className="link-button text-info text-left" id="toggler4" onTouchEnd={this.toggle('toggler4')} onClick={this.toggle('toggler4')} style={{ marginBottom: '1rem' }}>
              <h5>¿Cómo solicitar las facturas electrónicas emitidas o recibidas?</h5>
            </button>
            <UncontrolledCollapse toggler="#toggler4" isOpen={collapseID === 'toggler4'}>
              <Card>
                <CardBody>
                  <p className="text-justify"><b className="text-info">1.</b> Dé clic en la opción <b className="text-info">"<FontAwesomeIcon icon={['fas', 'cloud-download-alt']} /> SOLICITAR FACTURAS"</b>. Aquí el aplicativo le mostrará y/o solicitará la siguiente información:</p>
                  <p className="text-justify"><b className="text-info">2.</b> Selecciona el tipo de factura <b className="text-info">"Emitidas"</b>o <b className="text-info">"Recibidas"</b>.</p>
                  <p className="text-justify ml-4"><b className="text-info"><FontAwesomeIcon icon={['fas', 'circle']} className="text-info mr-2" style={{ fontSize: '0.5rem', verticalAlign: 'middle' }} /></b> Si selecciona "Emitidas" debera de seleccionar los RFC receptores.</p>
                  <p className="text-justify ml-4"><b className="text-info"><FontAwesomeIcon icon={['fas', 'circle']} className="text-info mr-2" style={{ fontSize: '0.5rem', verticalAlign: 'middle' }} /></b> Si selecciona "Recibidas" no es necesario seleccionar el RFC receptor.</p>
                  <p className="text-justify"><b className="text-info">3.</b> El aplicativo le solicitará la fecha inicial y final en que se expidió la factura.</p>
                  <p className="text-justify"><b className="text-info">4.</b> Una vez ingresados los datos solicitados, deberá dar clic en el botón <b>"Solicitar"</b>.</p>
                  <p className="text-justify"><b className="text-info">5.</b> Si todo está correcto, le mostrará una tabla con el registro de la solicitud, donde podrá ver el estado desde que fue aceptada hasta que se descargaron las facturas.</p>
                </CardBody>
              </Card>
            </UncontrolledCollapse>
          </div>

          {/* SECCIÓN 6 */}
          <div className="mb-2">
            <button className="link-button text-info text-left" id="toggler5" onTouchEnd={this.toggle('toggler5')} onClick={this.toggle('toggler5')} style={{ marginBottom: '1rem' }}>
              <h5>¿Cómo consultar, exportar a Excel o generar el PDF de las facturas electrónicas?</h5>
            </button>
            <UncontrolledCollapse toggler="#toggler5" isOpen={collapseID === 'toggler5'}>
              <Card>
                <CardBody>
                  <p className="text-justify"><b className="text-info">1.</b> Dé clic en la opción <b className="text-info">"<FontAwesomeIcon icon={['fas', 'receipt']} /> MIS FACTURAS"</b>.</p>
                  <p className="text-justify"><b className="text-info">2.</b> Si no se han descargado facturas, el aplicativo le enviará un mensaje indicando que aún no hay facturas disponibles.</p>
                  <p className="text-justify"><b className="text-info">3.</b> En el encabezado mostrará el total de ingreso, egresos y el neto de las factras electronicas.</p>
                  <p className="text-justify"><b className="text-info">4.</b> Muestra una grafica con los ingresos, egresos y el neto donde podra seleccionar el tipo de grafica, el año de emisión de las facturas y un boton <FontAwesomeIcon size="2x" data-tooltip-id="my-tooltip-1" className="text-primary" icon={['fas' , 'file-excel']} /> para poder exportar las facturas a excel.</p>
                  <p className="text-justify"><b className="text-info">4.</b> Asi mismo muestra un tabla con cada una de las facturas.</p>
                  <p className="text-justify"><b className="text-info">5.</b> En cada fila existe un icono <FontAwesomeIcon icon={['fas', 'file-pdf']} className="text-danger" size="lg" /> que al darle click genera un PDF de la factura.</p>
                </CardBody>
              </Card>
            </UncontrolledCollapse>
          </div>
          
        </div>
      </div>
    );
  }
}

export default Ayuda;

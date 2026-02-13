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
                  <p className="text-justify"><b className="text-info">1.</b> Este aplicativo le permite validar la llave privada y pública generada por el <b>SAT</b>. Su principal virtud es que la llave privada y pública <b>no</b> viajan por internet. Esto incrementa la seguridad de sus datos confidenciales, previniendo ser víctima de un ciber-crimen al no exponer sus llaves y evitar que su firma electrónica pueda ser <b>hackeada</b>.</p>
                  <p className="text-justify"><b className="text-info">2.</b> Solicitar las facturas electrónicas emitidas y/o recibidas y poder exportarlas a <b>Excel</b>.</p>
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
                  <p className="text-justify"><b className="text-info">1.</b> Dé clic en la opción <b className="text-info">"<FontAwesomeIcon icon={['fas', 'cloud-download-alt']} /> DESCARGA MASIVA"</b>. Aquí el aplicativo le mostrará y/o solicitará la siguiente información:</p>
                  <p className="text-justify"><b className="text-info">2.</b> Previamente se debió haber validado la <b className="text-info">"FIEL"</b>.</p>
                  <p className="text-justify"><b className="text-info">3.</b> El aplicativo le mostrará el RFC que contiene la FIEL.</p>
                  <p className="text-justify"><b className="text-info">4.</b> El aplicativo le mostrará que está autenticado ante el SAT.</p>
                  <p className="text-justify"><b className="text-info">5.</b> El aplicativo le solicitará el RFC o los RFCs que le emitieron una factura o que usted emitió.</p>
                  <p className="text-justify"><b className="text-info">6.</b> El aplicativo le solicitará la fecha inicial y final en que se expidió la factura.</p>
                  <p className="text-justify"><b className="text-info">7.</b> Una vez ingresados los datos solicitados, deberá dar clic en el botón <b>"Solicitar"</b>.</p>
                  <p className="text-justify"><b className="text-info">8.</b> Si todo está correcto, le mostrará una tabla con el registro de la solicitud, donde podrá ver el estado desde que fue aceptada hasta que se descargaron las facturas.</p>
                </CardBody>
              </Card>
            </UncontrolledCollapse>
          </div>

          {/* SECCIÓN 6 */}
          <div className="mb-2">
            <button className="link-button text-info text-left" id="toggler5" onTouchEnd={this.toggle('toggler5')} onClick={this.toggle('toggler5')} style={{ marginBottom: '1rem' }}>
              <h5>¿Cómo consultar o exportar a Excel las facturas electrónicas?</h5>
            </button>
            <UncontrolledCollapse toggler="#toggler5" isOpen={collapseID === 'toggler5'}>
              <Card>
                <CardBody>
                  <p className="text-justify"><b className="text-info">1.</b> Dé clic en la opción <b className="text-info">"<FontAwesomeIcon icon={['fas', 'receipt']} /> MIS FACTURAS"</b>.</p>
                  <p className="text-justify"><b className="text-info">2.</b> Si no se han descargado facturas, el aplicativo le enviará un mensaje indicando que aún no hay facturas disponibles.</p>
                  <p className="text-justify"><b className="text-info">3.</b> Si hay facturas, le mostrará una gráfica de los ingresos y/o egresos del año de emisión actual o anterior.</p>
                  <p className="text-justify"><b className="text-info">4.</b> Se podrá consultar en forma detallada las facturas dando clic en el botón <b className="text-info"><FontAwesomeIcon icon={['fas', 'search']} className='mr-2' />"Consultar historial"</b>.</p>
                  <p className="text-justify"><b className="text-info">5.</b> Se podrá exportar a Excel las facturas mediante el icono con el logo de <b className="text-info">"Excel"</b>.</p>
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

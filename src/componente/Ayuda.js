import React, {Component}  from 'react';
import ReactDOM from 'react-dom';
import { Card,CardBody,UncontrolledCollapse } from 'reactstrap';

class Ayuda extends Component {


   state={ collapseID: "toggler" }
   toggle = collapseID => () => {
          console.log('si dio click');
	  this.setState(prevState => ({
	    collapseID: prevState.collapseID !== collapseID ? collapseID : ""
	  }));
         }
	componentDidMount(){
		ReactDOM.findDOMNode(this).addEventListener('touchstart', (e)=>{ 
		    console.log("touchstart triggered");
		},{passive: true});
        }
        ponpasivo = () => {
		ReactDOM.findDOMNode(this).addEventListener('touchstart', (e)=>{ 
		    console.log("touchstart triggered");
		},{passive: true});
        }
  render() {
     const { collapseID } = this.state;
     return  (
        <div id="ayuda" data-role="dialog" data-url="ayuda" data-theme="d">
          <div data-role="header">
                  <h2 className="text-center">Ayuda</h2>
          </div>
          <div data-role="content">
                 <div className="mb-2" >
                      <button className="link-button text-info text-left" id="toggler" href="#" onTouchEnd={this.toggle('toggler')} onClick={this.toggle('toggler')} style={{ marginBottom: '1rem' }}><h5>¿Qué es la <b>FIEL</b>?</h5></button>
		      <UncontrolledCollapse toggler="#toggler" isOpen={collapseID==='toggler' ? true : false} toggleEvents={['touchstart']} >
			<Card >
			  <CardBody>
				  <p className="text-justify">La <b>FIEL</b> también es conocida como la e.firma o firma electrónica y consta de dos archivos y una contraseña, uno de los archivos viene en formato .cer (certificado) llamada llave pública y el otro archivo en formato .key llamada llave privada. La <b>FIEL</b> permite generar sellos electrónicos de las facturas que se emitan. Este sello electrónico tiene la misma validez que la firma autógrafa. </p>
			  </CardBody>
			</Card>
		      </UncontrolledCollapse>
                  </div>
                 <div className="mb-2">
                  <button className="link-button text-info text-left" id="toggler1" onTouchEnd={this.toggle('toggler1')} onClick={this.toggle('toggler1')} style={{ marginBottom: '1rem' }}>
	               <h5>¿En que le ayuda este aplicativo?</h5></button>
		      <UncontrolledCollapse toggler="#toggler1"  isOpen={collapseID==='toggler1' ? true : false}>
                        <Card>
                          <CardBody>
                  <p className="text-justify"><b className="text-info">1.</b> Este aplicativo le permite validar la llave privada y pública generada por el <b>SAT</b>. Teniendo como principal virtud que la llave privada y pública <b>no</b> viajan por internet. Esto incrementa la seguridad de sus datos confidenciales, previniendo ser víctima de un ciber crimen al no exponer sus llaves y evitar que su firma electrónica pueda ser <b className="text-alert">hackeada</b></p>
                  <p className="text-justify"><b className="text-info">2.</b> Solicitar las facturas electrónicas emitidas y/o recibidas y poder exportarlas EXCEL.</p>
                          </CardBody>
                        </Card>
                      </UncontrolledCollapse>
                  </div>

                 <div className="mb-2">
                  <button className="link-button text-info text-left" id="toggler2" onTouchEnd={this.toggle('toggler2')}  onClick={this.toggle('toggler2')} style={{ marginBottom: '1rem' }}>
	                       <h5>¿Cuales son los requisitos?</h5></button>
                      <UncontrolledCollapse toggler="#toggler2" isOpen={collapseID==='toggler2' ? true : false}>
                        <Card>
                          <CardBody>
                  <p className="text-justify"><b className="text-info">1.</b> Contar con la llave privada y pública las cuales deberán de estar almacenadas en el móvil o computador o en la NUBE.</p>
                  <p className="text-justify"><b className="text-info">2.</b> Conocer la contraseña de la llave privada.</p>
                          </CardBody>
                        </Card>
                      </UncontrolledCollapse>
                  </div>

                 <div className="mb-2">
                   <button className="link-button text-info text-left" id="toggler3" onTouchEnd={this.toggle('toggler3')} onClick={this.toggle('toggler3')} style={{ marginBottom: '1rem' }}>
	                     <h5>¿Cómo validar la <b>FIEL</b>?</h5></button>
                      <UncontrolledCollapse toggler="#toggler3" isOpen={collapseID==='toggler3' ? true : false}>
                        <Card>
                          <CardBody>
                  <p className="text-justify"><b className="text-info">1.</b> Dar un clic en la opción <b className="text-info">"MI FIEL"</b>. Aquí el aplicativo le mostrará tres botones dos de ellos son para ubicar la <b>FIEL</b> y el tercero para validar la llave privada contra su contraseña.</p>
                  <p className="text-justify"><b className="text-info">2.</b> Dar clic en el boton <b className="text-info">"Ubicar llave pública"</b>. Aquí el aplicativo le solicitará la ubicación del certificado que es un archivo con extensión cer .</p>
                  <p className="text-justify"><b className="text-info">3.</b> Dar clic en el boton <b className="text-info">"Ubicar llave privada"</b>. Aquí el aplicativo le solicitará la ubicación de la llave privada que es un archivo con extensión key .</p>
                  <p className="text-justify"><b className="text-info">4.</b> Una vez que ya cargo la <b>FIEL</b>, se debe de teclear la contraseña de la llave privada y posteriormente dar clic en el botón <b className="text-info">"Validar"</b>. Si todo esta correcto el aplicativo le indicara que la <b>FIEL</b> y la contraseña checan entre si, caso contrario indicara que no checa la <b>FIEL</b>.</p>
                  <p className="text-justify"><b className="text-info">Nota</b> Si la <b>FIEL</b> es correcta, se podrá solicitar las facturas electrónicas emitidas y/o recibidas y exportarlas a EXCEL.</p>
                          </CardBody>
                        </Card>
                      </UncontrolledCollapse>
                  </div>

                 <div className="mb-2">
                  <button className="link-button text-info text-left" id="toggler4" onTouchEnd={this.toggle('toggler4')}  onClick={this.toggle('toggler4')} style={{ marginBottom: '1rem' }}>
	             <h5>¿Cómo solicitar las facturas electrónicas emitidas o recibidas ?</h5></button>
                      <UncontrolledCollapse toggler="#toggler4" isOpen={collapseID==='toggler4' ? true : false}>
                        <Card>
                          <CardBody>
                  <p className="text-justify"><b className="text-info">1.</b> Previamente se debio de haber validado la  <b className="text-info">"FIEL"</b></p>
                  <p className="text-justify"><b className="text-info">2.</b> El aplicativo le mostrará que el RFC que contiene la FIEL.</p>
                  <p className="text-justify"><b className="text-info">3.</b> El aplicativo le mostrará que esta autenticado ante el SAT. </p>
                  <p className="text-justify"><b className="text-info">4.</b> El aplicativo le solicitará el RFC o RFCS que le emitierón un factura o usted le emitio un factura.</p>
                  <p className="text-justify"><b className="text-info">5.</b> El aplicativo le solicitará la fecha inicial y final en que la expidio la factura</p>
                  <p className="text-justify"><b className="text-info">6.</b> Una vez tecleado los datos solicitados deberá de dar click en en el botón solicitar</p>
                  <p className="text-justify"><b className="text-info">6.</b> Si todo esta correcto le mostrará una tabla con el registro de la solicitud donde podra ver el estado desde que fue aceptada hasta que se decarga las factura o hubo un error. </p>
                          </CardBody>
                        </Card>
                      </UncontrolledCollapse>
                  </div>

                 <div className="mb-2">
                  <button className="link-button text-info text-left" id="toggler5" onTouchEnd={this.toggle('toggler5')}  onClick={this.toggle('toggler5')} style={{ marginBottom: '1rem' }}><h5>¿Cómo firmar un conjunto de datos con la <b>FIEL</b>?</h5></button>
                      <UncontrolledCollapse toggler="#toggler5" isOpen={collapseID==='toggler5' ? true : false}>
                        <Card>
                          <CardBody>
                  <p className="text-justify"><b className="text-info">1.</b> Para poder firmar electrónicamente un conjunto de datos la <b>FIEL</b> debio de haber sido validada previamente.</p>
                  <p className="text-justify">Este aplicativo puede adaptarse para comunicarse con otros sistemas, con el objetivo de obtener el conjunto de datos a firmar electrónicamente. Y una vez generado el sello digital correspondiente, este se puede enviar al sistema que solicito el <b>firmado electrónico</b>.</p>
                  <p className="text-justify">Se recomienda que los datos a firmar se encuentren en formato JSON.</p>
                          </CardBody>
                        </Card>
                      </UncontrolledCollapse>
                  </div>
          </div>
        </div>
    )
  };
};
export default Ayuda;

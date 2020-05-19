import React, {useState} from 'react';
import { Badge,Card,CardBody,UncontrolledCollapse } from 'reactstrap';


const Ayuda = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  return  (
        <div id="ayuda" data-role="dialog" data-url="ayuda" data-theme="d">
          <div data-role="header">
                  <h2 class="text-center">Ayuda</h2>
          </div>
          <div data-role="content">
                 <div>
                      <button className="link-button text-info text-left" id="toggler" href="#" onClick={toggle} style={{ marginBottom: '1rem' }}><h5>¿Qué es la FIEL?</h5></button>
		      <UncontrolledCollapse toggler="#toggler">
			<Card>
			  <CardBody>
				  <p>En ocasiones también es llamada la e.firma o firma electrónica y consta de dos archivos y una contraseña uno de los archivos viene en formato .cer (certificado) llamada llave pública y el otro archivo en formato .key llamada llave privada. La <b>FIEL</b> permite generar sellos electrónicos de las facturas que se emitan. Otra característica de la <b>FIEL</b> es que tiene la misma validez de la firma autógrafa. </p>
			  </CardBody>
			</Card>
		      </UncontrolledCollapse>
                  </div>
                 <div>
                  <button className="link-button text-info text-left" id="toggler1" onClick={toggle} style={{ marginBottom: '1rem' }}><h5>¿En que le ayuda este aplicativo?</h5></button>
		      <UncontrolledCollapse toggler="#toggler1">
                        <Card>
                          <CardBody>
                  <p><Badge color="dark" className="text-info">1.</Badge> Este aplicativo le permite validar la llave privada y pública generada por el <b>SAT</b>. Teniendo como principal virtud que la llave privada y pública <b>no</b> viajen por internet incrementando la seguridad y evitar que pueda ser <b class="text-alert">hackeada su firma electrónica</b></p>
                  <p><Badge color="dark" className="text-info">2.</Badge> Poder validar las facturas electrónicas emitidas con los formatos establecido por el SAT. En caso contrario indicará que la factura no es válida.</p>
                  <p><Badge color="dark" className="text-info">3.</Badge> Firmar electrónicamente cualquier conjunto de datos. A este aplicativo se le pueden adaptar servicios de datos externos para obtener información, firmarlos electrónicamente y generar el sello electrónico.</p>
                          </CardBody>
                        </Card>
                      </UncontrolledCollapse>
                  </div>

                 <div>
                  <button className="link-button text-info text-left" id="toggler2" onClick={toggle} style={{ marginBottom: '1rem' }}><h5>Requisitos:</h5></button>
                      <UncontrolledCollapse toggler="#toggler2">
                        <Card>
                          <CardBody>
                  <p><Badge color="dark" className="text-info">1.</Badge> Contar con la llave privada y pública las cuales deberán de estar almacenadas en el móvil o computador.</p>
                  <p><Badge color="dark" className="text-info">2.</Badge> Conocer la contraseña de la llave privada.</p>
                          </CardBody>
                        </Card>
                      </UncontrolledCollapse>
                  </div>

                 <div>
                   <button className="link-button text-info text-left" id="toggler3" onClick={toggle} style={{ marginBottom: '1rem' }}><h5>¿Cómo validar la FIEL?</h5></button>
                      <UncontrolledCollapse toggler="#toggler3">
                        <Card>
                          <CardBody>
                  <p><Badge color="dark" className="text-info">1.</Badge> Cargar la fiel dando un clic en la opción del menú  <b class="text-info">"Cargar FIEL"</b>. Aquí el aplicativo le solicitará la ubicación de los dos archivos, uno con extension KEY llave privada y el otro con extensión CER llave pública.</p>
                  <p>En el caso de los móviles una de las formas de poder tener las llaves en su equipo es auto enviarse un correo electrónico que contenga las llaves y descargarlas a su equipo.</p>
                  <p><Badge color="dark" className="text-info">2.</Badge> Una vez que ya cargo la FIEL, hay que validarla dando un clic en la opción del menú  <b class="text-info">"Validar Fiel"</b>, aquí se solicitara la contraseña y se debera dar clic en el boton Validar. Aquí espere un momento ya que se tarda alrededor de 1 minuto. Si esta correcto le envia un saludo con el nombre del propietario de la FIEL.</p>
                          </CardBody>
                        </Card>
                      </UncontrolledCollapse>
                  </div>

                 <div>
                  <button className="link-button text-info text-left" id="toggler4" onClick={toggle} style={{ marginBottom: '1rem' }}><h5>¿Cómo validar una factura electrónica firmada con la FIEL?</h5></button>
                      <UncontrolledCollapse toggler="#toggler4">
                        <Card>
                          <CardBody>
                  <p><Badge color="dark" className="text-info">1.</Badge> Cargar la factura electrónica dando un clic en la opción del menú <b class="text-info">"Cargar FAEL"</b>.</p>
                  <p><Badge color="dark" className="text-info">2.</Badge> Dar clic en la opción del menú <b class="text-info">"Valida FAEL"</b>y dar clic en el botón <b class="text-info">Validar</b>, si la factura electrónica es válida desplegara el contenido de este caso contrario enviara el mensaje de que la factura electrónica no es valida.</p>
                  <p>Es importante mencionar que el formato de la factura debe estar en XML</p>
                          </CardBody>
                        </Card>
                      </UncontrolledCollapse>
                  </div>

                 <div>
                  <button className="link-button text-info text-left" id="toggler5" onClick={toggle} style={{ marginBottom: '1rem' }}><h5>¿Cómo firmar un conjunto de datos con la <b>FIEL</b>?</h5></button>
                      <UncontrolledCollapse toggler="#toggler5">
                        <Card>
                          <CardBody>
                  <p><Badge color="dark" className="text-info">1.</Badge> Para poder firmar electrónicamente un conjunto de datos la <b>FIEL</b> debio de haber sido validad previamente.</p>
                  <p>Este aplicativo puede adaptarse para comunicarse con otros sistemas con el objetivo de obtener el conjunto de datos a firmar electrónicamente y despues de haber generado el sello digital este se puede enviar al sistema que solicito el firmado electrónico.</p>
                  <p>Se recomienda que los datos a firmar se encuentren en formato JSON.</p>
                          </CardBody>
                        </Card>
                      </UncontrolledCollapse>
                  </div>
          </div>
        </div>
    )
};
export default Ayuda;

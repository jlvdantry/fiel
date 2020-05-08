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
                      <button className="link-button text-info text-left" id="toggler" href="#" onClick={toggle} style={{ marginBottom: '1rem' }}><h5>¿Que es la FIEL?</h5></button>
		      <UncontrolledCollapse toggler="#toggler">
			<Card>
			  <CardBody>
				  <p>En ocaciones también es llamada la e.firma o firma electrónica consta de dos archivos uno en formato .cer (certificado) llamada llave pública y el otro archivo en formato .key , llave privada, asi como la contraseña de este último. Estos archivos te permiten generar sellos electrónicos de la facturas que emitas y que tienen la misma validez que tu firma autografa. </p>
			  </CardBody>
			</Card>
		      </UncontrolledCollapse>
                  </div>
                 <div>
                  <button className="link-button text-info text-left" id="toggler1" onClick={toggle} style={{ marginBottom: '1rem' }}><h5>¿En que le ayuda este aplicativo?</h5></button>
		      <UncontrolledCollapse toggler="#toggler1">
                        <Card>
                          <CardBody>
                  <p>Este aplicativo le permite validar la llave privada y publica generada por el <b>SAT</b></p>
                  <p>Sin que la llave privada y publica viajen por internet incrementando la seguridad y evitar que pueda ser <b class="text-alert">hackeada su firma electrónica</b></p>
                          </CardBody>
                        </Card>
                      </UncontrolledCollapse>
                  </div>

                 <div>
                  <button className="link-button text-info text-left" id="toggler2" onClick={toggle} style={{ marginBottom: '1rem' }}><h5>Requisitos:</h5></button>
                      <UncontrolledCollapse toggler="#toggler2">
                        <Card>
                          <CardBody>
                  <p><Badge className="text-info">1.</Badge> Contar con la llave privada y publica las cuales deberan de estar almacenadas en el movil o computador.</p>
                  <p><Badge color="primary">2.</Badge> Conocer el password de la llave privada.</p>
                          </CardBody>
                        </Card>
                      </UncontrolledCollapse>
                  </div>

                 <div>
                   <button className="link-button text-info text-left" id="toggler3" onClick={toggle} style={{ marginBottom: '1rem' }}><h5>¿Como Validar la FIEL?</h5></button>
                      <UncontrolledCollapse toggler="#toggler3">
                        <Card>
                          <CardBody>
                  <p><h4><Badge color="primary">Paso 1.</Badge></h4> Cargar la fiel dando un click en la opción del menu  <b class="text-info">"Cargar FIEL"</b>. Aqui le va solicitar el programa que utilizará para cargar la fiel por default esta la camara , foto, galeria etc..., Una vez que selecciono el programa para cargar su fiel debe ubicar donde esta su llave privada con extension key posteriormente debe hacer los mismo con su llave publica con extensión cer.</p>
                  <p>En el caso de los moviles una de la forma de poder tener las llave en su movil es autoenviarse un email que contenga las llaves y de poderlas descargar</p>
                  <p><h4><Badge color="primary">Paso 2.</Badge></h4> Una vez que ya cargo la FIEL, hay que validarla dando un click en la opción del menu  <b class="text-info">"Validar Fiel"</b>, aqui se solicitara el password y se debera dar click en el boton Validar, Aqui espere un momento ya que se tarda alrededor de 1 minuto. Si esta correcto le envia un saludo con el nombre del propietario de la FIEL.</p>
                          </CardBody>
                        </Card>
                      </UncontrolledCollapse>
                  </div>

                 <div>
                  <button className="link-button text-info text-left" id="toggler4" onClick={toggle} style={{ marginBottom: '1rem' }}><h5>¿Como Validar una factura electronica firmada con la FIEL?</h5></button>
                      <UncontrolledCollapse toggler="#toggler4">
                        <Card>
                          <CardBody>
                  <p><Badge color="primary">1.</Badge> Cargar la factura electronica dando un click en la opción del menu <b class="text-info">"Cargar FAEL"</b>.</p>
                  <p><Badge color="primary">2.</Badge>Dar click en la opción del menu <b class="text-info">"Valida FAEL"</b>y dar click en el boton <b class="text-info">Validar<b>, si la factura electronica es valida desplegara el contenido de este caso contrario enviara el mensaje de que la factura electronica no es valida.</p>
                  <p>Es importante mencionar que el formato de la factura debe estar en XML</p>
                          </CardBody>
                        </Card>
                      </UncontrolledCollapse>
                  </div>

                 <div>
                  <button className="link-button text-info text-left" id="toggler5" onClick={toggle} style={{ marginBottom: '1rem' }}><h5>¿Como firmar un conjunto de datos con la FIEL?</h5></button>
                      <UncontrolledCollapse toggler="#toggler5">
                        <Card>
                          <CardBody>
                  <p><Badge color="primary">1.</Badge> Para poder firmar electronicamente un conjunto de datos la <b>FIEL</b> debio de haber sido valida previamente.</p>
                  <p>Este aplicativo puede adaptarse para comunicarse con otros sistemas con el objetivo de obtener el conjunto de datos a firmar electronicamente y despues de haber generado el sello digital este se puede enviar al sistema que solicito el firmado electronico.</p>
                  <p>Se recomienda que los datos a firmar se encuentren en formato json</p>
                          </CardBody>
                        </Card>
                      </UncontrolledCollapse>
                  </div>
          </div>
        </div>
    )
};
export default Ayuda;

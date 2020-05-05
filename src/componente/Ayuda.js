import React, {Component} from 'react';
import { browserHistory  } from 'react-router';
import { Badge } from 'reactstrap';


class Ayuda extends Component {
  constructor(props){
    console.log('entro en el constructor');
    super(props);
    this.nextPath = this.nextPath.bind(this);
  }
  nextPath(path) {
      browserHistory.push(path);
  }
  render() {
    console.log('va a renderiar');
    return  (
        <div id="ayuda" data-role="dialog" data-url="ayuda" data-theme="d">
          <div data-role="header">
                  <h2>Ayuda</h2>
          </div>
          <div data-role="content">
                  <p>Este aplicativo le permite validar la llave privada y publica generada por el <b>SAT</b></p>
                  <p>Sin que la llave privada y publica viajen por internet incrementando la seguridad y evitar que pueda ser <b class="text-alert">hackeada su firma electrónica</b></p>
                  <h3>Requisitos:</h3>
                  <p><Badge color="primary">1.</Badge> Contar con la llave privada y publica las cuales deberan de estar almacenadas en el movil o computador.</p>
                  <p><Badge color="primary">2.</Badge> Conocer el password de la llave privada.</p>
                  <h3>Como Validar la FIEL:</h3>
                  <p><h4><Badge color="primary">Paso 1.</Badge></h4> Cargar la fiel dando un click en la opción del menu  <b class="text-info">"Cargar FIEL"</b>. Aqui le va solicitar el programa que utilizará para cargar la fiel por default esta la camara , foto, galeria etc..., Una vez que selecciono el programa para cargar su fiel debe ubicar donde esta su llave privada con extension key posteriormente debe hacer los mismo con su llave publica con extensión cer.</p>
                  <p>En el caso de los moviles una de la forma de poder tener las llave en su movil es autoenviarse un email que contenga las llaves y de poderlas descargar</p>
                  <p><h4><Badge color="primary">Paso 2.</Badge></h4> Una vez que ya cargo la FIEL, hay que validarla dando un click en la opción del menu  <b class="text-info">"Validar Fiel"</b>, aqui se solicitara el password y se debera dar click en el boton Validar, Aqui espere un momento ya que se tarda alrededor de 1 minuto. Si esta correcto le envia un saludo con el nombre del propietario de la FIEL.</p>
                  <h3>Como Validar una factura electronica firmada con la FIEL:</h3>
                  <p><Badge color="primary">1.</Badge> Cargar la factura electronica dando un click en la opción del menu <b class="text-info">"Cargar FAEL"</b>. si la factura electronica es valida desplegara el contenido de este caso contrario enviara el mensaje de que la factura electronica no es valida.</p>
                  <p>Es importante mencionar que el formato de la factura debe estar en XML</p>
                  <h3>Como firmar un conjunto de datos con la FIEL:</h3>
                  <p><Badge color="primary">1.</Badge> Para poder firmar electronicamente un conjunto de datos la <b>FIEL</b> debio de haber sido valida previamente.</p>
                  <p>Este aplicativo puede adaptarse para comunicarse con otros sistemas con el objetivo de obtener el conjunto de datos a firmar electronicamente asi mismo para poder enviar la firma electronica generada.</p>
                  <p>Se recomienda que los datos a firmar se encuentren en formato json</p>
          </div>
        </div>
    )
  }
};
export default Ayuda;

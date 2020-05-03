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
                  <p>Sin que la llave privada y publica viajen por internet incrementando la seguridad y evitar que pueda seir hackeada su firma electrónica</p>
                  <h3>Requisitos:</h3>
                  <p><Badge color="primary">1.</Badge> Contar con la llave privada y publica las cuales deberan de estar almacenadas en el movil o computador.</p>
                  <p><Badge color="primary">2.</Badge> Conocer el password de la llave privada.</p>
                  <p><Badge color="primary">3.</Badge> Para firmar tramites del Archivo General de Notarias contar con un Usuarios y contraseña del Sistema de "Ventanilla".</p>
                  <h3>Como firmar:</h3>
                  <p><h4><Badge color="primary">Paso 1.</Badge></h4> Cargar la fiel dando un click en el boton <b class="text-info">"Cargar FIEL"</b>. Aqui le va solicitar el programa que utilizará para cargar la fiel por default esta la camara , foto, galeria etc..., Una vez que selecciono el programa para cargar su fiel debe ubicar donde esta su llave privada con extension key posteriormente debe hacer los mismo con su llave publica con extensión cer </p>
                  <p><h4>Paso 2.</h4> Una vez que ya cargo la FIEL, hay que validarla dando un click en el boton "Validar Fiel", aqui se solicitara el password y se debera dar click en el boton Validar, Aqui espere un momento ya que se tarda alrededor de 1 minuto. Si esta correcto le envia un saludo con el nombre del propietario de la FIEL.</p>
                  <p><h4>Paso 3.</h4> El tercer paso es conectarse al sistema para traer la cadena de datos a firmar.</p>
                  <p><h4>Paso 4.</h4> El Ultimo paso es seleccionar el Numero de notario y el Instrumento notarial a firmar.</p>
          </div>
        </div>
    )
  }
};
export default Ayuda;

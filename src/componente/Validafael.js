import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { browserHistory  } from 'react-router';
import { Button, Container, Alert,Card,CardBody,CardSubtitle,CardText,CardHeader, CardDeck} from 'reactstrap';
import fiel from '../fiel';
//import { TC } from './Constantes';
import {openDatabasex,DBNAME,DBVERSION,inserta_factura} from '../db';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CurrencyFormat from 'react-currency-format';


class Validafael extends Component {
  constructor(props){
    super(props);
    this.nextPath = this.nextPath.bind(this);
    this.state = { archi: [] }
    this.validafael = this.validafael.bind(this)
    this.insertafael = this.insertafael.bind(this)
  }

  nextPath(path) {
      browserHistory.push(path);
  }

  componentDidMount(){
  }

  insertafael(){
        console.log('entro en insertafael');
        var archi = this.state.archi;
        archi.map ( async (x,ind,archi1) => 
        {
		var that=this;
                console.log('x='+x+' ind='+ind);
		await openDatabasex(DBNAME,DBVERSION).then(function() {
				     inserta_factura(x.faeljson).then(function() {
                                                                    console.log('puso 1');
								    //x.seintegro=1;
                                                                    archi1[ind].seintegro=1;
                                                                    that.setState({archi:archi1});
                                                                    that.props.onRefresca();
							    }).catch(function(err)  {
                                                                    console.log('puso 2');
								    //x.seintegro=2;
                                                                    archi1[ind].seintegro=2;
                                                                    that.setState({archi:archi1});
							    });
			  });
        });
        //this.setState ({ archi : archi });
        console.log('paso map  insertafael');
  }

  validafael(){
        var archi = []
        for (var i = 0; i < localStorage.length; i++) {
          var key = localStorage.key(i);
          var valor = localStorage.getItem(key);
          if (key.indexOf('xml_name_')!==-1) {
	    var x = new fiel();
	    var res=x.validafael(valor);
	    if (res.ok===true) {
	       archi.push({ ok: true, nook:false, certijson : res.certijson , faeljson : res.faeljson,seintegro:0  });
	    }
	    if (res.ok===false) {
	       archi.push({ ok: false, nook:true,msg:res.msg , seintegro:0 });
	    }
          }
        }
	this.setState({ archi: archi });
  }

  render() {
    const archi = this.state.archi;
    console.log('rendereo');
    const faels = archi.map ((x) => 
              <Container className="border p-2 mb-3">
              { x.ok  && <>
                     <Alert color="success" className="text-center d-flex justify-content-between align-items-center" >
                            <FontAwesomeIcon icon={['fas' , 'thumbs-up']} />
                                      Felicidades el sello de la factura electrónica checa contra el certificado del emisor</Alert>
                 <CardDeck>
                     <Card>
                        <CardHeader color="success" className="text-center" >Factura electrónica</CardHeader>
                        <CardBody>
                          <CardSubtitle className="text-center">Fecha: {x.faeljson["cfdi:Comprobante"]["@attributes"].Fecha}</CardSubtitle>
                          <CardSubtitle className="text-center">Tipo de comprobante: {window.TC[x.faeljson["cfdi:Comprobante"]["@attributes"].TipoDeComprobante]}</CardSubtitle>
                          <CardSubtitle className="text-center">SubTotal: <CurrencyFormat value={x.faeljson["cfdi:Comprobante"]["@attributes"].SubTotal} displayType={'text'} thousandSeparator={true} prefix={'$'} /></CardSubtitle>
                          <CardSubtitle className="text-center">Total: <CurrencyFormat value={x.faeljson["cfdi:Comprobante"]["@attributes"].Total} displayType={'text'} thousandSeparator={true} prefix={'$'} /></CardSubtitle>
                        </CardBody>
                     </Card>

                     <Card>
                        <CardHeader color="success" className="text-center" >Emisor</CardHeader>
                        <CardBody>
                          <CardText color="success" className="text-center" >{ x.faeljson["cfdi:Comprobante"]["cfdi:Emisor"]["@attributes"].Rfc} </CardText>
                          <CardText color="success" className="text-center" >{ x.faeljson["cfdi:Comprobante"]["cfdi:Emisor"]["@attributes"].Nombre}</CardText>
                        </CardBody>
                     </Card>
                     <Card>
                        <CardHeader color="success" className="text-center" >Receptor</CardHeader>
                        <CardBody>
                          <CardText color="success" className="text-center" >{ x.faeljson["cfdi:Comprobante"]["cfdi:Receptor"]["@attributes"].Rfc} </CardText>
                          <CardText color="success" className="text-center" >{ x.faeljson["cfdi:Comprobante"]["cfdi:Receptor"]["@attributes"].Nombre}</CardText>
                        </CardBody>
                     </Card>
                 </CardDeck></> }
                 {x.nook && <Container id="nook" className="border p-2 mb-3">
                     <Alert color="danger" className="text-center d-flex justify-content-between align-items-center" > <FontAwesomeIcon icon={['fas' , 'thumbs-down']} /> {x.msg} </Alert>
                          </Container>}
                         { x.seintegro===1 && <div className="flex-col d-flex justify-content-center mt-3"> <Alert color="success" >
                                      <FontAwesomeIcon icon={['fas' , 'thumbs-up']} /> Se integro la factura al historico</Alert>  </div>}
                         { x.seintegro===2 && <div className="flex-col d-flex justify-content-center mt-3"> <Alert color="danger"  className={ x.seintegro===2 ? 'd-none d-flex align-items-center' : ''  } >
                                      <FontAwesomeIcon icon={['fas' , 'thumbs-down']} className='mr-2' /> La factura ya esta integrada al historico</Alert>  </div>}

              </Container>
              );

    return  (
        <Card id="ayuda" className="p-2 m-2">
	      <h2 className="text-center" >Validar factura electrónica</h2>
              <Container className="border p-2 mb-3">
                      <div className="flex-col d-flex justify-content-center">
		           <Button color="primary" onClick={this.validafael}>Validar factura</Button>
                      </div>
              </Container>
              { faels }
              { faels.length>0 &&
              <div className="flex-col d-flex justify-content-center mt-3">
                           <Button color="primary" onClick={this.insertafael}> <FontAwesomeIcon icon={['fas' , 'plus-circle']} /> ¿Desea agregar al historial de facturas?</Button>
              </div> }
        </Card>
    )
  }
};

Validafael.propTypes = {
  onRefresca: PropTypes.func.isRequired
};

Validafael.defaultProps = {
  onRefresca: () => null
}

export default Validafael;

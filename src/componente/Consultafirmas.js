import React, {Component} from 'react';
import PropTypes from 'prop-types'
import { Button, Container, Card,CardBody,CardSubtitle,CardText, Badge} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ShowMoreText from 'react-show-more-text';
import  Html2Pdf   from "js-html2pdf";


class Consultafirmas extends Component {
  constructor(props){
    super(props);
    this.state = { firmas:[],totalfirmas:0}
    this.consulta = this.consulta.bind(this)
    this.totalFirmas = this.totalFirmas.bind(this)
    this.bajaFirma = this.bajaFirma.bind(this)
    this.pdfFirma = this.pdfFirma.bind(this)
  }

  componentWillMount(){
       this.totalFirmas();
  }

  pdfFirma(event) {
                                        var id=event.currentTarget.dataset.id;
                                        console.log('id='+id);
					var element = document.getElementById(id);

					// Define optional configuration
					var options = {
					  filename: id+'-my-file.pdf',
                                          'width'   : 330,
                                          pagesplit : true
					};
                                        console.log('antes de export');

					// Create instance of html2pdf class
					var exporter = new Html2Pdf(element, options);
                                        console.log('despues de export');

					// Download the PDF or...
					exporter.getPdf(true).then((pdf) => {
					  console.log('pdf file downloaded');
					});
  }

  totalFirmas() {
        var that=this;
        //console.log('va a contar el total de firmas');
        window.cuantasfirmas().then(function(cuantas) {
                                                            //console.log('Cuantas firmas='+cuantas);
                                                            that.setState({totalfirmas:cuantas});
                                                            that.consulta();
                                                    }).catch(function(err)  {
                                                            //console.log('se fue por erro en fotalfirmas'+err);
                                                            that.setState({totalfirmas:0});
                                                            that.consulta();
                                                    });
  }

  bajaFirma(event){
        var that=this;
        window.bajafirmas(event.currentTarget.dataset.id).then(function() {
              that.setState({firmas:[]});
              that.totalFirmas();
              //that.consulta();
              //that.props.onRefresca();
        }).catch(function(err)  {
              console.log('error al dar de baja la factura'+err);
        });
  }

  consulta(){
        //console.log('[Consultafirmas] consulta entro');
        var that=this;
        window.leefirmas().then(function(firmas) {
                                                            //console.log('[Consultafael.js] consulta='+firmas.length);
                                                            that.setState({firmas:firmas});
                                                    }).catch(function(err)  {
                                                            that.setState({firmas:[]});
                                                    });
  }

  render() {
    const { firmas,totalfirmas } = this.state;
    return  (
        <Card className="p-2 m-2">
	      <h2 className="text-center" >Historial de mis firmas <Badge>{totalfirmas}</Badge></h2>
              <Container className="p-2">
                      <div className="flex-col d-flex justify-content-center">
		           <Button color="primary" onClick={this.consulta}> <FontAwesomeIcon icon={['fas' , 'search']} className='mr-2' /> Consultar historial</Button>
                      </div>
              </Container>
              <Container className="p-2 mb-3">
              { firmas.map((data) => { 
                  return (
                 <>
                 <Card key={data.key} className="border p-2 m-2 rounded">
                        <CardBody id={ 'cb-'+ data.key }>
                          <CardSubtitle className="text-center text-break"><b>FIRMA:</b>
                                    <ShowMoreText
                                        lines={3}
                                        more='Ver mas'
                                        less='Ver menos'
                                        anchorClass=''
                                        expanded={false}
                                        width={280}
                                    >{ data.valor.sello } </ShowMoreText>
                          </CardSubtitle>
                          <CardText className="text-center"><b>CADENA:</b>
                                    <ShowMoreText
                                        lines={3}
                                        more='Ver mas'
                                        less='Ver menos'
                                        anchorClass=''
                                        expanded={false}
                                        width={280}
                                    >{ data.valor.passdata.cadena } </ShowMoreText>
                          </CardText>
                          <CardText className="text-center text-break"><b>CERTIFICADO: </b>
                                    <ShowMoreText
                                        lines={3}
                                        more='Ver mas'
                                        less='Ver menos'
                                        anchorClass=''
                                        expanded={false}
                                        width={280}
                                    >{ data.valor.passdata.cer } </ShowMoreText>
                          </CardText>
                        </CardBody>
                        <div className="d-flex justify-content-around">
				<Button data-id={data.key} color="primary"  onClick={this.bajaFirma}> 
					      <FontAwesomeIcon icon={['fas' , 'trash-alt']} className='mr-2' />Eliminar</Button> 
				<Button data-id={'cb-'+data.key} color="primary"  onClick={this.pdfFirma}> 
					      <FontAwesomeIcon icon={['fas' , 'file-pdf']} className='mr-2' />PDF</Button> 
                        </div>
                 </Card>
                 </>
                         )}) }
              </Container> 
        </Card>
    )
  }
};

Consultafirmas.propTypes = {
  onRefresca: PropTypes.func.isRequired
};

Consultafirmas.defaultProps = {
  onRefresca: () => null
}

export default Consultafirmas;

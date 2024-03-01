import React, { Component } from 'react';

import {  Container, Card,CardBody,CardSubtitle,CardText,CardHeader, CardDeck,Badge} from 'reactstrap'
class MiDataGrid extends Component {
  constructor(props){
    super(props);
  }


  render() {
    return  (
        <Card className="p-2 m-2">
              <h2 className="text-center" >Historial de Descargas Masivas solicitadas </h2>
              <Container className="p-2 mb-3">
              { this.props.filas.map((data) => {
                  return (
                 <>
                 <CardDeck key={data.key} className="border p-2 m-2 rounded">
                     <Card>
                        <CardHeader color="success" className="text-center" >Solicitud hecha el <Badge>{data.fecha}</Badge> </CardHeader>
                        <CardBody>
                          <CardSubtitle className="text-center">Estatus: {JSON.stringify(data.msgs)}</CardSubtitle>
                          <CardSubtitle className="text-center">Fecha Inicial: {data.fechaini}</CardSubtitle>
                          <CardSubtitle className="text-center">Fecha Final: {data.fechafin}</CardSubtitle>
                          <CardSubtitle className="text-center">RFC Receptor: {data.RFCReceptor}</CardSubtitle>
                          <CardSubtitle className="text-center">RFC Emisor: {data.RFCEmisor}</CardSubtitle>
                        </CardBody>
                     </Card>
                 </CardDeck>
                 </>
                         )})}
              </Container>
        </Card>
   )}
}


export default MiDataGrid;

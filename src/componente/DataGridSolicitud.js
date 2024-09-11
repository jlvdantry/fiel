
import 'react-data-grid/lib/styles.css';

import DG from 'react-data-grid';
const columns = [
  { key: 'fechaini',  name: 'Fecha Inicial', backgroundColor:'yellow'},
  { key: 'fechafin',  name: 'Fecha Final' },
  { key: 'RFCEmisor', name: 'Emisor' },
  { key: 'RFCReceptor', name: 'Receptor' },
  { key: 'msg', name: 'Estado Solicitud' },
  { key: 'msg_v', name: 'Verificando' },
  { key: 'msg_d', name: 'Descarga'}
];

export function MiDataGrid(props) {
  return <DG columns={columns} rows={props.filas} />;
}

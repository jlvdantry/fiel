
import 'react-data-grid/lib/styles.css';

import DG from 'react-data-grid';
const columns = [
  { key: 'fechaini',  name: 'Fecha Inicial',  minWidth: 50, flex: 1},
  { key: 'fechafin',  name: 'Fecha Final', minWidth: 50, flex: 2},
  { key: 'RFCEmisor', name: 'Emisor',  minWidth: 60, flex: 3},
  { key: 'RFCReceptor', name: 'Receptor', minWidth: 60, flex: 3 },
  { key: 'msg', name: 'Estado Solicitud', minWidth: 80, flex: 3 },
];

export function MiDataGrid(props) {
  return <DG columns={columns} rows={props.filas} />;
}

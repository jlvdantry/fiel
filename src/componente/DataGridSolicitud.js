
import 'react-data-grid/lib/styles.css';

import DataGrid from 'react-data-grid';

const columns = [
  { key: 'fechaini', name: 'Fecha Inicial' },
  { key: 'fechafin', name: 'Fecha Final' },
  { key: 'RFCEmisor', name: 'RFC Emisor' },
  { key: 'RFCReceptor', name: 'RFC Receptor' },
  { key: 'msg', name: 'Estado' }
];

export function MiDataGrid(props) {
  return <DataGrid columns={columns} rows={props.filas} />;
}

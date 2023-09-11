
import 'react-data-grid/lib/styles.css';

import DataGrid from 'react-data-grid';
const fechaformateada = ({value}) => { const valor=value.substring(0,9); console.log('formatter='+valor);return valor; };
const columns = [
  { key: 'fechaini',  name: 'Fecha Inicial', formatter : ({value}) => { const valor=value.substring(0,9); console.log('formatter='+value);return <b>value</b>; }},
  { key: 'fechafin',  name: 'Fecha Final' },
  { key: 'RFCEmisor', name: 'RFC Emisor' },
  { key: 'RFCReceptor', name: 'RFC Receptor' },
  { key: 'msg', name: 'Estado' }
];

export function MiDataGrid(props) {
  return <DataGrid columns={columns} rows={props.filas} />;
}

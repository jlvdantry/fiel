
import 'react-data-grid/lib/styles.css';

import DG from 'react-data-grid';
const columns = [
  { key: 'fechaini',  name: 'Fecha Inicial', backgroundColor:'yellow'},
  { key: 'fechafin',  name: 'Fecha Final' },
  { key: 'RFCEmisor', name: 'RFC Emisor' },
  { key: 'RFCReceptor', name: 'RFC Receptor' },
  { key: 'msg', name: 'Estado Solicitud' },
  { key: 'msg_v', name: 'Estado Verificacion' },
  { key: 'msg_d', name: 'Estado Descarga',
    renderHeaderCell: (props) => {
      return <div className="text-success">Estado Descarga</div>;
    }}
];

export function MiDataGrid(props) {
  return <DG columns={columns} rows={props.filas} />;
}

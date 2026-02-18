import React, { useState, useEffect } from "react";
import 'react-data-grid/lib/styles.css';
import DG from 'react-data-grid';

// FUNCIÓN DE LIMPIEZA TOTAL: No deja pasar ningún objeto a React
const formatearTextoSeguro = (dato) => {
    if (dato === null || dato === undefined) return '';

    // Si es un arreglo (los 5 RFCs)
    if (Array.isArray(dato)) {
        return dato.map(item => {
            if (item && typeof item === 'object') {
                return item.alias || item.label || 'Objeto';
            }
            return String(item);
        }).join(', ');
    }

    // Si es un objeto (un solo RFC con alias o un error de base de datos)
    if (typeof dato === 'object') {
        return dato.alias || dato.label || JSON.stringify(dato);
    }

    // Si es string, número o boolean
    return String(dato);
};

const columns = [
  { key: 'fila',  name: 'ID',  width: 10, flex: 1, formatter: ({row}) => <div>{formatearTextoSeguro(row.fila)}</div>},
  { key: 'fechaini',  name: 'Fecha Inicial',  minWidth: 30, flex: 2, formatter: ({row}) => <div>{formatearTextoSeguro(row.fechaini)}</div>},
  { key: 'fechafin',  name: 'Fecha Final', minWidth: 30, flex: 3, formatter: ({row}) => <div>{formatearTextoSeguro(row.fechafin)}</div>},
  { key: 'RFCEmisor', name: 'Emisor',  minWidth: 50, flex: 4, formatter: ({row}) => <div>{formatearTextoSeguro(row.RFCEmisor)}</div>},
  { 
    key: 'RFCReceptor', 
    name: 'Receptor', 
    minWidth: 50, 
    flex: 5,
    formatter: ({ row }) => {
      const texto = formatearTextoSeguro(row.RFCReceptor);
      return (
        <div title={texto} style={{ cursor: 'help', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {texto}
        </div>
      );
    }
  },
  { key: 'msg', name: 'Estado Solicitud', minWidth: 90, flex: 6, cellClass:'blink', formatter: ({row}) => <div>{formatearTextoSeguro(row.msg)}</div> },
];

export function MiDataGrid(props) {
  const [isMobile, setIsMobile] = useState(false);
  const data = Array.isArray(props.filas) ? props.filas : [];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize); // Aquí pasamos los 2 argumentos por seguridad
  }, []);

  if (isMobile) {
    return (
      <div>
        {data.map((row, rowIndex) => (
          <div className="card mb-2" key={`m-${rowIndex}`}>
            <div className="card-body">
              {columns.map((col, colIndex) => (
                <div className="row justify-content-between mb-1" key={`c-${colIndex}`}>
                  <div className="col-5"><b>{col.name}</b></div>
                  <div className="col-7 text-right text-truncate">
                    {formatearTextoSeguro(row[col.key])}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <DG columns={columns} rows={data} />
    </div>
  );
}

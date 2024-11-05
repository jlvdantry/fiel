import React, { useState, useEffect } from "react";
import 'react-data-grid/lib/styles.css';
import DG from 'react-data-grid';

const columns = [
  { key: 'Emisor', name: 'RFC Emisor', minWidth: 16, flex: 3 },
  { key: 'Nombre Emisor', name: 'Nombre Emisor', minWidth: 30, flex: 3 },
  { key: 'Receptor', name: 'RFC Receptor', minWidth: 16, flex: 3 },
  { key: 'Fecha Emision',  name: 'Fecha Emision',  minWidth: 20, flex: 1, headerRenderer: () => <div>Fecha<br />Emision</div>},
  { key: 'Fecha Pago',  name: 'Fecha Pago',  minWidth: 20, flex: 1},
  { key: 'Descuento',  name: 'Descuento',  minWidth: 20, flex: 1},
  { key: 'Tipo de Comprobante',  name: 'TC', minWidth: 10, flex: 2},
  { key: 'Ingreso', name: 'Ingreso', minWidth: 20, flex: 3 },
  { key: 'Egreso', name: 'Egreso', minWidth: 20, flex: 3 },
];

export default  function DataGridFacturas(props) {
  const [isMobile, setIsMobile] = useState(false);

  // Check if the screen size is mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust 768px as your mobile threshold
    };

    handleResize(); // Check once when the component loads
    window.addEventListener("resize", handleResize); // Add listener for screen resize

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Render grid for desktop/tablet view
  const renderGrid = () => (
    <div style={{ width: "100%", height: "400px" }}>
      <DG columns={columns} rows={props.filas} />
    </div>
  );

  // Render mobile-friendly list view (column data as rows)
  const renderMobileView = () => (
    <div>
      {props.filas.map((row, rowIndex) => (
            <div className="card mb-2">
		<div key={rowIndex} className="card-body">
	        { columns.map((rowc, rowIndexc) => (
			  <div className="row  justify-content-between"><div><b>{ rowc.name}:</b></div> <div>{ row[rowc.key] }</div></div>
                  ))
		}
		</div>
	    </div>
      ))}
    </div>
  );

  return <div>{isMobile ? renderMobileView() : renderGrid()}</div>;
}


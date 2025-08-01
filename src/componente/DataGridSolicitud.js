import React, { useState, useEffect } from "react";
import 'react-data-grid/lib/styles.css';
import DG from 'react-data-grid';

const columns = [
  { key: 'fechaini',  name: 'Fecha Inicial',  minWidth: 50, flex: 1},
  { key: 'fechafin',  name: 'Fecha Final', minWidth: 50, flex: 2},
  { key: 'RFCEmisor', name: 'Emisor',  minWidth: 60, flex: 3},
  { key: 'RFCReceptor', name: 'Receptor', minWidth: 60, flex: 3 },
  { key: 'msg', name: 'Estado Solicitud', minWidth: 80, flex: 3, cellClass:'blink' },
];

export function MiDataGrid(props) {
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
	        {
			columns.map( (col,colIndex) => (
			  <div className="row  justify-content-between">
				 <div><b>{col.name}</b></div> 
				{ !('cellClass' in  col) &&  <div>{row[col.key]}</div>  }
				{  ('cellClass' in  col) &&  <div className='blink'>{row[col.key]}</div>  }
			  </div>
			))
                }
	        </div>
	    </div>
      ))}
    </div>
  )

  return <div>{isMobile ? renderMobileView() : renderGrid()}</div>;
}


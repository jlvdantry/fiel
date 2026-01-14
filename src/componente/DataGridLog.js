import React, { useState, useEffect } from "react";
import 'react-data-grid/lib/styles.css';
import DG from 'react-data-grid';

const columns = [
  { key: 'hora', name: 'Hora', Width: 5, flex: 3 },
  { key: 'msg', name: 'Mensaje', minWidth: 30, flex: 3 },
  { key: 'tipo', name: 'Tipo', Width: 5, flex: 3 },
];

export default function DataGridLog(props) {

  const [isMobile, setIsMobile] = useState(false);
  const filasAMostrar = props.filasAMostrar;

  useEffect(() => {

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const renderGrid = () => (
    <div style={{ width: "100%", height: "400px" }}>
      <DG columns={columns} rows={filasAMostrar || []} />
    </div>
  );

  const renderMobileView = () => (
    <div>
      {filasAMostrar.map((row, rowIndex) => (
        <div key={rowIndex} className="card mb-2">
          <div className="card-body">
            {columns.map((rowc, colIndex) => (
              <div key={colIndex} className="row justify-content-between">
                <div><b>{rowc.name}:</b></div> 
                <div>{row[rowc.key]}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return <div>{isMobile ? renderMobileView() : renderGrid()}</div>;
}

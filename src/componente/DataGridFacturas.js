import React, { useState, useEffect } from "react";
import 'react-data-grid/lib/styles.css';
import DG from 'react-data-grid';
import { useFamilyFiltro } from './FamilyFiltros';
import { ExtraeComprobantes as EC } from './ExtraeComprobantes';

const columns = [
  { key: 'Emisor', name: 'RFC Emisor', minWidth: 16, flex: 3 },
  { key: 'Nombre Emisor', name: 'Nombre Emisor', minWidth: 30, flex: 3 },
  { key: 'Receptor', name: 'RFC Receptor', minWidth: 16, flex: 3 },
  { key: 'Fecha Emision',  name: 'Fecha Emision',  minWidth: 20, flex: 1, headerRenderer: () => <div>Fecha<br />Emision</div>},
  { key: 'Fecha Pago',  name: 'Fecha Pago',  minWidth: 20, flex: 1},
  { key: 'Tipo de Comprobante',  name: 'TC', minWidth: 10, flex: 2},
  { key: 'Ingreso', name: 'Ingreso', minWidth: 20, flex: 3 },
  { key: 'Egreso', name: 'Egreso', minWidth: 20, flex: 3 },
  { key: 'Iva Acreditado', name: 'ivaAcreditado', minWidth: 20, flex: 3 },
  { key: 'Iva Cobrado', name: 'ivaCobrado', minWidth: 20, flex: 3 }
];

export default function DataGridFacturas(props) {
  const [isMobile, setIsMobile] = useState(false);
  // 1. Creamos un estado para el RFC
  const [rfc, setRfc] = useState('');

  // 2. Obtenemos las facturas del store de Zustand
  const facturasRaw = useFamilyFiltro((state) => state.facturasProcesadas);

  useEffect(() => {
    // 3. Función asíncrona para obtener el RFC al montar el componente
    const obtenerDatosIniciales = async () => {
      const rfcObtenido = await window.dameRfc();
      setRfc(rfcObtenido);
    };

    obtenerDatosIniciales();

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 4. Procesamos las filas solo si ya tenemos el RFC y las facturas
  // Usamos useFamilyFiltro con el nombre de variable correcto (sharedFiltro)
  const filasAMostrar = (rfc && facturasRaw) ? EC(facturasRaw, rfc) : [];

  const renderGrid = () => (
    <div style={{ width: "100%", height: "400px" }}>
      <DG columns={columns} rows={filasAMostrar} />
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

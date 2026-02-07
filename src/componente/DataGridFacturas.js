import React, { useState, useEffect, useMemo } from "react";
import 'react-data-grid/lib/styles.css';
import DG from 'react-data-grid';
import { useFamilyFiltro } from './FamilyFiltros';
import { ExtraeComprobantes as EC } from './ExtraeComprobantes';

export default function DataGridFacturas(props) {
  const [isMobile, setIsMobile] = useState(false);
  const [rfc, setRfc] = useState('');
  
  // Estado unificado: guarda qué columna se ordena y en qué dirección
  const [sortConfig, setSortConfig] = useState({ key: 'Fecha Emision', direction: 'desc' });

  const facturasRaw = useFamilyFiltro((state) => state.facturasProcesadas);

  // Función de ordenamiento para TODAS las columnas
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  // Definición de columnas con renderHeaderCell dinámico
  const columns = useMemo(() => [
    { key: 'Emisor', name: 'RFC Emisor', minWidth: 100 },
    { key: 'Nombre Emisor', name: 'Nombre Emisor', minWidth: 200 },
    { key: 'Receptor', name: 'RFC Receptor', minWidth: 100 },
    { key: 'Fecha Emision', name: 'Fecha Emisión', width: 180 },
    { key: 'Ingreso', name: 'Ingreso', minWidth: 100 },
    { key: 'Egreso', name: 'Egreso', minWidth: 100 },
    { key: 'Iva Acreditado', name: 'IVA Acreditado', minWidth: 100 },
    { key: 'Iva Cobrado', name: 'IVA Cobrado', minWidth: 100 }
  ].map(col => ({
    ...col,
    // Asigna el click de ordenamiento a cada cabecera
    renderHeaderCell: () => (
      <div 
        onClick={() => handleSort(col.key)} 
        style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', width: '100%' }}
      >
        {col.name} {sortConfig.key === col.key ? (sortConfig.direction === 'desc' ? '▼' : '▲') : ''}
      </div>
    )
  })), [sortConfig]);

  // Procesamiento y clasificación global
  const filasAMostrar = useMemo(() => {
    if (rfc && facturasRaw && facturasRaw.length > 0) {
      const datos = EC(facturasRaw, rfc);

      return [...datos].sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        // Lógica para Fechas
        if (sortConfig.key.includes('Fecha')) {
          aVal = new Date(aVal || 0).getTime();
          bVal = new Date(bVal || 0).getTime();
        } 
        // Lógica para Números (quitar símbolos de moneda si existen)
        else if (!isNaN(String(aVal).replace(/[^0-9.-]+/g,""))) {
          aVal = parseFloat(String(aVal).replace(/[^0-9.-]+/g,""));
          bVal = parseFloat(String(bVal).replace(/[^0-9.-]+/g,""));
        }
        // 3. Lógica para Texto (Nombre Emisor, RFC)
        else {
          aVal = String(aVal || '').toLowerCase();
          bVal = String(bVal || '').toLowerCase();
          if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
          if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
          return 0;
        }
        // Retorno para Fechas y Números
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;

      });
    }
    return [];
  }, [facturasRaw, rfc, sortConfig]); 

  useEffect(() => {
    const obtenerDatosIniciales = async () => {
      const rfcObtenido = await window.dameRfc();
      setRfc(rfcObtenido);
    };
    obtenerDatosIniciales();

    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const renderGrid = () => (
    <div style={{ width: "100%", height: "500px" }}>
      <DG columns={columns} rows={filasAMostrar} />
    </div>
  );

  const renderMobileView = () => (
    <div className="p-2">
      {/* Botones de ordenamiento para móvil */}
      <div className="sticky-top bg-white pb-2" style={{ zIndex: 100 }}>
        <label className="small fw-bold">Ordenar por:</label>
        <div className="d-flex gap-2 overflow-auto pb-2">
          {columns.map(col => (
            <button 
              key={col.key}
              className={`btn btn-sm ${sortConfig.key === col.key ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => handleSort(col.key)}
              style={{ whiteSpace: 'nowrap' }}
            >
              {col.name} {sortConfig.key === col.key ? (sortConfig.direction === 'desc' ? '▼' : '▲') : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Tarjetas */}
      {filasAMostrar.map((row, rowIndex) => (
        <div key={rowIndex} className="card mb-2 shadow-sm">
          <div className="card-body">
            {columns.map((col) => (
              <div key={col.key} className="d-flex justify-content-between border-bottom py-1">
                <small><b>{col.name}:</b></small> 
                <small>{row[col.key]}</small>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return <div>{isMobile ? renderMobileView() : renderGrid()}</div>;
}

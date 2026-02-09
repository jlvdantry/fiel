import React, { useState, useEffect, useMemo } from "react";
import 'react-data-grid/lib/styles.css';
import DG from 'react-data-grid';
import { useFamilyFiltro } from './FamilyFiltros';
import { ExtraeComprobantes as EC } from './ExtraeComprobantes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Importación específica

const generarPdfIndividual = (factura) => {
  const doc = new jsPDF();

  // Configuración de estilo
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("COMPROBANTE FISCAL DIGITAL (CFDI)", 105, 20, { align: "center" });

  // Cuadro de Emisor y Receptor
  doc.setFontSize(10);
  doc.rect(14, 30, 90, 35); // Cuadro Emisor
  doc.text("EMISOR", 16, 35);
  doc.setFont("helvetica", "normal");
  doc.text(`RFC: ${factura.Emisor}`, 16, 45);
  doc.text(`Nombre: ${factura['Nombre Emisor'] || 'N/A'}`, 16, 50);

  doc.setFont("helvetica", "bold");
  doc.rect(106, 30, 90, 35); // Cuadro Receptor
  doc.text("RECEPTOR", 108, 35);
  doc.setFont("helvetica", "normal");
  doc.text(`RFC: ${factura.Receptor}`, 108, 45);
  doc.text(`Nombre: ${factura['Nombre Receptor'] || 'N/A'}`, 108, 50);

  // Información del Folio y Fecha
  doc.setFont("helvetica", "bold");
  doc.text("Datos del Comprobante", 14, 75);
  doc.line(14, 77, 196, 77);

  doc.setFont("helvetica", "normal");
  doc.text(`Folio Fiscal (UUID): ${factura.UUID}`, 14, 85);
  doc.text(`Fecha de Emisión: ${factura['Fecha Emision']}`, 14, 92);
  doc.text(`Tipo de Comprobante: ${factura.TipoComprobante || 'Ingreso'}`, 14, 99);

    // TABLA DE CONCEPTOS
    autoTable(doc, {
        startY: 100,
        head: [['Cant', 'Clave', 'Descripción', 'Unitario', 'Importe']],
        body: factura.Conceptos.map(c => [
            c.cantidad, c.clave, c.descripcion, `$ ${c.valorUnitario}`, `$ ${c.importe}`
        ]),
        styles: { fontSize: 8 }
    });

    // RESUMEN DE TOTALES
    const finalY = doc.lastAutoTable.finalY;
    doc.text(`Subtotal: $ ${factura.Subtotal}`, 140, finalY + 10);
    
    // Mapeo de impuestos en el pie
    factura.Impuestos.forEach((imp, index) => {
        doc.text(`${imp.impuesto} (${imp.tasa}): $ ${imp.importe}`, 140, finalY + 15 + (index * 5));
    });

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL: $ ${factura.Total}`, 140, finalY + 30);

  doc.save(`Factura_${factura.UUID.substring(0,8)}.pdf`);
};

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
    { key: 'Iva Cobrado', name: 'IVA Cobrado', minWidth: 100 },
    {
	    key: 'acciones',
	    name: 'PDF',
	    width: 80,
	    renderCell: ({ row }) => (
	      <button 
		className="btn btn-link btn-sm p-0" 
		onClick={() => generarPdfIndividual(row)}
		title="Descargar PDF"
	      >
		<FontAwesomeIcon icon={['fas', 'file-pdf']} className="text-danger" size="lg" />
	      </button>
	    )
    }
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
	  {/* Dentro de renderMobileView, dentro del mapeo de tarjetas */}
	  <div className="card-footer bg-transparent border-top-0 d-flex justify-content-end">
		  <button 
		    className="btn btn-danger btn-sm" 
		    onClick={() => generarPdfIndividual(row)}
		  >
		    <FontAwesomeIcon icon={['fas', 'file-pdf']} className="mr-2" />
		    Bajar PDF
		  </button>
	  </div>
        </div>
      ))}
    </div>
  );

  return <div>{isMobile ? renderMobileView() : renderGrid()}</div>;
}

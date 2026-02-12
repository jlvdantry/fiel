import React, { useState, useEffect } from "react";
import 'react-data-grid/lib/styles.css';
import DG from 'react-data-grid';
import { Input, Card, CardBody, Badge, Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const columns = [
  { key: 'hora', name: 'Hora', Width: 5, flex: 3 },
  { key: 'msg', name: 'Mensaje', minWidth: 30, flex: 3 },
  { key: 'tipo', name: 'Tipo', Width: 5, flex: 3 },
];

export default function DataGridLog(props) {

  const [isMobile, setIsMobile] = useState(false);
  const [filtroTexto, setFiltroTexto] = useState("");
  const [filas, setFilas] = useState([]);

     // Función única de recarga
 const refrescarTabla = () => {
                if (window.dameUltimosLogs) {
                    window.dameUltimosLogs(100).then(data => setFilas(data));
                }
          };


  useEffect(() => {
    // Debounce: Espera 300ms de calma antes de refrescar
    let timeoutId;
    const refrescarConPausa = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(refrescarConPausa, 300);
    };

    // 1. Escuchar al Service Worker
    const handleSWMessage = (event) => {
      if (event.data && event.data.type === 'NUEVO_LOG_DETECTADO') {
        refrescarConPausa();
      }
    };

    // B. Escuchar logs del FRONTEND (console.log interceptado)
    const handleLocalEvent = () => {
        refrescarConPausa();
    };



    if (navigator.serviceWorker) {
      navigator.serviceWorker.addEventListener('message', handleSWMessage);
    }

    refrescarTabla()

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
  
    window.addEventListener('NUEVO_LOG_LOCAL', handleLocalEvent);

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (navigator.serviceWorker) {
        navigator.serviceWorker.removeEventListener('message', handleSWMessage);
      }
      window.removeEventListener('NUEVO_LOG_LOCAL', handleLocalEvent);
    };
  }, [refrescarTabla]);

  const filasFiltradas = filas.filter(f => 
    f.msg.toLowerCase().includes(filtroTexto.toLowerCase())
  );

// 2. Lógica de agrupamiento para Móvil
  const agruparPorFecha = () => {
    return filasFiltradas.reduce((acc, current) => {
      // Extraemos solo la fecha (asumiendo que 'hora' trae "YYYY-MM-DD HH:mm:ss")
      const fecha = current.hora; 
      if (!acc[fecha]) acc[fecha] = [];
      acc[fecha].push(current);
      return acc;
    }, {});
  };

  const registrosAgrupados = agruparPorFecha();

  const   onBajaLog = () => {
            if (window.confirm("¿Estás seguro de que quieres borrar todos los logs?")) {
                try {
                    window.borrarTodoDeTabla('log').then( x => {
			    refrescarTabla()
                    });
                } catch (error) {
                    console.error("No se pudieron borrar los registros", error);
                }
            }
  }



  const renderGrid = () => (
    <div style={{ width: "100%", height: "400px" }}>
      <DG columns={columns} rows={filasFiltradas} />
    </div>
  );


const renderMobileView = () => (
    <div className="mt-2">
      {Object.keys(registrosAgrupados).map((fecha) => (
        <Card key={fecha} className="mb-3 shadow-sm border-primary">
          {/* Cabecera: Fecha y Badge de cantidad a un lado */}
          <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center py-1">
            <span className="fw-bold">{fecha}</span>
          </div>
          
          <CardBody className="p-2">
            {registrosAgrupados[fecha].map((item, idx) => {
              return (
                <div key={idx} className="border-bottom mb-2 pb-1">
                  {/* Línea 2: Mensaje y Tipo en la misma línea */}
                  <Row className="gx-2 align-items-baseline">
                    <Col xs="9">
                      <div className="small text-break">{item.msg}</div>
                    </Col>
                    <Col xs="3" className="text-end">
                      <Badge color={item.tipo === 'Error' ? 'danger' : 'info'} size="sm" style={{fontSize: '10px'}}>
                        {item.tipo}
                      </Badge>
                    </Col>
                  </Row>
                </div>
              );
            })}
          </CardBody>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="container-fluid">

      <div className="row g-3 justify-content-center align-items-center mt-3">
	{/* Botón de borrar con icono grande */}
	<div className="text-danger btn p-2" onClick={onBajaLog} title="Borrar historial">
	  <FontAwesomeIcon icon={['fas', 'trash-alt']} size="2x" />
	</div>

	{/* Botón de refrescar con icono grande */}
	<div className="text-primary btn p-2" onClick={refrescarTabla} title="Refrescar">
	  <FontAwesomeIcon icon={['fas', 'redo-alt']} size="2x" />
	</div>
      </div>

     <div className="text-center mt-2"> Total de registros <b>{filasFiltradas.length}</b> </div>

      {/* Input de Filtro */}
      <div className="mb-2 mt-2">
        <Input 
          type="text" 
          placeholder="🔍 Filtrar por mensaje..." 
          value={filtroTexto}
          onChange={(e) => setFiltroTexto(e.target.value)}
        />
      </div>

      {isMobile ? renderMobileView() : renderGrid()}
    </div>
  );
}

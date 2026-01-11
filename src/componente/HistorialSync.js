import React, { useState, useEffect } from 'react';

const PanelControlSync = () => {
    const [ultimaRevision, setUltimaRevision] = useState(null);
    const [isPWA, setIsPWA] = useState(false);
    const [metodo, setMetodo] = useState(false);

    useEffect(() => {
        // Verificar si está instalada (modo standalone)
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsPWA(true);
        }

        const leerHistorial = async () => {
            // Asumiendo que tienes acceso a dameInterval en el alcance global o via prop
            if (window.dameIntervalHis) {
                try {
                    const ts = await window.dameIntervalHis('UltimaRevisionExito');
                    if (ts.fechatiempo) setUltimaRevision(new Date(ts.fechatiempo).toLocaleString());
                    if (ts.metodo) setMetodo(ts.metodo);
                } catch (e) {
                    console.log("Aún no hay registros de sincronización.");
                }
            }
        };

        leerHistorial();
        // Actualizar cada vez que el usuario vuelve a la app
        window.addEventListener('focus', leerHistorial);
        return () => window.removeEventListener('focus', leerHistorial);
    }, []);

    return (
        <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h4>📡 Estado de Sincronización SAT</h4>
            
            <p><strong>Última revisión:</strong> {ultimaRevision || 'Nunca'}</p>
            <p><strong>Metodo:</strong> { metodo }</p>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                    width: '12px', height: '12px', borderRadius: '50%',
                    backgroundColor: ultimaRevision ? '#28a745' : '#ccc'
                }}></div>
                <span>{ultimaRevision ? 'Sistema Activo' : 'Esperando primera descarga'}</span>
            </div>

            {!isPWA && (
                <p style={{ color: '#d9534f', fontSize: '0.8em', marginTop: '10px' }}>
                    ⚠️ Instala la app para habilitar descargas en segundo plano.
                </p>
            )}
        </div>
    );
};
export default PanelControlSync;

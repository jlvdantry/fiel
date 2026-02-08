
self.addEventListener('notificationclick', (event) => {
    event.notification.close(); // Cerrar el globo de texto

    if (event.action !== 'cerrar') {
        // Enfocar la app si ya está abierta o abrir una nueva pestaña
        event.waitUntil(
            self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
                for (const client of clientList) {
                    if (client.url === '/' && 'focus' in client) return client.focus();
                }
                if (self.clients.openWindow) return self.clients.openWindow('/');
            })
        );
    }
});


// notifica.js
async function notifica() {
    console.log('Iniciando proceso de notificación...');
    // Eliminamos la validación de clientes activos para que siempre notifique
    try {
        await enviarNotificacionSat(
            "Descarga Finalizada",
            "Tus facturas han sido procesadas correctamente."
        );
        console.log('Notificación enviada con éxito');
    } catch (error) {
        console.error('Error al lanzar notificación:', error);
    }
}

function enviarNotificacionSat(titulo, cuerpo) {
    const opciones = {
        body: cuerpo,
        icon: '/icon-192x192.png',
        badge: '/badge-icon.png',
        vibrate: [100, 50, 100],
        data: { url: '/' },
        tag: 'descarga-sat', // Evita que se amontonen múltiples globos
        renotify: true,
        actions: [
            { action: 'abrir', title: 'Ver Facturas' },
            { action: 'cerrar', title: 'Cerrar' }
        ]
    };

    // Es fundamental usar self.registration para el Service Worker
    return self.registration.showNotification(titulo, opciones);
}

self.addEventListener('push', function(event) {
    console.log('[SW] Mensaje Push recibido');
    let payload;
    try {
        // Intentamos obtener el JSON
        payload = event.data ? event.data.json() : {};
        console.log('[SW] Payload recibido:', payload);
    } catch (e) {
        console.warn('[SW] El push no contiene JSON válido, intentando texto...');
        payload = { action: event.data ? event.data.text() : 'no_data' };
    }

    // Laravel WebPush a veces mete la data dentro de un objeto 'data'
    // o directamente en la raíz. Buscamos en ambos lugares:
    const action = payload.action || (payload.data ? payload.data.action : null);

    if (action === 'check-sat-status' || action === 'sync') {
        console.log('[SW] Acción reconocida: Ejecutando tareas pendientes...');

        event.waitUntil(
            procesarTareasPendientes('Push_Laravel')
                .then(() => {
                    console.log('[SW] Proceso finalizado exitosamente.');
                })
                .catch(err => {
                    console.error('[SW] Error en procesarTareasPendientes:', err);
                })
        );
    } else {
        console.warn('[SW] No se reconoció la acción o action es undefined. Action detectada:', action);
    }
});

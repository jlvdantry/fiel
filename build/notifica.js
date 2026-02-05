
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

// Función para lanzar la notificación visual
function enviarNotificacionSat(titulo, cuerpo) {
    const opciones = {
        body: cuerpo,
        icon: '/icon-192x192.png', // Ruta a tu icono de PWA
        badge: '/badge-icon.png',  // Icono pequeño para la barra de Android
        vibrate: [100, 50, 100],
        data: {
            url: '/' // URL a abrir al dar clic
        },
        actions: [
            { action: 'abrir', title: 'Ver Facturas' },
            { action: 'cerrar', title: 'Cerrar' }
        ]
    };

    self.registration.showNotification(titulo, opciones);
}

async function notifica() {
	const clientes = await self.clients.matchAll({ type: 'window' });
	const appAbierta = clientes.length > 0;

	if (!appAbierta) {
	    enviarNotificacionSat("Descarga Finalizada", "Se han procesado tus solicitudes del SAT en segundo plano.");
	}
}


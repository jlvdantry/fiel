// webpush-client.js o dentro de tu componente de Login

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export default async function solicitarYGuardarSuscripcion() {
    try {
        // 1. Esperar a que el SW esté listo
        const registration = await navigator.serviceWorker.ready;
        
        // 2. Pedir permiso al navegador
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            console.log('Permiso de notificaciones denegado');
            return;
        }

        // 3. Obtener suscripción de los servidores de Push (Google/Apple)
        // Usa la VAPID_PUBLIC_KEY de tu .env de Laravel
        const publicKey = window.VAPID_PUBLIC_KEY; 
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicKey)
        });

        let deviceId = localStorage.getItem('pwa_device_id');
	if (!deviceId) {
		deviceId = 'dev_' + Math.random().toString(36).substr(2, 9) + Date.now();
		localStorage.setItem('pwa_device_id', deviceId);
	}

	// 2. Identificar el nombre del dispositivo para tu control
	const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);
	const deviceName = isMobile ? 'Mobile (' + navigator.platform + ')' : 'PC (' + navigator.platform + ')';

        // 4. Crear el objeto para tu tabla 'request' de db.js
	var subs  = subscription.toJSON(); 
        subs.device_name=deviceName;
        subs.device_id=deviceId;
        const dataPush = {
            url: 'push',
            body: subs,
            estado: window.ESTADOREQ.PUSH_SUSCRIBE,
            urlSAT: window.ENDPOINTFIEL.SUBSCRIPCION, 
            passdata: { fecha: new Date().toISOString() }
        };

        // 5. Guardar en IndexedDB (Esto dispara tu ciclo de tareas pendientes)
        // Nota: Asegúrate de que updObjectByKey esté disponible en el alcance
	try {
	    const nextId = await window.getNextRequestId();
	    // 5. Guardar en IndexedDB con el ID numérico
	    await window.updObjectByKey('request', dataPush, nextId);
	    console.log('[Push] Guardado con ID consecutivo:', nextId);
	} catch (err) {
	    console.log('[Push] err:', err);
	    // Fallback por si falla el contador (mantenemos el timestamp para no perder el dato)
	    const fallbackId = 'push_err_' + Date.now();
	    await window.updObjectByKey('request', dataPush, fallbackId);
	}
        
        console.log("Suscripción encolada en IndexedDB");
    } catch (err) {
        console.error("Error al suscribir:", err);
    }
}

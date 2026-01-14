// Variable para evitar ejecuciones duplicadas
let isProcessing = false;

async function procesarTareasPendientes(quemetodo) {
        // --- NUEVO: Guardar registro de éxito ---
        const registroExito = {
            fechatiempo: Date.now(),
            metodo: quemetodo+' Plano isProcessing='+isProcessing
        };
        // Usamos tu función existente para guardar el rastro
        await insertaOActualizaInterval(registroExito, 'UltimaRevisionExito');

    if (isProcessing) {
        console.log('[sw] Ya hay un proceso en curso, omitiendo...');
        return;
    }

    isProcessing = true;
    console.log('Iniciando barrido de tareas metodo='+quemetodo);

    try {
        // 1. Recuperamos la contraseña de la DB (dbFiel.js)
        const pwd = await dame_pwd();
        
        if (!pwd) {
            console.log('[sw] No hay contraseña disponible. Abortando.');
            isProcessing = false;
            return;
        }

        // 2. Inicializamos el motor de descarga si es necesario
        PWDFIEL = pwd;
        if (DMS === null) { 
            DMS = new DescargaMasivaSat(); 
        }

        console.log('Revisa si esta autenticado si no crea request de autenciacion');
        revisaSiEstaAutenticado();

        console.log('Iniciando secuencia: Autenticación');
        await syncRequest(ESTADOREQ.INICIAL.AUTENTICA);

        console.log('Iniciando secuencia: Solicitud');
        await syncRequest(ESTADOREQ.INICIAL.SOLICITUD);

        console.log('Iniciando secuencia: Verificación');
        await syncRequest(ESTADOREQ.INICIAL.VERIFICA);

        console.log('niciando secuencia: Pendientes de descarga');
        await syncRequest(ESTADOREQ.SOLICITUDPENDIENTEDOWNLOAD);

        console.log('Iniciando secuencia: Solicitudes aceptadas');
        await syncRequest(ESTADOREQ.SOLICITUDACEPTADA);

        console.log('Iniciando secuencia: Descarga final');
        await syncRequest(ESTADOREQ.INICIAL.DESCARGA);

        // 4. Limpieza (estas funciones también deberían ser llamadas secuencialmente)
        await bajaVerificaciones();
        await bajaTokenCaducado();
        await bajaRequiriendo();

        console.log('Ciclo de tareas completado ordenadamente.');

    } catch (err) {
        console.error('[sw] Error en procesarTareasPendientes:', err);
    } finally {
        isProcessing = false;
    }
}

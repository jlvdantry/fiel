// Variable para evitar ejecuciones duplicadas
let isProcessing = false;

async function procesarTareasPendientes(quemetodo) {
        // --- NUEVO: Guardar registro de éxito ---
        const registroExito = {
            fechatiempo: Date.now(),
            metodo: quemetodo+' Plano '
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
        await revisaSiEstaAutenticado();

        //console.log('Iniciando secuencia: Autenticación '+quemetodo);
        await syncRequest(ESTADOREQ.INICIAL.AUTENTICA);

        //console.log('Iniciando secuencia: Solicitud '+quemetodo);
        await syncRequest(ESTADOREQ.INICIAL.SOLICITUD);

        //console.log('Iniciando secuencia: Verificación '+quemetodo);
        await syncRequest(ESTADOREQ.INICIAL.VERIFICA);

        //console.log('Iniciando secuencia: Pendientes de descarga '+quemetodo);
        await syncRequest(ESTADOREQ.SOLICITUDPENDIENTEDOWNLOAD);

        //console.log('Iniciando secuencia: Solicitudes aceptadas '+quemetodo);
        await syncRequest(ESTADOREQ.SOLICITUDACEPTADA);

        //console.log('Iniciando secuencia: Descarga final '+quemetodo);
        await syncRequest(ESTADOREQ.INICIAL.DESCARGA);

        await bajaVerificaciones();
        await bajaTokenCaducado();
        await bajaRequiriendo();

        console.log('Termino barrido de tareas plano='+quemetodo);

    } catch (err) {
        console.error('[sw] Error en procesarTareasPendientes:', err);
    } finally {
        isProcessing = false;
    }
}

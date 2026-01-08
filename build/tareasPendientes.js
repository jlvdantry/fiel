// Variable para evitar ejecuciones duplicadas
let isProcessing = false;

async function procesarTareasPendientes() {
    if (isProcessing) {
        console.log('[sw] Ya hay un proceso en curso, omitiendo...');
        return;
    }

    isProcessing = true;
    console.log('[sw] Iniciando barrido de tareas (Periodic/Interval)...');

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

        // 3. Ejecutamos el barrido de todos los estados pendientes
        // Esto reemplaza las llamadas individuales que tenías en los intervalos
        await Promise.allSettled([
            syncRequest(ESTADOREQ.INICIAL.AUTENTICA),
            syncRequest(ESTADOREQ.INICIAL.SOLICITUD),
            syncRequest(ESTADOREQ.INICIAL.VERIFICA),
            syncRequest(ESTADOREQ.SOLICITUDPENDIENTEDOWNLOAD),
            syncRequest(ESTADOREQ.SOLICITUDACEPTADA),
            syncRequest(ESTADOREQ.INICIAL.DESCARGA)
        ]);

        // 4. Limpieza de registros antiguos
        bajaVerificaciones();
        bajaTokenCaducado();
        bajaRequiriendo();

        console.log('[sw] Barrido completado con éxito.');
    } catch (err) {
        console.error('[sw] Error en procesarTareasPendientes:', err);
    } finally {
        isProcessing = false;
    }
}

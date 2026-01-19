/* Revisa si esta autenticado */
var DMS = DMS || null;     // Initialize if not exists
var PWDFIEL = PWDFIEL || null; // Initialize if not exists

var revisaSiEstaAutenticado = () => {
    dame_pwd().then(pwd => {
        if (pwd !== null) {
            if (DMS===null) {
                PWDFIEL = pwd;
                DMS = new DescargaMasivaSat();
            }
            DMS.getTokenEstatusSAT().then(res => {
                const isAuthed = !(res === undefined || 
                                   res.tokenEstatusSAT === TOKEN.NOSOLICITADO || 
                                   res.tokenEstatusSAT === TOKEN.CADUCADO || 
                                   res.tokenEstatusSAT === ESTADOREQ.ERROR);

                if (!isAuthed) {
                    DMS.autenticate_armasoa(pwd);
                }

                // --- SHARED NOTIFICATION LOGIC ---
                // If in Service Worker, broadcast to all tabs
                if (typeof self !== 'undefined' && self.clients && self.clients.matchAll) {
                    self.clients.matchAll().then(clients => {
                        clients.forEach(client => client.postMessage({ type: 'AUTH_STATUS', value: isAuthed }));
                    });
                }
                
                // If in Main Thread (UI), dispatch a custom event
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('authStatusChanged', { detail: isAuthed }));
                }

            }).catch(er => console.log('Error:', er));
        }
    });
}

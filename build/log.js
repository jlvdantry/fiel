//const logContainer = document.getElementById('logContainer');
var logToBD= function (message,type,plano) {
        var objlog={ url:'log',msg:message,'tipo':type,'plano':plano }
        inserta_log(objlog);
}
var logToBDE = function (message,type,plano) {
        var objlog={ url:'log',msg:message,'tipo':type,'plano':plano }
        inserta_log(objlog);
}

var log_en_bd = function (type,plano) {
    const originalLog = console.log;
    const originalLogE = console.error;
    console.log = function(...args) {
        logToBD(args.join(' '),type,plano);
        originalLog.apply(console, args);
	    // 2. AVISAR AL FRONTEND (Si estamos en el navegador)
	    if (typeof window !== 'undefined') {
		const evento = new CustomEvent('NUEVO_LOG_LOCAL', {
		    detail: { type, plano }
		});
		window.dispatchEvent(evento);
	    }

	    // 3. AVISAR AL FRONTEND (Si estamos en el Service Worker)
	    if (typeof self !== 'undefined' && 'clients' in self) {
		self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
		    clients.forEach(client => {
			client.postMessage({ type: 'NUEVO_LOG_DETECTADO' });
		    });
		});
	    }

    };
    console.error = function(...args) {
        logToBDE(args.join(' '),type+'e',type,plano);
        originalLogE.apply(console, args);
	    // 2. AVISAR AL FRONTEND (Si estamos en el navegador)
	    if (typeof window !== 'undefined') {
		const evento = new CustomEvent('NUEVO_LOG_LOCAL', {
		    detail: { type, plano }
		});
		window.dispatchEvent(evento);
	    }

	    // 3. AVISAR AL FRONTEND (Si estamos en el Service Worker)
	    if (typeof self !== 'undefined' && 'clients' in self) {
		self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
		    clients.forEach(client => {
			client.postMessage({ type: 'NUEVO_LOG_DETECTADO' });
		    });
		});
	    }

   };

};


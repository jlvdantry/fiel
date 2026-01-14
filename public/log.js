//const logContainer = document.getElementById('logContainer');
var logToDocument= function (message,type,plano) {
        var objlog={ url:'log',msg:message,'tipo':type,'plano':plano }
        inserta_log(objlog);
}
var logToDocumentE = function (message,type,plano) {
        var objlog={ url:'log',msg:message,'tipo':type,'plano':plano }
        inserta_log(objlog);
}

var log_en_bd = function (type,plano) {
    const originalLog = console.log;
    const originalLogE = console.error;
    console.log = function(...args) {
        logToDocument(args.join(' '),type,plano);
        originalLog.apply(console, args);
    };
    console.error = function(...args) {
        logToDocumentE(args.join(' '),type,type,plano);
        originalLogE.apply(console, args);
    };

};


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
    };
    console.error = function(...args) {
        logToBDE(args.join(' '),type+'e',type,plano);
        originalLogE.apply(console, args);
    };

};


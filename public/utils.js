String.prototype.chunkString = function(len) {
    var _ret="";
    if (this.length < 1) {
        return [];
    }
    if (typeof len === 'number' && len > 0) {
        var _size = Math.ceil(this.length / len), _offset = 0;
        //_ret = new Array(_size);
        for (var _i = 0; _i < _size; _i++) {
            //_ret[_i] = this.substring(_offset, _offset = _offset + len)+"\r\n";
            _ret = _ret + this.substring(_offset, _offset = _offset + len)+"\r\n";
        }
    }
    else if (typeof len === 'object' && len.length) {
        var n = 0, l = this.length, chunk, that = this;
        _ret = [];
        do {
            len.forEach(function(o) {
                chunk = that.substring(n, n + o);
                if (chunk !== '') {
                    _ret.push(chunk);
                    n += chunk.length;
                }
            });
            if (n === 0) {
                return undefined; // prevent an endless loop when len = [0]
            }
        } while (n < l);
    }
    return _ret;
}

var get_fechahora = function () {
      var fecha = new Date();
      var mes=fecha.getMonth()+1;
      mes=mes < 10 ? '0' + mes : '' + mes;
      var dia=fecha.getDate();
      dia=dia < 10 ? '0' + dia : '' + dia;
      var  hora = fecha.getHours(); // 0-23
      hora=hora < 10 ? '0' + hora : '' + hora;
      var  minuto = fecha.getMinutes(); // 0-59
      minuto=minuto < 10 ? '0' + minuto : '' + minuto;
      fecha=fecha.getFullYear()+'-'+mes+'-'+dia+' '+hora+':'+minuto;
      return fecha;
}

function differenceInMinutes(dateStr1, dateStr2) {
    // Parse the date strings into Date objects
    const date1 = new Date(dateStr1);
    const date2 = new Date(dateStr2);

    // Calculate the difference in milliseconds
    const diffInMs = Math.abs(date2 - date1);

    // Convert milliseconds to minutes
    const diffInMinutes = Math.floor(diffInMs / 1000 / 60);

    return diffInMinutes;
}


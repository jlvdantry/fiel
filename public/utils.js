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
};

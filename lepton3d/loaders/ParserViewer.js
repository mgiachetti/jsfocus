/**
 * @author Martin H. Giachetti
 * @date 28/08/13
 */


L3D.ByteArray = function() {
    this.buffer = null;
    this.position = 0;
}

L3D.ByteArray.prototype = {
    readFloat: function() {
        var data = new Float32Array(this.buffer, this.position, 1);
        this.position += 4;
        return data;
    },
    readInt: function() {
        var data = new Int32Array(this.buffer, this.position, 1)[0];
        this.position += 4;
        return data;
    },
    readByte: function() {
        var data = new Int8Array(this.buffer, this.position, 1)[0];
        this.position++;
        return data;
    },
    readString: function(size) {
        var data = new Uint8Array(this.buffer, this.position, size);

        var result = "";
        for(var i = 0; i < size; i++) {
            result = result + String.fromCharCode(data[i]);
        }
        this.position += size;
        return result;
    }
}

L3D.ParserViewer = function() {
    this.mesh = null;
    this.filePath = "lepton3d/assets/escena.dat";
    this.byteData = new L3D.ByteArray();

    this.load();
};

L3D.ParserViewer.prototype = {
    load: function() {
        var oReq = new XMLHttpRequest();
        oReq.open("GET", this.filePath, true);
        oReq.responseType = "arraybuffer";
        var thisObj = this;
        oReq.onload = function(oEvent) {
            thisObj.onload(oEvent)
        };
        oReq.send(null);
    },

    onload: function (oEvent) {
        var arrayBuffer = oEvent.target.response;
        if (arrayBuffer) {
            this.byteData.buffer = arrayBuffer;
            this.parse();
        }
    },

    parse: function() {
        alert("a" + this.byteData.readByte());
    }

};

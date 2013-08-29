/**
 * @author Martin H. Giachetti
 * @date 29/08/13
 */

L3D.GLBuffer = function(type, usage, typeOfArray) {
    this.gl = L3D.gl;
    this.type = (type!==undefined)?type : this.gl.ARRAY_BUFFER;
    this.data = null;
    this.glbuffer = null;
    this.length = 0;
    this.dirty = true;
    this.usage = (usage!==undefined)?usage : this.gl.STATIC_DRAW;
    this.typeOfArray = (typeOfArray!==undefined)?typeOfArray : L3D.F32Array;
};

L3D.GLBuffer.prototype = {
    updateData: function(newData) {
        if(newData.length != this.length) {
            this.data = new this.typeOfArray(newData);
            this.length = newData.length;
            this.invalidateBuffer();
        } else {
            this.data.set(newData);
        }
        this.dirty = true;
    },

    bindBuffer: function() {
        this.updateBuffer();
        this.gl.bindBuffer(this.type, this.glbuffer);
    },

    updateBuffer: function() {
        if(!this.dirty) {
            return;
        }

        if(!this.glbuffer) {
            this.glbuffer = this.gl.createBuffer();
        }

        this.gl.bindBuffer(this.type, this.glbuffer);
        this.gl.bufferData(this.type, this.data, this.usage);
    },

    invalidateBuffer: function() {
        this.dirty = true;
        this.disposeBuffer();
    } ,

    dispose: function() {
        this.disposeBuffer();
        this.data = null;
        this.length = 0;
    },

    disposeBuffer: function() {
        if(this.glbuffer) {
            this.gl.deleteBuffer(this.glbuffer);
            this.glbuffer = null;
        }
    }

};

L3D.F32Buffer = function(){
    L3D.GLBuffer.call(this, L3D.gl.ARRAY_BUFFER, L3D.gl.STATIC_DRAW, L3D.F32Array);
};
//por el momoneto todas las funciones son iguales. Si en algun momento cambia hay que clonar prototype
L3D.F32Buffer.prototype = L3D.GLBuffer.prototype;

L3D.UI16Buffer = function(){
    L3D.GLBuffer.call(this, L3D.gl.ELEMENT_ARRAY_BUFFER, L3D.gl.STATIC_DRAW, L3D.UI16Array);
};
//por el momoneto todas las funciones son iguales. Si en algun momento cambia hay que clonar prototype
L3D.UI16Buffer.prototype = L3D.GLBuffer.prototype;

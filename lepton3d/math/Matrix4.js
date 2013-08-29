/**
 * @author Martin H. Giachetti
 * @date 28/08/13
 */


L3D.Matrix4 = function( m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {

    this.vec = new L3D.F32Array(16);

    this.set(   m11!==undefined?m11:1, m12||0, m13||0, m14||0,
                m21||0, m22!==undefined?m22:1, m23||0, m24||0,
                m31||0, m32||0, m33!==undefined?m33:1, m34||0,
                m41||0, m42||0, m43||0, m44!==undefined?m44:1
    );
};

L3D.Matrix4.prototype = {
    set: function( m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
        var v = this.vec;
        v[0]=m11;  v[1]=m12;  v[2]=m13;  v[3]=m14;
        v[4]=m21;  v[5]=m22;  v[6]=m23;  v[7]=m24;
        v[8]=m31;  v[9]=m32;  v[10]=m33; v[11]=m34;
        v[12]=m41; v[13]=m42; v[14]=m43; v[15]=m44;
        return this;
    },

    identity: function() {
        return this.set( 1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, 1, 0,
                    0, 0, 0, 1);
    },

    perspective: function(fovy, aspect, near, far) {
        var f = 1.0 / Math.tan(fovy / 2),
            nf = 1 / (near - far);
        return this.set(
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (far + near) * nf, -1,
            0, 0, (2 * far * near) * nf, 0
        );

    },

    translate: function(x, y, z) {
        var v = this.vec;
        v[12] = v[0] * x + v[4] * y + v[8] * z + v[12];
        v[13] = v[1] * x + v[5] * y + v[9] * z + v[13];
        v[14] = v[2] * x + v[6] * y + v[10] * z + v[14];
        v[15] = v[3] * x + v[7] * y + v[11] * z + v[15];
    },

    scale: function(x,y,z) {
        var v = this.vec;
        v[0] = v[0] * x;
        v[1] = v[1] * x;
        v[2] = v[2] * x;
        v[3] = v[3] * x;
        v[4] = v[4] * y;
        v[5] = v[5] * y;
        v[6] = v[6] * y;
        v[7] = v[7] * y;
        v[8] = v[8] * z;
        v[9] = v[9] * z;
        v[10] = v[10] * z;
        v[11] = v[11] * z;
        v[12] = v[12];
        v[13] = v[13];
        v[14] = v[14];
        v[15] = v[15];
    },

    copy: function(m) {
        this.vec.set(m.vec);
    }

};


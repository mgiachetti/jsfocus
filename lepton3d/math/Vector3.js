/**
 * @author Martin H. Giachetti
 * @date 28/08/13
 */

L3D.Vector3 = function(x,y,z){
    this.x = x || 0.0;
    this.y = y || 0.0;
    this.z = z || 0.0;
};

L3D.Vector3.prototype = {

    add: function(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    },

    sub: function(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    },

    multiplyScalar: function(s) {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        return this;
    },

    divideScalar: function(s) {
        this.x /= s;
        this.y /= s;
        this.z /= s;
        return this;
    },

    dot: function(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    },

    cross: function(v) {
        var x = this.x, y = this.y, z = this.z;

        this.x = y * v.z - z * v.y;
        this.y = z * v.x - x * v.z;
        this.z = x * v.y - y * v.x;
        return this;
    },

    length: function() {
        return Math.sqrt(this.x*this.x+this.y*this.y+this.z+this.z);
    },

    lengthSqrt: function() {
        return this.x*this.x+this.y*this.y+this.z*this.z;
    },

    normalize: function() {
        return this.divideScalar(this.length());
    },

    transformCoordinate: function(mat) {
        var m = mat.vec;
        var x = this.x, y = this.y, z = this.z;

        this.x = m[0]*x + m[1]*y + m[2]*z + m[3];
        this.y = m[4]*x + m[5]*y + m[6]*z + m[7];
        this.z = m[8]*x + m[9]*y + m[10]*z + m[11];
        return this;
    },

    min: function(v) {
        if(this.x > v.x) {
            this.x = v.x;
        }

        if(this.y > v.y) {
            this.y = v.y;
        }

        if(this.z > v.z) {
            this.z = v.z;
        }

        return this;
    },

    max: function(v) {
        if(this.x < v.x) {
            this.x = v.x;
        }

        if(this.y < v.y) {
            this.y = v.y;
        }

        if(this.z < v.z) {
            this.z = v.z;
        }

        return this;
    },

    copy: function(v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;
    },

    set: function(x,y,z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
};

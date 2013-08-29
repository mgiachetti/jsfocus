/**
 * @author Martin H. Giachetti
 * @date 28/08/13
 */

L3D.Vector4 = function(x, y, z, w) {
    this.x = x || 0.0;
    this.y = y || 0.0;
    this.z = z || 0.0;
    this.w = w || 0.0;
};

L3D.Vector4.prototype = {
    add: function(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        this.w += v.w;
        return this;
    },

    sub: function(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        this.w -= v.w;
        return this;
    },

    multiplyScale: function(s) {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        this.w *= s;
        return this;
    },

    divideScale: function(s) {
        this.x /= s;
        this.y /= s;
        this.z /= s;
        this.w /= s;
        return this;
    },

    dot: function(v) {
        return this.x * v.x + this.y * v.y + this.z* v.z + this.w * v.w;
    },

    normalize: function() {
        return this.divideScale( this.length() );
    },

    lengthSqrt: function() {
        return this.x*this.x + this.y*this.y + this.z*this.z + this.w*this.w;
    },

    length: function() {
        return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z + this.w*this.w);
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

        if(this.w > v.w) {
            this.w = v.w;
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

        if(this.w < v.w) {
            this.w = v.w;
        }
        return this;
    },

    copy: function(v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        this.w = v.w;
        return this;
    }
};
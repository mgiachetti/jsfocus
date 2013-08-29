/**
 * @author Martin H. Giachetti
 * @date 28/08/13
 */

L3D.Vector2 = function(x, y) {
    this.x = x || 0.0;
    this.y = y || 0.0;
};

L3D.Vector2.prototype = {
    add: function(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    },

    sub: function(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    },

    multiplyScalar: function(s) {
        this.x *= s;
        this.y *= s;
        return this;
    },

    divideScalar: function(s) {
        this.x /= s;
        this.y /= s;
        return this;
    },

    dot: function(v) {
        return this.x*v.x + this.y* v.y;
    },

    lengthSqrt: function() {
        return this.x*this.x + this.y*this.y;
    },

    length: function() {
        return Math.sqrt(this.x*this.x+this.y*this.y);
    },

    normalize: function() {
        return this.divideScalar(this.length());
    },

    min: function(v) {
        if(this.x > v.x) {
            this.x = v.x;
        }

        if(this.y > v.y) {
            this.y = v.y;
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

        return this;
    },

    copy: function(v) {
        this.x = v.x;
        this.y = v.y;
        return this;
    }

};
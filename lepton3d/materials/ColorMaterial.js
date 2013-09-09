/**
 * @author Martin H. Giachetti
 * @date 29/08/13
 */

L3D.ColorMaterial = function(color) {
    L3D.BaseMaterial.call(this);
    this.uColorLocation = null;
    this.fcolor = new L3D.F32Array(3);
    this.setColor((color!=undefined)?color:0xFFFFFF*Math.random());

    this.fScript = [
        "#ifdef GL_ES",
        "precision highp float;",
        "#endif",
        "uniform vec3 uColor;",
        "varying vec3 vNormal;",
        "varying vec3 vPosition;",

        "void main(void) {",
            "vec3 lpos = vec3(0.0,2500.0,1.0);",
            "vec3 N = normalize(vNormal);",
            "vec3 L = normalize(lpos-vPosition);",
            "float bright = clamp(dot(N,L),0.4,1.0);",
            "gl_FragColor = vec4(bright*uColor, 1.0);",
        "}"
    ].join("\n");

    this.vScript = [
        "attribute vec3 v_position;",
        "attribute vec3 v_normal;",
        "varying vec3 vNormal;",
        "varying vec3 vPosition;",

        "uniform mat4 uMatView;",
        "uniform mat4 uMatProj;",


        "void main(void) {",
            "gl_Position = uMatProj * uMatView *  vec4(v_position, 1.0);",
            "vPosition = (uMatView * vec4(v_position, 1.0)).xyz;",
            "vNormal = (uMatView * vec4(v_normal, 0.0)).xyz;",

        "}"
    ].join("\n");
};

L3D.ColorMaterial.prototype = Object.create(L3D.BaseMaterial.prototype);

L3D.ColorMaterial.prototype.constructor = L3D.ColorMaterial;

L3D.ColorMaterial.prototype.bindExtended = function() {
    if(!this.uColorLocation) {
        this.uColorLocation = this.getUniformLocation("uColor");
    }
    this.gl.uniform3fv(this.uColorLocation, this.fcolor);
};

L3D.ColorMaterial.prototype.setColor = function(color) {
    this.color = color;
    this.fcolor[0] = ((color&0xFF0000)>>16)/255.0;
    this.fcolor[1] = ((color&0x00FF00)>>8)/255.0;
    this.fcolor[2] = ((color&0x0000FF)>>0)/255.0;
};

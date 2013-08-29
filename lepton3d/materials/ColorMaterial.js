/**
 * @author Martin H. Giachetti
 * @date 29/08/13
 */

L3D.ColorMaterial = function(color) {
    L3D.BaseMaterial.call(this);
    this.uColorLocation = null;
    this.fcolor = new L3D.F32Array(3);
    this.setColor((color!=undefined)?color:0xFFFFFF);

    this.fScript = [
        "#ifdef GL_ES",
        "precision highp float;",
        "#endif",
        "uniform vec3 uColor;",

        "void main(void) {",
            "gl_FragColor = vec4(uColor, 1.0);",
        "}"
    ].join("\n");

    this.vScript = [
        "attribute vec3 v_position;",

        "uniform mat4 uMatView;",
        "uniform mat4 uMatProj;",


        "void main(void) {",
            "gl_Position = uMatProj * uMatView * vec4(v_position, 1.0);",
        "}"
    ].join("\n");
};

L3D.ColorMaterial.prototype = Object.create(L3D.BaseMaterial.prototype);

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

/**
 * @author Martin H. Giachetti
 * @date 29/08/13
 */

L3D.BaseMaterial = function() {
    this.gl = L3D.gl;
    this.fShader = null;
    this.vShader = null;
    this.program = null;

    this.verticesLocation = -1;
    this.uvsLocation = -1;
    this.uvs2Location = -1;
    this.normalsLocation = -1;
    this.tangentsLocation = -1;

    this.uMatWorldLocation = -1;
    this.uMatViewLocation = -1;
    this.uMatProjLocation = -1;


    this.fScript = [
        "#ifdef GL_ES",
        "precision highp float;",
        "#endif",

        "void main(void) {",
            "gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);",
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

L3D.BaseMaterial.prototype = {
    render: function(geometry) {
        var gl = this.gl;

        this.bind();

        if(this.verticesLocation >= 0) {
            geometry.vertices.bindBuffer();
            gl.vertexAttribPointer(this.verticesLocation, 3, gl.FLOAT, false, 0, 0);
        }

        if(this.uvsLocation >= 0) {
            geometry.uvs.bindBuffer();
            gl.vertexAttribPointer(this.uvsLocation, 2, gl.FLOAT, false, 0, 0);
        }

        if(this.uvs2Location >= 0) {
            geometry.uvs2.bindBuffer();
            gl.vertexAttribPointer(this.uvs2Location, 2, gl.FLOAT, false, 0, 0);
        }

        if(this.normalsLocation >= 0) {
            geometry.normals.bindBuffer();
            gl.vertexAttribPointer(this.normalsLocation, 3, gl.FLOAT, false, 0, 0);
        }

        if(this.tangentsLocation >= 0) {
            geometry.tangents.bindBuffer();
            gl.vertexAttribPointer(this.tangentsLocation, 3, gl.FLOAT, false, 0, 0);
        }

        if(this.uMatWorldLocation) {
            gl.uniformMatrix4fv(this.uMatWorldLocation, false, L3D.matWorld.vec)
        }

        if(this.uMatViewLocation) {
            gl.uniformMatrix4fv(this.uMatViewLocation, false, L3D.matView.vec)
        }

        if(this.uMatProjLocation) {
            gl.uniformMatrix4fv(this.uMatProjLocation, false, L3D.matProj.vec)
        }

        this.bindExtended();

        //bind index buffer
        geometry.indices.bindBuffer();

        //draw the triangle list
        gl.drawElements(gl.TRIANGLES, geometry.indices.length, gl.UNSIGNED_SHORT, 0);

    },

    bind: function() {
        this.build();
        this.gl.useProgram(this.program);
    },

    bindExtended: function() {

    },

    build: function() {
        if(this.program) {
            return;
        }

        var gl = this.gl;

        this.vShader = this.buildShader(this.vScript, gl.VERTEX_SHADER);
        this.fShader = this.buildShader(this.fScript, gl.FRAGMENT_SHADER);

        this.program = gl.createProgram();
        gl.attachShader(this.program, this.vShader);
        gl.attachShader(this.program, this.fShader);
        gl.linkProgram(this.program);

        if(!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            alert("No se pudieron inicializar los shaders");
        }

        this.verticesLocation = this.getArrayLocation("v_position");
        this.uvsLocation = this.getArrayLocation("v_uv");
        this.uvs2Location = this.getArrayLocation("v_uv2");
        this.normalsLocation = this.getArrayLocation("v_normal");
        this.tangentsLocation = this.getArrayLocation("v_tangent");

        this.uMatWorldLocation = this.getUniformLocation("uMatWorld");
        this.uMatViewLocation = this.getUniformLocation("uMatView");
        this.uMatProjLocation = this.getUniformLocation("uMatProj");
    },

    getAttribLocation: function(attrib) {
        return this.gl.getAttribLocation(this.program, attrib);
    },

    getUniformLocation: function(uniform) {
        return this.gl.getUniformLocation(this.program, uniform);
    },

    getArrayLocation: function(attrib) {
        var l = this.getAttribLocation(attrib);
        if(l >= 0) {
            this.gl.enableVertexAttribArray(l);
        }
        return l;
    },

    buildShader: function(script, type) {
        if (!script) {
            return null;
        }

        var gl = this.gl;

        var shader;
        if (type == gl.FRAGMENT_SHADER) {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if(type == gl.VERTEX_SHADER) {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }

        gl.shaderSource(shader, script);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    },

    dispose: function() {

        if(this.program != null)
        {
            this.gl.deleteProgram(this.program);
            this.gl.deleteShader(this.fShader);
            this.gl.deleteShader(this.vShader);
        }

        this.program = null;
        this.fShader = null;
        this.vShader = null;
    }
};




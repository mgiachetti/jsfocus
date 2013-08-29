/**
 * @author Martin H. Giachetti
 * @date 28/08/13
 */

if(typeof L3D === 'undefined') {

    L3D = {};

    L3D.init = function() {
        L3D.renderer = new L3D.Renderer();
        L3D.renderer.initGL();
        L3D.gl = L3D.renderer.getContext();
        L3D.matView = new L3D.Matrix4();
        L3D.matProj = new L3D.Matrix4();
        L3D.matWorld = new L3D.Matrix4();
    };

    L3D.F32Array = Float32Array;
    L3D.UI16Array = Uint16Array;

    L3D.toRadianConst = Math.PI/180;
    L3D.toDegreeConst = 180/Math.PI;

    L3D.toRadian = function(a) {
        return a*L3D.toRadianConst;
    };

    L3D.toDegree = function(a) {
        return a*L3D.toDegreeConst;
    }
}

function webGLStart(){
    L3D.init();
    L3D.renderer.start();
}

/**
 * @author Martin H. Giachetti
 * @date 28/08/13
 */

L3D.Renderer = function() {

    var _canvas = document.getElementById("canvas") || document.createElement( 'canvas' );
    var _gl;

    this.initGL = function() {

        try{
            _gl = _canvas.getContext( 'webgl' ) || _canvas.getContext( 'experimental-webgl' );
            _gl.viewportWidth = _canvas.width;
            _gl.viewportHeight = _canvas.height;
        }catch(e){
        }

        if(!_gl){
            alert("No se Pudo Inicializar WebGL.");
        }
    }

    this.getContext = function() {
        return _gl;
    }

    this.start = function() {
        initMeshes();

        _gl.clearColor(0.0, 0.0, 0.0, 1.0);
        _gl.enable(_gl.DEPTH_TEST);

        window.setInterval(drawScene, 1000/30.0);
    }

    function drawScene() {
        _gl.viewport(0, 0, _gl.viewportWidth, _gl.viewportHeight);
        _gl.clear(_gl.COLOR_BUFFER_BIT | _gl.DEPTH_BUFFER_BIT);

        L3D.matProj.perspective(45, _gl.viewportWidth / _gl.viewportHeight, 0.1, 100.0);

        L3D.matView.identity();

        L3D.matView.translate(-1.5, 0.0, -7.0);
        //draw triangle
        triangle.render();

        L3D.matView.translate(3.0*Math.abs(((new Date()).getTime()%4000 - 2000)/2000.0), 0.0, 0.0);
        //draw square
        square.render();
    }

    var material;
    var triangle;
    var square;


    function initMeshes(){
        material = new L3D.ColorMaterial();
        triangle = new L3D.SubMesh(null,material);
        square = new L3D.SubMesh(null,material);

        var vertices = [
            0.0,  1.0,  0.0,
            -1.0, -1.0,  0.0,
            1.0, -1.0,  0.0
        ];
        var indices = [0,1,2];

        triangle.geometry.vertices.updateData(vertices);
        triangle.geometry.indices.updateData(indices);

        vertices = [
            1.0,  1.0,  0.0,
            -1.0,  1.0,  0.0,
            1.0, -1.0,  0.0,
            -1.0, -1.0,  0.0
        ];
        indices = [0,1,2,1,2,3];

        square.geometry.vertices.updateData(vertices);
        square.geometry.indices.updateData(indices);
    }
};

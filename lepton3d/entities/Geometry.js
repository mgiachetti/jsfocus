/**
 * @author Martin H. Giachetti
 * @date 29/08/13
 */

L3D.Geometry = function() {
    this.vertices = new L3D.F32Buffer();
    this.uvs = new L3D.F32Buffer();
    this.uvs2 = new L3D.F32Buffer();
    this.normals = new L3D.F32Buffer();
    this.tangents = new L3D.F32Buffer();
    this.indices = new L3D.UI16Buffer();

    this.numVertices = 0;
    this.numIndices = 0;
};

L3D.Geometry.prototype = {


    dispose: function() {
        this.vertices.dispose();
        this.uvs.dispose();
        this.uvs2.dispose();
        this.normals.dispose();
        this.tangents.dispose();
        this.indices.dispose();
        this.numIndices = 0;
        this.numVertices = 0;
    }
};

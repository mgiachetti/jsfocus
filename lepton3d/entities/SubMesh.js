/**
 * @author Martin H. Giachetti
 * @date 29/08/13
 */


L3D.SubMesh = function(geometry, material) {
    this.geometry = (geometry!=undefined)?geometry : new L3D.Geometry();
    this.material = (material!=undefined)?material : new L3D.ColorMaterial(0x770077);
    this.isInstance = false;
};

L3D.SubMesh.prototype = {

    render: function() {
        this.material.render(this.geometry);
    },

    dispose: function() {
        if(!this.isInstance) {
            this.geometry.dispose();
            this.material = null; //TODO: ver como hacer el dispose del material (ool de materials?)
        }
    }

};
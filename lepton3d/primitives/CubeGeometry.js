/**
 * @author Martin H. Giachetti
 * @date 29/08/13
 */

L3D.CubeGeometry = function(width, height, depth) {
    L3D.Geometry.call(this);
    this.width = width;
    this.height = height;
    this.depth = depth;

    this.build();
};

L3D.CubeGeometry.prototype = Object.create(L3D.Geometry.prototype);

L3D.CubeGeometry.prototype.build = function() {
    var hw = this.width/2.0;
    var hh = this.height/2.0;
    var hd = this.depth/2.0;

    var vertices = [
        //izq
        -hw, -hh, -hd,
        -hw, -hh,  hd,
        -hw,  hh, -hd,
        -hw,  hh,  hd,

        //der
         hw, -hh, -hd,
         hw, -hh,  hd,
         hw,  hh, -hd,
         hw,  hh,  hd,

        //inf
        -hw, -hh, -hd,
        -hw, -hh,  hd,
         hw, -hh, -hd,
         hw, -hh,  hd,

        //sup
        -hw,  hh, -hd,
        -hw,  hh,  hd,
         hw,  hh, -hd,
         hw,  hh,  hd,

        //tra
        -hw, -hh, -hd,
        -hw,  hh, -hd,
         hw, -hh, -hd,
         hw,  hh, -hd,

        //del
        -hw, -hh,  hd,
        -hw,  hh,  hd,
         hw, -hh,  hd,
         hw,  hh,  hd
    ];

    var normals = [
        //izq
        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0,

        //der
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,

        //inf
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,

        //sup
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,

        //tra
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,

        //sup
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0
    ];

    var indices = [
        0,2,1,   1,2,3,//izq
        4,5,6,   5,7,6,//der
        8,9,10,  9,11,10,//inf
        12,14,13,  13,14,15,//sup
        16,18,17,  17,18,19,//tra
        20,21,22,  21,23,22 //del
    ];

    this.vertices.updateData(vertices);
    this.normals.updateData(normals);
    this.indices.updateData(indices);
};

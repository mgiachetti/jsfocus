/**
 * @author Martin H. Giachetti
 * @date 28/08/13
 */

L3D.Ray = function(orig, dir) {
    this.orig = (orig!==undefined)? orig : new L3D.Vector3();
    this.dir  = (dir!==undefined)? dir : new L3D.Vector3();
};

L3D.Ray.prototype = {

}

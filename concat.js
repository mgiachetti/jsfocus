"undefined"===typeof L3D&&(L3D={init:function(){L3D.renderer=new L3D.Renderer;L3D.renderer.initGL();L3D.gl=L3D.renderer.getContext();L3D.matView=new L3D.Matrix4;L3D.matProj=new L3D.Matrix4;L3D.matWorld=new L3D.Matrix4}},L3D.F32Array=Float32Array,L3D.UI16Array=Uint16Array,L3D.toRadianConst=Math.PI/180,L3D.toDegreeConst=180/Math.PI,L3D.toRadian=function(a){return a*L3D.toRadianConst},L3D.toDegree=function(a){return a*L3D.toDegreeConst});function webGLStart(){L3D.init();L3D.renderer.start()}
L3D.Renderer=function(){function a(){requestAnimationFrame(a);c.viewport(0,0,c.viewportWidth,c.viewportHeight);c.clear(c.COLOR_BUFFER_BIT|c.DEPTH_BUFFER_BIT);L3D.matProj.perspective(45,c.viewportWidth/c.viewportHeight,0.1,2E4);L3D.matView.identity();L3D.matView.translate(-1.5,0,-7);g.render();L3D.matView.translate(3*Math.abs(((new Date).getTime()%4E3-2E3)/2E3),3,0);f.render();L3D.matView.identity();L3D.matView.translate(-1500,-1500,-5E3);for(var b=0;b<h.escena.length;b++)h.escena[b].render()}var b=
document.getElementById("canvas")||document.createElement("canvas"),c;this.initGL=function(){try{c=b.getContext("webgl")||b.getContext("experimental-webgl"),c.viewportWidth=b.width,c.viewportHeight=b.height}catch(a){}c||alert("No se Pudo Inicializar WebGL.")};this.getContext=function(){return c};this.start=function(){d=new L3D.ColorMaterial;g=new L3D.SubMesh(null,new L3D.BaseMaterial);e=new L3D.SubMesh(null,d);f=new L3D.SubMesh(new L3D.CubeGeometry(1,1,1),d);h=new L3D.ParserViewer;var b=[0,1,0,-1,
-1,0,1,-1,0],m=[0,1,2];g.geometry.vertices.updateData(b);g.geometry.indices.updateData(m);b=[1,1,0,-1,1,0,1,-1,0,-1,-1,0];m=[0,1,2,1,2,3];e.geometry.vertices.updateData(b);e.geometry.indices.updateData(m);c.clearColor(0,0,0,1);c.enable(c.DEPTH_TEST);requestAnimationFrame(a)};var d,g,e,f,h};
L3D.Geometry=function(){this.vertices=new L3D.F32Buffer;this.uvs=new L3D.F32Buffer;this.uvs2=new L3D.F32Buffer;this.normals=new L3D.F32Buffer;this.tangents=new L3D.F32Buffer;this.indices=new L3D.UI16Buffer;this.numIndices=this.numVertices=0};L3D.Geometry.prototype={dispose:function(){this.vertices.dispose();this.uvs.dispose();this.uvs2.dispose();this.normals.dispose();this.tangents.dispose();this.indices.dispose();this.numVertices=this.numIndices=0}};
L3D.GLBuffer=function(a,b,c){this.gl=L3D.gl;this.type=void 0!==a?a:this.gl.ARRAY_BUFFER;this.glbuffer=this.data=null;this.length=0;this.dirty=!0;this.usage=void 0!==b?b:this.gl.STATIC_DRAW;this.typeOfArray=void 0!==c?c:L3D.F32Array};
L3D.GLBuffer.prototype={updateData:function(a){a.length!=this.length?(this.data=new this.typeOfArray(a),this.length=a.length,this.invalidateBuffer()):this.data.set(a);this.dirty=!0},bindBuffer:function(){this.updateBuffer();this.gl.bindBuffer(this.type,this.glbuffer)},updateBuffer:function(){this.dirty&&(this.glbuffer||(this.glbuffer=this.gl.createBuffer()),this.gl.bindBuffer(this.type,this.glbuffer),this.gl.bufferData(this.type,this.data,this.usage),this.dirty=!1)},invalidateBuffer:function(){this.dirty=
!0;this.disposeBuffer()},dispose:function(){this.disposeBuffer();this.data=null;this.length=0},disposeBuffer:function(){this.glbuffer&&(this.gl.deleteBuffer(this.glbuffer),this.glbuffer=null)}};L3D.F32Buffer=function(){L3D.GLBuffer.call(this,L3D.gl.ARRAY_BUFFER,L3D.gl.STATIC_DRAW,L3D.F32Array)};L3D.F32Buffer.prototype=L3D.GLBuffer.prototype;L3D.UI16Buffer=function(){L3D.GLBuffer.call(this,L3D.gl.ELEMENT_ARRAY_BUFFER,L3D.gl.STATIC_DRAW,L3D.UI16Array)};L3D.UI16Buffer.prototype=L3D.GLBuffer.prototype;
L3D.SubMesh=function(a,b){this.geometry=void 0!=a?a:new L3D.Geometry;this.material=void 0!=b?b:new L3D.ColorMaterial(7798903);this.isInstance=!1};L3D.SubMesh.prototype={render:function(){this.material.render(this.geometry)},dispose:function(){this.isInstance||(this.geometry.dispose(),this.material=null)}};L3D.ByteArray=function(){this.buffer=null;this.position=0};
L3D.ByteArray.prototype={readFloat:function(){var a=(new Float32Array(this.buffer.slice(this.position,this.position+4),0,1))[0];this.position+=4;return a},readInt:function(){var a=new Uint8Array(this.buffer,this.position,4);this.position+=4;return a[0]+(a[1]<<8)+(a[2]<<16)+(a[3]<<24)},readUInt:function(){var a=new Uint8Array(this.buffer,this.position,4);this.position+=4;return a[0]+(a[1]<<8)+(a[2]<<16)+(a[3]<<24)},readByte:function(){var a=(new Int8Array(this.buffer,this.position,1))[0];this.position++;
return a},readBytes:function(a){var b=new Int8Array(this.buffer,this.position,a);this.position+=a;return b},readString:function(a){for(var b=new Uint8Array(this.buffer,this.position,a),c="",d=0;d<a&&0!=b[d];d++)c+=String.fromCharCode(b[d]);this.position+=a;return c}};
L3D.ParserViewer=function(){this.escena=[];this.filePath="lepton3d/assets/escena.dat";this.byteData=new L3D.ByteArray;this._version=0;this._vertices=[];this._normals=[];this._uvs=[];this._cantFaces=this._cantMeshes=this._cantTextures=this._color=0;this._texturesId=[];this._meshesId=[];this._meshes=[];this._faces=[];this._textures=[];this.load()};
L3D.ParserViewer.prototype={load:function(){var a=new XMLHttpRequest;a.open("GET",this.filePath,!0);a.responseType="arraybuffer";var b=this;a.onload=function(a){b.onload(a)};a.send(null)},onload:function(a){if(a=a.target.response)this.byteData.buffer=a,this.parse()},parse:function(){this.parseTextures();this.parseMeshes();this.parseFaces();this.parseSets();this.byteData.buffer=null;this.loadTextures();this.loadMeshes();this.build()},parseTextures:function(){var a=this.byteData;a.readString(10);this._version=
a.readInt();this.escena=[];this._cantTextures=a.readInt();this._texturesId=Array(this._cantTextures);for(var b=0;b<this._cantTextures;b++)a.readString(260).toLowerCase(),a.readInt()},parseMeshes:function(){var a=this.byteData;this._cantMeshes=a.readInt();this._meshesId=Array(this._cantMeshes);for(var b=0;b<this._cantMeshes;b++)a.readString(260)},parseFaces:function(){var a=this.byteData;this._cantFaces=a.readInt();this._faces=Array(this._cantFaces);for(var b=0;b<this._cantFaces;b++){var c={};c.tipo=
a.readByte();a.readBytes(3);for(var d=0;4>d;d++)this.parsePosition(),this.parseNormal(),this._color=a.readUInt(),this.parseUV();c.id=a.readInt();c.borde=a.readByte();a.readBytes(3);c.nroMesh=a.readInt();var g=a.readByte();a.readBytes(3);c.kd=a.readFloat();c.ks=a.readFloat();c.kr=a.readFloat();c.kt=a.readFloat();d=a.readInt();65535==d&&(d=-1);c.nroConjunto=d;if(-1!=c.nroMesh)for(c.cantLayers=a.readByte(),a.readBytes(3),c.matWorld=this.parseMatrix(),c.bmpK=a.readFloat(),c.texturaRotada=a.readByte(),
c.flagEspejar=a.readByte(),a.readBytes(2),c.flagMaterial=a.readInt(),c.layers=Array(c.cantLayers),d=0;d<c.cantLayers;d++){var e={};e.nroLayer=a.readByte();a.readBytes(3);e.material={};var f=e.material;f.diffuseColor=[a.readFloat(),a.readFloat(),a.readFloat(),a.readFloat()];f.ambientColor=[a.readFloat(),a.readFloat(),a.readFloat(),a.readFloat()];f.specularColor=[a.readFloat(),a.readFloat(),a.readFloat(),a.readFloat()];f.emissiveColor=[a.readFloat(),a.readFloat(),a.readFloat(),a.readFloat()];f.specularSharpness=
a.readFloat();a.readFloat();a.readFloat();var h=a.readByte(),k=a.readByte();a.readBytes(2);e.nroTextura=0<h&&255!=k?k:-1;e.material=f;if(e.nroLayer>=c.layers.length)throw Error("Nro de layer mayor a la cantidad de layers.");c.layers[e.nroLayer]=e}c.nroTextura=g;this._faces[b]=c}},parsePosition:function(){var a=this.byteData.readFloat(),b=this.byteData.readFloat(),c=this.byteData.readFloat();this._vertices.push(a);this._vertices.push(c);this._vertices.push(b)},parseNormal:function(){var a=this.byteData.readFloat(),
b=this.byteData.readFloat(),c=this.byteData.readFloat();this._normals.push(a);this._normals.push(c);this._normals.push(b)},parseUV:function(){this._uvs.push(this.byteData.readFloat());this._uvs.push(this.byteData.readFloat())},parseMatrix:function(){for(var a=new L3D.Matrix4,b=new Float32Array(16),c=0;16>c;c++)b[c]=this.byteData.readFloat();a.vec[0]=b[0];a.vec[1]=b[2];a.vec[2]=-b[1];a.vec[3]=b[3];a.vec[4]=b[8];a.vec[5]=b[10];a.vec[6]=-b[9];a.vec[7]=b[7];a.vec[8]=-b[4];a.vec[9]=-b[6];a.vec[10]=b[5];
a.vec[11]=b[11];a.vec[12]=b[12];a.vec[13]=b[14];a.vec[14]=-b[13];a.vec[15]=b[15];return a},parseSets:function(){var a=this.byteData,b=a.readInt();this._focusSets=Array(b);for(var c=0;c<b;c++){var d={};d.tipo=a.readByte();a.readBytes(3);var g=a.readFloat(),e=a.readFloat(),f=a.readFloat();d.vector=new L3D.Vector3(e,f,g);d.max=a.readFloat();var g=a.readFloat(),e=a.readFloat(),f=a.readFloat(),h=a.readFloat(),k=a.readFloat(),m=a.readFloat(),n=a.readFloat();d.offset=new L3D.Vector3(e,f,-g);d.dir=new L3D.Vector3(h,
0,-k);d.normal=new L3D.Vector3(m,0,-n);this._focusSets[c]=d}},loadTextures:function(){this._textures=Array(this._cantTextures)},loadMeshes:function(){0!=this._meshesId.Length&&(this._meshes=Array(this._cantMeshes))},build:function(){Array(1)[0]={};for(var a=[],b=new L3D.Vector3(999999,999999,999999),c=new L3D.Vector3(-999999,-999999,-999999),d=new L3D.Vector3,g=0,e=0;e<this._cantFaces;e++){var f=this._faces[e];if(-1!=f.nroMesh)this.resolveMesh(e);else{a.push(g+0);a.push(g+1);a.push(g+2);1==f.tipo&&
(a.push(g+0),a.push(g+2),a.push(g+3));for(var g=g+4,h=0;4>h;h++){var k=3*(4*e+h);d.set(this._vertices[k],this._vertices[k+1],this._vertices[k+2]);b.min(d);c.max(d)}if(e==this._cantFaces-1||f.id!=this._faces[e+1].id)f=new L3D.SubMesh(null,new L3D.ColorMaterial),h=a[0],k=a[a.length-1]+1,f.geometry.indices.updateData(a),f.geometry.vertices.updateData(this._vertices.slice(3*h,3*k)),f.geometry.normals.updateData(this._normals.slice(3*h,3*k)),f.geometry.uvs.updateData(this._uvs.slice(2*h,2*k)),this.escena.push(f)}}},
resolveMesh:function(a){},cloneTgcMesh:function(a){return null},getTexture:function(a){return null},downloadTexture:function(a){if(File.Exists(a))return!0;try{var b=new WebClient;Directory.CreateDirectory(Path.GetDirectoryName(a));var c=FocusParser.WEB_TEXTURE_FOLDER+a.Substring(FocusParser.TEXTURE_FOLDER.Length).Replace("\\","/").Replace(" ","%20").ToLower();b.DownloadFile(c,a);GuiController.Instance.Logger.log("Descargado: "+c);return!0}catch(d){return!1}}};
L3D.BaseMaterial=function(){this.gl=L3D.gl;this.program=this.vShader=this.fShader=null;this.uMatProjLocation=this.uMatViewLocation=this.uMatWorldLocation=this.tangentsLocation=this.normalsLocation=this.uvs2Location=this.uvsLocation=this.verticesLocation=-1;this.fScript="#ifdef GL_ES\nprecision highp float;\n#endif\nvoid main(void) {\ngl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n}";this.vScript="attribute vec3 v_position;\nuniform mat4 uMatView;\nuniform mat4 uMatProj;\nvoid main(void) {\ngl_Position = uMatProj * uMatView * vec4(v_position, 1.0);\n}"};
L3D.BaseMaterial.prototype={render:function(a){var b=this.gl;this.bind();0<=this.verticesLocation&&(a.vertices.bindBuffer(),b.vertexAttribPointer(this.verticesLocation,3,b.FLOAT,!1,0,0));0<=this.uvsLocation&&(a.uvs.bindBuffer(),b.vertexAttribPointer(this.uvsLocation,2,b.FLOAT,!1,0,0));0<=this.uvs2Location&&(a.uvs2.bindBuffer(),b.vertexAttribPointer(this.uvs2Location,2,b.FLOAT,!1,0,0));0<=this.normalsLocation&&(a.normals.bindBuffer(),b.vertexAttribPointer(this.normalsLocation,3,b.FLOAT,!1,0,0));0<=
this.tangentsLocation&&(a.tangents.bindBuffer(),b.vertexAttribPointer(this.tangentsLocation,3,b.FLOAT,!1,0,0));this.uMatWorldLocation&&b.uniformMatrix4fv(this.uMatWorldLocation,!1,L3D.matWorld.vec);this.uMatViewLocation&&b.uniformMatrix4fv(this.uMatViewLocation,!1,L3D.matView.vec);this.uMatProjLocation&&b.uniformMatrix4fv(this.uMatProjLocation,!1,L3D.matProj.vec);this.bindExtended();a.indices.bindBuffer();b.drawElements(b.TRIANGLES,a.indices.length/3,b.UNSIGNED_SHORT,0)},bind:function(){this.build();
this.gl.useProgram(this.program)},bindExtended:function(){},build:function(){if(!this.program){var a=this.gl;this.vShader=this.buildShader(this.vScript,a.VERTEX_SHADER);this.fShader=this.buildShader(this.fScript,a.FRAGMENT_SHADER);this.program=a.createProgram();a.attachShader(this.program,this.vShader);a.attachShader(this.program,this.fShader);a.linkProgram(this.program);a.getProgramParameter(this.program,a.LINK_STATUS)||alert("No se pudieron inicializar los shaders");this.verticesLocation=this.getArrayLocation("v_position");
this.uvsLocation=this.getArrayLocation("v_uv");this.uvs2Location=this.getArrayLocation("v_uv2");this.normalsLocation=this.getArrayLocation("v_normal");this.tangentsLocation=this.getArrayLocation("v_tangent");this.uMatWorldLocation=this.getUniformLocation("uMatWorld");this.uMatViewLocation=this.getUniformLocation("uMatView");this.uMatProjLocation=this.getUniformLocation("uMatProj")}},getAttribLocation:function(a){return this.gl.getAttribLocation(this.program,a)},getUniformLocation:function(a){return this.gl.getUniformLocation(this.program,
a)},getArrayLocation:function(a){a=this.getAttribLocation(a);0<=a&&this.gl.enableVertexAttribArray(a);return a},buildShader:function(a,b){if(!a)return null;var c=this.gl,d;if(b==c.FRAGMENT_SHADER)d=c.createShader(c.FRAGMENT_SHADER);else if(b==c.VERTEX_SHADER)d=c.createShader(c.VERTEX_SHADER);else return null;c.shaderSource(d,a);c.compileShader(d);return c.getShaderParameter(d,c.COMPILE_STATUS)?d:(alert(c.getShaderInfoLog(d)),null)},dispose:function(){null!=this.program&&(this.gl.deleteProgram(this.program),
this.gl.deleteShader(this.fShader),this.gl.deleteShader(this.vShader));this.vShader=this.fShader=this.program=null}};
L3D.ColorMaterial=function(a){L3D.BaseMaterial.call(this);this.uColorLocation=null;this.fcolor=new L3D.F32Array(3);this.setColor(void 0!=a?a:11202575);this.fScript="#ifdef GL_ES\nprecision highp float;\n#endif\nuniform vec3 uColor;\nvarying vec3 vNormal;\nvarying vec3 vPosition;\nvoid main(void) {\nvec3 lpos = vec3(0.0,2500.0,1.0);\nvec3 N = normalize(vNormal);\nvec3 L = normalize(lpos-vPosition);\nfloat bright = clamp(dot(N,L),0.4,1.0);\ngl_FragColor = vec4(bright*uColor, 1.0);\n}";this.vScript=
"attribute vec3 v_position;\nattribute vec3 v_normal;\nvarying vec3 vNormal;\nvarying vec3 vPosition;\nuniform mat4 uMatView;\nuniform mat4 uMatProj;\nvoid main(void) {\ngl_Position = uMatProj * uMatView *  vec4(v_position, 1.0);\nvPosition = (uMatView * vec4(v_position, 1.0)).xyz;\nvNormal = (uMatView * vec4(v_normal, 0.0)).xyz;\n}"};L3D.ColorMaterial.prototype=Object.create(L3D.BaseMaterial.prototype);
L3D.ColorMaterial.prototype.bindExtended=function(){this.uColorLocation||(this.uColorLocation=this.getUniformLocation("uColor"));this.gl.uniform3fv(this.uColorLocation,this.fcolor)};L3D.ColorMaterial.prototype.setColor=function(a){this.color=a;this.fcolor[0]=((a&16711680)>>16)/255;this.fcolor[1]=((a&65280)>>8)/255;this.fcolor[2]=((a&255)>>0)/255};
L3D.Matrix4=function(a,b,c,d,g,e,f,h,k,m,n,q,r,s,t,p){this.vec=new L3D.F32Array(16);this.set(void 0!==a?a:1,b||0,c||0,d||0,g||0,void 0!==e?e:1,f||0,h||0,k||0,m||0,void 0!==n?n:1,q||0,r||0,s||0,t||0,void 0!==p?p:1)};
L3D.Matrix4.prototype={set:function(a,b,c,d,g,e,f,h,k,m,n,q,r,s,t,p){var l=this.vec;l[0]=a;l[1]=b;l[2]=c;l[3]=d;l[4]=g;l[5]=e;l[6]=f;l[7]=h;l[8]=k;l[9]=m;l[10]=n;l[11]=q;l[12]=r;l[13]=s;l[14]=t;l[15]=p;return this},identity:function(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)},perspective:function(a,b,c,d){a=1/Math.tan(a/2);var g=1/(c-d);return this.set(a/b,0,0,0,0,a,0,0,0,0,(d+c)*g,-1,0,0,2*d*c*g,0)},translate:function(a,b,c){var d=this.vec;d[12]=d[0]*a+d[4]*b+d[8]*c+d[12];d[13]=d[1]*a+d[5]*
b+d[9]*c+d[13];d[14]=d[2]*a+d[6]*b+d[10]*c+d[14];d[15]=d[3]*a+d[7]*b+d[11]*c+d[15]},scale:function(a,b,c){var d=this.vec;d[0]*=a;d[1]*=a;d[2]*=a;d[3]*=a;d[4]*=b;d[5]*=b;d[6]*=b;d[7]*=b;d[8]*=c;d[9]*=c;d[10]*=c;d[11]*=c;d[12]=d[12];d[13]=d[13];d[14]=d[14];d[15]=d[15]},copy:function(a){this.vec.set(a.vec)}};L3D.Ray=function(a,b){this.orig=void 0!==a?a:new L3D.Vector3;this.dir=void 0!==b?b:new L3D.Vector3};L3D.Ray.prototype={};L3D.Vector2=function(a,b){this.x=a||0;this.y=b||0};
L3D.Vector2.prototype={add:function(a){this.x+=a.x;this.y+=a.y;return this},sub:function(a){this.x-=a.x;this.y-=a.y;return this},multiplyScalar:function(a){this.x*=a;this.y*=a;return this},divideScalar:function(a){this.x/=a;this.y/=a;return this},dot:function(a){return this.x*a.x+this.y*a.y},lengthSqrt:function(){return this.x*this.x+this.y*this.y},length:function(){return Math.sqrt(this.x*this.x+this.y*this.y)},normalize:function(){return this.divideScalar(this.length())},min:function(a){this.x>
a.x&&(this.x=a.x);this.y>a.y&&(this.y=a.y);return this},max:function(a){this.x<a.x&&(this.x=a.x);this.y<a.y&&(this.y=a.y);return this},copy:function(a){this.x=a.x;this.y=a.y;return this}};L3D.Vector3=function(a,b,c){this.x=a||0;this.y=b||0;this.z=c||0};
L3D.Vector3.prototype={add:function(a){this.x+=a.x;this.y+=a.y;this.z+=a.z;return this},sub:function(a){this.x-=a.x;this.y-=a.y;this.z-=a.z;return this},multiplyScalar:function(a){this.x*=a;this.y*=a;this.z*=a;return this},divideScalar:function(a){this.x/=a;this.y/=a;this.z/=a;return this},dot:function(a){return this.x*a.x+this.y*a.y+this.z*a.z},cross:function(a){var b=this.x,c=this.y,d=this.z;this.x=c*a.z-d*a.y;this.y=d*a.x-b*a.z;this.z=b*a.y-c*a.x;return this},length:function(){return Math.sqrt(this.x*
this.x+this.y*this.y+this.z+this.z)},lengthSqrt:function(){return this.x*this.x+this.y*this.y+this.z*this.z},normalize:function(){return this.divideScalar(this.length())},transformCoordinate:function(a){a=a.vec;var b=this.x,c=this.y,d=this.z;this.x=a[0]*b+a[1]*c+a[2]*d+a[3];this.y=a[4]*b+a[5]*c+a[6]*d+a[7];this.z=a[8]*b+a[9]*c+a[10]*d+a[11];return this},min:function(a){this.x>a.x&&(this.x=a.x);this.y>a.y&&(this.y=a.y);this.z>a.z&&(this.z=a.z);return this},max:function(a){this.x<a.x&&(this.x=a.x);
this.y<a.y&&(this.y=a.y);this.z<a.z&&(this.z=a.z);return this},copy:function(a){this.x=a.x;this.y=a.y;this.z=a.z;return this},set:function(a,b,c){this.x=a;this.y=b;this.z=c}};L3D.Vector4=function(a,b,c,d){this.x=a||0;this.y=b||0;this.z=c||0;this.w=d||0};
L3D.Vector4.prototype={add:function(a){this.x+=a.x;this.y+=a.y;this.z+=a.z;this.w+=a.w;return this},sub:function(a){this.x-=a.x;this.y-=a.y;this.z-=a.z;this.w-=a.w;return this},multiplyScale:function(a){this.x*=a;this.y*=a;this.z*=a;this.w*=a;return this},divideScale:function(a){this.x/=a;this.y/=a;this.z/=a;this.w/=a;return this},dot:function(a){return this.x*a.x+this.y*a.y+this.z*a.z+this.w*a.w},normalize:function(){return this.divideScale(this.length())},lengthSqrt:function(){return this.x*this.x+
this.y*this.y+this.z*this.z+this.w*this.w},length:function(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)},min:function(a){this.x>a.x&&(this.x=a.x);this.y>a.y&&(this.y=a.y);this.z>a.z&&(this.z=a.z);this.w>a.w&&(this.w=a.w);return this},max:function(a){this.x<a.x&&(this.x=a.x);this.y<a.y&&(this.y=a.y);this.z<a.z&&(this.z=a.z);this.w<a.w&&(this.w=a.w);return this},copy:function(a){this.x=a.x;this.y=a.y;this.z=a.z;this.w=a.w;return this}};
L3D.CubeGeometry=function(a,b,c){L3D.Geometry.call(this);this.width=a;this.height=b;this.depth=c;this.build()};L3D.CubeGeometry.prototype=Object.create(L3D.Geometry.prototype);
L3D.CubeGeometry.prototype.build=function(){var a=this.width/2,b=this.height/2,c=this.depth/2;this.vertices.updateData([-a,-b,-c,-a,-b,c,-a,b,-c,-a,b,c,a,-b,-c,a,-b,c,a,b,-c,a,b,c,-a,-b,-c,-a,-b,c,a,-b,-c,a,-b,c,-a,b,-c,-a,b,c,a,b,-c,a,b,c,-a,-b,-c,-a,b,-c,a,-b,-c,a,b,-c,-a,-b,c,-a,b,c,a,-b,c,a,b,c]);this.normals.updateData([-1,0,0,-1,0,0,-1,0,0,-1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,1,0,0,1,0,0,1,0,0,1]);this.indices.updateData([0,
2,1,1,2,3,4,5,6,5,7,6,8,9,10,9,11,10,12,14,13,13,14,15,16,18,17,17,18,19,20,21,22,21,23,22])};
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

        requestAnimationFrame(drawScene);
    }

    function drawScene() {
        //requestAnimationFrame(drawScene);

        _gl.viewport(0, 0, _gl.viewportWidth, _gl.viewportHeight);
        _gl.clear(_gl.COLOR_BUFFER_BIT | _gl.DEPTH_BUFFER_BIT);

        L3D.matProj.perspective(45, _gl.viewportWidth / _gl.viewportHeight, 0.1, 20000.0);

        L3D.matView.identity();

        L3D.matView.translate(-1.5, 0.0, -7.0);
        //draw triangle
        triangle.render();

        L3D.matView.translate(3.0*Math.abs(((new Date()).getTime()%4000 - 2000)/2000.0), 3.0, 0.0);
        //draw square
        cube.render();

        L3D.matView.identity();
        L3D.matView.translate(-1500,-1500,-5000);
        for(var i = 0; i < parser.escena.length; i++) {
            parser.escena[i].render();
        }
        requestAnimationFrame(drawScene);
    }

    var material;
    var triangle;
    var square;
    var cube;
    var parser;


    function initMeshes(){
        material = new L3D.ColorMaterial();
        triangle = new L3D.SubMesh(null,new L3D.BaseMaterial());
        square = new L3D.SubMesh(null,material);
        cube = new L3D.SubMesh(new L3D.CubeGeometry(1.0,1.0,1.0),material);
        parser = new L3D.ParserViewer();

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
/**
 * @author Martin H. Giachetti
 * @date 29/08/13
 */

L3D.GLBuffer = function(type, usage, typeOfArray) {
    this.gl = L3D.gl;
    this.type = (type!==undefined)?type : this.gl.ARRAY_BUFFER;
    this.data = null;
    this.glbuffer = null;
    this.length = 0;
    this.dirty = true;
    this.usage = (usage!==undefined)?usage : this.gl.STATIC_DRAW;
    this.typeOfArray = (typeOfArray!==undefined)?typeOfArray : L3D.F32Array;
};

L3D.GLBuffer.prototype = {
    updateData: function(newData) {
        if(newData.length != this.length) {
            this.data = new this.typeOfArray(newData);
            this.length = newData.length;
            this.invalidateBuffer();
        } else {
            this.data.set(newData);
        }
        this.dirty = true;
    },

    bindBuffer: function() {
        this.updateBuffer();
        this.gl.bindBuffer(this.type, this.glbuffer);
    },

    updateBuffer: function() {
        if(!this.dirty) {
            return;
        }

        if(!this.glbuffer) {
            this.glbuffer = this.gl.createBuffer();
        }

        this.gl.bindBuffer(this.type, this.glbuffer);
        this.gl.bufferData(this.type, this.data, this.usage);

        this.dirty = false;
    },

    invalidateBuffer: function() {
        this.dirty = true;
        this.disposeBuffer();
    } ,

    dispose: function() {
        this.disposeBuffer();
        this.data = null;
        this.length = 0;
    },

    disposeBuffer: function() {
        if(this.glbuffer) {
            this.gl.deleteBuffer(this.glbuffer);
            this.glbuffer = null;
        }
    }

};

L3D.F32Buffer = function(){
    L3D.GLBuffer.call(this, L3D.gl.ARRAY_BUFFER, L3D.gl.STATIC_DRAW, L3D.F32Array);
};
//por el momoneto todas las funciones son iguales. Si en algun momento cambia hay que clonar prototype
L3D.F32Buffer.prototype = L3D.GLBuffer.prototype;

L3D.UI16Buffer = function(){
    L3D.GLBuffer.call(this, L3D.gl.ELEMENT_ARRAY_BUFFER, L3D.gl.STATIC_DRAW, L3D.UI16Array);
};
//por el momoneto todas las funciones son iguales. Si en algun momento cambia hay que clonar prototype
L3D.UI16Buffer.prototype = L3D.GLBuffer.prototype;
/**
 * @author Martin H. Giachetti
 * @date 28/08/13
 */
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

};/**
 * @author Martin H. Giachetti
 * @date 28/08/13
 */


L3D.ByteArray = function() {
    this.buffer = null;
    this.position = 0;
}

L3D.ByteArray.prototype = {
    readFloat: function() {
        var data = new Float32Array(this.buffer.slice(this.position,this.position+4), 0, 1)[0];
        this.position += 4;
        return data;
    },
    readInt: function() {
        var data = new Uint8Array(this.buffer, this.position, 4);
        this.position += 4;
        return data[0] + (data[1]<<8) + (data[2]<<16) + (data[3]<<24);
    },
    readUInt: function() {
        var data = new Uint8Array(this.buffer, this.position, 4);
        this.position += 4;
        return data[0] + (data[1]<<8) + (data[2]<<16) + (data[3]<<24);
    },
    readByte: function() {
        var data = new Int8Array(this.buffer, this.position, 1)[0];
        this.position++;
        return data;
    },
    readBytes: function(cant) {
        var data = new Int8Array(this.buffer, this.position, cant);
        this.position+=cant;
        return data;
    },
    readString: function(size) {
        var data = new Uint8Array(this.buffer, this.position, size);

        var result = "";
        for(var i = 0; i < size && data[i] != 0; i++) {
            result = result + String.fromCharCode(data[i]);
        }
        this.position += size;
        return result;
    }
}

L3D.ParserViewer = function() {
    this.escena = [];
    this.filePath = "lepton3d/assets/escena.dat";
    this.byteData = new L3D.ByteArray();

    //variables del archivo del parser
    this._version=0;
    this._vertices=[];
    this._normals=[];
    this._uvs=[];
    this._color=0;
    this._cantTextures=0;
    this._cantMeshes=0;
    this._cantFaces=0;
    this._texturesId=[];
    this._meshesId=[];
    this._meshes=[];
    this._faces=[];
    this._textures=[];

    //public List<TgcMesh> Escene = new List<TgcMesh>();
    //public List<TgcMesh> Manijas = new List<TgcMesh>();
    //public FocusSet[] _focusSets;

    this.load();
};

L3D.ParserViewer.prototype = {
    load: function() {
        var oReq = new XMLHttpRequest();
        oReq.open("GET", this.filePath, true);
        oReq.responseType = "arraybuffer";
        var thisObj = this;
        oReq.onload = function(oEvent) {
            thisObj.onload(oEvent)
        };
        oReq.send(null);
    },

    onload: function (oEvent) {
        var arrayBuffer = oEvent.target.response;
        if (arrayBuffer) {
            this.byteData.buffer = arrayBuffer;
            this.parse();
        }
    },

    parse: function() {
        //alert("a" + this.byteData.readByte());ParseTextures();
        this.parseTextures();
        this.parseMeshes();
        this.parseFaces();
        this.parseSets();

        this.byteData.buffer = null; // ya no se necesitan mas los datos

        //this.downloadAssets();
        this.loadTextures();
        this.loadMeshes();
        this.build();
    },



    parseTextures: function() {

        var byteData = this.byteData;
        //primero parseo el Header
        var head = byteData.readString(10); // aca tiene que decir LEPTONVIEW
        this._version = byteData.readInt(); // version;

        this.escena = [];

        //Texturas
        //cantidad de texturas
        this._cantTextures = byteData.readInt();
        this._texturesId = new Array(this._cantTextures);


        for(var i = 0 ; i < this._cantTextures; i++) {
            //Texture Path
            //saco el fullpath
            var file = byteData.readString(260).toLowerCase();
            var bmp_k = byteData.readInt();

            //TODO:ver funciones de Path
            continue;

            file = file.substring(file.lastIndexOf("texturas") + 9);

            this._texturesId[i]="";
            var ext = Path.GetExtension(file).ToLower();

            if (ext == ".bmp") {
                file = Path.ChangeExtension(file, ".jpg");
            }

            if(ext != ".msh" && ext != ".dxf" && ext != ".x") {
                _texturesId[i]= TEXTURE_FOLDER + file;
            }

        }
        //Fin Texturas
    },

    parseMeshes: function() {
        //Meshes
        //cantidad de meshes
        var byteData = this.byteData;
        this._cantMeshes = byteData.readInt();
        this._meshesId = new Array(this._cantMeshes);


        for (var i = 0; i < this._cantMeshes; i++) {
            //Meshes Path

            var file = byteData.readString(260);

            //TODO; ver funciones de Path
            continue;

            file = Path.changeExtension(file, ".y");
            //saco el fullpath
            file = file.substring(file.lastIndexOf("texturas") + 9);
            file = MESH_FOLDER + file;
            this._meshesId[i] = file;
        }
        //Fin Meshes
    },

    parseFaces: function() {
        //Faces
        // Cantidad de Faces
        var byteData = this.byteData;
        this._cantFaces = byteData.readInt();
        this._faces = new Array(this._cantFaces);
        //this._vertices = new Array(this._cantFaces * 4);

        for (var i = 0; i < this._cantFaces; i++) {

            var face = {};
            //tipo Face, Triangulo(3) o Rectangulo(1)
            face.tipo = byteData.readByte();

            //3 byte de relleno (alineacion)
            byteData.readBytes(3);

            for (var j = 0; j < 4; j++) {
                //Vertices
                //Posicion
                this.parsePosition();
                //Normal
                this.parseNormal();
                //color
                this._color = byteData.readUInt();
                //UV
                this.parseUV()
            }

            //id
            face.id = byteData.readInt();

            // Borde
            face.borde = byteData.readByte();

            //3 byte de relleno (alineacion)
            byteData.readBytes(3);

            //nro_mesh, -1 si no es mesh
            face.nroMesh = byteData.readInt();

            //nro de textura
            var nroTextura = byteData.readByte();

            //3 byte de relleno (alineacion)
            byteData.readBytes(3);

            // parametros de iluminacion
            face.kd = byteData.readFloat();
            face.ks = byteData.readFloat();
            face.kr = byteData.readFloat();
            face.kt = byteData.readFloat();

            var nroConjunto = byteData.readInt();
            if(nroConjunto == 65535) {
                nroConjunto = -1;
            }

            face.nroConjunto = nroConjunto;

            if(face.nroMesh != -1) {
                //es un mesh
                //Cant Layers
                face.cantLayers = byteData.readByte();

                //3 byte de relleno (alineacion)
                byteData.readBytes(3);

                //WordMatrix
                face.matWorld = this.parseMatrix();

                face.bmpK = byteData.readFloat();
                face.texturaRotada = byteData.readByte();
                face.flagEspejar = byteData.readByte();

                //2 byte de relleno (alineacion)
                byteData.readBytes(2);

                face.flagMaterial = byteData.readInt();

                //layers
                face.layers = new Array(face.cantLayers);
                for(var j = 0; j < face.cantLayers; j++) {
                    var layer = {};

                    //nro layer
                    layer.nroLayer = byteData.readByte();

                    //3 byte de relleno (alineacion)
                    byteData.readBytes(3);

                    //material
                    layer.material = {};
                    var mat = layer.material;
                    mat.diffuseColor = [byteData.readFloat(), byteData.readFloat(), byteData.readFloat(), byteData.readFloat()];
                    mat.ambientColor = [byteData.readFloat(), byteData.readFloat(), byteData.readFloat(), byteData.readFloat()];
                    mat.specularColor = [byteData.readFloat(), byteData.readFloat(), byteData.readFloat(), byteData.readFloat()];
                    mat.emissiveColor = [byteData.readFloat(), byteData.readFloat(), byteData.readFloat(), byteData.readFloat()];
                    mat.specularSharpness = byteData.readFloat();

                    //Coefcientes luz
                    var transparencyLevel = byteData.readFloat();
                    var SpecularLevel = byteData.readFloat();

                    //textura Propia
                    var textura_propia = byteData.readByte();

                    //Nro Textura
                    var lNroTextura = byteData.readByte();

                    //2 byte de relleno (alineacion)
                    byteData.readBytes(2);

                    //if(textura_propia == 0) //TODO revisar
                    //	mat = null;

                    layer.nroTextura = textura_propia > 0 && lNroTextura != 255 ? lNroTextura : -1;
                    layer.material = mat;

                    if (layer.nroLayer >= face.layers.length) {
                        throw new Error("Nro de layer mayor a la cantidad de layers.");
                    }
                    //face.layers[layer.nroLayer] = layer;
                    face.layers[layer.nroLayer] = layer;
                }

                //Fin mesh
            }

            //Fin Face
            face.nroTextura = nroTextura;
            this._faces[i] = face;
        }
    },

    parsePosition: function() {
        var x = this.byteData.readFloat();
        var z = this.byteData.readFloat();
        var y = this.byteData.readFloat();

        this._vertices.push(x);
        this._vertices.push(y);
        this._vertices.push(z);
    },

    parseNormal: function() {
        var x = this.byteData.readFloat();
        var z = this.byteData.readFloat();
        var y = this.byteData.readFloat();

        this._normals.push(x);
        this._normals.push(y);
        this._normals.push(z);
    },

    parseUV: function() {
        this._uvs.push(this.byteData.readFloat());
        this._uvs.push(this.byteData.readFloat());
    },

    parseMatrix: function() {

        var mat = new L3D.Matrix4();
        var rows = new Float32Array(16);

        for(var i = 0 ; i < 16 ; i++) {
            rows[i] = this.byteData.readFloat();
        }

        mat.vec[0] = rows[0];
        mat.vec[1] = rows[2];
        mat.vec[2] = -rows[1];
        mat.vec[3] = rows[3];

        mat.vec[4] = rows[8];
        mat.vec[5] = rows[10];
        mat.vec[6] = -rows[9];
        mat.vec[7] = rows[7];

        mat.vec[8] = -rows[4];
        mat.vec[9] = -rows[6];
        mat.vec[10] = rows[5];
        mat.vec[11] = rows[11];

        mat.vec[12] = rows[12];
        mat.vec[13] = rows[14];
        mat.vec[14] = -rows[13];
        mat.vec[15] = rows[15];
        return mat;
    },

    parseSets: function() {

        var byteData = this.byteData;
        //leo la cantidad de conjuntos
        var cantSets = byteData.readInt();
        this._focusSets = new Array(cantSets);
        for(var i = 0; i < cantSets; i++)
        {
            var fs = {};
            fs.tipo = byteData.readByte();

            //3 byte de relleno (alineacion)
            byteData.readBytes(3);

            var vx = byteData.readFloat();
            var vy = byteData.readFloat();
            var vz = byteData.readFloat();

            fs.vector = new L3D.Vector3(vy,vz,vx);
            fs.max = byteData.readFloat();

            var x = byteData.readFloat();
            var y = byteData.readFloat();
            var z = byteData.readFloat();

            var dir_vx = byteData.readFloat();
            var dir_vy = byteData.readFloat();

            var dir_wx = byteData.readFloat();
            var dir_wy = byteData.readFloat();

            fs.offset = new L3D.Vector3(y, z, -x);
            fs.dir = new L3D.Vector3(dir_vx, 0, -dir_vy);
            fs.normal = new L3D.Vector3(dir_wx, 0, -dir_wy);

            //fs.play();

            this._focusSets[i] = fs;
        }
    },

    loadTextures: function() {
        this._textures = new Array(this._cantTextures);

        return;//TODO: Carga de texturas mediante el pool de texturas
        for (var i = 0; i < this._texturesId.length; i++) {
            this._textures[i] = FocusParser.getTexture(_texturesId[i]);
        }
    },

    loadMeshes: function() {

        if(this._meshesId.Length == 0){
            return;
        }

        this._meshes = new Array(this._cantMeshes);
        return; //TODO: ver cargar meshes desde el pool de meshes
        for(var i = 0; i < this._meshesId.length; i++)
        {
             var yparser = new YParser();
             yparser.FromFile(_meshesId[i]);
             _meshes[i] = yparser.Mesh;
        }
    },

    build: function() {

        var materials = new Array(1);
        materials[0] = {};

        var index = [];
        var pMin = new L3D.Vector3( 999999,  999999,  999999);
        var pMax = new L3D.Vector3(-999999, -999999, -999999);
        var v = new L3D.Vector3();
        var offset = 0;
        for (var i = 0; i < this._cantFaces; i++) {

            var f = this._faces[i];
            if (f.nroMesh != -1) {
                //el face tiene un mesh propio
                this.resolveMesh(i);
                continue;
            }

            //var offset = (index.length > 0)? index[index.length-1]+1 : 0;//vertex.length;
            index.push(offset + 0);
            index.push(offset + 1);
            index.push(offset + 2);
            if (f.tipo == 1) {
                //rectangulo
                index.push(offset + 0);
                index.push(offset + 2);
                index.push(offset + 3);
            }

            offset+=4;

            //el siguiente for actualmente solo se usa para el boundingbox, deberia eliminarlo
            //y agregar alguna funcion dentro de mesh
            for (var j = 0; j < 4; j++) {
                var off = (i * 4 + j)*3
                v.set(this._vertices[off],this._vertices[off+1],this._vertices[off+2]);
                pMin.min(v);
                pMax.max(v);
            }


            if (i == this._cantFaces - 1 || f.id != this._faces[i + 1].id) {
                var m = new L3D.SubMesh(null,new L3D.ColorMaterial());
                var v0 = index[0];
                var v1 = index[index.length-1]+1;
                m.geometry.indices.updateData(index);
                m.geometry.vertices.updateData(this._vertices.slice(v0*3, v1*3));
                m.geometry.normals.updateData(this._normals.slice(v0*3, v1*3));
                m.geometry.uvs.updateData(this._uvs.slice(v0*2, v1*2));

                this.escena.push(m);
                continue; //TODO: ver como sigue
                m.material = materials;
                if (f.nroTextura >= 0) {
                    mesh.diffuseMaps = [this._textures[f.nroTextura]];
                } else {
                    mesh.DiffuseMaps = [ new TgcTexture("", "", null, false) ];
                }
                mesh.enabled = true;
                mesh.boundingBox = new TgcBoundingBox(pMin, pMax);

                mesh.kd = f.kd;
                mesh.ks = f.ks;
                mesh.kr = f.kr;
                mesh.kt = f.kt;

                if (f.nroConjunto == -1) {
                    this.escene.Add(mesh);
                } else {
                    this._focusSets[f.nroConjunto].container.childs.add(mesh);
                }

                index = [];
                vertex = [];
                pMin.set( 999999,  999999,  999999);
                pMax.set(-999999, -999999, -999999);
                offset=0;
            }
        }


        //TODO:
        //for (FocusSet f in _focusSets) {
        //    f.container.createBoundingBox();
        //}

    },


    resolveMesh: function(nroFace) {
        return; //TODO;
        var face = this._faces[nroFace];

        if (this._meshes[face.nroMesh] == null)
            //hay un mesh no cargado
            return;

        var mesh = cloneTgcMesh(this._meshes[face.nroMesh]);

        if(face.flagEspejar > 0){
            var x = (face.FlagEspejar&Face.OBJ_ESPEJAR_X) > 0 ? -1 : 1;
            var y = (face.FlagEspejar&Face.OBJ_ESPEJAR_Y) > 0 ? -1 : 1;
            var z = (face.FlagEspejar&Face.OBJ_ESPEJAR_Z) > 0 ? -1 : 1;
            var center = mesh.BoundingBox.calculateBoxCenter();
            var pMatrix = Matrix.Translation(-center)*
                Matrix.Scaling(x, y, z)*
                Matrix.Translation(center);
            face.MatWorld = pMatrix * face.MatWorld;
        }

        mesh.autoTransformEnable = false;
        mesh.transform = face.matWorld;


        var pmin = new L3D.Vector3();
        var pmax = new L3D.Vector3();
        pmin.copy(mesh.boundingBox.pMin);
        pmax.copy(mesh.boundingBox.pMax);
        pmin.transform(mesh.transform);
        pmax.transform(mesh.transform);


        mesh.BoundingBox.setExtremes(Vector3.Minimize(pmin, pmax), Vector3.Maximize(pmax,pmin));

        mesh.kd = face.kd;
        mesh.ks = face.ks;
        mesh.kr = face.kr;
        mesh.kt = face.kt;

        var matLength = mesh.materials.length;
        for (var j = 0; j < matLength; j++) {

            if (j > face.layers.length && face.layers[j] != null) {
                continue;
            }

            var nroTextura = face.layers[j].nroTextura;
            var mat = face.layers[j].material;//TODO: Ver mesh que no tienen texturas, pero si color
            if (nroTextura == -1 || nroTextura >= this._textures.Length)
                continue;

            //tiene una textura propia el layer
            mesh.diffuseMaps[j] = this._textures[nroTextura];
        }

        if (face.nroConjunto == -1)
            _escene.add(mesh);
        else
        {
            _focusSets[face.NroConjunto].container.Childs.Add(mesh);
            //if(_meshesId[face.NroMesh].ToLower().Contains("manij"))
            //    Manijas.Add(mesh);
        }

    },

    cloneTgcMesh: function(tgcMesh) {
        return null; //TODO:
        var m = new TgcMesh(tgcMesh.D3dMesh, tgcMesh.Name, tgcMesh.RenderType);
        m.enabled = true;
        m.diffuseMaps = tgcMesh.diffuseMaps.clone();
        m.materials = tgcMesh.materials.clone();
        m.boundingBox = tgcMesh.BoundingBox.clone();
        m.alphaBlendEnable = tgcMesh.AlphaBlendEnable;

        return m;
    },


    getTexture: function(path) {
        return null; //TODO::
        if (Path.GetFileNameWithoutExtension(path).Length == 0)
            return NULL_TEXTURE;

        var pngpath = Path.ChangeExtension(path, ".png");
        var jpgpath = Path.ChangeExtension(path, ".jpg");

        if (File.Exists(jpgpath))
            path = jpgpath;
        else
            path = pngpath;


        if (!downloadTexture(path))
        {
            path = Path.ChangeExtension(path, ".jpg");
            downloadTexture(path);
        }

        try
        {
            return TgcTexture.createTexture(GuiController.Instance.D3dDevice,
                Path.GetFileName(path), path);
        }
        catch (Exception)
        {
            GuiController.Instance.Logger.log("Archivo: " + path + " no se encuentra.");
            return NULL_TEXTURE;
        }
    },

    downloadTexture: function(path) {
        if (File.Exists(path)) {
            return true;
        }

        try
        {
            var wc = new WebClient();
            Directory.CreateDirectory(Path.GetDirectoryName(path));
            var webpath = FocusParser.WEB_TEXTURE_FOLDER + path.Substring(FocusParser.TEXTURE_FOLDER.Length).Replace('\\', '/').Replace(" ", "%20").ToLower();
            wc.DownloadFile(webpath, path);
            GuiController.Instance.Logger.log("Descargado: " + webpath);
            return true;
        }
        catch (e)
        {
            return false;
        }
    }

};
/**
 * @author Martin H. Giachetti
 * @date 28/08/13
 */
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
        gl.drawElements(gl.TRIANGLES, geometry.indices.length/3, gl.UNSIGNED_SHORT, 0);

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



/**
 * @author Martin H. Giachetti
 * @date 29/08/13
 */

L3D.ColorMaterial = function(color) {
    L3D.BaseMaterial.call(this);
    this.uColorLocation = null;
    this.fcolor = new L3D.F32Array(3);
    this.setColor((color!=undefined)?color:0xAAF00F);

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
/**
 * @author Martin H. Giachetti
 * @date 28/08/13
 */
/**
 * @author Martin H. Giachetti
 * @date 28/08/13
 */


L3D.Matrix4 = function( m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {

    this.vec = new L3D.F32Array(16);

    this.set(   m11!==undefined?m11:1, m12||0, m13||0, m14||0,
                m21||0, m22!==undefined?m22:1, m23||0, m24||0,
                m31||0, m32||0, m33!==undefined?m33:1, m34||0,
                m41||0, m42||0, m43||0, m44!==undefined?m44:1
    );
};

L3D.Matrix4.prototype = {
    set: function( m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
        var v = this.vec;
        v[0]=m11;  v[1]=m12;  v[2]=m13;  v[3]=m14;
        v[4]=m21;  v[5]=m22;  v[6]=m23;  v[7]=m24;
        v[8]=m31;  v[9]=m32;  v[10]=m33; v[11]=m34;
        v[12]=m41; v[13]=m42; v[14]=m43; v[15]=m44;
        return this;
    },

    identity: function() {
        return this.set( 1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, 1, 0,
                    0, 0, 0, 1);
    },

    perspective: function(fovy, aspect, near, far) {
        var f = 1.0 / Math.tan(fovy / 2),
            nf = 1 / (near - far);
        return this.set(
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (far + near) * nf, -1,
            0, 0, (2 * far * near) * nf, 0
        );

    },

    translate: function(x, y, z) {
        var v = this.vec;
        v[12] = v[0] * x + v[4] * y + v[8] * z + v[12];
        v[13] = v[1] * x + v[5] * y + v[9] * z + v[13];
        v[14] = v[2] * x + v[6] * y + v[10] * z + v[14];
        v[15] = v[3] * x + v[7] * y + v[11] * z + v[15];
    },

    scale: function(x,y,z) {
        var v = this.vec;
        v[0] = v[0] * x;
        v[1] = v[1] * x;
        v[2] = v[2] * x;
        v[3] = v[3] * x;
        v[4] = v[4] * y;
        v[5] = v[5] * y;
        v[6] = v[6] * y;
        v[7] = v[7] * y;
        v[8] = v[8] * z;
        v[9] = v[9] * z;
        v[10] = v[10] * z;
        v[11] = v[11] * z;
        v[12] = v[12];
        v[13] = v[13];
        v[14] = v[14];
        v[15] = v[15];
    },

    copy: function(m) {
        this.vec.set(m.vec);
    }

};

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

};/**
 * @author Martin H. Giachetti
 * @date 28/08/13
 */

L3D.Vector3 = function(x,y,z){
    this.x = x || 0.0;
    this.y = y || 0.0;
    this.z = z || 0.0;
};

L3D.Vector3.prototype = {

    add: function(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    },

    sub: function(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    },

    multiplyScalar: function(s) {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        return this;
    },

    divideScalar: function(s) {
        this.x /= s;
        this.y /= s;
        this.z /= s;
        return this;
    },

    dot: function(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    },

    cross: function(v) {
        var x = this.x, y = this.y, z = this.z;

        this.x = y * v.z - z * v.y;
        this.y = z * v.x - x * v.z;
        this.z = x * v.y - y * v.x;
        return this;
    },

    length: function() {
        return Math.sqrt(this.x*this.x+this.y*this.y+this.z+this.z);
    },

    lengthSqrt: function() {
        return this.x*this.x+this.y*this.y+this.z*this.z;
    },

    normalize: function() {
        return this.divideScalar(this.length());
    },

    transformCoordinate: function(mat) {
        var m = mat.vec;
        var x = this.x, y = this.y, z = this.z;

        this.x = m[0]*x + m[1]*y + m[2]*z + m[3];
        this.y = m[4]*x + m[5]*y + m[6]*z + m[7];
        this.z = m[8]*x + m[9]*y + m[10]*z + m[11];
        return this;
    },

    min: function(v) {
        if(this.x > v.x) {
            this.x = v.x;
        }

        if(this.y > v.y) {
            this.y = v.y;
        }

        if(this.z > v.z) {
            this.z = v.z;
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

        if(this.z < v.z) {
            this.z = v.z;
        }

        return this;
    },

    copy: function(v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;
    },

    set: function(x,y,z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
};
/**
 * @author Martin H. Giachetti
 * @date 28/08/13
 */

L3D.Vector4 = function(x, y, z, w) {
    this.x = x || 0.0;
    this.y = y || 0.0;
    this.z = z || 0.0;
    this.w = w || 0.0;
};

L3D.Vector4.prototype = {
    add: function(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        this.w += v.w;
        return this;
    },

    sub: function(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        this.w -= v.w;
        return this;
    },

    multiplyScale: function(s) {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        this.w *= s;
        return this;
    },

    divideScale: function(s) {
        this.x /= s;
        this.y /= s;
        this.z /= s;
        this.w /= s;
        return this;
    },

    dot: function(v) {
        return this.x * v.x + this.y * v.y + this.z* v.z + this.w * v.w;
    },

    normalize: function() {
        return this.divideScale( this.length() );
    },

    lengthSqrt: function() {
        return this.x*this.x + this.y*this.y + this.z*this.z + this.w*this.w;
    },

    length: function() {
        return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z + this.w*this.w);
    },

    min: function(v) {
        if(this.x > v.x) {
            this.x = v.x;
        }

        if(this.y > v.y) {
            this.y = v.y;
        }

        if(this.z > v.z) {
            this.z = v.z;
        }

        if(this.w > v.w) {
            this.w = v.w;
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

        if(this.z < v.z) {
            this.z = v.z;
        }

        if(this.w < v.w) {
            this.w = v.w;
        }
        return this;
    },

    copy: function(v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        this.w = v.w;
        return this;
    }
};/**
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

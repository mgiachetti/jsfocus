/**
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

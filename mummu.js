var Mummu;
(function (Mummu) {
    class AnimationFactory {
        static CreateWait(owner, onUpdateCallback) {
            let scene;
            return (duration) => {
                return new Promise(resolve => {
                    let t = 0;
                    let animationCB = () => {
                        t += 1 / 60;
                        let f = t / duration;
                        if (f < 1) {
                            if (onUpdateCallback) {
                                onUpdateCallback();
                            }
                        }
                        else {
                            if (onUpdateCallback) {
                                onUpdateCallback();
                            }
                            owner.getScene().onBeforeRenderObservable.removeCallback(animationCB);
                            resolve();
                        }
                    };
                    owner.getScene().onBeforeRenderObservable.add(animationCB);
                });
            };
        }
        static CreateNumber(owner, obj, property, onUpdateCallback) {
            return (target, duration) => {
                return new Promise(resolve => {
                    let origin = obj[property];
                    let t = 0;
                    if (owner[property + "_animation"]) {
                        owner.getScene().onBeforeRenderObservable.removeCallback(owner[property + "_animation"]);
                    }
                    let animationCB = () => {
                        t += 1 / 60;
                        let f = t / duration;
                        if (f < 1) {
                            obj[property] = origin * (1 - f) + target * f;
                            if (onUpdateCallback) {
                                onUpdateCallback();
                            }
                        }
                        else {
                            obj[property] = target;
                            if (onUpdateCallback) {
                                onUpdateCallback();
                            }
                            owner.getScene().onBeforeRenderObservable.removeCallback(animationCB);
                            owner[property + "_animation"] = undefined;
                            resolve();
                        }
                    };
                    owner.getScene().onBeforeRenderObservable.add(animationCB);
                    owner[property + "_animation"] = animationCB;
                });
            };
        }
    }
    AnimationFactory.EmptyVoidCallback = async (duration) => { };
    AnimationFactory.EmptyNumberCallback = async (target, duration) => { };
    Mummu.AnimationFactory = AnimationFactory;
})(Mummu || (Mummu = {}));
/// <reference path="../lib/babylon.d.ts"/>
var Mummu;
(function (Mummu) {
    let CachedData = new Map();
    function CloneVertexData(data) {
        let clonedData = new BABYLON.VertexData();
        clonedData.positions = [...data.positions];
        clonedData.indices = [...data.indices];
        clonedData.normals = [...data.normals];
        if (data.matricesIndices) {
            clonedData.matricesIndices = [...data.matricesIndices];
        }
        if (data.matricesWeights) {
            clonedData.matricesWeights = [...data.matricesWeights];
        }
        if (data.uvs) {
            clonedData.uvs = [...data.uvs];
        }
        if (data.colors) {
            clonedData.colors = [...data.colors];
        }
        return clonedData;
    }
    Mummu.CloneVertexData = CloneVertexData;
    async function GetVertexData(path) {
        if (CachedData.get(path)) {
            return CachedData.get(path);
        }
        let vertexData = undefined;
        let loadedFile = await BABYLON.SceneLoader.ImportMeshAsync("", path, "");
        let vertexDatas = [];
        let loadedFileMeshes = loadedFile.meshes.sort((m1, m2) => {
            if (m1.name < m2.name) {
                return -1;
            }
            else if (m1.name > m2.name) {
                return 1;
            }
            return 0;
        });
        for (let i = 0; i < loadedFileMeshes.length; i++) {
            let loadedMesh = loadedFileMeshes[i];
            if (loadedMesh instanceof BABYLON.Mesh) {
                vertexData = BABYLON.VertexData.ExtractFromMesh(loadedMesh);
                let colors = [];
                if (loadedMesh.material) {
                    if (loadedMesh.material instanceof BABYLON.PBRMaterial) {
                        let color = loadedMesh.material.albedoColor;
                        for (let k = 0; k < vertexData.positions.length / 3; k++) {
                            let index = k;
                            colors[4 * index] = color.r;
                            colors[4 * index + 1] = color.g;
                            colors[4 * index + 2] = color.b;
                            colors[4 * index + 3] = 1;
                        }
                    }
                    else if (loadedMesh.material instanceof BABYLON.MultiMaterial) {
                        for (let j = 0; j < loadedMesh.material.subMaterials.length; j++) {
                            let subMaterial = loadedMesh.material.subMaterials[j];
                            if (subMaterial instanceof BABYLON.PBRMaterial) {
                                let color = subMaterial.albedoColor;
                                let subMesh = loadedMesh.subMeshes.find(sm => { return sm.materialIndex === j; });
                                for (let k = 0; k < subMesh.verticesCount; k++) {
                                    let index = subMesh.verticesStart + k;
                                    colors[4 * index] = color.r;
                                    colors[4 * index + 1] = color.g;
                                    colors[4 * index + 2] = color.b;
                                    colors[4 * index + 3] = 1;
                                }
                            }
                        }
                    }
                }
                if (colors.length === 0) {
                    for (let i = 0; i < vertexData.positions.length / 3; i++) {
                        colors.push(1, 1, 1, 1);
                    }
                }
                vertexData.colors = colors;
                vertexDatas.push(vertexData);
            }
        }
        CachedData.set(path, vertexDatas);
        loadedFileMeshes.forEach(m => { m.dispose(); });
        loadedFile.skeletons.forEach(s => { s.dispose(); });
        return vertexDatas;
    }
    Mummu.GetVertexData = GetVertexData;
    async function GetColorizedVertexData(path, baseColorHex = "#FFFFFF", frameColorHex = "", color1Hex = "", // Replace red
    color2Hex = "", // Replace green
    color3Hex = "" // Replace blue
    ) {
        let vertexDatas = await GetColorizedMultipleVertexData(path, baseColorHex, frameColorHex, color1Hex, color2Hex, color3Hex);
        return vertexDatas[0];
    }
    Mummu.GetColorizedVertexData = GetColorizedVertexData;
    async function GetColorizedMultipleVertexData(path, baseColorHex = "#FFFFFF", frameColorHex = "", color1Hex = "", // Replace red
    color2Hex = "", // Replace green
    color3Hex = "" // Replace blue
    ) {
        let baseColor;
        if (baseColorHex !== "") {
            baseColor = BABYLON.Color3.FromHexString(baseColorHex);
        }
        let frameColor;
        if (frameColorHex !== "") {
            frameColor = BABYLON.Color3.FromHexString(frameColorHex);
        }
        let color1;
        if (color1Hex !== "") {
            color1 = BABYLON.Color3.FromHexString(color1Hex);
        }
        let color2;
        if (color2Hex !== "") {
            color2 = BABYLON.Color3.FromHexString(color2Hex);
        }
        let color3;
        if (color3Hex !== "") {
            color3 = BABYLON.Color3.FromHexString(color3Hex);
        }
        let vertexDatas = await GetVertexData(path);
        let colorizedVertexDatas = [];
        for (let d = 0; d < vertexDatas.length; d++) {
            let vertexData = vertexDatas[d];
            let colorizedVertexData = CloneVertexData(vertexData);
            if (colorizedVertexData.colors) {
                for (let i = 0; i < colorizedVertexData.colors.length / 4; i++) {
                    let r = colorizedVertexData.colors[4 * i];
                    let g = colorizedVertexData.colors[4 * i + 1];
                    let b = colorizedVertexData.colors[4 * i + 2];
                    if (baseColor) {
                        if (r === 1 && g === 1 && b === 1) {
                            colorizedVertexData.colors[4 * i] = baseColor.r;
                            colorizedVertexData.colors[4 * i + 1] = baseColor.g;
                            colorizedVertexData.colors[4 * i + 2] = baseColor.b;
                            continue;
                        }
                    }
                    if (frameColor) {
                        if (r === 0.502 && g === 0.502 && b === 0.502) {
                            colorizedVertexData.colors[4 * i] = frameColor.r;
                            colorizedVertexData.colors[4 * i + 1] = frameColor.g;
                            colorizedVertexData.colors[4 * i + 2] = frameColor.b;
                            continue;
                        }
                    }
                    if (color1) {
                        if (r === 1 && g === 0 && b === 0) {
                            colorizedVertexData.colors[4 * i] = color1.r;
                            colorizedVertexData.colors[4 * i + 1] = color1.g;
                            colorizedVertexData.colors[4 * i + 2] = color1.b;
                            continue;
                        }
                    }
                    if (color2) {
                        if (r === 0 && g === 1 && b === 0) {
                            colorizedVertexData.colors[4 * i] = color2.r;
                            colorizedVertexData.colors[4 * i + 1] = color2.g;
                            colorizedVertexData.colors[4 * i + 2] = color2.b;
                            continue;
                        }
                    }
                    if (color3) {
                        if (r === 0 && g === 0 && b === 1) {
                            colorizedVertexData.colors[4 * i] = color3.r;
                            colorizedVertexData.colors[4 * i + 1] = color3.g;
                            colorizedVertexData.colors[4 * i + 2] = color3.b;
                            continue;
                        }
                    }
                }
            }
            else {
                let colors = [];
                for (let i = 0; i < colorizedVertexData.positions.length / 3; i++) {
                    colors[4 * i] = baseColor.r;
                    colors[4 * i + 1] = baseColor.g;
                    colors[4 * i + 2] = baseColor.b;
                    colors[4 * i + 3] = 1;
                }
                colorizedVertexData.colors = colors;
            }
            colorizedVertexDatas.push(colorizedVertexData);
        }
        return colorizedVertexDatas;
    }
    Mummu.GetColorizedMultipleVertexData = GetColorizedMultipleVertexData;
})(Mummu || (Mummu = {}));

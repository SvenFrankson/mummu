/// <reference path="../lib/babylon.d.ts"/>

namespace Mummu {
    
    class VertexDataInfo {

        public name: string;
        public position: BABYLON.Vector3;
    }

    class VertexDataWithInfo {
        
        constructor(
            public vertexDatas: BABYLON.VertexData[],
            public infos: VertexDataInfo[]
        ) {

        }
    }

    export class VertexDataLoader {

        public static instance: VertexDataLoader;
    
        public scene: BABYLON.Scene;
        private _vertexDatas: Map<string, VertexDataWithInfo>;
    
        constructor(scene: BABYLON.Scene) {
            this.scene = scene;
            this._vertexDatas = new Map<string, VertexDataWithInfo>();
            VertexDataLoader.instance = this;
        }
    
        public static clone(data: BABYLON.VertexData): BABYLON.VertexData {
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

        public async getInfos(url: string, scene?: BABYLON.Scene): Promise<VertexDataInfo[]> {
            if (!this._vertexDatas.get(url)) {
                await this.get(url, scene);
            }
            if (this._vertexDatas.has(url)) {
                return this._vertexDatas.get(url).infos;
            }
            return [];
        }
    
        public async get(url: string, scene?: BABYLON.Scene): Promise<BABYLON.VertexData[]> {
            if (this._vertexDatas.get(url)) {
                return this._vertexDatas.get(url).vertexDatas;
            }
            let vertexData: BABYLON.VertexData = undefined;
            let loadedFile = await BABYLON.SceneLoader.ImportMeshAsync("", url, "", scene);
            let vertexDatas: BABYLON.VertexData[] = [];
            let infos: VertexDataInfo[] = [];
            let loadedFileMeshes = loadedFile.meshes.sort(
                (m1, m2) => {
                    if (m1.name < m2.name) {
                        return -1;
                    }
                    else if (m1.name > m2.name) {
                        return 1;
                    }
                    return 0;
                }
            )
            for (let i = 0; i < loadedFileMeshes.length; i++) {
                let loadedMesh = loadedFileMeshes[i];
                if (loadedMesh instanceof BABYLON.Mesh) {
                    vertexData =  BABYLON.VertexData.ExtractFromMesh(loadedMesh);
                    if (vertexData.positions && vertexData.positions.length > 0) {
                        let colors: number[] = [];
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
                        
                        let vertexDataInfos = new VertexDataInfo();
                        vertexDataInfos.name = loadedMesh.name;
                        vertexDataInfos.position = loadedMesh.position.clone();
                        infos.push(vertexDataInfos);
                    }
                }
            }
            this._vertexDatas.set(url, new VertexDataWithInfo(vertexDatas, infos));
            loadedFileMeshes.forEach(m => { m.dispose(); });
            loadedFile.skeletons.forEach(s => { s.dispose(); });
            return vertexDatas;
        }
    
        public async getColorized(
            url: string, 
            baseColorHex: string = "#FFFFFF",
            frameColorHex: string = "",
            color1Hex: string = "", // Replace red
            color2Hex: string = "", // Replace green
            color3Hex: string = "" // Replace blue
        ): Promise<BABYLON.VertexData> {
            let vertexDatas = await this.getColorizedMultiple(url, baseColorHex, frameColorHex, color1Hex, color2Hex, color3Hex);
            return vertexDatas[0];
        }
    
        public async getColorizedMultiple(
            url: string, 
            baseColorHex: string = "#FFFFFF",
            frameColorHex: string = "",
            color1Hex: string = "", // Replace red
            color2Hex: string = "", // Replace green
            color3Hex: string = "" // Replace blue
        ): Promise<BABYLON.VertexData[]> {
            let baseColor: BABYLON.Color3;
            if (baseColorHex !== "") {
                baseColor = BABYLON.Color3.FromHexString(baseColorHex);
            }
            let frameColor: BABYLON.Color3;
            if (frameColorHex !== "") {
                frameColor = BABYLON.Color3.FromHexString(frameColorHex);
            }
            let color1: BABYLON.Color3;
            if (color1Hex !== "") {
                color1 = BABYLON.Color3.FromHexString(color1Hex);
            }
            let color2: BABYLON.Color3;
            if (color2Hex !== "") {
                color2 = BABYLON.Color3.FromHexString(color2Hex);
            }
            let color3: BABYLON.Color3;
            if (color3Hex !== "") {
                color3 = BABYLON.Color3.FromHexString(color3Hex);
            }
            let vertexDatas = await VertexDataLoader.instance.get(url);
            let colorizedVertexDatas: BABYLON.VertexData[] = [];
            for (let d = 0; d < vertexDatas.length; d++) {
                let vertexData = vertexDatas[d];
                let colorizedVertexData = VertexDataLoader.clone(vertexData);
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
                    let colors: number[] = [];
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
    }
}
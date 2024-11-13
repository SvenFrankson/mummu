namespace Mummu {

    export function CloneVertexData(data: BABYLON.VertexData): BABYLON.VertexData {
        let clonedData = new BABYLON.VertexData();
        
        clonedData.positions = [...data.positions];
        clonedData.indices = [...data.indices];
        clonedData.normals = [...data.normals];
        if (data.uvs) {
            clonedData.uvs = [...data.uvs];
        }
        if (data.colors) {
            clonedData.colors = [...data.colors];
        }

        return clonedData;
    }

    export function MergeVertexDatas(...datas: BABYLON.VertexData[]): BABYLON.VertexData {
        let mergedData = new BABYLON.VertexData();
        
        let positions = [];
        let indices = [];
        let normals = [];
        let uvs = [];
        let uvs2 = [];
        let colors = [];

        let useColors = false;
        for (let i = 0; i < datas.length; i++) {
            if (datas[i].colors) {
                useColors = true;
            }
        }

        for (let i = 0; i < datas.length; i++) {
            let offset = positions.length / 3;
            positions.push(...datas[i].positions);
            indices.push(...datas[i].indices.map(index => { return index + offset; }));
            normals.push(...datas[i].normals);
            if (datas[i].uvs) {
                uvs.push(...datas[i].uvs);
            }
            if (datas[i].uvs2) {
                uvs2.push(...datas[i].uvs2);
            }
            if (datas[i].colors) {
                colors.push(...datas[i].colors);
            }
            else if (useColors) {
                for (let j = 0; j < positions.length / 3; j++) {
                    colors.push(1, 1, 1, 1);
                }
            }
        }

        mergedData.positions = positions;
        mergedData.indices = indices;
        mergedData.normals = normals;
        if (uvs.length > 0) {
            mergedData.uvs = uvs;
        }
        if (uvs2.length > 0) {
            mergedData.uvs2 = uvs2;
        }
        if (colors.length > 0) {
            mergedData.colors = colors;
        }

        return mergedData;
    }

    export function TranslateVertexDataInPlace(data: BABYLON.VertexData, t: BABYLON.Vector3): BABYLON.VertexData {
        let positions = [...data.positions];
        for (let i = 0; i < positions.length / 3; i++) {
            positions[3 * i] += t.x;
            positions[3 * i + 1] += t.y;
            positions[3 * i + 2] += t.z;
        }
        data.positions = positions;

        return data;
    }

    export function RotateAngleAxisVertexDataInPlace(data: BABYLON.VertexData, angle: number, axis: BABYLON.Vector3): BABYLON.VertexData {
        let q = BABYLON.Quaternion.RotationAxis(axis, angle);
        return RotateVertexDataInPlace(data, q);
    }

    export function RotateVertexDataInPlace(data: BABYLON.VertexData, q: BABYLON.Quaternion): BABYLON.VertexData {
        let pos = BABYLON.Vector3.Zero();
        let normal = BABYLON.Vector3.Up();
        let positions = [...data.positions];
        let normals = [...data.normals];
        let L = positions.length;
        for (let i = 0; i < L / 3; i++) {
            pos.copyFromFloats(positions[3 * i], positions[3 * i + 1], positions[3 * i + 2]);
            normal.copyFromFloats(normals[3 * i], normals[3 * i + 1], normals[3 * i + 2]);
            pos.rotateByQuaternionToRef(q, pos);
            normal.rotateByQuaternionToRef(q, normal);
            positions[3 * i] = pos.x;
            positions[3 * i + 1] = pos.y;
            positions[3 * i + 2] = pos.z;
            normals[3 * i] = normal.x;
            normals[3 * i + 1] = normal.y;
            normals[3 * i + 2] = normal.z;
        }
        data.positions = positions;
        data.normals = normals;

        return data;
    }

    export function ScaleVertexDataInPlace(data: BABYLON.VertexData, s: number): BABYLON.VertexData {
        data.positions = data.positions.map((n: number) => { return n * s; });
        return data;
    }

    export function ShrinkVertexDataInPlace(data: BABYLON.VertexData, d: number): BABYLON.VertexData {
        let positions = [...data.positions];
        let normals = data.normals;
        for (let i = 0; i < positions.length / 3; i++) {
            let nx = normals[3 * i];
            let ny = normals[3 * i + 1];
            let nz = normals[3 * i + 2];
            positions[3 * i] += d * nx;
            positions[3 * i + 1] += d * ny;
            positions[3 * i + 2] += d * nz;
        }
        data.positions = positions;

        return data;
    }

    export function MirrorXVertexDataInPlace(data: BABYLON.VertexData): BABYLON.VertexData {
        let positions = [...data.positions];
        let normals = [...data.normals];
        let uvs = [...data.uvs];
        for (let i = 0; i < positions.length / 3; i++) {
            normals[3 * i] *= -1;
            positions[3 * i] *= -1;
            uvs[2 * i] *= -1;
        }
        data.positions = positions;
        data.normals = normals;
        data.uvs = uvs;

        let indices = [...data.indices];
        for (let i = 0; i < indices.length / 3; i++) {
            let i1 = indices[3 * i];
            let i2 = indices[3 * i + 1];
            indices[3 * i] = i2;
            indices[3 * i + 1] = i1;
        }
        data.indices = indices;

        return data;
    }

    export function TriFlipVertexDataInPlace(data: BABYLON.VertexData): BABYLON.VertexData {
        let indices = [...data.indices];
        for (let i = 0; i < indices.length / 3; i++) {
            let i1 = indices[3 * i];
            let i2 = indices[3 * i + 1];
            indices[3 * i] = i2;
            indices[3 * i + 1] = i1;
        }
        data.indices = indices;
        data.normals = data.normals.map((n: number) => { return - n; });

        return data;
    }

    export function ColorizeVertexDataInPlace(data: BABYLON.VertexData, color: BABYLON.Color3, colorToReplace?: BABYLON.Color3): BABYLON.VertexData {
        let colors = [];
        if (colorToReplace && data.colors) {
            colors = [...data.colors];
        }
        for (let i = 0; i < data.positions.length / 3; i++) {
            if (colorToReplace) {
                let r = data.colors[4 * i];
                let g = data.colors[4 * i + 1];
                let b = data.colors[4 * i + 2];
                if (r != colorToReplace.r || g != colorToReplace.g || b != colorToReplace.b) {
                    continue;
                }
            }
            colors[4 * i] = color.r;
            colors[4 * i + 1] = color.g;
            colors[4 * i + 2] = color.b;
            colors[4 * i + 3] = 1;
        }
        data.colors = colors;

        return data;
    }
}
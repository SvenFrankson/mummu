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
        let colors = [];

        for (let i = 0; i < datas.length; i++) {
            let offset = positions.length / 3;
            positions.push(...datas[i].positions);
            indices.push(...datas[i].indices.map(index => { return index + offset; }));
            normals.push(...datas[i].normals);
            if (datas[i].uvs) {
                uvs.push(...datas[i].uvs);
            }
            if (datas[i].colors) {
                colors.push(...datas[i].colors);
            }
        }

        mergedData.positions = positions;
        mergedData.indices = indices;
        mergedData.normals = normals;
        if (uvs.length > 0) {
            mergedData.uvs = uvs;
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
}
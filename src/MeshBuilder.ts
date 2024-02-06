/// <reference path="../lib/babylon.d.ts"/>

namespace Mummu {

    export interface IQuadProps {
        p1: BABYLON.Vector3,
        p2: BABYLON.Vector3,
        p3: BABYLON.Vector3,
        p4: BABYLON.Vector3,
        colors?: BABYLON.Color4 | BABYLON.Color4[],
        sideOrientation?: number
    }

    export function CreateQuadVertexData(props: IQuadProps): BABYLON.VertexData {
        let data = new BABYLON.VertexData();
        
        let positions = [
            props.p1.x, props.p1.y, props.p1.z,
            props.p2.x, props.p2.y, props.p2.z,
            props.p3.x, props.p3.y, props.p3.z,
            props.p4.x, props.p4.y, props.p4.z
        ];

        let n1 = BABYLON.Vector3.Cross(
            props.p4.subtract(props.p1),
            props.p2.subtract(props.p1)
        ).normalize();
        let n2 = BABYLON.Vector3.Cross(
            props.p1.subtract(props.p2),
            props.p3.subtract(props.p2)
        ).normalize();
        let n3 = BABYLON.Vector3.Cross(
            props.p2.subtract(props.p3),
            props.p4.subtract(props.p3)
        ).normalize();
        let n4 = BABYLON.Vector3.Cross(
            props.p3.subtract(props.p4),
            props.p1.subtract(props.p4)
        ).normalize();

        let indices: number[] = [];
        if (BABYLON.Vector3.DistanceSquared(props.p1, props.p3) <= BABYLON.Vector3.DistanceSquared(props.p2, props.p4)) {
            if (isNaN(props.sideOrientation) || props.sideOrientation === 0 || props.sideOrientation === 2) {
                indices.push(0, 1, 2);
                indices.push(0, 2, 3);
            }
            if (props.sideOrientation === 1 || props.sideOrientation === 2) {
                indices.push(0, 2, 1);
                indices.push(0, 3, 2);
            }
        }
        else {
            if (isNaN(props.sideOrientation) || props.sideOrientation === 0 || props.sideOrientation === 2) {
                indices.push(0, 1, 3);
                indices.push(1, 2, 3);
            }
            if (props.sideOrientation === 1 || props.sideOrientation === 2) {
                indices.push(0, 3, 1);
                indices.push(1, 3, 2);
            }
        }

        let normals = [
            n1.x, n1.y, n1.z,
            n2.x, n2.y, n2.z,
            n3.x, n3.y, n3.z,
            n4.x, n4.y, n4.z
        ];

        let uvs = [0, 0, 1, 0, 1, 1, 0, 1];

        data.positions = positions;
        data.normals = normals;
        data.indices = indices;
        data.uvs = uvs;

        if (props.colors) {
            if (props.colors instanceof BABYLON.Color4) {
                let colors = [
                    ...props.colors.asArray(),
                    ...props.colors.asArray(),
                    ...props.colors.asArray(),
                    ...props.colors.asArray(),
                ];
                data.colors = colors;
            }
            else {
                let colors = [
                    ...props.colors[0].asArray(),
                    ...props.colors[1].asArray(),
                    ...props.colors[2].asArray(),
                    ...props.colors[3].asArray(),
                ];
                data.colors = colors;
            }
        }

        return data;
    }

    export function CreateQuad(name: string, props: IQuadProps, scene?: BABYLON.Scene): BABYLON.Mesh {
        let mesh = new BABYLON.Mesh(name, scene);
        CreateQuadVertexData(props).applyToMesh(mesh);
        return mesh;
    }
}
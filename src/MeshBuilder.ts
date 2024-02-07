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

    export interface ISphereCutProps {
        dir: BABYLON.Vector3,
        up?: BABYLON.Vector3,
        rMin: number,
        rMax: number,
        alpha?: number,
        alphaMin?: number,
        alphaMax?: number,
        beta?: number,
        betaMin?: number,
        betaMax?: number,
        angularQuadLength?: number,
        color?: BABYLON.Color4,
        sideOrientation?: number
    }

    export function CreateSphereCutData(props: ISphereCutProps): BABYLON.VertexData {
        let data = new BABYLON.VertexData();
        let positions: number[] = [];
        let normals: number[] = [];
        let uvs: number[] = [];
        let indices: number[] = [];

        let dir = props.dir;
        let up = props.up ? props.up : BABYLON.Axis.Y;
        if (!isFinite(props.angularQuadLength)) {
            props.angularQuadLength = Math.PI / 12;
        }
        let right = BABYLON.Vector3.Cross(up, dir).normalize();
        up = BABYLON.Vector3.Cross(dir, right).normalize();

        let alphaL = isFinite(props.alpha) ? props.alpha : props.alphaMax - props.alphaMin;
        let alphaMin = isFinite(props.alpha) ? - props.alpha * 0.5 : props.alphaMin;
        let betaL = isFinite(props.beta) ? props.beta : props.betaMax - props.betaMin;
        let betaMin = isFinite(props.beta) ? - props.beta * 0.5 : props.betaMin;
        
        let cAlpha = Math.round(alphaL / props.angularQuadLength);
        let cBeta = Math.round(betaL / props.angularQuadLength);

        // Large face
        for (let j = 0; j <= cBeta; j++) {
            for (let i = 0; i <= cAlpha; i++) {
                
                let a = (i / cAlpha) * alphaL + alphaMin;
                let b = (j / cBeta) * betaL + betaMin;

                let p = Mummu.Rotate(dir, right, b);
                Mummu.RotateInPlace(p, up, a);
                
                let n = positions.length / 3;
                positions.push(p.x * props.rMax, p.y * props.rMax, p.z * props.rMax);
                uvs.push(1 - i / cAlpha, 1 - j / cBeta);

                if (i < cAlpha && j < cBeta) {
                    if (isNaN(props.sideOrientation) || props.sideOrientation === 0 || props.sideOrientation === 2) {
                        indices.push(n, n + 1, n + 1 + (cAlpha + 1));
                        indices.push(n, n + 1 + (cAlpha + 1), n + (cAlpha + 1));
                    }
                    if (props.sideOrientation === 1 || props.sideOrientation === 2) {
                        indices.push(n, n + 1 + (cAlpha + 1), n + 1);
                        indices.push(n, n + (cAlpha + 1), n + 1 + (cAlpha + 1));
                    }
                }
            }
        }

        // Small face
        for (let j = 0; j <= cBeta; j++) {
            for (let i = 0; i <= cAlpha; i++) {
                
                let a = (i / cAlpha) * alphaL + alphaMin;
                let b = (j / cBeta) * betaL + betaMin;

                let p = Mummu.Rotate(dir, right, b);
                Mummu.RotateInPlace(p, up, a);
                
                let n = positions.length / 3;
                positions.push(p.x * props.rMin, p.y * props.rMin, p.z * props.rMin);
                uvs.push(i / cAlpha, 1 - j / cBeta);

                if (i < cAlpha && j < cBeta) {
                    if (isNaN(props.sideOrientation) || props.sideOrientation === 0 || props.sideOrientation === 2) {
                        indices.push(n, n + 1 + (cAlpha + 1), n + 1);
                        indices.push(n, n + (cAlpha + 1), n + 1 + (cAlpha + 1));
                    }
                    if (props.sideOrientation === 1 || props.sideOrientation === 2) {
                        indices.push(n, n + 1, n + 1 + (cAlpha + 1));
                        indices.push(n, n + 1 + (cAlpha + 1),  n + (cAlpha + 1));
                    }
                }
            }
        }

        // Left face
        for (let j = 0; j <= cBeta; j++) {
            let a = alphaMin;
            let b = (j / cBeta) * betaL + betaMin;

            let p = Mummu.Rotate(dir, right, b);
            Mummu.RotateInPlace(p, up, a);
            
            let n = positions.length / 3;
            positions.push(p.x * props.rMin, p.y * props.rMin, p.z * props.rMin);
            positions.push(p.x * props.rMax, p.y * props.rMax, p.z * props.rMax);
            
            uvs.push(1, 1 - j / cBeta);
            uvs.push(0, 1 - j / cBeta);

            if (j < cBeta) {
                if (isNaN(props.sideOrientation) || props.sideOrientation === 0 || props.sideOrientation === 2) {
                    indices.push(n, n + 1, n + 3);
                    indices.push(n, n + 3, n + 2);
                }
                if (props.sideOrientation === 1 || props.sideOrientation === 2) {
                    indices.push(n, n + 3, n + 1);
                    indices.push(n, n + 2, n + 3);
                }
            }
        }

        // Right face
        for (let j = 0; j <= cBeta; j++) {
            let a = alphaMin + alphaL;
            let b = (j / cBeta) * betaL + betaMin;

            let p = Mummu.Rotate(dir, right, b);
            Mummu.RotateInPlace(p, up, a);
            
            let n = positions.length / 3;
            positions.push(p.x * props.rMin, p.y * props.rMin, p.z * props.rMin);
            positions.push(p.x * props.rMax, p.y * props.rMax, p.z * props.rMax);
            
            uvs.push(0, 1 - j / cBeta);
            uvs.push(1, 1 - j / cBeta);

            if (j < cBeta) {
                if (isNaN(props.sideOrientation) || props.sideOrientation === 0 || props.sideOrientation === 2) {
                    indices.push(n, n + 3, n + 1);
                    indices.push(n, n + 2, n + 3);
                }
                if (props.sideOrientation === 1 || props.sideOrientation === 2) {
                    indices.push(n, n + 1, n + 3);
                    indices.push(n, n + 3, n + 2);
                }
            }
        }

        // Top face
        for (let i = 0; i <= cAlpha; i++) {
            
            let a = (i / cAlpha) * alphaL + alphaMin;
            let b = betaMin;

            let p = Mummu.Rotate(dir, right, b);
            Mummu.RotateInPlace(p, up, a);
            
            let n = positions.length / 3;
            positions.push(p.x * props.rMin, p.y * props.rMin, p.z * props.rMin);
            positions.push(p.x * props.rMax, p.y * props.rMax, p.z * props.rMax);
            
            uvs.push(i / cAlpha, 0);
            uvs.push(i / cAlpha, 1);

            if (i < cAlpha) {
                if (isNaN(props.sideOrientation) || props.sideOrientation === 0 || props.sideOrientation === 2) {
                    indices.push(n, n + 3, n + 1);
                    indices.push(n, n + 2, n + 3);
                }
                if (props.sideOrientation === 1 || props.sideOrientation === 2) {
                    indices.push(n, n + 1, n + 3);
                    indices.push(n, n + 3, n + 2);
                }
            }
        }

        // Bottom face
        for (let i = 0; i <= cAlpha; i++) {
            
            let a = (i / cAlpha) * alphaL + alphaMin;
            let b = betaL + betaMin;

            let p = Mummu.Rotate(dir, right, b);
            Mummu.RotateInPlace(p, up, a);
            
            let n = positions.length / 3;
            positions.push(p.x * props.rMin, p.y * props.rMin, p.z * props.rMin);
            positions.push(p.x * props.rMax, p.y * props.rMax, p.z * props.rMax);
            
            uvs.push(1 - i / cAlpha, 0);
            uvs.push(1 - i / cAlpha, 1);

            if (i < cAlpha) {
                if (isNaN(props.sideOrientation) || props.sideOrientation === 0 || props.sideOrientation === 2) {
                    indices.push(n, n + 1, n + 3);
                    indices.push(n, n + 3, n + 2);
                }
                if (props.sideOrientation === 1 || props.sideOrientation === 2) {
                    indices.push(n, n + 3, n + 1);
                    indices.push(n, n + 2, n + 3);
                }
            }
        }


        data.positions = positions;
        data.indices = indices;
        BABYLON.VertexData.ComputeNormals(positions, indices, normals);
        data.normals = normals;
        data.uvs = uvs;

        if (props.color) {
            let colors: number[] = [];
            for (let i = 0; i < positions.length / 3; i++) {
                colors.push(...props.color.asArray());
            }
            data.colors = colors;
        }
        
        return data;
    }

    export function CreateSphereCut(name: string, props: ISphereCutProps, scene?: BABYLON.Scene): BABYLON.Mesh {
        let mesh = new BABYLON.Mesh(name, scene);
        CreateSphereCutData(props).applyToMesh(mesh);
        return mesh;
    }
}
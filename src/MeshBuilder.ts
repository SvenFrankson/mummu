/// <reference path="../lib/babylon.d.ts"/>

namespace Mummu {
    export interface IQuadProps {
        width?: number;
        height?: number;
        p1?: BABYLON.Vector3;
        p2?: BABYLON.Vector3;
        p3?: BABYLON.Vector3;
        p4?: BABYLON.Vector3;
        colors?: BABYLON.Color4 | BABYLON.Color4[];
        uvInWorldSpace?: boolean;
        uvSize?: number;
        sideOrientation?: number;
    }

    export function CreateQuadVertexData(props: IQuadProps): BABYLON.VertexData {
        let data = new BABYLON.VertexData();

        if (isFinite(props.width) && isFinite(props.height)) {
            props.p1 = new BABYLON.Vector3(- props.width * 0.5, - props.height * 0.5, 0);

            props.p2 = props.p1.clone();
            props.p2.x += props.width;

            props.p3 = props.p1.clone();
            props.p3.x += props.width;
            props.p3.y += props.height;

            props.p4 = props.p1.clone();
            props.p4.y += props.height;
        }

        let positions = [props.p1.x, props.p1.y, props.p1.z, props.p2.x, props.p2.y, props.p2.z, props.p3.x, props.p3.y, props.p3.z, props.p4.x, props.p4.y, props.p4.z];

        let n1 = BABYLON.Vector3.Cross(props.p4.subtract(props.p1), props.p2.subtract(props.p1)).normalize();
        let n2 = BABYLON.Vector3.Cross(props.p1.subtract(props.p2), props.p3.subtract(props.p2)).normalize();
        let n3 = BABYLON.Vector3.Cross(props.p2.subtract(props.p3), props.p4.subtract(props.p3)).normalize();
        let n4 = BABYLON.Vector3.Cross(props.p3.subtract(props.p4), props.p1.subtract(props.p4)).normalize();

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
        } else {
            if (isNaN(props.sideOrientation) || props.sideOrientation === 0 || props.sideOrientation === 2) {
                indices.push(0, 1, 3);
                indices.push(1, 2, 3);
            }
            if (props.sideOrientation === 1 || props.sideOrientation === 2) {
                indices.push(0, 3, 1);
                indices.push(1, 3, 2);
            }
        }

        let normals = [n1.x, n1.y, n1.z, n2.x, n2.y, n2.z, n3.x, n3.y, n3.z, n4.x, n4.y, n4.z];

        let uvs: number[];
        if (props.uvInWorldSpace) {
            let s = props.uvSize;
            if (isNaN(s)) {
                s = 1;
            }
            let w = props.p2.subtract(props.p1).length() / s;
            let h = props.p4.subtract(props.p1).length() / s;
            uvs = [0, 0, w, 0, w, h, 0, h];
        }
        else {
            uvs = [0, 0, 1, 0, 1, 1, 0, 1];
        }

        data.positions = positions;
        data.normals = normals;
        data.indices = indices;
        data.uvs = uvs;

        if (props.colors) {
            if (props.colors instanceof BABYLON.Color4) {
                let colors = [...props.colors.asArray(), ...props.colors.asArray(), ...props.colors.asArray(), ...props.colors.asArray()];
                data.colors = colors;
            } else {
                let colors = [...props.colors[0].asArray(), ...props.colors[1].asArray(), ...props.colors[2].asArray(), ...props.colors[3].asArray()];
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

    export interface I9SliceProps {
        width: number;
        height: number;
        margin: number;
        color?: BABYLON.Color4;
        sideOrientation?: number;
        uv1InWorldSpace?: boolean;
        uv1Size?: number;
    }

    export function Create9SliceVertexData(props: I9SliceProps): BABYLON.VertexData {
        let data = new BABYLON.VertexData();

        let w2 = props.width * 0.5;
        let h2 = props.height * 0.5;
        let m = props.margin;

        let positions = [
            -w2, -h2, 0,
            -w2 + m, -h2, 0,
            w2 - m, -h2, 0,
            w2, -h2, 0,
            -w2, -h2 + m, 0,
            -w2 + m, -h2 + m, 0,
            w2 - m, -h2 + m, 0,
            w2, -h2 + m, 0,
            -w2, h2 - m, 0,
            -w2 + m, h2 - m, 0,
            w2 - m, h2 - m, 0,
            w2, h2 - m, 0,
            -w2, h2, 0,
            -w2 + m, h2, 0,
            w2 - m, h2, 0,
            w2, h2, 0
        ];

        let normals = [
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1
        ]

        let indices: number[] = [];
        for (let j = 0; j < 3; j++) {
            for (let i = 0; i < 3; i++) {
                let n = i + j * 4;
                indices.push(n, n + 1, n + 1 + 4);
                indices.push(n, n + 1 + 4, n + 4);
            }
        }

        let slice9uvs = [
            0, 0,
            1/3, 0,
            2/3, 0,
            1, 0,
            0, 1/3,
            1/3, 1/3,
            2/3, 1/3,
            1, 1/3,
            0, 2/3,
            1/3, 2/3,
            2/3, 2/3,
            1, 2/3,
            0, 1,
            1/3, 1,
            2/3, 1,
            1, 1
        ];

        data.positions = positions;
        data.normals = normals;
        data.indices = indices;

        if (props.color) {
            let colors: number[] = [];
            for (let i = 0; i < 16; i++) {
                colors.push(...props.color.asArray());
            }
            data.colors = colors;
        }

        if (props.uv1InWorldSpace) {
            let s = props.uv1Size;
            if (isNaN(s)) {
                s = 1;
            }

            let uvs: number[] = [];
            for (let i = 0; i < positions.length / 3; i++) {
                uvs[2 * i] = positions[3 * i] * s;
                uvs[2 * i + 1] = positions[3 * i + 1] * s;
            }
            data.uvs = uvs;
            data.uvs2 = slice9uvs;
        }
        else {
            data.uvs = slice9uvs;
        }

        return data;
    }

    export function Create9Slice(name: string, props: I9SliceProps, scene?: BABYLON.Scene): BABYLON.Mesh {
        let mesh = new BABYLON.Mesh(name, scene);
        Create9SliceVertexData(props).applyToMesh(mesh);
        return mesh;
    }

    export interface IExtrudeShapeVertexData {
        shape: BABYLON.Vector3[],
        path: BABYLON.Vector3[],
        scale?: number,
        rotation?: number,
        closeShape?: boolean,
        closePath?: boolean,
        cap?: number,
        updatable?: boolean,
        sideOrientation?: number,
        frontUVs?: BABYLON.Vector4,
        backUVs?: BABYLON.Vector4,
        instance?: BABYLON.Mesh,
        invertUV?: boolean,
        firstNormal?: BABYLON.Vector3,
        adjustFrame?: boolean 
    } 

    export function CreateExtrudeShapeVertexData(data: IExtrudeShapeVertexData): BABYLON.VertexData {
        let tmp = BABYLON.MeshBuilder.ExtrudeShape("tmp", data);
        let vertexData = BABYLON.VertexData.ExtractFromMesh(tmp);
        tmp.dispose();
        return vertexData;
    }

    export interface ICylinderSliceVertexData {
        center?: BABYLON.Vector3;
        radius?: number;
        alphaMin: number;
        alphaMax: number;
        yMin?: number;
        yMax?: number;
        tesselation?: number;
        colors?: BABYLON.Color4 | BABYLON.Color4[];
        uvInWorldSpace?: boolean;
        uvSize?: number;
        sideOrientation?: number;
    }

    export function CreateCylinderSliceVertexData(props: ICylinderSliceVertexData): BABYLON.VertexData {
        if (isNaN(props.tesselation)) {
            props.tesselation = 16;
        }
        if (isNaN(props.radius)) {
            props.radius = 1;
        }
        if (isNaN(props.yMin)) {
            props.yMin = 0;
        }
        if (isNaN(props.yMax)) {
            props.yMax = 1;
        }
        if (isNaN(props.sideOrientation)) {
            props.sideOrientation = BABYLON.Mesh.FRONTSIDE;
        }
        if (isNaN(props.uvSize)) {
            props.uvSize = 1;
        }

        let data = new BABYLON.VertexData();

        let positions: number[] = [];
        let normals = [];
        let indices: number[] = [];
        let uvs: number[] = [];

        if (props.sideOrientation === BABYLON.Mesh.FRONTSIDE || props.sideOrientation === BABYLON.Mesh.DOUBLESIDE) {
            for (let i = 0; i <= props.tesselation; i++) {
                let f = i / props.tesselation;
                let a = props.alphaMin * (1 - f) + props.alphaMax * f;
                let cosa = Math.cos(a);
                let sina = Math.sin(a);
                let x = cosa * props.radius;
                let z = sina * props.radius;

                let l = positions.length / 3;
                positions.push(x, props.yMin, z);
                positions.push(x, props.yMax, z);

                normals.push(cosa, 0, sina);
                normals.push(cosa, 0, sina);

                if (i < props.tesselation) {
                    indices.push(l, l + 2, l + 3);
                    indices.push(l, l + 3, l + 1);
                }

                if (props.uvInWorldSpace) {
                    let p = (props.alphaMax - props.alphaMin) * props.radius;
                    uvs.push((f * p) / props.uvSize, 0);
                    uvs.push((f * p) / props.uvSize, (props.yMax - props.yMin) / props.uvSize);
                }
                else {
                    uvs.push(f, 0);
                    uvs.push(f, 1);
                }
            }
        }

        if (props.sideOrientation === BABYLON.Mesh.BACKSIDE || props.sideOrientation === BABYLON.Mesh.DOUBLESIDE) {
            for (let i = 0; i <= props.tesselation; i++) {
                let f = i / props.tesselation;
                let a = props.alphaMin * (1 - f) + props.alphaMax * f;
                let cosa = Math.cos(a);
                let sina = Math.sin(a);
                let x = cosa * props.radius;
                let z = sina * props.radius;

                let l = positions.length / 3;
                positions.push(x, props.yMin, z);
                positions.push(x, props.yMax, z);

                normals.push(- cosa, 0, - sina);
                normals.push(- cosa, 0, - sina);

                if (i < props.tesselation) {
                    indices.push(l, l + 3, l + 2);
                    indices.push(l, l + 1, l + 3);
                }

                if (props.uvInWorldSpace) {
                    let p = (props.alphaMax - props.alphaMin) * props.radius;
                    uvs.push(((1 - f) * p) / props.uvSize, 0);
                    uvs.push(((1 - f) * p) / props.uvSize, (props.yMax - props.yMin) / props.uvSize);
                }
                else {
                    uvs.push((1 - f), 0);
                    uvs.push((1 - f), 1);
                }
            }
        }

        data.positions = positions;
        data.uvs = uvs;
        data.indices = indices;
        data.normals = normals;

        return data;
    }

    export function CreateCylinderSlice(name: string, props: ICylinderSliceVertexData, scene?: BABYLON.Scene): BABYLON.Mesh {
        let mesh = new BABYLON.Mesh(name, scene);
        CreateCylinderSliceVertexData(props).applyToMesh(mesh);
        return mesh;
    }

    export interface IDiscSliceVertexData {
        center?: BABYLON.Vector3;
        innerRadius?: number;
        outterRadius?: number;
        alphaMin: number;
        alphaMax: number;
        y?: number;
        tesselation?: number;
        colors?: BABYLON.Color4 | BABYLON.Color4[];
        uvInWorldSpace?: boolean;
        uvSize?: number;
        sideOrientation?: number;
    }

    export function CreateDiscSliceVertexData(props: IDiscSliceVertexData): BABYLON.VertexData {
        if (isNaN(props.tesselation)) {
            props.tesselation = 16;
        }
        if (isNaN(props.innerRadius)) {
            props.innerRadius = 1;
        }
        if (isNaN(props.outterRadius)) {
            props.outterRadius = 1;
        }
        if (isNaN(props.y)) {
            props.y = 0;
        }
        if (isNaN(props.sideOrientation)) {
            props.sideOrientation = BABYLON.Mesh.FRONTSIDE;
        }
        if (isNaN(props.uvSize)) {
            props.uvSize = 1;
        }

        let data = new BABYLON.VertexData();

        let positions: number[] = [];
        let normals = [];
        let indices: number[] = [];
        let uvs: number[] = [];

        if (props.sideOrientation === BABYLON.Mesh.FRONTSIDE || props.sideOrientation === BABYLON.Mesh.DOUBLESIDE) {
            for (let i = 0; i <= props.tesselation; i++) {
                let f = i / props.tesselation;
                let a = props.alphaMin * (1 - f) + props.alphaMax * f;
                let cosa = Math.cos(a);
                let sina = Math.sin(a);
                let xInner = cosa * props.innerRadius;
                let zInner = sina * props.innerRadius;
                let xOutter = cosa * props.outterRadius;
                let zOutter = sina * props.outterRadius;

                let l = positions.length / 3;
                positions.push(xInner, props.y, zInner);
                positions.push(xOutter, props.y, zOutter);
    
                normals.push(0, 1, 0);
                normals.push(0, 1, 0);
                
                if (i < props.tesselation) {
                    indices.push(l, l + 1, l + 3);
                    indices.push(l, l + 3, l + 2);
                }
                
                if (props.uvInWorldSpace) {
                    uvs.push(xInner / props.uvSize, zInner / props.uvSize);
                    uvs.push(xOutter / props.uvSize, zOutter / props.uvSize);
                }
                else {
                    uvs.push(f, 1);
                    uvs.push(f, 0);
                }
            }
        }

        if (props.sideOrientation === BABYLON.Mesh.BACKSIDE || props.sideOrientation === BABYLON.Mesh.DOUBLESIDE) {
            for (let i = 0; i <= props.tesselation; i++) {
                let f = i / props.tesselation;
                let a = props.alphaMin * (1 - f) + props.alphaMax * f;
                let cosa = Math.cos(a);
                let sina = Math.sin(a);
                let xInner = cosa * props.innerRadius;
                let zInner = sina * props.innerRadius;
                let xOutter = cosa * props.outterRadius;
                let zOutter = sina * props.outterRadius;

                let l = positions.length / 3;
                positions.push(xInner, props.y, zInner);
                positions.push(xOutter, props.y, zOutter);
    
                normals.push(0, - 1, 0);
                normals.push(0, - 1, 0);
                
                if (i < props.tesselation) {
                    indices.push(l, l + 2, l + 3);
                    indices.push(l, l + 3, l + 1);
                }
                
                if (props.uvInWorldSpace) {
                    uvs.push(xInner / props.uvSize, zInner / props.uvSize);
                    uvs.push(xOutter / props.uvSize, zOutter / props.uvSize);
                }
                else {
                    uvs.push(f, 0);
                    uvs.push(f, 1);
                }
            }
        }

        data.positions = positions;
        data.uvs = uvs;
        data.indices = indices;
        data.normals = normals;

        return data;
    }

    export function CreateDiscSlice(name: string, props: IDiscSliceVertexData, scene?: BABYLON.Scene): BABYLON.Mesh {
        let mesh = new BABYLON.Mesh(name, scene);
        CreateDiscSliceVertexData(props).applyToMesh(mesh);
        return mesh;
    }

    export interface IDiscVertexData {
        center?: BABYLON.Vector3;
        radius?: number;
        alphaMin: number;
        alphaMax: number;
        y?: number;
        tesselation?: number;
        colors?: BABYLON.Color4 | BABYLON.Color4[];
        uvInWorldSpace?: boolean;
        uvSize?: number;
        sideOrientation?: number;
    }

    export function CreateDiscVertexData(props: IDiscVertexData): BABYLON.VertexData {
        if (isNaN(props.tesselation)) {
            props.tesselation = 16;
        }
        if (isNaN(props.radius)) {
            props.radius = 1;
        }
        if (isNaN(props.y)) {
            props.y = 0;
        }
        if (isNaN(props.sideOrientation)) {
            props.sideOrientation = BABYLON.Mesh.FRONTSIDE;
        }
        if (isNaN(props.uvSize)) {
            props.uvSize = 1;
        }

        let data = new BABYLON.VertexData();

        let positions: number[] = [];
        let normals = [];
        let indices: number[] = [];
        let uvs: number[] = [];

        if (props.sideOrientation === BABYLON.Mesh.FRONTSIDE || props.sideOrientation === BABYLON.Mesh.DOUBLESIDE) {
            let centerIndex = positions.length / 3;
            positions.push(0, props.y, 0);
            normals.push(0, 1, 0);
            uvs.push(0, 0);
            
            for (let i = 0; i <= props.tesselation; i++) {
                let f = i / props.tesselation;
                let a = props.alphaMin * (1 - f) + props.alphaMax * f;
                let cosa = Math.cos(a);
                let sina = Math.sin(a);
                let x = cosa * props.radius;
                let z = sina * props.radius;

                let l = positions.length / 3;
                positions.push(x, props.y, z);
    
                normals.push(0, 1, 0);
                
                if (i < props.tesselation) {
                    indices.push(centerIndex, l, l + 1);
                }
                
                if (props.uvInWorldSpace) {
                    uvs.push(x / props.uvSize, z / props.uvSize);
                }
                else {
                    uvs.push(x, z);
                }
            }
        }

        if (props.sideOrientation === BABYLON.Mesh.BACKSIDE || props.sideOrientation === BABYLON.Mesh.DOUBLESIDE) {
            let centerIndex = positions.length / 3;
            positions.push(0, props.y, 0);
            normals.push(0, - 1, 0);
            uvs.push(0, 0);
            
            for (let i = 0; i <= props.tesselation; i++) {
                let f = i / props.tesselation;
                let a = props.alphaMin * (1 - f) + props.alphaMax * f;
                let cosa = Math.cos(a);
                let sina = Math.sin(a);
                let x = cosa * props.radius;
                let z = sina * props.radius;

                let l = positions.length / 3;
                positions.push(x, props.y, z);
    
                normals.push(0, - 1, 0);
                
                if (i < props.tesselation) {
                    indices.push(centerIndex, l + 1, l);
                }
                
                if (props.uvInWorldSpace) {
                    uvs.push(x / props.uvSize, z / props.uvSize);
                }
                else {
                    uvs.push(x, z);
                }
            }
        }

        data.positions = positions;
        data.uvs = uvs;
        data.indices = indices;
        data.normals = normals;

        return data;
    }

    export function CreateDisc(name: string, props: IDiscVertexData, scene?: BABYLON.Scene): BABYLON.Mesh {
        let mesh = new BABYLON.Mesh(name, scene);
        CreateDiscVertexData(props).applyToMesh(mesh);
        return mesh;
    }

    export interface IBoxProps {
        size?: number;
        width?: number;
        height?: number;
        depth?: number;
        color?: BABYLON.Color4;
        grid?: number;
        offset?: BABYLON.Vector3;
    }

    export function CreateLineBox(name: string, props: IBoxProps, scene?: BABYLON.Scene): BABYLON.Mesh {
        let w = isFinite(props.width) ? props.width : props.size;
        let h = isFinite(props.height) ? props.height : props.size;
        let d = isFinite(props.depth) ? props.depth : props.size;
        
        let w05 = w * 0.5;
        let h05 = h * 0.5;
        let d05 = d * 0.5;

        let p000 = new BABYLON.Vector3(- w05, - h05, -d05);
        let p100 = new BABYLON.Vector3(w05, - h05, -d05);
        let p101 = new BABYLON.Vector3(w05, - h05, d05);
        let p001 = new BABYLON.Vector3(- w05, - h05, d05);
        let p010 = new BABYLON.Vector3(- w05, h05, -d05);
        let p110 = new BABYLON.Vector3(w05, h05, -d05);
        let p111 = new BABYLON.Vector3(w05, h05, d05);
        let p011 = new BABYLON.Vector3(- w05, h05, d05);

        let lines = [
            [p000.clone(), p100.clone(), p101.clone(), p001.clone(), p000.clone()],
            [p000.clone(), p010.clone()],
            [p100.clone(), p110.clone()],
            [p101.clone(), p111.clone()],
            [p001.clone(), p011.clone()],
            [p010.clone(), p110.clone(), p111.clone(), p011.clone(), p010.clone()],
        ];

        let colors: BABYLON.Color4[][];
        if (props.color) {
            colors = [
                [props.color, props.color, props.color, props.color, props.color],
                [props.color, props.color],
                [props.color, props.color],
                [props.color, props.color],
                [props.color, props.color],
                [props.color, props.color, props.color, props.color, props.color],
            ]
        }

        if (props.grid) {
            let cW = Math.round(w / props.grid);
            let cH = Math.round(h / props.grid);
            let cD = Math.round(d / props.grid);

            for (let i = 1; i < cW; i++) {
                lines.push([
                    new BABYLON.Vector3(- w05 + i * props.grid, - h05, - d05),
                    new BABYLON.Vector3(- w05 + i * props.grid, - h05, d05),
                    new BABYLON.Vector3(- w05 + i * props.grid, h05, d05),
                    new BABYLON.Vector3(- w05 + i * props.grid, h05, - d05),
                    new BABYLON.Vector3(- w05 + i * props.grid, - h05, - d05)
                ]);
                if (props.color) {
                    colors.push([props.color, props.color, props.color, props.color, props.color]);
                }
            }

            for (let i = 1; i < cH; i++) {
                lines.push([
                    new BABYLON.Vector3(- w05, - h05 + i * props.grid, - d05),
                    new BABYLON.Vector3(- w05, - h05 + i * props.grid, d05),
                    new BABYLON.Vector3(w05, - h05 + i * props.grid, d05),
                    new BABYLON.Vector3(w05, - h05 + i * props.grid, - d05),
                    new BABYLON.Vector3(- w05, - h05 + i * props.grid, - d05)
                ]);
                if (props.color) {
                    colors.push([props.color, props.color, props.color, props.color, props.color]);
                }
            }

            for (let i = 1; i < cD; i++) {
                lines.push([
                    new BABYLON.Vector3(- w05, - h05, - d05 + i * props.grid),
                    new BABYLON.Vector3(- w05, h05, - d05 + i * props.grid),
                    new BABYLON.Vector3(w05, h05, - d05 + i * props.grid),
                    new BABYLON.Vector3(w05, - h05, - d05 + i * props.grid),
                    new BABYLON.Vector3(- w05, - h05, - d05 + i * props.grid)
                ]);
                if (props.color) {
                    colors.push([props.color, props.color, props.color, props.color, props.color]);
                }
            }
        }

        if (props.offset) {
            lines.forEach(line => {
                line.forEach(point => {
                    point.addInPlace(props.offset);
                });
            });
        }

        return BABYLON.MeshBuilder.CreateLineSystem(
            name,
            {
                lines: lines,
                colors: colors
            },
            scene
        )
    }

    export interface IBeveledBoxProps {
        size?: number;
        width?: number;
        height?: number;
        depth?: number;
        bevel?: number;
        color?: BABYLON.Color4;
        flat?: boolean;
    }

    export function CreateBeveledBoxVertexData(props: IBeveledBoxProps): BABYLON.VertexData {
        let w = isFinite(props.width) ? props.width : props.size;
        let h = isFinite(props.height) ? props.height : props.size;
        let d = isFinite(props.depth) ? props.depth : props.size;

        let data = new BABYLON.VertexData();
        let positions: number[];
        let normals: number[];
        let indices: number[];
        let colors: number[];

        if (props.flat) {
            positions = [
                0.25, -0.5, 0.25, -0.25, -0.5, -0.25, -0.25, -0.5, 0.25, -0.5, 0.25, -0.25, -0.5, -0.25, 0.25, -0.5, -0.25, -0.25, 0.25, 0.25, -0.5, -0.25, -0.25, -0.5, 0.25, -0.25, -0.5, -0.25, 0.5, 0.25, 0.25, 0.5, -0.25, 0.25, 0.5, 0.25, 0.5, 0.25, 0.25, 0.5, -0.25, -0.25, 0.5, -0.25, 0.25, 0.25, 0.25, 0.5, 0.25, 0.5, 0.25, 0.5, 0.25, 0.25, 0.25, -0.5, 0.25, 0.25, -0.25, 0.5, 0.5, -0.25, 0.25,
                0.5, 0.25, -0.25, 0.25, 0.5, -0.25, 0.25, 0.25, -0.5, 0.5, -0.25, -0.25, 0.25, -0.25, -0.5, 0.25, -0.5, -0.25, -0.25, 0.25, 0.5, -0.5, 0.25, 0.25, -0.25, 0.5, 0.25, -0.5, -0.25, 0.25, -0.25, -0.25, 0.5, -0.25, -0.5, 0.25, -0.5, 0.25, -0.25, -0.25, 0.25, -0.5, -0.25, 0.5, -0.25, -0.25, -0.5, -0.25, -0.25, -0.25, -0.5, -0.5, -0.25, -0.25, -0.25, -0.5, -0.25, -0.5, -0.25, 0.25, -0.25,
                -0.5, 0.25, -0.25, -0.5, 0.25, 0.25, -0.25, 0.5, 0.25, -0.5, 0.25, 0.5, -0.25, 0.25, 0.25, 0.25, 0.5, 0.5, 0.25, 0.25, -0.25, 0.25, -0.5, -0.5, -0.25, -0.25, -0.25, -0.25, -0.5, 0.25, -0.25, -0.5, 0.5, 0.25, -0.25, 0.25, 0.25, -0.5, -0.25, -0.25, 0.5, -0.5, 0.25, 0.25, -0.25, 0.25, 0.5, -0.25, 0.5, -0.25, 0.25, 0.25, -0.5, 0.25, 0.5, -0.25, 0.25, 0.5, -0.25, 0.5, 0.25, 0.25, 0.25,
                0.5, 0.25, 0.25, -0.5, -0.25, -0.25, -0.25, -0.5, -0.25, -0.5, -0.25, -0.25, 0.5, 0.25, -0.5, 0.25, -0.25, -0.25, 0.5, -0.25, 0.25, 0.5, 0.25, -0.25, 0.25, 0.5, -0.25, 0.5, 0.25, 0.25, -0.5, 0.25, 0.5, -0.25, -0.25, 0.25, -0.5, -0.25, -0.25, 0.25, 0.5, 0.25, -0.25, 0.5, -0.25, -0.25, 0.5, 0.25, -0.5, -0.25, -0.5, 0.25, 0.25, -0.25, 0.25, -0.5, -0.25, 0.5, -0.25, 0.5, 0.25, -0.25,
                -0.25, -0.5, -0.25, -0.5, -0.25, -0.25, -0.5, -0.25, 0.25, -0.25, -0.5, 0.25, -0.25, -0.25, 0.5, 0.25, -0.25, 0.5, 0.5, -0.25, 0.25, 0.25, -0.25, 0.5, 0.25, 0.25, 0.5, -0.25, 0.25, -0.5, -0.5, 0.25, -0.25, -0.5, -0.25, -0.25, 0.25, -0.25, -0.5, 0.5, -0.25, -0.25, 0.5, 0.25, -0.25, -0.25, -0.25, 0.5, -0.5, -0.25, 0.25, -0.5, 0.25, 0.25, -0.25, 0.5, -0.25, -0.25, 0.25, -0.5, 0.25,
                0.25, -0.5, 0.25, 0.5, -0.25, 0.5, 0.25, -0.25, 0.5, 0.25, 0.25, 0.25, -0.5, -0.25, 0.25, -0.25, -0.5, -0.25, -0.25, -0.5, -0.25, 0.5, 0.25, -0.5, 0.25, 0.25, -0.5, 0.25, -0.25, 0.25, 0.5, 0.25, 0.25, 0.25, 0.5, -0.25, 0.25, 0.5, 0.25, -0.5, 0.25, 0.5, -0.25, 0.25, 0.5, -0.25, -0.25, -0.25, 0.25, 0.5, 0.25, 0.25, 0.5, 0.25, -0.25, 0.5,
            ];
            normals = [
                0, -1, 0, 0, -1, 0, 0, -1, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0.577, 0.577, 0.577, 0.577, 0.577, 0.577, 0.577, 0.577, 0.577, 0.577, -0.577, 0.577, 0.577, -0.577, 0.577, 0.577, -0.577, 0.577, 0.577, 0.577, -0.577, 0.577, 0.577, -0.577, 0.577, 0.577, -0.577, 0.577, -0.577, -0.577, 0.577, -0.577, -0.577,
                0.577, -0.577, -0.577, -0.577, 0.577, 0.577, -0.577, 0.577, 0.577, -0.577, 0.577, 0.577, -0.577, -0.577, 0.577, -0.577, -0.577, 0.577, -0.577, -0.577, 0.577, -0.577, 0.577, -0.577, -0.577, 0.577, -0.577, -0.577, 0.577, -0.577, -0.577, -0.577, -0.577, -0.577, -0.577, -0.577, -0.577, -0.577, -0.577, -0.707, -0.707, 0, -0.707, -0.707, 0, -0.707, -0.707, 0, 0, -0.707, 0.707, 0, -0.707,
                0.707, 0, -0.707, 0.707, 0.707, 0, 0.707, 0.707, 0, 0.707, 0.707, 0, 0.707, -0.707, 0, -0.707, -0.707, 0, -0.707, -0.707, 0, -0.707, 0.707, 0, -0.707, 0.707, 0, -0.707, 0.707, 0, -0.707, -0.707, 0, 0.707, -0.707, 0, 0.707, -0.707, 0, 0.707, 0, 0.707, -0.707, 0, 0.707, -0.707, 0, 0.707, -0.707, 0.707, 0.707, 0, 0.707, 0.707, 0, 0.707, 0.707, 0, 0, -0.707, -0.707, 0, -0.707, -0.707,
                0, -0.707, -0.707, -0.707, 0.707, 0, -0.707, 0.707, 0, -0.707, 0.707, 0, 0, 0.707, 0.707, 0, 0.707, 0.707, 0, 0.707, 0.707, 0.707, -0.707, 0, 0.707, -0.707, 0, 0.707, -0.707, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, -1, 0, -1, 0, 0, 0, 0, -1, 0, 1, 0, 1, 0, 0, -0.707, -0.707, 0, -0.707, -0.707, 0, -0.707, -0.707, 0, 0, -0.707, 0.707, 0, -0.707, 0.707, 0, -0.707, 0.707, 0.707, 0, 0.707,
                0.707, 0, 0.707, 0.707, 0, 0.707, -0.707, 0, -0.707, -0.707, 0, -0.707, -0.707, 0, -0.707, 0.707, 0, -0.707, 0.707, 0, -0.707, 0.707, 0, -0.707, -0.707, 0, 0.707, -0.707, 0, 0.707, -0.707, 0, 0.707, 0, 0.707, -0.707, 0, 0.707, -0.707, 0, 0.707, -0.707, 0.707, 0.707, 0, 0.707, 0.707, 0, 0.707, 0.707, 0, 0, -0.707, -0.707, 0, -0.707, -0.707, 0, -0.707, -0.707, -0.707, 0.707, 0,
                -0.707, 0.707, 0, -0.707, 0.707, 0, 0, 0.707, 0.707, 0, 0.707, 0.707, 0, 0.707, 0.707, 0.707, -0.707, 0, 0.707, -0.707, 0, 0.707, -0.707, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1,
            ];
            indices = [
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 0, 78, 1, 3, 79, 4, 6, 80, 7, 9, 81, 10, 12, 82, 13, 83, 84, 85, 86, 87, 88, 89,
                90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121,
            ];
        } else {
            positions = [
                0.25, -0.5, 0.25, -0.25, -0.5, -0.25, -0.25, -0.5, 0.25, -0.5, 0.25, -0.25, -0.5, -0.25, 0.25, -0.5, -0.25, -0.25, 0.25, 0.25, -0.5, -0.25, -0.25, -0.5, 0.25, -0.25, -0.5, -0.25, 0.5, 0.25, 0.25, 0.5, -0.25, 0.25, 0.5, 0.25, 0.5, 0.25, 0.25, 0.5, -0.25, -0.25, 0.5, -0.25, 0.25, 0.25, 0.25, 0.5, 0.25, 0.5, 0.25, 0.5, 0.25, 0.25, 0.25, -0.25, 0.5, 0.5, -0.25, 0.25, 0.5, 0.25, -0.25,
                0.25, 0.5, -0.25, 0.25, 0.25, -0.5, 0.5, -0.25, -0.25, 0.25, -0.25, -0.5, 0.25, -0.5, -0.25, -0.25, 0.25, 0.5, -0.5, 0.25, 0.25, -0.25, 0.5, 0.25, -0.25, -0.25, 0.5, -0.25, -0.5, 0.25, -0.25, 0.25, -0.5, -0.25, 0.5, -0.25, -0.25, -0.25, -0.5, -0.5, -0.25, -0.25, -0.5, -0.25, 0.25, -0.25, -0.25, -0.5, -0.25, -0.25, 0.5, -0.5, 0.25, 0.25, -0.25, 0.25, 0.5, -0.25, 0.5, -0.25, 0.25,
                0.5, -0.25, 0.25, -0.5, -0.25, -0.25, -0.25, -0.5, -0.25, 0.5, 0.25, 0.25, 0.5, 0.25, -0.25, 0.25, 0.5, -0.25, 0.5, 0.25, 0.25, -0.5, -0.25, -0.25, 0.25, 0.5, 0.25, -0.25, 0.5, -0.25, -0.25, 0.5, 0.25, -0.5, -0.25, -0.5, 0.25, 0.25, -0.25, 0.25, -0.5, -0.25, 0.5, -0.25, -0.5, -0.25, -0.25, -0.5, -0.25, 0.25, -0.25, -0.25, 0.5, 0.25, -0.25, 0.5, -0.25, -0.25, 0.5, -0.5, 0.25, 0.25,
                -0.25, 0.5, -0.25, -0.25, 0.25, -0.5, 0.25, -0.5, -0.25, 0.25, -0.25, -0.5, -0.25, -0.25, -0.5, -0.25, 0.5, 0.25, -0.5, 0.25, 0.25, 0.25, 0.5, 0.25, -0.25, 0.25, 0.5, -0.25, 0.25, 0.5, 0.25, -0.25, 0.5,
            ];
            normals = [
                0.342, -0.876, 0.342, -0.342, -0.876, -0.342, -0.342, -0.876, 0.342, -0.876, 0.342, -0.342, -0.876, -0.342, 0.342, -0.876, -0.342, -0.342, 0.342, 0.342, -0.876, -0.342, -0.342, -0.876, 0.342, -0.342, -0.876, -0.342, 0.876, 0.342, 0.342, 0.876, -0.342, 0.342, 0.876, 0.342, 0.876, 0.342, 0.342, 0.876, -0.342, -0.342, 0.876, -0.342, 0.342, 0.342, 0.342, 0.876, 0.342, 0.876, 0.342,
                0.876, 0.342, 0.342, 0.342, -0.342, 0.876, 0.876, -0.342, 0.342, 0.876, 0.342, -0.342, 0.342, 0.876, -0.342, 0.342, 0.342, -0.876, 0.876, -0.342, -0.342, 0.342, -0.342, -0.876, 0.342, -0.876, -0.342, -0.342, 0.342, 0.876, -0.876, 0.342, 0.342, -0.342, 0.876, 0.342, -0.342, -0.342, 0.876, -0.342, -0.876, 0.342, -0.342, 0.342, -0.876, -0.342, 0.876, -0.342, -0.342, -0.342, -0.876,
                -0.876, -0.342, -0.342, -0.876, -0.342, 0.342, -0.342, -0.342, -0.876, -0.342, -0.342, 0.876, -0.876, 0.342, 0.342, -0.342, 0.342, 0.876, -0.342, 0.876, -0.342, 0.342, 0.876, -0.342, 0.342, -0.876, -0.342, -0.342, -0.342, -0.876, -0.342, 0.876, 0.342, 0.342, 0.876, 0.342, -0.342, 0.342, 0.876, -0.342, 0.876, 0.342, 0.342, -0.876, -0.342, -0.342, 0.342, 0.876, 0.342, -0.342, 0.876,
                -0.342, -0.342, 0.876, 0.342, -0.876, -0.342, -0.876, 0.342, 0.342, -0.342, 0.342, -0.876, -0.342, 0.876, -0.342, -0.876, -0.342, -0.342, -0.876, -0.342, 0.342, -0.342, -0.342, 0.876, 0.342, -0.342, 0.876, -0.342, -0.342, 0.876, -0.876, 0.342, 0.342, -0.342, 0.876, -0.342, -0.342, 0.342, -0.876, 0.342, -0.876, -0.342, 0.342, -0.342, -0.876, -0.342, -0.342, -0.876, -0.342, 0.876,
                0.342, -0.876, 0.342, 0.342, 0.342, 0.876, 0.342, -0.342, 0.342, 0.876, -0.342, 0.342, 0.876, 0.342, -0.342, 0.876,
            ];
            indices = [
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 0, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 4, 29, 30, 3, 31, 32, 1, 33, 34, 1, 35, 2, 2, 18, 0, 14, 15, 12, 31, 5, 36, 8, 20, 6, 37, 38, 39, 40, 6, 41, 10, 12, 11, 42, 43, 1, 44, 3, 32, 45, 46, 47, 0, 13, 48, 49, 50, 51, 0, 52, 1, 3, 53, 4, 6, 54, 7, 9, 55, 10, 12, 20, 13, 1, 56, 57, 2, 58, 18, 14, 59, 15, 31, 3, 5,
                8, 13, 20, 60, 4, 61, 62, 63, 6, 10, 20, 12, 64, 65, 66, 67, 68, 3, 69, 15, 70, 0, 14, 13, 71, 15, 72,
            ];
        }

        let l = positions.length / 3;

        for (let i = 0; i < l; i++) {
            let x = positions[3 * i];
            let y = positions[3 * i + 1];
            let z = positions[3 * i + 2];

            if (x > 0) {
                x += 0.5 * w - 0.5;
            } else {
                x -= 0.5 * w - 0.5;
            }
            if (y > 0) {
                y += 0.5 * h - 0.5;
            } else {
                y -= 0.5 * h - 0.5;
            }
            if (z > 0) {
                z += 0.5 * d - 0.5;
            } else {
                z -= 0.5 * d - 0.5;
            }

            positions[3 * i] = x;
            positions[3 * i + 1] = y;
            positions[3 * i + 2] = z;
        }

        if (props.color) {
            colors = [];
            for (let i = 0; i < l; i++) {
                colors.push(props.color.r, props.color.g, props.color.b, props.color.a);
            }
        }

        data.positions = positions;
        data.normals = normals;
        data.indices = indices;
        if (colors) {
            data.colors = colors;
        }

        return data;
    }

    export function CreateBeveledBox(name: string, props: IBeveledBoxProps, scene?: BABYLON.Scene): BABYLON.Mesh {
        let mesh = new BABYLON.Mesh(name, scene);
        CreateBeveledBoxVertexData(props).applyToMesh(mesh);
        return mesh;
    }

    export interface ISphereCutProps {
        dir: BABYLON.Vector3;
        up?: BABYLON.Vector3;
        rMin: number;
        rMax: number;
        alpha?: number;
        alphaMin?: number;
        alphaMax?: number;
        beta?: number;
        betaMin?: number;
        betaMax?: number;
        angularQuadLength?: number;
        color?: BABYLON.Color4;
        sideOrientation?: number;
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
        let alphaMin = isFinite(props.alpha) ? -props.alpha * 0.5 : props.alphaMin;
        let betaL = isFinite(props.beta) ? props.beta : props.betaMax - props.betaMin;
        let betaMin = isFinite(props.beta) ? -props.beta * 0.5 : props.betaMin;

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
                        indices.push(n, n + 1 + (cAlpha + 1), n + (cAlpha + 1));
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

    export interface IWireProps {
        path: BABYLON.Vector3[],
        color?: BABYLON.Color4,
        radius: number,
        tesselation?: number,
        closed?: boolean,
        textureRatio?: number
    }

    export function CreateWireVertexData(props: IWireProps): BABYLON.VertexData {
        let data = new BABYLON.VertexData();
        let positions: number[] = [];
        let normals = [];
        let indices: number[] = [];
        let uvs: number[] = [];
        let colors: number[] = [];

        if (isNaN(props.tesselation)) {
            props.tesselation = 12;
        }
        if (isNaN(props.textureRatio)) {
            props.textureRatio = 1;
        }

        let center = BABYLON.Vector3.Zero();
        let path = [...props.path];
        let n = path.length;
        let directions = [];
        let perimeter = 2 * Math.PI * props.radius;

        if (props.closed) {
            if (BABYLON.Vector3.DistanceSquared(path[0], path[n - 1]) > 0) {
                path.push(path[0].clone());
            }
        }
        
        n = path.length;

        if (props.closed) {
            let prev = path[n - 2];
            let next = path[1];
            directions[0] = next.subtract(prev).normalize();
        }
        else {
            let prev = path[0];
            let next = path[1];
            directions[0] = next.subtract(prev).normalize();
        }
        center.addInPlace(path[0]);

        for (let i = 1; i < path.length - 1; i++) {
            center.addInPlace(path[i]);
            let prev = path[i - 1];
            let next = path[i + 1];
            directions[i] = next.subtract(prev).normalize();
        }
        
        if (props.closed) {
            let prev = path[n - 2];
            let next = path[1];
            directions[n - 1] = next.subtract(prev).normalize();
        }
        else {
            let prev = path[n - 2];
            let next = path[n - 1];
            directions[n - 1] = next.subtract(prev).normalize();
        }
        center.addInPlace(path[n - 1]);

        center.scaleInPlace(1 / n);

        let cumulLength = 0;
        let t = props.tesselation;
        let angle = 2 * Math.PI / t;
        for (let i = 0; i < n; i++) {
            let p = path[i];
            if (i > 0) {
                cumulLength += BABYLON.Vector3.Distance(p, path[i - 1]);
            }
            let dir = directions[i];
            let rayon = p.subtract(center);
            let xDir = BABYLON.Vector3.Cross(dir, rayon);
            rayon = BABYLON.Vector3.Cross(xDir, dir).normalize().scaleInPlace(props.radius);

            let idx0 = positions.length / 3;
            positions.push(rayon.x + p.x, rayon.y + p.y, rayon.z + p.z);
            if (props.color) {
                colors.push(props.color.r, props.color.g, props.color.b, props.color.a);
            }
            let normal = rayon.clone().normalize();
            normals.push(normal.x, normal.y, normal.z);
            uvs.push(0, cumulLength / perimeter / props.textureRatio);
            if (i < n - 1) {
                indices.push(idx0, idx0 + (t + 1) + 1, idx0 + (t + 1));
                indices.push(idx0, idx0 + 1, idx0 + (t + 1) + 1);
            }
            for (let j = 1; j <= t; j++) {
                Mummu.RotateInPlace(rayon, dir, - angle);
                positions.push(rayon.x + p.x, rayon.y + p.y, rayon.z + p.z);
                if (props.color) {
                    colors.push(props.color.r, props.color.g, props.color.b, props.color.a);
                }
                let normal = rayon.clone().normalize();
                normals.push(normal.x, normal.y, normal.z);
                uvs.push(j / t, cumulLength / perimeter / props.textureRatio);
                if (i < n - 1) {
                    if (j < t) {
                        indices.push(idx0 + j, idx0 + j + (t + 1) + 1, idx0 + j + (t + 1));
                        indices.push(idx0 + j, idx0 + j + 1, idx0 + j + (t + 1) + 1);
                    }
                }
            }
        }

        data.positions = positions;
        data.indices = indices;
        data.normals = normals;
        data.uvs = uvs;
        if (props.color) {
            data.colors = colors;
        }

        return data;
    }
}

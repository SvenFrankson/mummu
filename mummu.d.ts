/// <reference path="../nabu/nabu.d.ts" />
/// <reference path="lib/babylon.d.ts" />
interface ISceneObject {
    getScene: () => BABYLON.Scene;
}
declare namespace Mummu {
    class AnimationFactory {
        static EmptyVoidCallback: (duration: number) => Promise<void>;
        static EmptyNumberCallback: (target: number, duration: number) => Promise<void>;
        static EmptyNumbersCallback: (targets: number[], duration: number) => Promise<void>;
        static EmptyVector3Callback: (target: BABYLON.Vector3, duration: number) => Promise<void>;
        static CreateWait(owner: ISceneObject, onUpdateCallback?: () => void): (duration: number) => Promise<void>;
        static CreateNumber(owner: ISceneObject, obj: any, property: string, onUpdateCallback?: () => void, isAngle?: boolean, easing?: (v: number) => number): (target: number, duration: number) => Promise<void>;
        static CreateNumbers(owner: ISceneObject, obj: any, properties: string[], onUpdateCallback?: () => void, isAngle?: boolean[], easing?: (v: number) => number): (targets: number[], duration: number) => Promise<void>;
        static CreateVector3(owner: ISceneObject, obj: any, property: string, onUpdateCallback?: () => void, easing?: (v: number) => number): (target: BABYLON.Vector3, duration: number) => Promise<void>;
    }
}
declare namespace Mummu {
    function SphereCollidersIntersection(cSphere: BABYLON.Vector3, rSphere: number, colliders: (Collider | BABYLON.Mesh)[]): IIntersection[];
    function SphereColliderIntersection(cSphere: BABYLON.Vector3, rSphere: number, collider: Collider | BABYLON.Mesh): IIntersection;
    function RayCollidersIntersection(ray: BABYLON.Ray, colliders: (Collider | BABYLON.Mesh)[]): IIntersection;
    function RayColliderIntersection(ray: BABYLON.Ray, collider: Collider | BABYLON.Mesh): IIntersection;
    class Collider {
    }
    class PlaneCollider extends Collider implements IPlane {
        point: BABYLON.Vector3;
        normal: BABYLON.Vector3;
        static CreateFromBJSPlane(plane: BABYLON.Mesh): PlaneCollider;
        static CreateFromPoints(p1: BABYLON.Vector3, p2: BABYLON.Vector3, p3: BABYLON.Vector3): PlaneCollider;
        constructor(point: BABYLON.Vector3, normal: BABYLON.Vector3);
    }
    class SphereCollider extends Collider implements ISphere {
        localCenter: BABYLON.Vector3;
        radius: number;
        parent?: BABYLON.TransformNode;
        center: BABYLON.Vector3;
        constructor(localCenter: BABYLON.Vector3, radius: number, parent?: BABYLON.TransformNode);
        recomputeWorldCenter(): void;
    }
    class MeshCollider extends Collider {
        mesh: BABYLON.Mesh;
        constructor(mesh: BABYLON.Mesh);
    }
}
declare namespace Mummu {
    function DrawDebugLine(from: BABYLON.Vector3, to: BABYLON.Vector3, frames?: number, color?: BABYLON.Color3, scene?: BABYLON.Scene): BABYLON.Mesh;
    function DrawDebugHit(point: BABYLON.Vector3, normal: BABYLON.Vector3, frames?: number, color?: BABYLON.Color3, scene?: BABYLON.Scene): BABYLON.Mesh;
    function DrawDebugPoint(points: BABYLON.Vector3, frames?: number, color?: BABYLON.Color3, size?: number, scene?: BABYLON.Scene): BABYLON.Mesh;
    function DrawDebugTriangle(p1: BABYLON.Vector3, p2: BABYLON.Vector3, p3: BABYLON.Vector3, frames?: number, color?: BABYLON.Color3, scene?: BABYLON.Scene): BABYLON.Mesh;
}
declare namespace Mummu {
    interface IPlane {
        point: BABYLON.Vector3;
        normal: BABYLON.Vector3;
    }
    interface ISphere {
        center: BABYLON.Vector3;
        radius: number;
    }
    interface IIntersection {
        hit: boolean;
        point: BABYLON.Vector3;
        normal: BABYLON.Vector3;
        depth: number;
        index?: number;
    }
    class Intersection implements IIntersection {
        hit: boolean;
        point: BABYLON.Vector3;
        normal: BABYLON.Vector3;
        depth: number;
        index: number;
        constructor();
    }
    function SphereTriangleCheck(cSphere: BABYLON.Vector3, rSphere: number, p1: BABYLON.Vector3, p2: BABYLON.Vector3, p3: BABYLON.Vector3): boolean;
    function SphereRayCheck(cSphere: BABYLON.Vector3, rSphere: number, ray: BABYLON.Ray): boolean;
    function SphereAABBCheck(cSphere: BABYLON.Vector3, rSphere: number, boxMin: BABYLON.Vector3, boxMax: BABYLON.Vector3): boolean;
    function SphereAABBCheck(cSphere: BABYLON.Vector3, rSphere: number, x2Min: number, x2Max: number, y2Min: number, y2Max: number, z2Min: number, z2Max: number): boolean;
    function AABBAABBCheck(box1Min: BABYLON.Vector3, box1Max: BABYLON.Vector3, box2Min: BABYLON.Vector3, box2Max: BABYLON.Vector3): boolean;
    function AABBAABBCheck(x1Min: number, x1Max: number, y1Min: number, y1Max: number, z1Min: number, z1Max: number, x2Min: number, x2Max: number, y2Min: number, y2Max: number, z2Min: number, z2Max: number): boolean;
    function RaySphereIntersection(ray: BABYLON.Ray, sphere: ISphere): IIntersection;
    function RaySphereIntersection(ray: BABYLON.Ray, cSphere: BABYLON.Vector3, rSphere: number): IIntersection;
    function RayMeshIntersection(ray: BABYLON.Ray, mesh: BABYLON.Mesh): IIntersection;
    function RayPlaneIntersection(ray: BABYLON.Ray, plane: IPlane): IIntersection;
    function RayPlaneIntersection(ray: BABYLON.Ray, pPlane: BABYLON.Vector3, nPlane: BABYLON.Vector3): IIntersection;
    function SpherePlaneIntersection(sphere: ISphere, plane: IPlane): IIntersection;
    function SpherePlaneIntersection(cSphere: BABYLON.Vector3, rSphere: number, plane: IPlane): IIntersection;
    function SpherePlaneIntersection(cSphere: BABYLON.Vector3, rSphere: number, pPlane: BABYLON.Vector3, nPlane: BABYLON.Vector3): IIntersection;
    function SphereCapsuleIntersection(cSphere: BABYLON.Vector3, rSphere: number, c1Capsule: BABYLON.Vector3, c2Capsule: BABYLON.Vector3, rCapsule: number): IIntersection;
    function SphereWireIntersection(cSphere: BABYLON.Vector3, rSphere: number, path: BABYLON.Vector3[], rWire: number, pathIsEvenlyDistributed?: boolean, nearBestIndex?: number, nearBestSearchRange?: number): IIntersection;
    function SphereTriangleIntersection(sphere: ISphere, p1: BABYLON.Vector3, p2: BABYLON.Vector3, p3: BABYLON.Vector3): IIntersection;
    function SphereTriangleIntersection(cSphere: BABYLON.Vector3, rSphere: number, p1: BABYLON.Vector3, p2: BABYLON.Vector3, p3: BABYLON.Vector3): IIntersection;
    function SphereMeshIntersection(cSphere: BABYLON.Vector3, rSphere: number, mesh: BABYLON.Mesh): IIntersection;
}
declare namespace Mummu {
    interface IQuadProps {
        p1: BABYLON.Vector3;
        p2: BABYLON.Vector3;
        p3: BABYLON.Vector3;
        p4: BABYLON.Vector3;
        colors?: BABYLON.Color4 | BABYLON.Color4[];
        sideOrientation?: number;
    }
    function CreateQuadVertexData(props: IQuadProps): BABYLON.VertexData;
    function CreateQuad(name: string, props: IQuadProps, scene?: BABYLON.Scene): BABYLON.Mesh;
    interface IBoxProps {
        size?: number;
        width?: number;
        height?: number;
        depth?: number;
        color?: BABYLON.Color4;
    }
    function CreateLineBox(name: string, props: IBoxProps, scene?: BABYLON.Scene): BABYLON.Mesh;
    interface IBeveledBoxProps {
        size?: number;
        width?: number;
        height?: number;
        depth?: number;
        bevel?: number;
        color?: BABYLON.Color4;
        flat?: boolean;
    }
    function CreateBeveledBoxVertexData(props: IBeveledBoxProps): BABYLON.VertexData;
    function CreateBeveledBox(name: string, props: IBeveledBoxProps, scene?: BABYLON.Scene): BABYLON.Mesh;
    interface ISphereCutProps {
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
    function CreateSphereCutData(props: ISphereCutProps): BABYLON.VertexData;
    function CreateSphereCut(name: string, props: ISphereCutProps, scene?: BABYLON.Scene): BABYLON.Mesh;
}
declare namespace Mummu {
    function QuaternionFromXYAxis(x: BABYLON.Vector3, y: BABYLON.Vector3): BABYLON.Quaternion;
    function QuaternionFromXYAxisToRef(x: BABYLON.Vector3, y: BABYLON.Vector3, ref: BABYLON.Quaternion): BABYLON.Quaternion;
    function QuaternionFromXZAxis(x: BABYLON.Vector3, z: BABYLON.Vector3): BABYLON.Quaternion;
    function QuaternionFromXZAxisToRef(x: BABYLON.Vector3, z: BABYLON.Vector3, ref: BABYLON.Quaternion): BABYLON.Quaternion;
    function QuaternionFromYZAxis(y: BABYLON.Vector3, z: BABYLON.Vector3): BABYLON.Quaternion;
    function QuaternionFromYZAxisToRef(y: BABYLON.Vector3, z: BABYLON.Vector3, ref: BABYLON.Quaternion): BABYLON.Quaternion;
    function QuaternionFromZXAxis(z: BABYLON.Vector3, x: BABYLON.Vector3): BABYLON.Quaternion;
    function QuaternionFromZXAxisToRef(z: BABYLON.Vector3, x: BABYLON.Vector3, ref: BABYLON.Quaternion): BABYLON.Quaternion;
    function QuaternionFromZYAxis(z: BABYLON.Vector3, y: BABYLON.Vector3): BABYLON.Quaternion;
    function QuaternionFromZYAxisToRef(z: BABYLON.Vector3, y: BABYLON.Vector3, ref: BABYLON.Quaternion): BABYLON.Quaternion;
}
declare namespace Mummu {
    interface IMakeScreenshotProp {
        miniatureName?: string;
        size?: number;
        desaturation?: number;
        alphaColor?: BABYLON.Color3;
        engine?: BABYLON.Engine;
        canvas?: HTMLCanvasElement;
        camera?: BABYLON.Camera;
        outlineWidth?: number;
    }
    export function MakeScreenshot(prop?: IMakeScreenshotProp): Promise<void>;
    export {};
}
declare namespace Mummu {
    function IsFinite(v: BABYLON.Vector3): boolean;
    function Barycentric(point: BABYLON.Vector3, p1: BABYLON.Vector3, p2: BABYLON.Vector3, p3: BABYLON.Vector3): Nabu.UVW;
    function ProjectPerpendicularAtToRef(v: BABYLON.Vector3, at: BABYLON.Vector3, out: BABYLON.Vector3): BABYLON.Vector3;
    function ProjectPerpendicularAt(v: BABYLON.Vector3, at: BABYLON.Vector3): BABYLON.Vector3;
    function Rotate(v: BABYLON.Vector3, axis: BABYLON.Vector3, angle: number): BABYLON.Vector3;
    function RotateToRef(v: BABYLON.Vector3, axis: BABYLON.Vector3, angle: number, ref: BABYLON.Vector3): BABYLON.Vector3;
    function RotateInPlace(v: BABYLON.Vector3, axis: BABYLON.Vector3, angle: number): BABYLON.Vector3;
    function Angle(from: BABYLON.Vector3, to: BABYLON.Vector3): number;
    function AngleFromToAround(from: BABYLON.Vector3, to: BABYLON.Vector3, around: BABYLON.Vector3): number;
    function ProjectPointOnPlaneToRef(point: BABYLON.Vector3, pPlane: BABYLON.Vector3, nPlane: BABYLON.Vector3, ref: BABYLON.Vector3): BABYLON.Vector3;
    function ProjectPointOnPlane(point: BABYLON.Vector3, pPlane: BABYLON.Vector3, nPlane: BABYLON.Vector3): BABYLON.Vector3;
    function DistancePointLine(point: BABYLON.Vector3, lineA: BABYLON.Vector3, lineB: BABYLON.Vector3): number;
    function ProjectPointOnLineToRef(point: BABYLON.Vector3, lineA: BABYLON.Vector3, lineB: BABYLON.Vector3, ref: BABYLON.Vector3): BABYLON.Vector3;
    function ProjectPointOnLine(point: BABYLON.Vector3, lineA: BABYLON.Vector3, lineB: BABYLON.Vector3): BABYLON.Vector3;
    function ProjectPointOnSegmentToRef(point: BABYLON.Vector3, segA: BABYLON.Vector3, segB: BABYLON.Vector3, ref: BABYLON.Vector3): BABYLON.Vector3;
    function ProjectPointOnSegment(point: BABYLON.Vector3, segA: BABYLON.Vector3, segB: BABYLON.Vector3): BABYLON.Vector3;
    function DistancePointSegment(point: BABYLON.Vector3, segA: BABYLON.Vector3, segB: BABYLON.Vector3): number;
    interface IPathProjection {
        point: BABYLON.Vector3;
        index: number;
    }
    function ProjectPointOnPathToRef(point: BABYLON.Vector3, path: BABYLON.Vector3[], ref: IPathProjection, pathIsEvenlyDistributed?: boolean, nearBestIndex?: number, nearBestSearchRange?: number): IPathProjection;
    function StepToRef(from: BABYLON.Vector3, to: BABYLON.Vector3, step: number, ref: BABYLON.Vector3): BABYLON.Vector3;
    function Step(from: BABYLON.Vector3, to: BABYLON.Vector3, step: number): BABYLON.Vector3;
    function ForceDistanceFromOriginInPlace(point: BABYLON.Vector3, origin: BABYLON.Vector3, distance: number): BABYLON.Vector3;
    function CatmullRomPathInPlace(path: BABYLON.Vector3[], inDir?: BABYLON.Vector3, outDir?: BABYLON.Vector3): BABYLON.Vector3[];
    function CatmullRomClosedPathInPlace(path: BABYLON.Vector3[]): BABYLON.Vector3[];
    function DecimatePathInPlace(path: BABYLON.Vector3[], minAngle?: number): BABYLON.Vector3[];
    function RandomInSphereCutToRef(dir: BABYLON.Vector3, alphaMin: number, alphaMax: number, betaMin: number, betaMax: number, up: BABYLON.Vector3, ref: BABYLON.Vector3): BABYLON.Vector3;
    function RandomInSphereCut(dir: BABYLON.Vector3, alphaMin: number, alphaMax: number, betaMin: number, betaMax: number, up?: BABYLON.Vector3): BABYLON.Vector3;
    function GetClosestAxisToRef(dir: BABYLON.Vector3, ref: BABYLON.Vector3): BABYLON.Vector3;
    function GetClosestAxis(dir: BABYLON.Vector3): BABYLON.Vector3;
}
declare namespace Mummu {
    class VertexDataLoader {
        static instance: VertexDataLoader;
        scene: BABYLON.Scene;
        private _vertexDatas;
        constructor(scene: BABYLON.Scene);
        static clone(data: BABYLON.VertexData): BABYLON.VertexData;
        get(url: string, scene?: BABYLON.Scene): Promise<BABYLON.VertexData[]>;
        getColorized(url: string, baseColorHex?: string, frameColorHex?: string, color1Hex?: string, // Replace red
        color2Hex?: string, // Replace green
        color3Hex?: string): Promise<BABYLON.VertexData>;
        getColorizedMultiple(url: string, baseColorHex?: string, frameColorHex?: string, color1Hex?: string, // Replace red
        color2Hex?: string, // Replace green
        color3Hex?: string): Promise<BABYLON.VertexData[]>;
    }
}
declare namespace Mummu {
    function CloneVertexData(data: BABYLON.VertexData): BABYLON.VertexData;
    function MergeVertexDatas(...datas: BABYLON.VertexData[]): BABYLON.VertexData;
    function TranslateVertexDataInPlace(data: BABYLON.VertexData, t: BABYLON.Vector3): BABYLON.VertexData;
    function RotateVertexDataInPlace(data: BABYLON.VertexData, q: BABYLON.Quaternion): BABYLON.VertexData;
    function ScaleVertexDataInPlace(data: BABYLON.VertexData, s: number): BABYLON.VertexData;
}

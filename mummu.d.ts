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
        static CreateNumbers(owner: ISceneObject, obj: any, properties: string[], onUpdateCallback?: () => void, isAngle?: boolean[]): (targets: number[], duration: number) => Promise<void>;
        static CreateVector3(owner: ISceneObject, obj: any, property: string, onUpdateCallback?: () => void): (target: BABYLON.Vector3, duration: number) => Promise<void>;
    }
}
declare namespace Mummu {
    interface IIntersection {
        hit: boolean;
        point: BABYLON.Vector3;
        normal: BABYLON.Vector3;
        depth: number;
    }
    function AABBAABBIntersect(x1Min: number, x1Max: number, y1Min: number, y1Max: number, z1Min: number, z1Max: number, x2Min: number, x2Max: number, y2Min: number, y2Max: number, z2Min: number, z2Max: number): boolean;
    function SphereCapsuleIntersection(cSphere: BABYLON.Vector3, rSphere: number, c1Capsule: BABYLON.Vector3, c2Capsule: BABYLON.Vector3, rCapsule: number): IIntersection;
    function SphereWireIntersection(cSphere: BABYLON.Vector3, rSphere: number, path: BABYLON.Vector3[], rWire: number, pathIsEvenlyDistributed?: boolean): IIntersection;
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
    function ProjectPerpendicularAtToRef(v: BABYLON.Vector3, at: BABYLON.Vector3, out: BABYLON.Vector3): BABYLON.Vector3;
    function ProjectPerpendicularAt(v: BABYLON.Vector3, at: BABYLON.Vector3): BABYLON.Vector3;
    function Rotate(v: BABYLON.Vector3, axis: BABYLON.Vector3, angle: number): BABYLON.Vector3;
    function RotateToRef(v: BABYLON.Vector3, axis: BABYLON.Vector3, angle: number, ref: BABYLON.Vector3): BABYLON.Vector3;
    function RotateInPlace(v: BABYLON.Vector3, axis: BABYLON.Vector3, angle: number): BABYLON.Vector3;
    function Angle(from: BABYLON.Vector3, to: BABYLON.Vector3): number;
    function AngleFromToAround(from: BABYLON.Vector3, to: BABYLON.Vector3, around: BABYLON.Vector3): number;
    function DistancePointLine(point: BABYLON.Vector3, lineA: BABYLON.Vector3, lineB: BABYLON.Vector3): number;
    function ProjectPointOnSegmentToRef(point: BABYLON.Vector3, segA: BABYLON.Vector3, segB: BABYLON.Vector3, ref: BABYLON.Vector3): BABYLON.Vector3;
    function DistancePointSegment(point: BABYLON.Vector3, segA: BABYLON.Vector3, segB: BABYLON.Vector3): number;
    function ProjectPointOnPathToRef(point: BABYLON.Vector3, path: BABYLON.Vector3[], ref: BABYLON.Vector3, pathIsEvenlyDistributed?: boolean): BABYLON.Vector3;
    function StepToRef(from: BABYLON.Vector3, to: BABYLON.Vector3, step: number, ref: BABYLON.Vector3): BABYLON.Vector3;
    function Step(from: BABYLON.Vector3, to: BABYLON.Vector3, step: number): BABYLON.Vector3;
    function ForceDistanceFromOriginInPlace(point: BABYLON.Vector3, origin: BABYLON.Vector3, distance: number): BABYLON.Vector3;
    function QuaternionFromXYAxisToRef(x: BABYLON.Vector3, y: BABYLON.Vector3, ref: BABYLON.Quaternion): BABYLON.Quaternion;
    function QuaternionFromXZAxisToRef(x: BABYLON.Vector3, z: BABYLON.Vector3, ref: BABYLON.Quaternion): BABYLON.Quaternion;
    function QuaternionFromYZAxisToRef(y: BABYLON.Vector3, z: BABYLON.Vector3, ref: BABYLON.Quaternion): BABYLON.Quaternion;
    function QuaternionFromZXAxisToRef(z: BABYLON.Vector3, x: BABYLON.Vector3, ref: BABYLON.Quaternion): BABYLON.Quaternion;
    function QuaternionFromZYAxisToRef(z: BABYLON.Vector3, y: BABYLON.Vector3, ref: BABYLON.Quaternion): BABYLON.Quaternion;
    function CatmullRomPathInPlace(path: BABYLON.Vector3[], inDir?: BABYLON.Vector3, outDir?: BABYLON.Vector3): BABYLON.Vector3[];
    function CatmullRomClosedPathInPlace(path: BABYLON.Vector3[]): BABYLON.Vector3[];
    function DecimatePathInPlace(path: BABYLON.Vector3[], minAngle?: number): BABYLON.Vector3[];
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

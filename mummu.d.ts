/// <reference path="lib/babylon.d.ts" />
interface ISceneObject {
    getScene: () => BABYLON.Scene;
}
declare namespace Mummu {
    class AnimationFactory {
        static EmptyVoidCallback: (duration: number) => Promise<void>;
        static EmptyNumberCallback: (target: number, duration: number) => Promise<void>;
        static CreateWait(owner: ISceneObject, onUpdateCallback?: () => void): (duration: number) => Promise<void>;
        static CreateNumber(owner: ISceneObject, obj: any, property: string, onUpdateCallback?: () => void): (target: number, duration: number) => Promise<void>;
    }
}
declare namespace Mummu {
    function IsFinite(v: BABYLON.Vector3): boolean;
    function ProjectPerpendicularAtToRef(v: BABYLON.Vector3, at: BABYLON.Vector3, out: BABYLON.Vector3): BABYLON.Vector3;
    function ProjectPerpendicularAt(v: BABYLON.Vector3, at: BABYLON.Vector3): BABYLON.Vector3;
    function Angle(from: BABYLON.Vector3, to: BABYLON.Vector3): number;
    function AngleFromToAround(from: BABYLON.Vector3, to: BABYLON.Vector3, around: BABYLON.Vector3): number;
    function DistancePointLine(point: BABYLON.Vector3, lineA: BABYLON.Vector3, lineB: BABYLON.Vector3): number;
    function DistancePointSegment(point: BABYLON.Vector3, segA: BABYLON.Vector3, segB: BABYLON.Vector3): number;
    function StepToRef(from: BABYLON.Vector3, to: BABYLON.Vector3, step: number, ref: BABYLON.Vector3): BABYLON.Vector3;
    function Step(from: BABYLON.Vector3, to: BABYLON.Vector3, step: number): BABYLON.Vector3;
    function CatmullRomPathInPlace(path: BABYLON.Vector3[]): BABYLON.Vector3[];
    function CatmullRomClosedPathInPlace(path: BABYLON.Vector3[]): BABYLON.Vector3[];
}
declare namespace Mummu {
    function CloneVertexData(data: BABYLON.VertexData): BABYLON.VertexData;
    function GetVertexData(path: string): Promise<BABYLON.VertexData[]>;
    function GetColorizedVertexData(path: string, baseColorHex?: string, frameColorHex?: string, color1Hex?: string, // Replace red
    color2Hex?: string, // Replace green
    color3Hex?: string): Promise<BABYLON.VertexData>;
    function GetColorizedMultipleVertexData(path: string, baseColorHex?: string, frameColorHex?: string, color1Hex?: string, // Replace red
    color2Hex?: string, // Replace green
    color3Hex?: string): Promise<BABYLON.VertexData[]>;
}

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
    function CloneVertexData(data: BABYLON.VertexData): BABYLON.VertexData;
    function GetVertexData(path: string): Promise<BABYLON.VertexData[]>;
    function GetColorizedVertexData(path: string, baseColorHex?: string, frameColorHex?: string, color1Hex?: string, // Replace red
    color2Hex?: string, // Replace green
    color3Hex?: string): Promise<BABYLON.VertexData>;
    function GetColorizedMultipleVertexData(path: string, baseColorHex?: string, frameColorHex?: string, color1Hex?: string, // Replace red
    color2Hex?: string, // Replace green
    color3Hex?: string): Promise<BABYLON.VertexData[]>;
}

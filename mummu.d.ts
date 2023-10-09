/// <reference path="lib/babylon.d.ts" />
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

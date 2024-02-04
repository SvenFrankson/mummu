/// <reference path="../lib/babylon.d.ts"/>

namespace Mummu {

    export function DrawDebugLine(from: BABYLON.Vector3, to: BABYLON.Vector3, frames: number = Infinity, color?: BABYLON.Color3, scene?: BABYLON.Scene): BABYLON.Mesh {
        if (!scene) {
            scene = BABYLON.Engine.Instances[0]?.scenes[0];
        }

        if (scene) {
            let colors: BABYLON.Color4[];
            if (color) {
                colors = [
                    color.toColor4(),
                    color.toColor4()
                ]
            }
            
            let line = BABYLON.MeshBuilder.CreateLines(
                "debug-line",
                {
                    points: [from, to],
                    colors: colors
                }
            );
            
            if (isFinite(frames)) {
                let frameCount = frames;
                let disposeTimer = () => {
                    frameCount--;
                    if (frameCount <= 0) {
                        line.dispose();
                    }
                    else {
                        requestAnimationFrame(disposeTimer);
                    }
                }
                requestAnimationFrame(disposeTimer);
            }

            return line;
        }
    }

    export function DrawDebugPoint(points: BABYLON.Vector3, frames: number = Infinity, color?: BABYLON.Color3, scene?: BABYLON.Scene): BABYLON.Mesh {
        if (!scene) {
            scene = BABYLON.Engine.Instances[0]?.scenes[0];
        }

        if (scene) {
            let colors: BABYLON.Color4[][];
            if (color) {
                colors = [
                    [
                        color.toColor4(),
                        color.toColor4()
                    ],
                    [
                        color.toColor4(),
                        color.toColor4()
                    ],
                    [
                        color.toColor4(),
                        color.toColor4()
                    ]
                ]
            }
            
            let line = BABYLON.MeshBuilder.CreateLineSystem(
                "debug-points",
                {
                    lines: [
                        [
                            points.add(new BABYLON.Vector3(-0.1, 0, 0)),
                            points.add(new BABYLON.Vector3(0.1, 0, 0))
                        ],
                        [
                            points.add(new BABYLON.Vector3(0, -0.1, 0)),
                            points.add(new BABYLON.Vector3(0, 0.1, 0))
                        ],
                        [
                            points.add(new BABYLON.Vector3(0, 0, -0.1)),
                            points.add(new BABYLON.Vector3(0, 0, 0.1))
                        ]
                    ],
                    colors: colors
                },
                scene
            );
            
            if (isFinite(frames)) {
                let frameCount = frames;
                let disposeTimer = () => {
                    frameCount--;
                    if (frameCount <= 0) {
                        line.dispose();
                    }
                    else {
                        requestAnimationFrame(disposeTimer);
                    }
                }
                requestAnimationFrame(disposeTimer);
            }

            return line;
        }
    }

    export function DrawDebugTriangle(p1: BABYLON.Vector3, p2: BABYLON.Vector3, p3: BABYLON.Vector3, frames: number = Infinity, color?: BABYLON.Color3, scene?: BABYLON.Scene): BABYLON.Mesh {
        if (!scene) {
            scene = BABYLON.Engine.Instances[0]?.scenes[0];
        }

        if (scene) {
            let colors: BABYLON.Color4[];
            if (color) {
                colors = [
                    color.toColor4(),
                    color.toColor4(),
                    color.toColor4(),
                    color.toColor4()
                ]
            }
            
            let line = BABYLON.MeshBuilder.CreateLines(
                "debug-triangle",
                {
                    points: [p1, p2, p3, p1],
                    colors: colors
                }
            );
            
            if (isFinite(frames)) {
                let frameCount = frames;
                let disposeTimer = () => {
                    frameCount--;
                    if (frameCount <= 0) {
                        line.dispose();
                    }
                    else {
                        requestAnimationFrame(disposeTimer);
                    }
                }
                requestAnimationFrame(disposeTimer);
            }

            return line;
        }
    }
}
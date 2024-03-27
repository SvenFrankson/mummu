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

    export function DrawDebugHit(point: BABYLON.Vector3, normal: BABYLON.Vector3, frames: number = Infinity, color?: BABYLON.Color3, scene?: BABYLON.Scene): BABYLON.Mesh {
        if (!scene) {
            scene = BABYLON.Engine.Instances[0]?.scenes[0];
        }

        if (scene) {
            let colors: BABYLON.Color4[][];
            if (color) {
                colors = [
                    [
                        color.toColor4(),
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
                    ],
                    [
                        color.toColor4(),
                        color.toColor4()
                    ]
                ]
            }
            
            let f1 = BABYLON.Vector3.Cross(normal, new BABYLON.Vector3(Math.random(), Math.random(), Math.random())).normalize().scaleInPlace(0.01);
            let f2 = Mummu.Rotate(f1, normal, 2 * Math.PI / 3);
            let f3 = Mummu.Rotate(f2, normal, 2 * Math.PI / 3);
            f1.addInPlace(point);
            f2.addInPlace(point);
            f3.addInPlace(point);
            let p = point.add(normal.scale(0.1));
            let line = BABYLON.MeshBuilder.CreateLineSystem(
                "debug-points",
                {
                    lines: [
                        [f1, f2, f3],
                        [f1, p],
                        [f2, p],
                        [f3, p]
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

    export function DrawDebugPoint(points: BABYLON.Vector3, frames: number = Infinity, color?: BABYLON.Color3, size: number = 0.2, scene?: BABYLON.Scene): BABYLON.Mesh {
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
                            points.add(new BABYLON.Vector3(- size * 0.5, 0, 0)),
                            points.add(new BABYLON.Vector3( size * 0.5, 0, 0))
                        ],
                        [
                            points.add(new BABYLON.Vector3(0, - size * 0.5, 0)),
                            points.add(new BABYLON.Vector3(0,  size * 0.5, 0))
                        ],
                        [
                            points.add(new BABYLON.Vector3(0, 0, - size * 0.5)),
                            points.add(new BABYLON.Vector3(0, 0,  size * 0.5))
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
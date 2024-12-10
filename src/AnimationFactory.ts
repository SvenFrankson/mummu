/// <reference path="../../nabu/nabu.d.ts"/>

interface ISceneObject {
    getScene: () => BABYLON.Scene;
}

namespace Mummu {
    
    export class AnimationFactory {
    
        public static EmptyVoidCallback: (duration: number) => Promise<void> = async (duration: number) => {};
        public static EmptyNumberCallback: (target: number, duration: number, overrideEasing?: (v: number) => number) => Promise<void> = async (target: number, duration: number, overrideEasing?: (v: number) => number) => {};
        public static EmptyNumbersCallback: (targets: number[], duration: number) => Promise<void> = async (targets: number[], duration: number) => {};
        public static EmptyVector3Callback: (target: BABYLON.Vector3, duration: number, overrideEasing?: (v: number) => number) => Promise<void> = async (target: BABYLON.Vector3, duration: number, overrideEasing?: (v: number) => number) => {};
        public static EmptyQuaternionCallback: (target: BABYLON.Quaternion, duration: number, overrideEasing?: (v: number) => number) => Promise<void> = async (target: BABYLON.Quaternion, duration: number, overrideEasing?: (v: number) => number) => {};
    
        public static CreateWait(
            owner: ISceneObject,
            onUpdateCallback?: () => void
        ): (duration: number) => Promise<void> {
            return (duration: number) => {
                return new Promise<void>(resolve => {
                    let t0 = performance.now();
                    let animationCB = () => {
                        let t = (performance.now() - t0) / 1000;
                        let f = t / duration;
                        if (f < 1) {
                            if (onUpdateCallback) {
                                onUpdateCallback();
                            }
                        }
                        else {
                            if (onUpdateCallback) {
                                onUpdateCallback();
                            }
                            owner.getScene().onBeforeRenderObservable.removeCallback(animationCB);
                            resolve();
                        }
                    }
                    owner.getScene().onBeforeRenderObservable.add(animationCB);
                })
            }
        }
    
        public static CreateNumber(
            owner: ISceneObject,
            obj: any,
            property: string,
            onUpdateCallback?: () => void,
            isAngle?: boolean,
            easing?: (v: number) => number
        ): (target: number, duration: number, overrideEasing?: (v: number) => number) => Promise<void> {
            return (target: number, duration: number, overrideEasing?: (v: number) => number) => {
                return new Promise<void>(resolve => {
                    let origin: number = obj[property];
                    let t0 = performance.now();
                    if (owner[property + "_animation"]) {
                        owner.getScene().onBeforeRenderObservable.removeCallback(owner[property + "_animation"]);
                    }
                    let animationCB = () => {
                        let f = (performance.now() - t0) / 1000 / duration;
                        if (f < 1) {
                            if (isAngle) {
                                obj[property] = Nabu.LerpAngle(origin, target, f);
                            }
                            else {
                                if (overrideEasing) {
                                    f = overrideEasing(f);
                                }
                                else if (easing) {
                                    f = easing(f);
                                }
                                obj[property] = origin * (1 - f) + target * f;
                            }
                            if (onUpdateCallback) {
                                onUpdateCallback();
                            }
                        }
                        else {
                            obj[property] = target;
                            if (onUpdateCallback) {
                                onUpdateCallback();
                            }
                            owner.getScene().onBeforeRenderObservable.removeCallback(animationCB);
                            owner[property + "_animation"] = undefined;
                            resolve();
                        }
                    }
                    owner.getScene().onBeforeRenderObservable.add(animationCB);
                    owner[property + "_animation"] = animationCB;
                })
            }
        }

        public static CreateNumbers(
            owner: ISceneObject,
            obj: any,
            properties: string[],
            onUpdateCallback?: () => void,
            isAngle?: boolean[],
            easing?: (v: number) => number
        ): (targets: number[], duration: number) => Promise<void> {
            return (targets: number[], duration: number) => {
                return new Promise<void>(resolve => {
                    let n = properties.length;
                    let origins: number[] = [];
                    for (let i = 0; i < n; i++) {
                        origins[i] = obj[properties[i]];
                    }
                    let t0 = performance.now();
                    if (owner[properties[0] + "_animation"]) {
                        owner.getScene().onBeforeRenderObservable.removeCallback(owner[properties[0] + "_animation"]);
                    }
                    let animationCB = () => {
                        let f = (performance.now() - t0) / 1000 / duration;
                        if (f < 1) {
                            if (easing) {
                                f = easing(f);
                            }
                            for (let i = 0; i < n; i++) {
                                if (isAngle && isAngle[i]) {
                                    obj[properties[i]] = Nabu.LerpAngle(origins[i], targets[i], f);
                                }
                                else {
                                    obj[properties[i]] = origins[i] * (1 - f) + targets[i] * f;
                                }
                            }
                            if (onUpdateCallback) {
                                onUpdateCallback();
                            }
                        }
                        else {
                            for (let i = 0; i < n; i++) {
                                obj[properties[i]] = targets[i];
                            }
                            if (onUpdateCallback) {
                                onUpdateCallback();
                            }
                            owner.getScene().onBeforeRenderObservable.removeCallback(animationCB);
                            owner[properties[0] + "_animation"] = undefined;
                            resolve();
                        }
                    }
                    owner.getScene().onBeforeRenderObservable.add(animationCB);
                    owner[properties[0] + "_animation"] = animationCB;
                })
            }
        }

        public static CreateVector3(
            owner: ISceneObject,
            obj: any,
            property: string,
            onUpdateCallback?: () => void,
            easing?: (v: number) => number
        ): (target: BABYLON.Vector3, duration: number, overrideEasing?: (v: number) => number) => Promise<void> {
            return (target: BABYLON.Vector3, duration: number, overrideEasing?: (v: number) => number) => {
                return new Promise<void>(resolve => {
                    let origin: BABYLON.Vector3 = obj[property].clone();
                    let tmpVector3 = BABYLON.Vector3.Zero();
                    let t0 = performance.now();
                    if (owner[property + "_animation"]) {
                        owner.getScene().onBeforeRenderObservable.removeCallback(owner[property + "_animation"]);
                    }
                    let animationCB = () => {
                        let f = (performance.now() - t0) / 1000 / duration;
                        if (f < 1) {
                            if (overrideEasing) {
                                f = overrideEasing(f);
                            }
                            else if (easing) {
                                f = easing(f);
                            }
                            tmpVector3.copyFrom(target).scaleInPlace(f);
                            obj[property].copyFrom(origin).scaleInPlace(1 - f).addInPlace(tmpVector3);
                            if (onUpdateCallback) {
                                onUpdateCallback();
                            }
                        }
                        else {
                            obj[property].copyFrom(target);
                            if (onUpdateCallback) {
                                onUpdateCallback();
                            }
                            owner.getScene().onBeforeRenderObservable.removeCallback(animationCB);
                            owner[property + "_animation"] = undefined;
                            resolve();
                        }
                    }
                    owner.getScene().onBeforeRenderObservable.add(animationCB);
                    owner[property + "_animation"] = animationCB;
                })
            }
        }

        public static CreateQuaternion(
            owner: ISceneObject,
            obj: any,
            property: string,
            onUpdateCallback?: () => void,
            easing?: (v: number) => number
        ): (target: BABYLON.Quaternion, duration: number, overrideEasing?: (v: number) => number) => Promise<void> {
            return (target: BABYLON.Quaternion, duration: number, overrideEasing?: (v: number) => number) => {
                return new Promise<void>(resolve => {
                    let origin: BABYLON.Quaternion = obj[property].clone();
                    let t0 = performance.now();
                    if (owner[property + "_animation"]) {
                        owner.getScene().onBeforeRenderObservable.removeCallback(owner[property + "_animation"]);
                    }
                    let animationCB = () => {
                        let f = (performance.now() - t0) / 1000 / duration;
                        if (f < 1) {
                            if (overrideEasing) {
                                f = overrideEasing(f);
                            }
                            else if (easing) {
                                f = easing(f);
                            }
                            BABYLON.Quaternion.SlerpToRef(origin, target, f, obj[property]);
                            if (onUpdateCallback) {
                                onUpdateCallback();
                            }
                        }
                        else {
                            obj[property].copyFrom(target);
                            if (onUpdateCallback) {
                                onUpdateCallback();
                            }
                            owner.getScene().onBeforeRenderObservable.removeCallback(animationCB);
                            owner[property + "_animation"] = undefined;
                            resolve();
                        }
                    }
                    owner.getScene().onBeforeRenderObservable.add(animationCB);
                    owner[property + "_animation"] = animationCB;
                })
            }
        }
    }
}
interface ISceneObject {
    getScene: () => BABYLON.Scene;
}

namespace Mummu {
    
    export class AnimationFactory {
    
        public static EmptyVoidCallback: (duration: number) => Promise<void> = async (duration: number) => {};
        public static EmptyNumberCallback: (target: number, duration: number) => Promise<void> = async (target: number, duration: number) => {};
        public static EmptyNumbersCallback: (targets: number[], duration: number) => Promise<void> = async (targets: number[], duration: number) => {};
    
        public static CreateWait(
            owner: ISceneObject,
            onUpdateCallback?: () => void
        ): (duration: number) => Promise<void> {
            let scene: BABYLON.Scene;
            return (duration: number) => {
                return new Promise<void>(resolve => {
                    let t = 0;
                    let animationCB = () => {
                        t += 1 / 60;
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
            onUpdateCallback?: () => void
        ): (target: number, duration: number) => Promise<void> {
            return (target: number, duration: number) => {
                return new Promise<void>(resolve => {
                    let origin: number = obj[property];
                    let t = 0;
                    if (owner[property + "_animation"]) {
                        owner.getScene().onBeforeRenderObservable.removeCallback(owner[property + "_animation"]);
                    }
                    let animationCB = () => {
                        t += 1 / 60;
                        let f = t / duration;
                        if (f < 1) {
                            obj[property] = origin * (1 - f) + target * f;
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
            onUpdateCallback?: () => void
        ): (targets: number[], duration: number) => Promise<void> {
            return (targets: number[], duration: number) => {
                return new Promise<void>(resolve => {
                    let n = properties.length;
                    let origins: number[] = [];
                    for (let i = 0; i < n; i++) {
                        origins[i] = obj[properties[i]];
                    }
                    let t = 0;
                    if (owner[properties[0] + "_animation"]) {
                        owner.getScene().onBeforeRenderObservable.removeCallback(owner[properties[0] + "_animation"]);
                    }
                    let animationCB = () => {
                        t += 1 / 60;
                        let f = t / duration;
                        if (f < 1) {
                            for (let i = 0; i < n; i++) {
                                obj[properties[i]] = origins[i] * (1 - f) + targets[i] * f;
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
    }
}
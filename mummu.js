var Mummu;
(function (Mummu) {
    class AnimationFactory {
        static CreateWait(owner, onUpdateCallback) {
            let scene;
            return (duration) => {
                return new Promise(resolve => {
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
                    };
                    owner.getScene().onBeforeRenderObservable.add(animationCB);
                });
            };
        }
        static CreateNumber(owner, obj, property, onUpdateCallback) {
            return (target, duration) => {
                return new Promise(resolve => {
                    let origin = obj[property];
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
                    };
                    owner.getScene().onBeforeRenderObservable.add(animationCB);
                    owner[property + "_animation"] = animationCB;
                });
            };
        }
        static CreateNumbers(owner, obj, properties, onUpdateCallback) {
            return (targets, duration) => {
                return new Promise(resolve => {
                    let n = properties.length;
                    let origins = [];
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
                    };
                    owner.getScene().onBeforeRenderObservable.add(animationCB);
                    owner[properties[0] + "_animation"] = animationCB;
                });
            };
        }
    }
    AnimationFactory.EmptyVoidCallback = async (duration) => { };
    AnimationFactory.EmptyNumberCallback = async (target, duration) => { };
    AnimationFactory.EmptyNumbersCallback = async (targets, duration) => { };
    Mummu.AnimationFactory = AnimationFactory;
})(Mummu || (Mummu = {}));
var Mummu;
(function (Mummu) {
    class Intersection {
        constructor() {
            this.hit = false;
            this.depth = 0;
        }
    }
    function SphereCapsuleIntersection(cSphere, rSphere, c1Capsule, c2Capsule, rCapsule) {
        let intersection = new Intersection();
        let dist = Mummu.DistancePointSegment(cSphere, c1Capsule, c2Capsule);
        let depth = (rSphere + rCapsule) - dist;
        if (depth > 0) {
            intersection.hit = true;
            intersection.depth = depth;
            let proj = BABYLON.Vector3.Zero();
            Mummu.ProjectPointOnSegmentToRef(cSphere, c1Capsule, c2Capsule, proj);
            let dir = cSphere.subtract(proj).normalize();
            intersection.point = dir.scale(rCapsule);
            intersection.point.addInPlace(proj);
            intersection.normal = dir;
        }
        return intersection;
    }
    Mummu.SphereCapsuleIntersection = SphereCapsuleIntersection;
    function SphereWireIntersection(cSphere, rSphere, path, rWire) {
        let intersection = new Intersection();
        let proj = BABYLON.Vector3.Zero();
        Mummu.ProjectPointOnPathToRef(cSphere, path, proj);
        let dist = BABYLON.Vector3.Distance(cSphere, proj);
        let depth = (rSphere + rWire) - dist;
        if (depth > 0) {
            intersection.hit = true;
            intersection.depth = depth;
            let dir = cSphere.subtract(proj).normalize();
            intersection.point = dir.scale(rWire);
            intersection.point.addInPlace(proj);
            intersection.normal = dir;
        }
        return intersection;
    }
    Mummu.SphereWireIntersection = SphereWireIntersection;
})(Mummu || (Mummu = {}));
/// <reference path="../lib/babylon.d.ts"/>
var Mummu;
(function (Mummu) {
    var TmpVec3 = [
        BABYLON.Vector3.Zero(),
        BABYLON.Vector3.Zero(),
        BABYLON.Vector3.Zero(),
        BABYLON.Vector3.Zero()
    ];
    var TmpQuat = [
        BABYLON.Quaternion.Identity()
    ];
    function IsFinite(v) {
        return isFinite(v.x) && isFinite(v.y) && isFinite(v.z);
    }
    Mummu.IsFinite = IsFinite;
    function ProjectPerpendicularAtToRef(v, at, out) {
        let k = (v.x * at.x + v.y * at.y + v.z * at.z);
        k = k / (at.x * at.x + at.y * at.y + at.z * at.z);
        out.copyFrom(v);
        out.subtractInPlace(at.multiplyByFloats(k, k, k));
        return out;
    }
    Mummu.ProjectPerpendicularAtToRef = ProjectPerpendicularAtToRef;
    function ProjectPerpendicularAt(v, at) {
        let p = BABYLON.Vector3.Zero();
        ProjectPerpendicularAtToRef(v, at, p);
        return p;
    }
    Mummu.ProjectPerpendicularAt = ProjectPerpendicularAt;
    function Rotate(v, axis, angle) {
        let rotatedV = BABYLON.Vector3.Zero();
        return RotateToRef(v, axis, angle, rotatedV);
    }
    Mummu.Rotate = Rotate;
    function RotateToRef(v, axis, angle, ref) {
        BABYLON.Quaternion.RotationAxisToRef(axis, angle, TmpQuat[0]);
        return v.rotateByQuaternionToRef(TmpQuat[0], ref);
    }
    Mummu.RotateToRef = RotateToRef;
    function RotateInPlace(v, axis, angle) {
        return RotateToRef(v, axis, angle, v);
    }
    Mummu.RotateInPlace = RotateInPlace;
    function Angle(from, to) {
        let pFrom = TmpVec3[0].copyFrom(from).normalize();
        let pTo = TmpVec3[1].copyFrom(from).normalize();
        let angle = Math.acos(BABYLON.Vector3.Dot(pFrom, pTo));
        return angle;
    }
    Mummu.Angle = Angle;
    function AngleFromToAround(from, to, around) {
        let pFrom = TmpVec3[0];
        let pTo = TmpVec3[1];
        ProjectPerpendicularAtToRef(from, around, pFrom).normalize();
        ProjectPerpendicularAtToRef(to, around, pTo).normalize();
        let dot = BABYLON.Vector3.Dot(pFrom, pTo);
        dot = Math.min(Math.max(dot, -1), 1);
        let angle = Math.acos(dot);
        if (angle > Math.PI / 360 / 60) {
            BABYLON.Vector3.CrossToRef(pFrom, pTo, TmpVec3[2]);
            if (BABYLON.Vector3.Dot(TmpVec3[2], around) < 0) {
                angle = -angle;
            }
        }
        return angle;
    }
    Mummu.AngleFromToAround = AngleFromToAround;
    function DistancePointLine(point, lineA, lineB) {
        let PA = TmpVec3[0];
        let dir = TmpVec3[1];
        let cross = TmpVec3[2];
        PA.copyFrom(lineA).subtractInPlace(point);
        dir.copyFrom(lineB).subtractInPlace(lineA).normalize();
        BABYLON.Vector3.CrossToRef(PA, dir, cross);
        return cross.length();
    }
    Mummu.DistancePointLine = DistancePointLine;
    function ProjectPointOnSegmentToRef(point, segA, segB, ref) {
        let AP = TmpVec3[0];
        let dir = TmpVec3[1];
        AP.copyFrom(point).subtractInPlace(segA);
        dir.copyFrom(segB).subtractInPlace(segA);
        let l = dir.length();
        dir.scaleInPlace(1 / l);
        let dist = BABYLON.Vector3.Dot(AP, dir);
        dist = Math.max(Math.min(dist, l), 0);
        ref.copyFrom(dir).scaleInPlace(dist).addInPlace(segA);
        return ref;
    }
    Mummu.ProjectPointOnSegmentToRef = ProjectPointOnSegmentToRef;
    function DistancePointSegment(point, segA, segB) {
        let AP = TmpVec3[0];
        let dir = TmpVec3[1];
        let projP = TmpVec3[2];
        AP.copyFrom(point).subtractInPlace(segA);
        dir.copyFrom(segB).subtractInPlace(segA);
        let l = dir.length();
        dir.scaleInPlace(1 / l);
        let dist = BABYLON.Vector3.Dot(AP, dir);
        dist = Math.max(Math.min(dist, l), 0);
        projP.copyFrom(dir).scaleInPlace(dist).addInPlace(segA);
        let PprojP = projP.subtractInPlace(point);
        return PprojP.length();
    }
    Mummu.DistancePointSegment = DistancePointSegment;
    function ProjectPointOnPathToRef(point, path, ref) {
        let proj = TmpVec3[3];
        let bestSqrDist = Infinity;
        for (let i = 0; i < path.length - 1; i++) {
            ProjectPointOnSegmentToRef(point, path[i], path[i + 1], proj);
            let sqrDist = BABYLON.Vector3.DistanceSquared(point, proj);
            if (sqrDist < bestSqrDist) {
                ref.copyFrom(proj);
                bestSqrDist = sqrDist;
            }
        }
        return ref;
    }
    Mummu.ProjectPointOnPathToRef = ProjectPointOnPathToRef;
    function StepToRef(from, to, step, ref) {
        from = TmpVec3[0].copyFrom(from);
        let sqrStep = step * step;
        if (BABYLON.Vector3.DistanceSquared(from, to) < sqrStep) {
            ref.copyFrom(to);
        }
        else {
            ref.copyFrom(to).subtractInPlace(from).normalize().scaleInPlace(step).addInPlace(from);
        }
        return ref;
    }
    Mummu.StepToRef = StepToRef;
    function Step(from, to, step) {
        let v = BABYLON.Vector3.Zero();
        StepToRef(from, to, step, v);
        return v;
    }
    Mummu.Step = Step;
    function ForceDistanceFromOriginInPlace(point, origin, distance) {
        TmpVec3[0].copyFrom(point).subtractInPlace(origin).normalize().scaleInPlace(distance);
        point.copyFrom(origin).addInPlace(TmpVec3[0]);
        return point;
    }
    Mummu.ForceDistanceFromOriginInPlace = ForceDistanceFromOriginInPlace;
    function QuaternionFromXYAxisToRef(x, y, ref) {
        let xAxis = TmpVec3[0].copyFrom(x);
        let yAxis = TmpVec3[1].copyFrom(y);
        let zAxis = TmpVec3[2];
        BABYLON.Vector3.CrossToRef(xAxis, yAxis, zAxis);
        BABYLON.Vector3.CrossToRef(zAxis, xAxis, yAxis);
        BABYLON.Quaternion.RotationQuaternionFromAxisToRef(xAxis, yAxis, zAxis, ref);
        return ref;
    }
    Mummu.QuaternionFromXYAxisToRef = QuaternionFromXYAxisToRef;
    function QuaternionFromXZAxisToRef(x, z, ref) {
        let xAxis = TmpVec3[0].copyFrom(x);
        let yAxis = TmpVec3[1];
        let zAxis = TmpVec3[2].copyFrom(z);
        BABYLON.Vector3.CrossToRef(zAxis, xAxis, yAxis);
        BABYLON.Vector3.CrossToRef(xAxis, yAxis, zAxis);
        BABYLON.Quaternion.RotationQuaternionFromAxisToRef(xAxis, yAxis, zAxis, ref);
        return ref;
    }
    Mummu.QuaternionFromXZAxisToRef = QuaternionFromXZAxisToRef;
    function QuaternionFromYZAxisToRef(y, z, ref) {
        let xAxis = TmpVec3[0];
        let yAxis = TmpVec3[1].copyFrom(y);
        let zAxis = TmpVec3[2].copyFrom(z);
        BABYLON.Vector3.CrossToRef(yAxis, zAxis, xAxis);
        BABYLON.Vector3.CrossToRef(xAxis, yAxis, zAxis);
        BABYLON.Quaternion.RotationQuaternionFromAxisToRef(xAxis, yAxis, zAxis, ref);
        return ref;
    }
    Mummu.QuaternionFromYZAxisToRef = QuaternionFromYZAxisToRef;
    function QuaternionFromZXAxisToRef(z, x, ref) {
        let xAxis = TmpVec3[0].copyFrom(x);
        let yAxis = TmpVec3[1];
        let zAxis = TmpVec3[2].copyFrom(z);
        BABYLON.Vector3.CrossToRef(zAxis, xAxis, yAxis);
        BABYLON.Vector3.CrossToRef(yAxis, zAxis, xAxis);
        BABYLON.Quaternion.RotationQuaternionFromAxisToRef(xAxis, yAxis, zAxis, ref);
        return ref;
    }
    Mummu.QuaternionFromZXAxisToRef = QuaternionFromZXAxisToRef;
    function QuaternionFromZYAxisToRef(z, y, ref) {
        let xAxis = TmpVec3[0];
        let yAxis = TmpVec3[1].copyFrom(y);
        let zAxis = TmpVec3[2].copyFrom(z);
        BABYLON.Vector3.CrossToRef(yAxis, zAxis, xAxis);
        BABYLON.Vector3.CrossToRef(zAxis, xAxis, yAxis);
        BABYLON.Quaternion.RotationQuaternionFromAxisToRef(xAxis, yAxis, zAxis, ref);
        return ref;
    }
    Mummu.QuaternionFromZYAxisToRef = QuaternionFromZYAxisToRef;
    function CatmullRomPathInPlace(path, inDir, outDir) {
        if (path.length >= 2) {
            let pFirst = TmpVec3[0];
            if (inDir) {
                pFirst.copyFrom(inDir).scaleInPlace(BABYLON.Vector3.Distance(path[0], path[1])).scaleInPlace(-1).addInPlace(path[0]);
            }
            else {
                pFirst.copyFrom(path[0]).subtractInPlace(path[1]);
                pFirst.addInPlace(path[0]);
            }
            let pLast = TmpVec3[1];
            if (outDir) {
                pLast.copyFrom(outDir).scaleInPlace(BABYLON.Vector3.Distance(path[path.length - 2], path[path.length - 1])).addInPlace(path[path.length - 1]);
            }
            else {
                pLast.copyFrom(path[path.length - 1]).subtractInPlace(path[path.length - 2]);
                pLast.addInPlace(path[path.length - 1]);
            }
            let interpolatedPoints = [];
            for (let i = 0; i < path.length - 1; i++) {
                let p0 = i > 0 ? path[i - 1] : pFirst;
                let p1 = path[i];
                let p2 = path[i + 1];
                let p3 = i < path.length - 2 ? path[i + 2] : pLast;
                interpolatedPoints.push(BABYLON.Vector3.CatmullRom(p0, p1, p2, p3, 0.5));
            }
            for (let i = 0; i < interpolatedPoints.length; i++) {
                path.splice(2 * i + 1, 0, interpolatedPoints[i]);
            }
            return path;
        }
    }
    Mummu.CatmullRomPathInPlace = CatmullRomPathInPlace;
    function CatmullRomClosedPathInPlace(path) {
        let interpolatedPoints = [];
        for (let i = 0; i < path.length; i++) {
            let p0 = path[(i - 1 + path.length) % path.length];
            let p1 = path[i];
            let p2 = path[(i + 1) % path.length];
            let p3 = path[(i + 2) % path.length];
            interpolatedPoints.push(BABYLON.Vector3.CatmullRom(p0, p1, p2, p3, 0.5));
        }
        for (let i = 0; i < interpolatedPoints.length; i++) {
            path.splice(2 * i + 1, 0, interpolatedPoints[i]);
        }
        return path;
    }
    Mummu.CatmullRomClosedPathInPlace = CatmullRomClosedPathInPlace;
})(Mummu || (Mummu = {}));
/// <reference path="../lib/babylon.d.ts"/>
var Mummu;
(function (Mummu) {
    class VertexDataLoader {
        constructor(scene) {
            this.scene = scene;
            this._vertexDatas = new Map();
            VertexDataLoader.instance = this;
        }
        static clone(data) {
            let clonedData = new BABYLON.VertexData();
            clonedData.positions = [...data.positions];
            clonedData.indices = [...data.indices];
            clonedData.normals = [...data.normals];
            if (data.matricesIndices) {
                clonedData.matricesIndices = [...data.matricesIndices];
            }
            if (data.matricesWeights) {
                clonedData.matricesWeights = [...data.matricesWeights];
            }
            if (data.uvs) {
                clonedData.uvs = [...data.uvs];
            }
            if (data.colors) {
                clonedData.colors = [...data.colors];
            }
            return clonedData;
        }
        async get(url, scene) {
            if (this._vertexDatas.get(url)) {
                return this._vertexDatas.get(url);
            }
            let vertexData = undefined;
            let loadedFile = await BABYLON.SceneLoader.ImportMeshAsync("", url, "", scene);
            let vertexDatas = [];
            let loadedFileMeshes = loadedFile.meshes.sort((m1, m2) => {
                if (m1.name < m2.name) {
                    return -1;
                }
                else if (m1.name > m2.name) {
                    return 1;
                }
                return 0;
            });
            for (let i = 0; i < loadedFileMeshes.length; i++) {
                let loadedMesh = loadedFileMeshes[i];
                if (loadedMesh instanceof BABYLON.Mesh) {
                    vertexData = BABYLON.VertexData.ExtractFromMesh(loadedMesh);
                    let colors = [];
                    if (loadedMesh.material) {
                        if (loadedMesh.material instanceof BABYLON.PBRMaterial) {
                            let color = loadedMesh.material.albedoColor;
                            for (let k = 0; k < vertexData.positions.length / 3; k++) {
                                let index = k;
                                colors[4 * index] = color.r;
                                colors[4 * index + 1] = color.g;
                                colors[4 * index + 2] = color.b;
                                colors[4 * index + 3] = 1;
                            }
                        }
                        else if (loadedMesh.material instanceof BABYLON.MultiMaterial) {
                            for (let j = 0; j < loadedMesh.material.subMaterials.length; j++) {
                                let subMaterial = loadedMesh.material.subMaterials[j];
                                if (subMaterial instanceof BABYLON.PBRMaterial) {
                                    let color = subMaterial.albedoColor;
                                    let subMesh = loadedMesh.subMeshes.find(sm => { return sm.materialIndex === j; });
                                    for (let k = 0; k < subMesh.verticesCount; k++) {
                                        let index = subMesh.verticesStart + k;
                                        colors[4 * index] = color.r;
                                        colors[4 * index + 1] = color.g;
                                        colors[4 * index + 2] = color.b;
                                        colors[4 * index + 3] = 1;
                                    }
                                }
                            }
                        }
                    }
                    if (colors.length === 0) {
                        for (let i = 0; i < vertexData.positions.length / 3; i++) {
                            colors.push(1, 1, 1, 1);
                        }
                    }
                    vertexData.colors = colors;
                    vertexDatas.push(vertexData);
                }
            }
            this._vertexDatas.set(url, vertexDatas);
            loadedFileMeshes.forEach(m => { m.dispose(); });
            loadedFile.skeletons.forEach(s => { s.dispose(); });
            return vertexDatas;
        }
        async getColorized(url, baseColorHex = "#FFFFFF", frameColorHex = "", color1Hex = "", // Replace red
        color2Hex = "", // Replace green
        color3Hex = "" // Replace blue
        ) {
            let vertexDatas = await this.getColorizedMultiple(url, baseColorHex, frameColorHex, color1Hex, color2Hex, color3Hex);
            return vertexDatas[0];
        }
        async getColorizedMultiple(url, baseColorHex = "#FFFFFF", frameColorHex = "", color1Hex = "", // Replace red
        color2Hex = "", // Replace green
        color3Hex = "" // Replace blue
        ) {
            let baseColor;
            if (baseColorHex !== "") {
                baseColor = BABYLON.Color3.FromHexString(baseColorHex);
            }
            let frameColor;
            if (frameColorHex !== "") {
                frameColor = BABYLON.Color3.FromHexString(frameColorHex);
            }
            let color1;
            if (color1Hex !== "") {
                color1 = BABYLON.Color3.FromHexString(color1Hex);
            }
            let color2;
            if (color2Hex !== "") {
                color2 = BABYLON.Color3.FromHexString(color2Hex);
            }
            let color3;
            if (color3Hex !== "") {
                color3 = BABYLON.Color3.FromHexString(color3Hex);
            }
            let vertexDatas = await VertexDataLoader.instance.get(url);
            let colorizedVertexDatas = [];
            for (let d = 0; d < vertexDatas.length; d++) {
                let vertexData = vertexDatas[d];
                let colorizedVertexData = VertexDataLoader.clone(vertexData);
                if (colorizedVertexData.colors) {
                    for (let i = 0; i < colorizedVertexData.colors.length / 4; i++) {
                        let r = colorizedVertexData.colors[4 * i];
                        let g = colorizedVertexData.colors[4 * i + 1];
                        let b = colorizedVertexData.colors[4 * i + 2];
                        if (baseColor) {
                            if (r === 1 && g === 1 && b === 1) {
                                colorizedVertexData.colors[4 * i] = baseColor.r;
                                colorizedVertexData.colors[4 * i + 1] = baseColor.g;
                                colorizedVertexData.colors[4 * i + 2] = baseColor.b;
                                continue;
                            }
                        }
                        if (frameColor) {
                            if (r === 0.502 && g === 0.502 && b === 0.502) {
                                colorizedVertexData.colors[4 * i] = frameColor.r;
                                colorizedVertexData.colors[4 * i + 1] = frameColor.g;
                                colorizedVertexData.colors[4 * i + 2] = frameColor.b;
                                continue;
                            }
                        }
                        if (color1) {
                            if (r === 1 && g === 0 && b === 0) {
                                colorizedVertexData.colors[4 * i] = color1.r;
                                colorizedVertexData.colors[4 * i + 1] = color1.g;
                                colorizedVertexData.colors[4 * i + 2] = color1.b;
                                continue;
                            }
                        }
                        if (color2) {
                            if (r === 0 && g === 1 && b === 0) {
                                colorizedVertexData.colors[4 * i] = color2.r;
                                colorizedVertexData.colors[4 * i + 1] = color2.g;
                                colorizedVertexData.colors[4 * i + 2] = color2.b;
                                continue;
                            }
                        }
                        if (color3) {
                            if (r === 0 && g === 0 && b === 1) {
                                colorizedVertexData.colors[4 * i] = color3.r;
                                colorizedVertexData.colors[4 * i + 1] = color3.g;
                                colorizedVertexData.colors[4 * i + 2] = color3.b;
                                continue;
                            }
                        }
                    }
                }
                else {
                    let colors = [];
                    for (let i = 0; i < colorizedVertexData.positions.length / 3; i++) {
                        colors[4 * i] = baseColor.r;
                        colors[4 * i + 1] = baseColor.g;
                        colors[4 * i + 2] = baseColor.b;
                        colors[4 * i + 3] = 1;
                    }
                    colorizedVertexData.colors = colors;
                }
                colorizedVertexDatas.push(colorizedVertexData);
            }
            return colorizedVertexDatas;
        }
    }
    Mummu.VertexDataLoader = VertexDataLoader;
})(Mummu || (Mummu = {}));

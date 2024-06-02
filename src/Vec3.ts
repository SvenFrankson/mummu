/// <reference path="../lib/babylon.d.ts"/>

namespace Mummu {
    
    var TmpVec3 = [
        BABYLON.Vector3.Zero(),
        BABYLON.Vector3.Zero(),
        BABYLON.Vector3.Zero(),
        BABYLON.Vector3.Zero(),
        BABYLON.Vector3.Zero()
    ];

    var TmpQuat = [
        BABYLON.Quaternion.Identity()
    ];

    export function IsFinite(v: BABYLON.Vector3): boolean {
        return v && isFinite(v.x) && isFinite(v.y) && isFinite(v.z);
    }

    export function Barycentric(point: BABYLON.Vector3, p1: BABYLON.Vector3, p2: BABYLON.Vector3, p3: BABYLON.Vector3): Nabu.UVW {
        let v0 = p2.subtract(p1);
        let v1 = p3.subtract(p1);
        let v2 = point.subtract(p1);

        let d00 = BABYLON.Vector3.Dot(v0, v0);
        let d01 = BABYLON.Vector3.Dot(v0, v1);
        let d11 = BABYLON.Vector3.Dot(v1, v1);
        let d20 = BABYLON.Vector3.Dot(v2, v0);
        let d21 = BABYLON.Vector3.Dot(v2, v1);

        let d = d00 * d11 - d01 * d01;
        let v = (d11 * d20 - d01 * d21) / d;
        let w = (d00 * d21 - d01 * d20) / d;
        let u = 1 - v - w;

        return {
            u: u,
            v: v,
            w: w
        };
    }

    export function ProjectPerpendicularAtToRef(v: BABYLON.Vector3, at: BABYLON.Vector3, out: BABYLON.Vector3): BABYLON.Vector3 {
        let k: number = (v.x * at.x + v.y * at.y + v.z * at.z);
        k = k / (at.x * at.x + at.y * at.y + at.z * at.z);
        out.copyFrom(v);
        out.subtractInPlace(at.multiplyByFloats(k, k, k));
        return out;
    }

    export function ProjectPerpendicularAt(v: BABYLON.Vector3, at: BABYLON.Vector3): BABYLON.Vector3 {
        let p = BABYLON.Vector3.Zero();
        ProjectPerpendicularAtToRef(v, at, p);
        return p;
    }

    export function Rotate(v: BABYLON.Vector3, axis: BABYLON.Vector3, angle: number): BABYLON.Vector3 {
        let rotatedV = BABYLON.Vector3.Zero();
        return RotateToRef(v, axis, angle, rotatedV);
    }

    export function RotateToRef(v: BABYLON.Vector3, axis: BABYLON.Vector3, angle: number, ref: BABYLON.Vector3): BABYLON.Vector3 {
        BABYLON.Quaternion.RotationAxisToRef(axis, angle, TmpQuat[0]);
        return v.rotateByQuaternionToRef(TmpQuat[0], ref);
    }

    export function RotateInPlace(v: BABYLON.Vector3, axis: BABYLON.Vector3, angle: number): BABYLON.Vector3 {
        return RotateToRef(v, axis, angle, v);
    }

    export function Angle(from: BABYLON.Vector3, to: BABYLON.Vector3): number {
        let pFrom = TmpVec3[0].copyFrom(from).normalize();
        let pTo = TmpVec3[1].copyFrom(to).normalize();
        let angle: number = Math.acos(BABYLON.Vector3.Dot(pFrom, pTo));
        return angle;
    }

    export function AngleFromToAround(from: BABYLON.Vector3, to: BABYLON.Vector3, around: BABYLON.Vector3): number {
        let pFrom = TmpVec3[0];
        let pTo = TmpVec3[1];
        ProjectPerpendicularAtToRef(from, around, pFrom).normalize();
        ProjectPerpendicularAtToRef(to, around, pTo).normalize();
        let dot = BABYLON.Vector3.Dot(pFrom, pTo);
        dot = Math.min(Math.max(dot, -1), 1);
        let angle: number = Math.acos(dot);
        if (angle > Math.PI / 360 / 60) {
            BABYLON.Vector3.CrossToRef(pFrom, pTo, TmpVec3[2]);
            if (BABYLON.Vector3.Dot(TmpVec3[2], around) < 0) {
                angle = -angle;
            }
        }
        return angle;
    }

    export function ProjectPointOnPlaneToRef(point: BABYLON.Vector3, pPlane: BABYLON.Vector3, nPlane: BABYLON.Vector3, ref: BABYLON.Vector3): BABYLON.Vector3 {
        ref.copyFrom(point).subtractInPlace(pPlane);
        let dot = BABYLON.Vector3.Dot(ref, nPlane);
        ref.copyFrom(nPlane).scaleInPlace(- dot);
        ref.addInPlace(point);
        return ref;
    }

    export function ProjectPointOnPlane(point: BABYLON.Vector3, pPlane: BABYLON.Vector3, nPlane: BABYLON.Vector3): BABYLON.Vector3 {
        let proj = BABYLON.Vector3.Zero();
        ProjectPointOnPlaneToRef(point, pPlane, nPlane, proj);
        return proj;
    }

    export function DistancePointRay(point: BABYLON.Vector3, ray: BABYLON.Ray): number {
        let PA = TmpVec3[0];
        let dir = TmpVec3[1];
        let cross = TmpVec3[2];
        PA.copyFrom(ray.origin).subtractInPlace(point);
        dir.copyFrom(ray.direction).normalize();
        BABYLON.Vector3.CrossToRef(PA, dir, cross);
        return cross.length();
    }

    export function DistancePointLine(point: BABYLON.Vector3, lineA: BABYLON.Vector3, lineB: BABYLON.Vector3): number {
        let PA = TmpVec3[0];
        let dir = TmpVec3[1];
        let cross = TmpVec3[2];
        PA.copyFrom(lineA).subtractInPlace(point);
        dir.copyFrom(lineB).subtractInPlace(lineA).normalize();
        BABYLON.Vector3.CrossToRef(PA, dir, cross);
        return cross.length();
    }

    export function ProjectPointOnLineToRef(point: BABYLON.Vector3, lineA: BABYLON.Vector3, lineB: BABYLON.Vector3, ref: BABYLON.Vector3): BABYLON.Vector3 {
        let AP = TmpVec3[0];
        let dir = TmpVec3[1];
        AP.copyFrom(point).subtractInPlace(lineA);
        dir.copyFrom(lineB).subtractInPlace(lineA);
        let l = dir.length();
        dir.scaleInPlace(1 / l);
        let dist = BABYLON.Vector3.Dot(AP, dir);
        ref.copyFrom(dir).scaleInPlace(dist).addInPlace(lineA);
        return ref;
    }

    export function ProjectPointOnLine(point: BABYLON.Vector3, lineA: BABYLON.Vector3, lineB: BABYLON.Vector3): BABYLON.Vector3 {
        let proj = BABYLON.Vector3.Zero();
        ProjectPointOnLineToRef(point, lineA, lineB, proj);
        return proj;
    }

    export function ProjectPointOnSegmentToRef(point: BABYLON.Vector3, segA: BABYLON.Vector3, segB: BABYLON.Vector3, ref: BABYLON.Vector3): BABYLON.Vector3 {
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

    export function ProjectPointOnSegment(point: BABYLON.Vector3, segA: BABYLON.Vector3, segB: BABYLON.Vector3): BABYLON.Vector3 {
        let proj = BABYLON.Vector3.Zero();
        ProjectPointOnSegmentToRef(point, segA, segB, proj);
        return proj;
    }

    export function DistancePointSegment(point: BABYLON.Vector3, segA: BABYLON.Vector3, segB: BABYLON.Vector3): number {
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

    export interface IPathProjection {
        point: BABYLON.Vector3,
        index: number;
    }
    export function ProjectPointOnPathToRef(point: BABYLON.Vector3, path: BABYLON.Vector3[], ref: IPathProjection, pathIsEvenlyDistributed?: boolean, nearBestIndex: number = - 1, nearBestSearchRange: number = 32): IPathProjection {
        let proj = TmpVec3[3];

        if (pathIsEvenlyDistributed && path.length >= 4) {
            let bestIndex = - 1;
            let bestSqrDist = Infinity;
            let start: number;
            let end: number;
            if (nearBestIndex >= 0) {
                start = Nabu.MinMax(nearBestIndex - nearBestSearchRange, 0, path.length);
                end = Nabu.MinMax(nearBestIndex + nearBestSearchRange, 0, path.length);
            }
            else {
                start = 0;
                end = path.length;
            }
            for (let i = start; i < end; i++) {
                let sqrDist = BABYLON.Vector3.DistanceSquared(point, path[i]);
                if (sqrDist < bestSqrDist) {
                    bestIndex = i;
                    bestSqrDist = sqrDist;
                }
            }
            
            let iFirst = Math.max(0, bestIndex - 1);
            let iLast = Math.min(path.length - 1, bestIndex + 1);
            bestSqrDist = Infinity;
            for (let i = iFirst; i < iLast; i++) {
                ProjectPointOnSegmentToRef(point, path[i], path[i + 1], proj);
                let sqrDist = BABYLON.Vector3.DistanceSquared(point, proj);
                if (sqrDist < bestSqrDist) {
                    ref.point.copyFrom(proj);
                    ref.index = i;
                    bestSqrDist = sqrDist;
                }
            }
        }
        else {
            let bestSqrDist = Infinity;
            for (let i = 0; i < path.length - 1; i++) {
                ProjectPointOnSegmentToRef(point, path[i], path[i + 1], proj);
                let sqrDist = BABYLON.Vector3.DistanceSquared(point, proj);
                if (sqrDist < bestSqrDist) {
                    ref.point.copyFrom(proj);
                    ref.index = i;
                    bestSqrDist = sqrDist;
                }
            }
        }

        return ref;
    }

    export function StepToRef(from: BABYLON.Vector3, to: BABYLON.Vector3, step: number, ref: BABYLON.Vector3): BABYLON.Vector3 {
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

    export function Step(from: BABYLON.Vector3, to: BABYLON.Vector3, step: number): BABYLON.Vector3 {
        let v = BABYLON.Vector3.Zero();
        StepToRef(from, to, step, v);
        return v;
    }

    export function ForceDistanceFromOriginInPlace(point: BABYLON.Vector3, origin: BABYLON.Vector3, distance: number): BABYLON.Vector3 {
        TmpVec3[0].copyFrom(point).subtractInPlace(origin).normalize().scaleInPlace(distance);
        point.copyFrom(origin).addInPlace(TmpVec3[0]);
        return point;
    }

    export function CatmullRomPathInPlace(path: BABYLON.Vector3[], inDir?: BABYLON.Vector3, outDir?: BABYLON.Vector3): BABYLON.Vector3[] {
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
    
            let interpolatedPoints: BABYLON.Vector3[] = [];
            for (let i: number = 0; i < path.length - 1; i++) {
                let p0 = i > 0 ? path[i - 1] : pFirst;
                let p1 = path[i];
                let p2 = path[i + 1];
                let p3 = i < path.length - 2 ? path[i + 2] : pLast;
                interpolatedPoints.push(BABYLON.Vector3.CatmullRom(p0, p1, p2, p3, 0.5));
            }
            for (let i: number = 0; i < interpolatedPoints.length; i++) {
                path.splice(2 * i + 1, 0, interpolatedPoints[i]);
            }
            return path;
        }
    }

    export function CatmullRomClosedPathInPlace(path: BABYLON.Vector3[]): BABYLON.Vector3[] {
        let interpolatedPoints: BABYLON.Vector3[] = [];
        for (let i: number = 0; i < path.length; i++) {
            let p0 = path[(i - 1 + path.length) % path.length];
            let p1 = path[i];
            let p2 = path[(i + 1) % path.length];
            let p3 = path[(i + 2) % path.length];
            interpolatedPoints.push(BABYLON.Vector3.CatmullRom(p0, p1, p2, p3, 0.5));
        }
        for (let i: number = 0; i < interpolatedPoints.length; i++) {
            path.splice(2 * i + 1, 0, interpolatedPoints[i]);
        }
        return path;
    }

    export function DecimatePathInPlace(path: BABYLON.Vector3[], minAngle: number = 1 / 180 * Math.PI): BABYLON.Vector3[] {
        let done = false;
        while (!done) {
            let flatestAngle = Infinity;
            let flatestIndex = - 1;
            let dirPrev = BABYLON.Vector3.Forward();
            let dirNext = path[1].subtract(path[0]).normalize();
            for (let i = 1; i < path.length - 1; i++) {
                dirPrev.copyFrom(dirNext);
                dirNext.copyFrom(path[i + 1]).subtractInPlace(path[i]).normalize();
                let angle = Angle(dirPrev, dirNext);
                if (angle < minAngle && angle < flatestAngle) {
                    flatestAngle = angle;
                    flatestIndex = i;
                }
            }
            if (flatestIndex != -1) {
                path.splice(flatestIndex, 1);
            }
            else {
                done = true;
            }
        }
        return path;
    }

    export function RemoveFromStartForDistanceInPlace(path: BABYLON.Vector3[], distance: number, outRemovedPart?: BABYLON.Vector3[]): BABYLON.Vector3[] {
        if (!outRemovedPart) {
            outRemovedPart = [];
        }
        let distanceLeft = distance;
        while (distanceLeft > 0 && path.length >= 2) {
            let pA = path[0];
            let pB = path[1];

            let d = BABYLON.Vector3.Distance(pA, pB)
            if (d <= distanceLeft) {
                console.log("! " + d.toFixed(4));
                outRemovedPart.push(path[0]);
                path.splice(0, 1);
                distanceLeft -= d;
            }
            else if (d > distanceLeft) {
                console.log("?");
                let newPoint = pB.subtract(pA).normalize().scaleInPlace(distanceLeft).addInPlace(pA);
                outRemovedPart.push(path[0]);
                outRemovedPart.push(newPoint);
                path[0] = newPoint;
                distanceLeft = 0;
            }
        }
        
        return path;
    }

    export function RemoveFromEndForDistanceInPlace(path: BABYLON.Vector3[], distance: number, outRemovedPart?: BABYLON.Vector3[]): BABYLON.Vector3[] {
        if (!outRemovedPart) {
            outRemovedPart = [];
        }
        path.reverse();
        RemoveFromStartForDistanceInPlace(path, distance, outRemovedPart);
        path.reverse();
        outRemovedPart.reverse();
        return path;
    }

    export function RandomInSphereCutToRef(dir: BABYLON.Vector3, alphaMin: number, alphaMax: number, betaMin: number, betaMax: number, up: BABYLON.Vector3, ref: BABYLON.Vector3): BABYLON.Vector3 {
        if (!up) {
            up = BABYLON.Axis.Y;
        }
        let right = BABYLON.Vector3.CrossToRef(up, dir, TmpVec3[0]).normalize();
        up = BABYLON.Vector3.CrossToRef(dir, right, TmpVec3[1]).normalize();
        let a = Math.random() * (alphaMax - alphaMin) + alphaMin;
        let b = Math.random() * (betaMax - betaMin) + betaMin;
        Mummu.RotateToRef(dir, right, b, ref);
        Mummu.RotateToRef(ref, up, a, ref);
        return ref;
    }

    export function RandomInSphereCut(dir: BABYLON.Vector3, alphaMin: number, alphaMax: number, betaMin: number, betaMax: number, up?: BABYLON.Vector3): BABYLON.Vector3 {
        let v = BABYLON.Vector3.Zero();
        RandomInSphereCutToRef(dir, alphaMin, alphaMax, betaMin, betaMax, up, v);
        return v;
    }

    export function GetClosestAxisToRef(dir: BABYLON.Vector3, ref: BABYLON.Vector3): BABYLON.Vector3 {
        let X = Math.abs(dir.x);
        let Y = Math.abs(dir.y);
        let Z = Math.abs(dir.z);
        if (X >= Y && X >= Z) {
            if (dir.x >= 0) {
                ref.copyFromFloats(1, 0, 0);
            }
            else {
                ref.copyFromFloats(- 1, 0, 0);
            }
        }
        else if (Y >= X && Y >= Z) {
            if (dir.y >= 0) {
                ref.copyFromFloats(0, 1, 0);
            }
            else {
                ref.copyFromFloats(0, - 1, 0);
            }
        }
        else if (Z >= X && Z >= Y) {
            if (dir.z >= 0) {
                ref.copyFromFloats(0, 0, 1);
            }
            else {
                ref.copyFromFloats(0, 0, - 1);
            }
        }
        return ref;
    }
    
    export function GetClosestAxis(dir: BABYLON.Vector3): BABYLON.Vector3 {
        let v = BABYLON.Vector3.Zero();
        GetClosestAxisToRef(dir, v);
        return v;
    }
}
namespace Mummu {
    
    export interface IPlane {
        point: BABYLON.Vector3;
        normal: BABYLON.Vector3;
    }
    
    export interface ISphere {
        center: BABYLON.Vector3;
        radius: number;
    }

    export interface IIntersection {
        hit: boolean;
        point: BABYLON.Vector3;
        normal: BABYLON.Vector3;
        depth: number;
    }

    class Intersection implements IIntersection {

        public hit: boolean = false;
        public point: BABYLON.Vector3;
        public normal: BABYLON.Vector3;
        public depth: number = 0;

        constructor() {

        }
    }

    export function SphereTriangleCheck(
        cSphere: BABYLON.Vector3, rSphere: number,
        p1: BABYLON.Vector3, p2: BABYLON.Vector3, p3: BABYLON.Vector3
    ): boolean {
        return SphereAABBCheck(
            cSphere, rSphere,
            Math.min(p1.x, p2.x, p3.x),
            Math.max(p1.x, p2.x, p3.x),
            Math.min(p1.y, p2.y, p3.y),
            Math.max(p1.y, p2.y, p3.y),
            Math.min(p1.z, p2.z, p3.z),
            Math.max(p1.z, p2.z, p3.z)
        );
    }

    export function SphereAABBCheck(
        cSphere: BABYLON.Vector3, rSphere: number,
        x2Min: number, x2Max: number, y2Min: number, y2Max: number, z2Min: number, z2Max: number
    ): boolean {
        return AABBAABBCheck(
            cSphere.x - rSphere, cSphere.x + rSphere, cSphere.y - rSphere, cSphere.y + rSphere, cSphere.z - rSphere, cSphere.z + rSphere, 
            x2Min, x2Max, y2Min, y2Max, z2Min, z2Max
        );
    }

    export function AABBAABBCheck(
        x1Min: number, x1Max: number, y1Min: number, y1Max: number, z1Min: number, z1Max: number,
        x2Min: number, x2Max: number, y2Min: number, y2Max: number, z2Min: number, z2Max: number
    ): boolean {
        if (x1Min > x2Max) {
            return false;
        }
        if (x1Max < x2Min) {
            return false;
        }
        if (y1Min > y2Max) {
            return false;
        }
        if (y1Max < y2Min) {
            return false;
        }
        if (z1Min > z2Max) {
            return false;
        }
        if (z1Max < z2Min) {
            return false;
        }
        return true;
    }

    export function SpherePlaneIntersection(sphere: ISphere, plane: IPlane): IIntersection;
    export function SpherePlaneIntersection(cSphere: BABYLON.Vector3, rSphere: number, pPlane: BABYLON.Vector3, nPlane: BABYLON.Vector3): IIntersection;
    export function SpherePlaneIntersection(arg1: any, arg2: any, pPlane?: BABYLON.Vector3, nPlane?: BABYLON.Vector3): IIntersection {
        let cSphere: BABYLON.Vector3;
        let rSphere: number;
        if (arg1 instanceof BABYLON.Vector3) {
            cSphere = arg1;
            rSphere = arg2;
        }
        else {
            cSphere = (arg1 as ISphere).center;
            rSphere = (arg1 as ISphere).radius;
            pPlane = (arg2 as IPlane).point;
            nPlane = (arg2 as IPlane).normal;
        }

        let intersection = new Intersection();

        let proj = ProjectPointOnPlane(cSphere, pPlane, nPlane);
    
        let sqrDist = BABYLON.Vector3.DistanceSquared(cSphere, proj);
        if (sqrDist <= rSphere * rSphere) {
            let dist = Math.sqrt(sqrDist);
            intersection.hit = true;
            intersection.depth = rSphere - dist;
            intersection.point = proj;
            intersection.normal = nPlane.clone();
        }

        return intersection;
    }

    export function SphereCapsuleIntersection(cSphere: BABYLON.Vector3, rSphere: number, c1Capsule: BABYLON.Vector3, c2Capsule: BABYLON.Vector3, rCapsule: number): IIntersection {
        let intersection = new Intersection();

        if (SphereAABBCheck(
            cSphere, rSphere,
            Math.min(c1Capsule.x, c2Capsule.x) - rCapsule,
            Math.max(c1Capsule.x, c2Capsule.x) + rCapsule,
            Math.min(c1Capsule.y, c2Capsule.y) - rCapsule,
            Math.max(c1Capsule.y, c2Capsule.y) + rCapsule,
            Math.min(c1Capsule.z, c2Capsule.z) - rCapsule,
            Math.max(c1Capsule.z, c2Capsule.z) + rCapsule
        )) {

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
        }

        return intersection;
    }

    export function SphereWireIntersection(cSphere: BABYLON.Vector3, rSphere: number, path: BABYLON.Vector3[], rWire: number, pathIsEvenlyDistributed?: boolean): IIntersection {
        let intersection = new Intersection();

        let proj = BABYLON.Vector3.Zero();
        Mummu.ProjectPointOnPathToRef(cSphere, path, proj, pathIsEvenlyDistributed);
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

    export function SphereTriangleIntersection(sphere: ISphere, p1: BABYLON.Vector3, p2: BABYLON.Vector3, p3: BABYLON.Vector3): IIntersection;
    export function SphereTriangleIntersection(cSphere: BABYLON.Vector3, rSphere: number, p1: BABYLON.Vector3, p2: BABYLON.Vector3, p3: BABYLON.Vector3): IIntersection;
    export function SphereTriangleIntersection(arg1: any, arg2: any, arg3: any, arg4: any, arg5?: any): IIntersection {
        let intersection = new Intersection();
        
        let cSphere: BABYLON.Vector3;
        let rSphere: number;
        let p1: BABYLON.Vector3;
        let p2: BABYLON.Vector3;
        let p3: BABYLON.Vector3;

        if (arg1 instanceof BABYLON.Vector3) {
            cSphere = arg1;
            rSphere = arg2;
            p1 = arg3;
            p2 = arg4;
            p3 = arg5;
        }
        else {
            cSphere = (arg1 as ISphere).center;
            rSphere = (arg1 as ISphere).radius;
            p1 = arg2;
            p2 = arg3;
            p3 = arg4;
        }

        if (SphereTriangleCheck(cSphere, rSphere, p1, p2, p3)) {
            
        }

        return intersection;
    }
}
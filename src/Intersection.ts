namespace Mummu {
    
    export interface IPlane {
        point: BABYLON.Vector3;
        normal: BABYLON.Vector3;
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

    export function AABBAABBIntersect(
        x1Min: number, x1Max: number, y1Min: number, y1Max: number, z1Min: number, z1Max: number,
        x2Min: number, x2Max: number, y2Min: number, y2Max: number, z2Min: number, z2Max: number
    ): boolean {
        if (x1Min > x2Max) {
            return false;
        }
        if (x1Max < x1Min) {
            return false;
        }
        if (y1Min > y2Max) {
            return false;
        }
        if (y1Max < y1Min) {
            return false;
        }
        if (z1Min > z2Max) {
            return false;
        }
        if (z1Max < z1Min) {
            return false;
        }
        return true;
    }

    export function SpherePlaneIntersection(cSphere: BABYLON.Vector3, rSphere: number, plane: IPlane): IIntersection;
    export function SpherePlaneIntersection(cSphere: BABYLON.Vector3, rSphere: number, pPlane: BABYLON.Vector3, nPlane: BABYLON.Vector3): IIntersection;
    export function SpherePlaneIntersection(cSphere: BABYLON.Vector3, rSphere: number, arg1: any, nPlane?: BABYLON.Vector3): IIntersection {
        let pPlane: BABYLON.Vector3;
        if (arg1 instanceof BABYLON.Vector3) {
            pPlane = arg1;
        }
        else if (arg1 && (arg1 as IPlane).point) {
            pPlane = (arg1 as IPlane).point;
            nPlane = (arg1 as IPlane).normal;
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

        if (AABBAABBIntersect(
            cSphere.x - rSphere, cSphere.x + rSphere, cSphere.y - rSphere, cSphere.y + rSphere, cSphere.z - rSphere, cSphere.z + rSphere, 
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
}
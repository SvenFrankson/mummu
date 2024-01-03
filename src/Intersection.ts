namespace Mummu {
    
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

    export function SphereCapsuleIntersection(cSphere: BABYLON.Vector3, rSphere: number, c1Capsule: BABYLON.Vector3, c2Capsule: BABYLON.Vector3, rCapsule: number): IIntersection {
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

    export function SphereWireIntersection(cSphere: BABYLON.Vector3, rSphere: number, path: BABYLON.Vector3[], rWire: number): IIntersection {
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
}
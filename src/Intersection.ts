/*
    Point
    Line
    Segment
    Ray
    Path
    Wire
    Plane
    AABB
    Triangle
    Sphere
    Capsule
    Mesh
*/

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
        index?: number; // when intersecting with a path
    }

    export class Intersection implements IIntersection {

        public hit: boolean = false;
        public point: BABYLON.Vector3;
        public normal: BABYLON.Vector3;
        public depth: number = 0;
        public index: number = -1;

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

    export function SphereRayCheck(cSphere: BABYLON.Vector3, rSphere: number, ray: BABYLON.Ray): boolean {
        return SphereAABBCheck(
            cSphere, rSphere,
            Math.min(ray.origin.x, ray.origin.x + ray.direction.x),
            Math.max(ray.origin.x, ray.origin.x + ray.direction.x),
            Math.min(ray.origin.y, ray.origin.y + ray.direction.y),
            Math.max(ray.origin.y, ray.origin.y + ray.direction.y),
            Math.min(ray.origin.z, ray.origin.z + ray.direction.z),
            Math.max(ray.origin.z, ray.origin.z + ray.direction.z)
        );
    }

    export function PointAABBCheck(p: BABYLON.Vector3, boxMin: BABYLON.Vector3, boxMax: BABYLON.Vector3): boolean;
    export function PointAABBCheck(
        p: BABYLON.Vector3,
        x2Min: number, x2Max: number, y1Min: number, y2Max: number, z2Min: number, z2Max: number
    ): boolean;
    export function PointAABBCheck(
        p: BABYLON.Vector3,
        arg1: any, arg2: any, y1Min?: number, y1Max?: number, z1Min?: number, z1Max?: number
    ): boolean {
        let x1Min: number;
        let x1Max: number;
        if (arg1 instanceof BABYLON.Vector3) {
            x1Min = arg1.x;
            x1Max = arg2.x;
            y1Min = arg1.y;
            y1Max = arg2.y;
            z1Min = arg1.z;
            z1Max = arg2.z;
        }
        else {
            x1Min = arg1;
            x1Max = arg2;
        }
        
        if (p.x >= x1Min) {
            if (p.x <= x1Max) {
                if (p.y >= y1Min) {
                    if (p.y <= y1Max) {
                        if (p.z >= z1Min) {
                            if (p.z <= z1Max) {
                                return true;
                            }
                        }
                    }
                }
            }
        }
        return false;
    }

    export function SphereAABBCheck(cSphere: BABYLON.Vector3, rSphere: number, boxMin: BABYLON.Vector3, boxMax: BABYLON.Vector3): boolean;
    export function SphereAABBCheck(
        cSphere: BABYLON.Vector3, rSphere: number,
        x2Min: number, x2Max: number, y2Min: number, y2Max: number, z2Min: number, z2Max: number
    ): boolean;
    export function SphereAABBCheck(
        cSphere: BABYLON.Vector3, rSphere: number,
        arg1: any, arg2: any, y2Min?: number, y2Max?: number, z2Min?: number, z2Max?: number
    ): boolean {
        let x2Min: number;
        let x2Max: number;
        if (arg1 instanceof BABYLON.Vector3) {
            x2Min = arg1.x;
            x2Max = arg2.x;
            y2Min = arg1.y;
            y2Max = arg2.y;
            z2Min = arg1.z;
            z2Max = arg2.z;
        }
        else {
            x2Min = arg1;
            x2Max = arg2;
        }
        return AABBAABBCheck(
            cSphere.x - rSphere, cSphere.x + rSphere, cSphere.y - rSphere, cSphere.y + rSphere, cSphere.z - rSphere, cSphere.z + rSphere, 
            x2Min, x2Max, y2Min, y2Max, z2Min, z2Max
        );
    }

    export function AABBAABBCheck(box1Min: BABYLON.Vector3, box1Max: BABYLON.Vector3, box2Min: BABYLON.Vector3, box2Max: BABYLON.Vector3): boolean;
    export function AABBAABBCheck(
        x1Min: number, x1Max: number, y1Min: number, y1Max: number, z1Min: number, z1Max: number,
        x2Min: number, x2Max: number, y2Min: number, y2Max: number, z2Min: number, z2Max: number
    ): boolean;
    export function AABBAABBCheck(
        arg1: any, arg2: any, arg3: any, arg4: any, z1Min?: number, z1Max?: number,
        x2Min?: number, x2Max?: number, y2Min?: number, y2Max?: number, z2Min?: number, z2Max?: number
    ): boolean {
        let x1Min: number;
        let x1Max: number;
        let y1Min: number;
        let y1Max: number;
        if (arg1 instanceof BABYLON.Vector3) {
            x1Min = arg1.x;
            x1Max = arg2.x;
            y1Min = arg1.y;
            y1Max = arg2.y;
            z1Min = arg1.z;
            z1Max = arg2.z;
            
            x2Min = arg3.x;
            x2Max = arg4.x;
            y2Min = arg3.y;
            y2Max = arg4.y;
            z2Min = arg3.z;
            z2Max = arg4.z;
        }
        else {
            x1Min = arg1;
            x1Max = arg2;
            y1Min = arg3;
            y1Max = arg4;
        }

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

    export function RaySphereIntersection(ray: BABYLON.Ray, sphere: ISphere): IIntersection; // 1
    export function RaySphereIntersection(ray: BABYLON.Ray, cSphere: BABYLON.Vector3, rSphere: number): IIntersection; // 2
    export function RaySphereIntersection(ray: BABYLON.Ray, arg2?: any, rSphere?: number): IIntersection {
        let cSphere: BABYLON.Vector3;
        if (arg2 instanceof BABYLON.Vector3) { // 2
            cSphere = arg2;
        }
        else { // 1
            cSphere = (arg2 as ISphere).center;
            rSphere = (arg2 as ISphere).radius;
        }

        let intersection = new Intersection();

        if (SphereRayCheck(cSphere, rSphere, ray)) {
            // todo
        }

        return intersection;
    }

    export function RayMeshIntersection(ray: BABYLON.Ray, mesh: BABYLON.Mesh): IIntersection {
        let intersection = new Intersection();

        let pickingInfo = ray.intersectsMesh(mesh);
        if (pickingInfo.hit) {
            intersection.hit = true;
            intersection.point = pickingInfo.pickedPoint;
            intersection.normal = pickingInfo.getNormal(true);
            intersection.depth = ray.length - pickingInfo.distance;
        }

        return intersection;
    }

    export function RayPlaneIntersection(ray: BABYLON.Ray, plane: IPlane): IIntersection; // 1
    export function RayPlaneIntersection(ray: BABYLON.Ray, pPlane: BABYLON.Vector3, nPlane: BABYLON.Vector3): IIntersection; // 2
    export function RayPlaneIntersection(ray: BABYLON.Ray, arg1: any, nPlane?: any): IIntersection {
        let pPlane: BABYLON.Vector3;
        if (arg1 instanceof BABYLON.Vector3) { // 2
            pPlane = arg1;
        }
        else { // 1
            pPlane = (arg1 as IPlane).point;
            nPlane = (arg1 as IPlane).normal;
        }

        let intersection = new Intersection();
        let bjsPlane = BABYLON.Plane.FromPositionAndNormal(pPlane, nPlane);

        let d = ray.intersectsPlane(bjsPlane);
        if (d > 0.001 && (d <= ray.length)) {
            intersection.hit = true;
            intersection.point = ray.origin.add(ray.direction.scale(d));
            intersection.normal = nPlane.clone();
            intersection.depth = ray.length - d;
        }

        return intersection;
    }

    export function SpherePlaneIntersection(sphere: ISphere, plane: IPlane): IIntersection;
    export function SpherePlaneIntersection(cSphere: BABYLON.Vector3, rSphere: number, plane: IPlane): IIntersection;
    export function SpherePlaneIntersection(cSphere: BABYLON.Vector3, rSphere: number, pPlane: BABYLON.Vector3, nPlane: BABYLON.Vector3): IIntersection;
    export function SpherePlaneIntersection(arg1: any, arg2: any, arg3?: any, nPlane?: BABYLON.Vector3): IIntersection {
        let cSphere: BABYLON.Vector3;
        let rSphere: number;
        let pPlane: BABYLON.Vector3;
        if (arg1 instanceof BABYLON.Vector3 && arg3 instanceof BABYLON.Vector3) {
            cSphere = arg1;
            rSphere = arg2;
            pPlane = arg3;            
        }
        else if (arg1 instanceof BABYLON.Vector3) {
            cSphere = arg1;
            rSphere = arg2;
            pPlane = (arg3 as IPlane).point;
            nPlane = (arg3 as IPlane).normal;
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

    var SphereLatheIntersectionTmpVec3 = BABYLON.Vector3.Zero();
    export function SphereLatheIntersection(cSphere: BABYLON.Vector3, rSphere: number, cLathe: BABYLON.Vector3, path: BABYLON.Vector3[], rWire: number = 0): IIntersection {
        let proj = SphereLatheIntersectionTmpVec3;
        proj.copyFrom(cSphere).subtractInPlace(cLathe);
        let alpha = Mummu.AngleFromToAround(proj, BABYLON.Axis.X, BABYLON.Axis.Y);
        Mummu.RotateInPlace(proj, BABYLON.Axis.Y, alpha);

        let intersection = SphereWireIntersection(proj, rSphere, path, rWire);

        if (intersection.hit) {
            Mummu.RotateInPlace(intersection.point, BABYLON.Axis.Y, - alpha);
            Mummu.RotateInPlace(intersection.normal, BABYLON.Axis.Y, - alpha);
            intersection.point.addInPlace(cLathe);
        }

        return intersection;
    }

    var SphereWireIntersectionTmpWireProj_0 = { point: BABYLON.Vector3.Zero(), index: - 1 };
    export function SphereWireIntersection(cSphere: BABYLON.Vector3, rSphere: number, path: BABYLON.Vector3[], rWire: number, pathIsEvenlyDistributed?: boolean, nearBestIndex?: number, nearBestSearchRange?: number): IIntersection {
        let intersection = new Intersection();

        let proj = SphereWireIntersectionTmpWireProj_0;
        Mummu.ProjectPointOnPathToRef(cSphere, path, proj, pathIsEvenlyDistributed, nearBestIndex, nearBestSearchRange);
        let sqrDist = BABYLON.Vector3.DistanceSquared(cSphere, proj.point);

        let sqrDepth = (rSphere + rWire) * (rSphere + rWire) - sqrDist;

        if (sqrDepth > 0) {
            intersection.hit = true;
            intersection.depth = (rSphere + rWire) - Math.sqrt(sqrDist);
            let dir = cSphere.subtract(proj.point).normalize();
            intersection.point = dir.scale(rWire);
            intersection.point.addInPlace(proj.point);
            intersection.normal = dir;
            intersection.index = proj.index;
        }

        return intersection;
    }

    var SphereInTubeIntersectionTmpWireProj_0 = { point: BABYLON.Vector3.Zero(), index: - 1 };
    export function SphereInTubeIntersection(cSphere: BABYLON.Vector3, rSphere: number, path: BABYLON.Vector3[], rTube: number, pathIsEvenlyDistributed?: boolean, nearBestIndex?: number, nearBestSearchRange?: number): IIntersection {
        let intersection = new Intersection();

        let proj = SphereInTubeIntersectionTmpWireProj_0;
        Mummu.ProjectPointOnPathToRef(cSphere, path, proj, pathIsEvenlyDistributed, nearBestIndex, nearBestSearchRange);
        let dist = BABYLON.Vector3.Distance(cSphere, proj.point);
        if (proj.index === 0) {
            let AB = path[1].subtract(path[0]);
            let AP = cSphere.subtract(path[0]);
            if (BABYLON.Vector3.Dot(AB, AP) < 0) {
                dist = 0;
            }
        }
        else if (proj.index === path.length - 2) {
            let AB = path[path.length - 1].subtract(path[path.length - 2]);
            let AP = cSphere.subtract(path[path.length - 1]);
            if (BABYLON.Vector3.Dot(AB, AP) > 0) {
                dist = 0;
            }
        }

        let depth = (rSphere + dist) - rTube;
        
        if (depth > 0 && depth < rSphere) {
            intersection.hit = true;
            intersection.depth = depth;
            let dir = proj.point.subtract(cSphere).normalize();
            intersection.point = dir.scale(- rTube);
            intersection.point.addInPlace(proj.point);
            intersection.normal = dir;
            intersection.index = proj.index;
        }

        return intersection;
    }

    var SphereTriangleIntersectionTmpVec3_0 = BABYLON.Vector3.Zero();
    var SphereTriangleIntersectionTmpVec3_1 = BABYLON.Vector3.Zero();
    var SphereTriangleIntersectionTmpVec3_2 = BABYLON.Vector3.Zero();
    var SphereTriangleIntersectionTmpVec3_3 = BABYLON.Vector3.Zero();
    var SphereTriangleIntersectionTmpVec3_4 = BABYLON.Vector3.Zero();
    var SphereTriangleIntersectionTmpQuat_0 = BABYLON.Quaternion.Identity();
    var SphereTriangleIntersectionTmpMatrix_0 = BABYLON.Matrix.Identity();
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
            let plane = PlaneCollider.CreateFromPoints(p1, p2, p3);
            let proj = ProjectPointOnPlaneToRef(cSphere, plane.point, plane.normal, SphereTriangleIntersectionTmpVec3_0);
            let sqrDist = BABYLON.Vector3.DistanceSquared(cSphere, proj);
            if (sqrDist <= rSphere * rSphere) {                
                let barycentric = Barycentric(cSphere, p1, p2, p3);
                if (barycentric.u < 0 || barycentric.u > 1 || barycentric.v < 0 || barycentric.v > 1 || barycentric.w < 0 || barycentric.w > 1) {
                    let proj1 = ProjectPointOnSegmentToRef(proj, p1, p2, SphereTriangleIntersectionTmpVec3_1);
                    let sqrDist1 = BABYLON.Vector3.DistanceSquared(proj, proj1);
                    let proj2 = ProjectPointOnSegmentToRef(proj, p2, p3, SphereTriangleIntersectionTmpVec3_2);
                    let sqrDist2 = BABYLON.Vector3.DistanceSquared(proj, proj2);
                    let proj3 = ProjectPointOnSegmentToRef(proj, p3, p1, SphereTriangleIntersectionTmpVec3_3);
                    let sqrDist3 = BABYLON.Vector3.DistanceSquared(proj, proj3);

                    if (sqrDist1 <= sqrDist2 && sqrDist1 <= sqrDist3) {
                        proj = proj1;
                    }
                    else if (sqrDist2 <= sqrDist1 && sqrDist2 <= sqrDist3) {
                        proj = proj2;
                    }
                    else if (sqrDist3 <= sqrDist1 && sqrDist3 <= sqrDist2) {
                        proj = proj3;
                    }
                }

                sqrDist = BABYLON.Vector3.DistanceSquared(cSphere, proj);
                if (sqrDist <= rSphere * rSphere) {
                    let triangleNormal = BABYLON.Vector3.CrossToRef(
                        p3.subtract(p1),
                        p2.subtract(p1),
                        SphereTriangleIntersectionTmpVec3_4
                    );
                    let normal = cSphere.subtract(proj);
                    if (BABYLON.Vector3.Dot(triangleNormal, normal) > 0) {
                        let dist = Math.sqrt(sqrDist);
                        intersection.hit = true;
                        intersection.point = proj;
                        intersection.normal = triangleNormal.normalize();
                        intersection.depth = rSphere - dist;
                    }
                }
            }
        }

        return intersection;
    }

    var SphereMeshIntersectionTmpVec3_0 = BABYLON.Vector3.Zero();
    var SphereMeshIntersectionTmpVec3_1 = BABYLON.Vector3.Zero();
    var SphereMeshIntersectionTmpVec3_2 = BABYLON.Vector3.Zero();
    var SphereMeshIntersectionTmpVec3_3 = BABYLON.Vector3.Zero();
    var SphereMeshIntersectionTmpVec3_4 = BABYLON.Vector3.Zero();
    var SphereMeshIntersectionTmpQuat_0 = BABYLON.Quaternion.Identity();
    var SphereMeshIntersectionTmpMatrix_0 = BABYLON.Matrix.Identity();

    export function SphereMeshIntersection(cSphere: BABYLON.Vector3, rSphere: number, mesh: BABYLON.AbstractMesh): IIntersection {
        let intersection: IIntersection = new Intersection();

        let bbox = mesh.getBoundingInfo();
        let scale: BABYLON.Vector3 = SphereMeshIntersectionTmpVec3_0;
        mesh.getWorldMatrix().decompose(scale, SphereMeshIntersectionTmpQuat_0, SphereMeshIntersectionTmpVec3_1);

        let invMatrix = SphereMeshIntersectionTmpMatrix_0;
        invMatrix.copyFrom(mesh.getWorldMatrix()).invert();
        let localCSphere = BABYLON.Vector3.TransformCoordinates(cSphere, invMatrix);
        let localRadius = rSphere / scale.x;
        if (SphereAABBCheck(localCSphere, localRadius, bbox.minimum, bbox.maximum)) {
            let positions = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
            let indices = mesh.getIndices();
            let p1 = SphereMeshIntersectionTmpVec3_2;
            let p2 = SphereMeshIntersectionTmpVec3_3;
            let p3 = SphereMeshIntersectionTmpVec3_4;
            for (let i = 0; i < indices.length / 3; i++) {
                let i1 = indices[3 * i];
                let i2 = indices[3 * i + 1];
                let i3 = indices[3 * i + 2];

                p1.x = positions[3 * i1];
                p1.y = positions[3 * i1 + 1];
                p1.z = positions[3 * i1 + 2];
                p2.x = positions[3 * i2];
                p2.y = positions[3 * i2 + 1];
                p2.z = positions[3 * i2 + 2];
                p3.x = positions[3 * i3];
                p3.y = positions[3 * i3 + 1];
                p3.z = positions[3 * i3 + 2];

                let triIntersection = SphereTriangleIntersection(localCSphere, localRadius, p1, p2, p3);
                if (triIntersection.hit) {
                    if (!intersection || triIntersection.depth > intersection.depth) {
                        intersection = triIntersection;
                    }
                }
            }

            if (intersection.hit) {
                BABYLON.Vector3.TransformCoordinatesToRef(intersection.point, mesh.getWorldMatrix(), intersection.point);
                BABYLON.Vector3.TransformNormalToRef(intersection.normal, mesh.getWorldMatrix(), intersection.normal);
            }
        }
        return intersection;
    }
}
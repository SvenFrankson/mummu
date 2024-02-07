namespace Mummu {

    export function SphereColliderIntersection(cSphere: BABYLON.Vector3, rSphere: number, collider: Collider): IIntersection {
        if (collider instanceof PlaneCollider) {
            return SpherePlaneIntersection(cSphere, rSphere, collider);
        }
        else if (collider instanceof SphereCollider) {
            // todo
        }
        else if (collider instanceof MeshCollider) {
            return SphereMeshIntersection(cSphere, rSphere, collider.mesh);
        }
    }

    export function RayColliderIntersection(ray: BABYLON.Ray, collider: Collider): IIntersection {
        if (collider instanceof PlaneCollider) {
            return RayPlaneIntersection(ray, collider);
        }
        else if (collider instanceof SphereCollider) {
            // todo
        }
        else if (collider instanceof MeshCollider) {
            return RayMeshIntersection(ray, collider.mesh);
        }
    }

    export class Collider {

    }

    export class PlaneCollider extends Collider implements IPlane {

        public static CreateFromBJSPlane(plane: BABYLON.Mesh): PlaneCollider {
            plane.computeWorldMatrix(true);
            return new PlaneCollider(plane.position, plane.forward.scale(-1));
        }

        public static CreateFromPoints(p1: BABYLON.Vector3, p2: BABYLON.Vector3, p3: BABYLON.Vector3): PlaneCollider {
            let l1 = p2.subtract(p1);
            let l2 = p3.subtract(p1);
            return new PlaneCollider(p1, BABYLON.Vector3.Cross(l1, l2));
        }

        constructor(
            public point: BABYLON.Vector3,
            public normal: BABYLON.Vector3
        ) {
            super();
            if (this.normal.lengthSquared() != 1) {
                this.normal = this.normal.clone().normalize();
            }
        }
    }

    export class SphereCollider extends Collider implements ISphere {

        constructor(
            public center: BABYLON.Vector3,
            public radius: number
        ) {
            super();
        }
    }

    export class MeshCollider extends Collider {

        constructor(public mesh: BABYLON.Mesh) {
            super();
        }
    }
}
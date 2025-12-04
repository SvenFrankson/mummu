namespace Mummu {

    export function SphereCollidersIntersection(cSphere: BABYLON.Vector3, rSphere: number, colliders: (Collider | BABYLON.Mesh)[]): IIntersection[] {
        let intersections: IIntersection[] = [];

        for (let i = 0; i < colliders.length; i++) {
            let intersection = SphereColliderIntersection(cSphere, rSphere, colliders[i]);
            if (intersection.hit) {
                intersections.push(intersection);
            }
        }

        return intersections;
    }

    export function SphereColliderIntersection(cSphere: BABYLON.Vector3, rSphere: number, collider: Collider | BABYLON.Mesh): IIntersection {
        if (collider instanceof PlaneCollider) {
            return SpherePlaneIntersection(cSphere, rSphere, collider);
        }
        else if (collider instanceof SphereCollider) {
            // todo
        }
        else if (collider instanceof BoxCollider) {
            return SphereBoxIntersection(cSphere, rSphere, collider);
        }
        else if (collider instanceof CylinderCollider) {
            // todo
        }
        else if (collider instanceof CapsuleCollider) {
            return SphereCapsuleIntersection(cSphere, rSphere, collider.c1, collider.c2, collider.radius, collider.worldMatrix);
        }
        else if (collider instanceof MeshCollider) {
            return SphereMeshIntersection(cSphere, rSphere, collider.mesh);
        }
        else if (collider instanceof BABYLON.Mesh) {
            return SphereMeshIntersection(cSphere, rSphere, collider);
        }
    }

    export function RayCollidersIntersection(ray: BABYLON.Ray, colliders: (Collider | BABYLON.Mesh)[]): IIntersection {
        let intersection: IIntersection = new Intersection();

        for (let i = 0; i < colliders.length; i++) {
            let currIntersection = RayColliderIntersection(ray, colliders[i]);
            if (currIntersection.hit) {
                if (!currIntersection.hit || currIntersection.depth > intersection.depth) {
                    intersection = currIntersection;
                }
            }
        }

        return intersection;
    }

    export function RayColliderIntersection(ray: BABYLON.Ray, collider: Collider | BABYLON.Mesh): IIntersection {
        if (collider instanceof PlaneCollider) {
            return RayPlaneIntersection(ray, collider);
        }
        else if (collider instanceof SphereCollider) {
            // todo
        }
        else if (collider instanceof MeshCollider) {
            return RayMeshIntersection(ray, collider.mesh);
        }
        else if (collider instanceof BABYLON.Mesh) {
            return RayMeshIntersection(ray, collider);
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

        public center: BABYLON.Vector3 = BABYLON.Vector3.Zero();

        constructor(
            public localCenter: BABYLON.Vector3,
            public radius: number,
            public parent?: BABYLON.TransformNode
        ) {
            super();
            this.recomputeWorldCenter();
        }

        public recomputeWorldCenter(): void {
            if (this.parent) {
                BABYLON.Vector3.TransformCoordinatesToRef(this.localCenter, this.parent.getWorldMatrix(), this.center);
            }
            else {
                this.center.copyFrom(this.localCenter);
            }
        }
    }

    export class BoxCollider extends Collider implements IBox {

        public width: number = 1;
        public height: number = 1;
        public depth: number = 1;

        constructor(public worldMatrix: BABYLON.Matrix) {
            super();
        }
    }

    export class CylinderCollider extends Collider implements ICylinder {

        public radius: number = 1;
        public height: number = 1;

        constructor(public worldMatrix: BABYLON.Matrix) {
            super();
        }
    }

    export class CapsuleCollider extends Collider implements ICapsule {

        constructor(public c1: BABYLON.Vector3, public c2: BABYLON.Vector3, public radius: number, public worldMatrix?: BABYLON.Matrix) {
            super();
        }
    }

    export class MeshCollider extends Collider {

        constructor(public mesh: BABYLON.Mesh) {
            super();
        }
    }
}
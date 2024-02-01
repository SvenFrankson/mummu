namespace Mummu {

    export class PlaneCollider implements IPlane {

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
            if (this.normal.lengthSquared() != 1) {
                this.normal = this.normal.clone().normalize();
            }
        }
    }

    export class SphereCollider implements ISphere {

        constructor(
            public center: BABYLON.Vector3,
            public radius: number
        ) {

        }
    }
}
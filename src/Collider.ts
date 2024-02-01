namespace Mummu {

    export class PlaneCollider implements IPlane {

        public static CreateFromBJSPlane(plane: BABYLON.Mesh): PlaneCollider {
            plane.computeWorldMatrix(true);
            return new PlaneCollider(plane.position, plane.forward.scale(-1));
        }

        constructor(
            public point: BABYLON.Vector3,
            public normal: BABYLON.Vector3
        ) {

        }
    }
}
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

    export function QuaternionFromXYAxis(x: BABYLON.Vector3, y: BABYLON.Vector3): BABYLON.Quaternion {
        let q = BABYLON.Quaternion.Identity();
        QuaternionFromXYAxisToRef(x, y, q);
        return q;
    }

    export function QuaternionFromXYAxisToRef(x: BABYLON.Vector3, y: BABYLON.Vector3, ref: BABYLON.Quaternion): BABYLON.Quaternion {
        let xAxis = TmpVec3[0].copyFrom(x);
        let yAxis = TmpVec3[1].copyFrom(y);
        let zAxis = TmpVec3[2];
        
        BABYLON.Vector3.CrossToRef(xAxis, yAxis, zAxis);
        BABYLON.Vector3.CrossToRef(zAxis, xAxis, yAxis);
        BABYLON.Quaternion.RotationQuaternionFromAxisToRef(xAxis, yAxis, zAxis, ref);

        return ref;
    }

    export function QuaternionFromXZAxis(x: BABYLON.Vector3, z: BABYLON.Vector3): BABYLON.Quaternion {
        let q = BABYLON.Quaternion.Identity();
        QuaternionFromXZAxisToRef(x, z, q);
        return q;
    }

    export function QuaternionFromXZAxisToRef(x: BABYLON.Vector3, z: BABYLON.Vector3, ref: BABYLON.Quaternion): BABYLON.Quaternion {
        let xAxis = TmpVec3[0].copyFrom(x);
        let yAxis = TmpVec3[1];
        let zAxis = TmpVec3[2].copyFrom(z);
        
        BABYLON.Vector3.CrossToRef(zAxis, xAxis, yAxis);
        BABYLON.Vector3.CrossToRef(xAxis, yAxis, zAxis);
        BABYLON.Quaternion.RotationQuaternionFromAxisToRef(xAxis, yAxis, zAxis, ref);

        return ref;
    }

    export function QuaternionFromYZAxis(y: BABYLON.Vector3, z: BABYLON.Vector3): BABYLON.Quaternion {
        let q = BABYLON.Quaternion.Identity();
        QuaternionFromYZAxisToRef(y, z, q);
        return q;
    }

    export function QuaternionFromYZAxisToRef(y: BABYLON.Vector3, z: BABYLON.Vector3, ref: BABYLON.Quaternion): BABYLON.Quaternion {
        let xAxis = TmpVec3[0];
        let yAxis = TmpVec3[1].copyFrom(y);
        let zAxis = TmpVec3[2].copyFrom(z);
        
        BABYLON.Vector3.CrossToRef(yAxis, zAxis, xAxis);
        BABYLON.Vector3.CrossToRef(xAxis, yAxis, zAxis);
        BABYLON.Quaternion.RotationQuaternionFromAxisToRef(xAxis, yAxis, zAxis, ref);

        return ref;
    }

    export function QuaternionFromZXAxis(z: BABYLON.Vector3, x: BABYLON.Vector3): BABYLON.Quaternion {
        let q = BABYLON.Quaternion.Identity();
        QuaternionFromZXAxisToRef(z, x, q);
        return q;
    }

    export function QuaternionFromZXAxisToRef(z: BABYLON.Vector3, x: BABYLON.Vector3, ref: BABYLON.Quaternion): BABYLON.Quaternion {
        let xAxis = TmpVec3[0].copyFrom(x);
        let yAxis = TmpVec3[1];
        let zAxis = TmpVec3[2].copyFrom(z);
        
        BABYLON.Vector3.CrossToRef(zAxis, xAxis, yAxis);
        BABYLON.Vector3.CrossToRef(yAxis, zAxis, xAxis);
        BABYLON.Quaternion.RotationQuaternionFromAxisToRef(xAxis, yAxis, zAxis, ref);

        return ref;
    }

    export function QuaternionFromZYAxis(z: BABYLON.Vector3, y: BABYLON.Vector3): BABYLON.Quaternion {
        let q = BABYLON.Quaternion.Identity();
        QuaternionFromZYAxisToRef(z, y, q);
        return q;
    }

    export function QuaternionFromZYAxisToRef(z: BABYLON.Vector3, y: BABYLON.Vector3, ref: BABYLON.Quaternion): BABYLON.Quaternion {
        let xAxis = TmpVec3[0];
        let yAxis = TmpVec3[1].copyFrom(y);
        let zAxis = TmpVec3[2].copyFrom(z);
        
        BABYLON.Vector3.CrossToRef(yAxis, zAxis, xAxis);
        BABYLON.Vector3.CrossToRef(zAxis, xAxis, yAxis);
        BABYLON.Quaternion.RotationQuaternionFromAxisToRef(xAxis, yAxis, zAxis, ref);

        return ref;
    }
}
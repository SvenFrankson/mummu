# mummu

Mummu is a collection of tools for BabylonJS applications. Typescript-written, it targets a wide range of domains, from BABYLON.VertexData manipulation to Vector3, Quaternion and Spatial Intersections.

## Disclaimer

I've written Mummu to factorize some code I tend to re-use in many different BabylonJS-based projects.
Its still a work in progress, and interfaces might change in the future.

## Usage

Add https://github.com/SvenFrankson/nabu/blob/main/nabu.js to your project

Add ./mummu.js to your project

Use ./mummu.d.ts for your Typescript project.

## Documentation
 
// todo

 ./src/Intersections.ts contains methods about Spatial Intersections.

./src/Collider.ts exposes accessors to X-Y intersections (where X and Y are Sphere/Ray/Plane/Babylon.Mesh).

./src/MeshBuilder.ts allows constructing a Quad by its 4 corners and Thick-Sphere slices.

./src/Debug.ts contains methods to instantiate segments, points and normals for n frames.

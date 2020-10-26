import {
    Scene,
    MeshBuilder,
    Mesh,
    Quaternion,
} from '@babylonjs/core';

export class Boid {
    mesh: Mesh;

    constructor(
        name: string,
        scene: Scene,
    ) {
        const mesh = MeshBuilder.CreateCylinder(name, {
            height: 1,
            diameterTop: 0.01,
            diameterBottom: 0.5,
        }, scene);
        mesh.rotationQuaternion = new Quaternion();

        this.mesh = mesh;
    }
}
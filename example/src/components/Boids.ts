import {
    Scene,
    Mesh,
    VertexData,
} from '@babylonjs/core';
import {
    Boid,
    BoidsUI,
} from '.';

export class Boids {
    config: {[key: string]: number};
    meshes: Mesh[];
    data: any[];

    constructor(
        wasm: any,
        initialConfig: {[key: string]: number},
        boidsNumber: number,
        obstacles: Mesh[],
        scene: Scene,
    ) {
        this.config = initialConfig;
        this.meshes = [];
        this.data = [];
        
        let i = 0;
        while (i < boidsNumber) {
            const b = new Boid(`${i}`, scene);
            this.data.push({
                pos: [Math.random(), Math.random(), Math.random()],
                vel: [1.0, 1.0, 0.0],
                rot: [0.0, 0.0, 0.0, 1.0],
            });
            this.meshes.push(b.mesh);
            i += 1;
        }

        const obstacleData = obstacles.reduce((acc: any[], o: Mesh) => {
            const { positions, uvs, indices } = VertexData.ExtractFromMesh(o, true, true);
            const position: number[] = [];
            o.position.toArray(position);
            acc.push({
                points: positions,
                indices,
                uvs,
                position,
            });
            return acc;
        }, []);

        const boids = wasm.boids_initialize(
            obstacleData,
            this.data,
            this.config,
        );

        const boidsUI = new BoidsUI((value: number, key: string) => {
            this.config[key] = value;
            boids.update_config(this.config);
        }, this.config);

        const updateBoids = (nextBoids: any) => {
            nextBoids.forEach((b: any, i: number) => {
                const { rot, pos } = b;
                this.meshes[i].position.set(pos[0], pos[1], pos[2]);
                this.meshes[i].rotationQuaternion!.set(rot[0], rot[1], rot[2], rot[3]);
            });
        };

        scene.registerAfterRender(function() {
            const nextBoids = boids.boids_iteration(scene.deltaTime);
            updateBoids(nextBoids);
        });
    }
}

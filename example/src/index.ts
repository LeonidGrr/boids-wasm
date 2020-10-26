import {
    Engine,
    ArcRotateCamera,
    Vector3,
    Scene,
    Mesh,
    MeshBuilder,
    StandardMaterial,
} from '@babylonjs/core';
import '@babylonjs/core/Meshes/meshBuilder';
import 'pepjs';
import './index.css';
import { Boids } from './components';

(async () => {
    const canvas: HTMLCanvasElement = document.querySelector('canvas')!;
    const engine = new Engine(canvas, true, {
        useHighPrecisionFloats: true,
    });

    const scene = new Scene(engine);

    const orreryCamera = new ArcRotateCamera('orreryCamera', -Math.PI / 4, Math.PI / 4, 100, Vector3.Zero(), scene);
    orreryCamera.minZ = 0.01;
    orreryCamera.maxZ = 1000;
    orreryCamera.attachControl(canvas, true);
    orreryCamera.useBouncingBehavior = true;
    orreryCamera.wheelPrecision = 50;
    orreryCamera.upperRadiusLimit = 100;

    const wasm = await import('./boids-wasm/boids_wasm');

    const obstacles: Mesh[] = [];
    const obstacleMaterial = new StandardMaterial('obstacleMaterial', scene);
    obstacleMaterial.alpha = 0.0;

    const obstacle1 = MeshBuilder.CreateBox('obstacle1', {
        size: 50,
    }, scene);
    obstacle1.material = obstacleMaterial;
    obstacles.push(obstacle1);

    const config = wasm.boids_config();
    config.time_scale = 0.001;
    config.obstacle_dist = 10;
    config.target_pos = [8.0, 8.0, 8.0];
    new Boids(wasm, config, 100, obstacles, scene);

    // Start render loop
    engine.runRenderLoop(() => {
        scene.render();
    });

    window.addEventListener('resize', () => {
        engine.resize();
    });
})();

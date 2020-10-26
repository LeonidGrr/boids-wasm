import * as dat from 'dat.gui';

export class BoidsUI {
    constructor(
        onChange: (value: number, key: string) => void,
        config: {[key: string]: number},
    ) {
        const gui = new dat.GUI();
        gui.domElement.style.marginTop = '16px';
        const options: any = {
            max_vel: {
                max: 50,
                min: 0.1,
            },
            min_vel: {
                max: 50,
                min: 0.1,
            },
            max_acc: {
                max: 50,
                min: 0.1,
            },
            min_acc: {
                max: 50,
                min: 0.1,
            },
            obstacle_w: {
                max: 50.0,
                min: 0.1,
            },
            align_w: {
                max: 1.0,
                min: 0.1,
            },
            target_w: {
                max: 1.0,
                min: 0.0,
            },
            collision_w: {
                max: 1.0,
                min: 0.1,
            },
            cohesion_w: {
                max: 1.0,
                min: 0.1,
            },
            obstacle_dist: {
                max: 50,
                min: 0.1,
            },
            view_ang: {
                max: 2.0 * Math.PI,
                min: 0.1 * Math.PI,
            },
            view_r: {
                max: 50,
                min: 0.1,
            },
            collision_r: {
                max: 50,
                min: 0.1,
            },
        };
        Object.keys(config).forEach((key: string) => {
            if (key !== 'time_scale' && key !== 'target_pos') {
                const { min, max } = options[key];
                gui.add(config, key, min, max, 0.1).onChange((value: number) => onChange(value, key));
            }
        });
    }
}

#![allow(dead_code)]

use ncollide3d::math::Isometry;
use ncollide3d::nalgebra::{Point2, Point3};
use ncollide3d::query::RayCast;
use ncollide3d::shape::TriMesh;
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

mod boid;
use boid::Boid;

pub fn set_panic_hook() {
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
}

pub type Obstacle = (Box<dyn RayCast<f64> + Sync>, Isometry<f64>);

#[derive(Serialize, Deserialize)]
pub struct ObstacleData {
    points: Vec<f64>,
    indices: Vec<usize>,
    uvs: Vec<f64>,
    position: [f64; 3],
}

#[derive(Serialize, Deserialize)]
pub struct BoidData {
    pos: [f64; 3],
    vel: [f64; 3],
    rot: [f64; 4],
}

impl From<Boid> for BoidData {
    fn from(boid: Boid) -> Self {
        Self {
            pos: boid.pos_array(),
            vel: boid.vel_array(),
            rot: boid.rot_array(),
        }
    }
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize)]
pub struct BoidsConfig {
    // scaling factors
    time_scale: f64,
    max_vel: f64,
    min_vel: f64,
    max_acc: f64,
    min_acc: f64,

    // rule weightage
    obstacle_w: f64,
    align_w: f64,
    collision_w: f64,
    cohesion_w: f64,

    // limits
    obstacle_dist: f64,
    view_ang: f64,
    view_r: f64,
    collision_r: f64,
}

impl Default for BoidsConfig {
    fn default() -> Self {
        BoidsConfig {
            time_scale: 1.0,
            max_vel: 14.0,
            min_vel: 7.0,
            max_acc: 2.0,
            min_acc: 0.0,
            obstacle_w: 6.0,
            align_w: 0.2,
            collision_w: 1.0,
            cohesion_w: 0.1,
            obstacle_dist: 5.0,
            view_ang: 2.0 * std::f64::consts::PI,
            view_r: 3.0,
            collision_r: 1.3,
        }
    }
}

#[wasm_bindgen]
pub struct Boids {
    obstacles: Vec<Obstacle>,
    boids: Vec<Boid>,
    config: BoidsConfig,
}

#[wasm_bindgen]
impl Boids {
    fn create_boids(boids_data: Vec<BoidData>) -> Vec<Boid> {
        boids_data.iter().fold(Vec::new(), |mut acc, d| {
            acc.push(Boid::new(d.pos, d.vel));
            acc
        })
    }

    fn create_obstacles(obstacle_data: Vec<ObstacleData>) -> Vec<Obstacle> {
        obstacle_data.iter().fold(Vec::new(), |mut res, d| {
            let ObstacleData {
                points,
                indices,
                uvs,
                position,
            } = d;
            let points = points.chunks(3).fold(Vec::new(), |mut acc, x| {
                acc.push(Point3::from_slice(x));
                acc
            });
            let indices = indices.chunks(3).fold(Vec::new(), |mut acc, x| {
                acc.push(Point3::from_slice(x));
                acc
            });
            let uvs = Some(uvs.chunks(2).fold(Vec::new(), |mut acc, x| {
                acc.push(Point2::from_slice(x));
                acc
            }));
            let position = Isometry::translation(position[0], position[1], position[2]);
            res.push((Box::new(TriMesh::new(points, indices, uvs)), position));
            res
        })
    }

    pub fn boids_iteration(&mut self, delta_time: f64) -> JsValue {
        set_panic_hook();
        let delta_time = match delta_time.is_nan() {
            true => 0.0,
            false => delta_time,
        };

        let Self {
            boids,
            config,
            obstacles,
        } = self;

        let copy: Vec<Boid> = boids.clone();
        let mut output = Vec::new();
        boids
            .iter_mut()
            .enumerate()
            .for_each(|(i, b): (usize, &mut Boid)| {
                b.frame_update(i, &copy, &obstacles, delta_time, &config);
                output.push(BoidData::from(b.clone()))
            });

        JsValue::from_serde(&output).unwrap()
    }

    pub fn update_config(&mut self, config: JsValue) {
        self.config = config.into_serde().unwrap();
    }
}

#[wasm_bindgen]
pub fn boids_config() -> JsValue {
    JsValue::from_serde(&BoidsConfig::default()).unwrap()
}

#[wasm_bindgen]
pub fn boids_initialize(obstacle_data: JsValue, boids_data: JsValue, config: JsValue) -> Boids {
    set_panic_hook();
    let obstacle_data = obstacle_data.into_serde().unwrap();
    let boids_data = boids_data.into_serde().unwrap();
    let config = config.into_serde().unwrap();
    let obstacles = Boids::create_obstacles(obstacle_data);
    let boids = Boids::create_boids(boids_data);

    Boids {
        obstacles,
        boids,
        config,
    }
}

use ncollide3d::math::Isometry;
use ncollide3d::nalgebra::{Point2, Point3};
use ncollide3d::query::RayCast;
use ncollide3d::shape::TriMesh;
use rayon::prelude::*;
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

mod boid;
use boid::Boid;

pub fn set_panic_hook() {
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
}

#[wasm_bindgen]
#[derive(Debug, Serialize, Deserialize)]
pub struct ObstacleData {
    points: Vec<[f64; 3]>,
    indices: Vec<[usize; 3]>,
    uvs: Vec<[f64; 2]>,
    position: [f64; 3],
}

#[wasm_bindgen]
#[derive(Debug, Serialize, Deserialize)]
pub struct BoidData {
    pos: [f64; 3],
    vel: [f64; 3],
}

impl From<Boid> for BoidData {
    fn from(boid: Boid) -> Self {
        Self {
            pos: boid.pos_array(),
            vel: boid.vel_array(),
        }
    }
}

#[wasm_bindgen]
#[derive(Debug, Serialize, Deserialize)]
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

#[wasm_bindgen]
pub struct Boids {
    obstacles: Vec<(Box<dyn RayCast<f64> + Sync>, Isometry<f64>)>,
    boids: Vec<Boid>,
    config: BoidsConfig,
}

#[wasm_bindgen]
impl Boids {
    pub fn new(
        // obstacle_data: Vec<ObstacleData>,
        // boids_data: Vec<BoidData>,
        // config: BoidsConfig,
        obstacle_data: JsValue,
        boids_data: JsValue,
        config: JsValue,
    ) -> Boids {
        set_panic_hook();
        let obstacle_data = obstacle_data.into_serde().unwrap();
        let boids_data = boids_data.into_serde().unwrap();
        let config = config.into_serde().unwrap();
        let obstacles = Self::create_obstacles(obstacle_data);
        let boids = Self::create_boids(boids_data);

        Boids {
            obstacles,
            boids,
            config,
        }
    }

    fn create_boids(boids_data: Vec<BoidData>) -> Vec<Boid> {
        set_panic_hook();

        let mut boids = Vec::new();

        for d in boids_data {
            boids.push(Boid::new(d.pos, d.vel))
        }

        boids
    }

    fn create_obstacles(
        obstacle_data: Vec<ObstacleData>,
    ) -> Vec<(Box<dyn RayCast<f64> + Sync>, Isometry<f64>)> {
        set_panic_hook();

        let mut obstacles: Vec<(Box<dyn RayCast<f64> + Sync>, Isometry<f64>)> = Vec::new();

        for d in obstacle_data.iter() {
            let points = d.points.iter().map(|x| Point3::from_slice(x)).collect();
            let indices = d.indices.iter().map(|x| Point3::from_slice(x)).collect();
            let uvs = Some(d.uvs.iter().map(|x| Point2::from_slice(x)).collect());
            let position = Isometry::translation(d.position[0], d.position[1], d.position[2]);
            obstacles.push((Box::new(TriMesh::new(points, indices, uvs)), position))
        }

        obstacles
    }

    pub fn boids_iteration(&mut self, delta_time: f64) -> JsValue {
        set_panic_hook();

        let Self {
            boids,
            config,
            obstacles,
        } = self;

        let copy: Vec<Boid> = boids.clone();

        // compute new boxy velocity and set it
        boids
            .par_iter_mut() // from iter_mut
            .enumerate()
            .for_each(|(i, b): (usize, &mut Boid)| {
                b.frame_update(i, &copy, &obstacles, delta_time, &config)
            });

        let boids_data = boids
            .iter()
            .map(|b| BoidData::from(b.clone()))
            .collect::<Vec<BoidData>>();
        JsValue::from_serde(&boids_data).unwrap()
    }
}

#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        assert_eq!(2 + 2, 4);
    }
}

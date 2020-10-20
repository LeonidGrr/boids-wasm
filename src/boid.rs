use lazy_static::lazy_static;
use ncollide3d::nalgebra::clamp;
use ncollide3d::nalgebra::geometry::UnitQuaternion;
use ncollide3d::nalgebra::{Point3, Vector3, Vector4};
use ncollide3d::query::Ray;

use crate::BoidsConfig;
use crate::Obstacle;

/// Boid struct is a point with a velocity
#[derive(Clone)]
pub struct Boid {
    pub pos: Point3<f64>,
    pub vel: Vector3<f64>,
}

impl Boid {
    /// Create new boid
    pub fn new(pos: [f64; 3], vel: [f64; 3]) -> Self {
        Boid {
            pos: Point3::from(Vector3::from(pos)),
            vel: Vector3::from(vel),
        }
    }

    /// Return position as array
    pub fn pos_array(&self) -> [f64; 3] {
        self.pos.coords.into()
    }

    /// Return velocity as array
    pub fn vel_array(&self) -> [f64; 3] {
        self.vel.into()
    }

    /// Update boid for each frame
    pub fn frame_update(
        &mut self,
        i: usize,
        copy: &[Boid],
        obs: &[Obstacle],
        delta_time: f64,
        config: &BoidsConfig,
    ) {
        let BoidsConfig {
            time_scale,
            min_vel,
            max_vel,
            ..
        } = *config;

        // update position
        self.pos += self.vel * delta_time * time_scale;

        // update velocity
        let mut new_vel = self.vel + self.apply_rules(i, copy, obs, config);
        new_vel.set_magnitude(clamp(new_vel.magnitude(), min_vel, max_vel));
        self.vel = new_vel;
    }

    /// return Rotation from y-axis towards velocity
    pub fn rot_array(&self) -> [f64; 4] {
        let rot: Vector4<f64> = *UnitQuaternion::rotation_between(&Vector3::y_axis(), &self.vel)
            .unwrap_or(UnitQuaternion::from_axis_angle(
                &Vector3::x_axis(),
                std::f64::consts::PI,
            ))
            .as_vector();
        rot.into()
    }

    /// Return unobstructed direction closest to current velocity
    fn unobstructed_dir(&self, obs: &[Obstacle], config: &BoidsConfig) -> Option<Vector3<f64>> {
        // create a rotation to orient ray directions along velocity
        let ray_axis: Vector3<f64> = Vector3::new(0.0, 0.0, 1.0);
        let rot = UnitQuaternion::rotation_between(&ray_axis, &self.vel).unwrap_or(
            UnitQuaternion::from_axis_angle(&Vector3::x_axis(), std::f64::consts::PI),
        );

        let mut best_dir: Option<Vector3<f64>> = None;
        for dir in RAY_DIRS.iter() {
            let ray = Ray {
                origin: self.pos,
                dir: rot * dir,
            };

            // if direction is unobstructed store it
            // after correcting it's orientation
            if !collided(obs, ray, config) {
                best_dir = Some(rot * dir);
                break;
            }
        }

        best_dir
    }

    /// Calculate clamped acceleration
    fn calc_acc(&self, vel: &Vector3<f64>, config: &BoidsConfig) -> Vector3<f64> {
        let BoidsConfig {
            max_acc,
            max_vel,
            min_acc,
            ..
        } = *config;

        let mut acc = vel.normalize() * max_vel - self.vel;
        acc.set_magnitude(clamp(acc.magnitude(), min_acc, max_acc));
        acc
    }

    /// Apply rules to calculate acceleration
    fn apply_rules(
        &self,
        i: usize,
        copy: &[Boid],
        obs: &[Obstacle],
        config: &BoidsConfig,
    ) -> Vector3<f64> {
        let BoidsConfig {
            view_ang,
            view_r,
            collision_r,
            collision_w,
            cohesion_w,
            obstacle_w,
            align_w,
            ..
        } = *config;
        let mut acc: Vector3<f64> = Vector3::new(0.0, 0.0, 0.0);

        // intialize accumulators
        let mut neighbours: i32 = 0;
        let mut too_near: i32 = 0;
        let mut alignment: Vector3<f64> = Vector3::new(0.0, 0.0, 0.0);
        let mut cohesion: Vector3<f64> = Vector3::new(0.0, 0.0, 0.0);
        let mut collision: Vector3<f64> = Vector3::new(0.0, 0.0, 0.0);

        // aggregate neighbour information
        for (index, b) in copy.iter().enumerate() {
            // ignore self
            if index == i {
                continue;
            }

            // only look within viewing angle
            let separation = b.pos.coords - self.pos.coords;
            if b.vel.angle(&separation) >= view_ang {
                continue;
            }

            // only look within viewing radius
            if separation.magnitude() >= view_r {
                continue;
            }

            // update accumulators
            neighbours += 1;
            alignment += b.vel;
            cohesion += b.pos.coords;
            if separation.magnitude() < collision_r {
                too_near += 1;
                collision -= separation / separation.magnitude();
            }
        }

        if neighbours != 0 {
            alignment /= neighbours as f64;
            cohesion = (cohesion / neighbours as f64) - self.pos.coords;

            acc += self.calc_acc(&alignment, config) * align_w;
            acc += self.calc_acc(&cohesion, config) * cohesion_w;
        }

        if too_near != 0 {
            acc += self.calc_acc(&collision, config) * collision_w;
        }

        // check if current heading is obstructed
        let cur_ray: Ray<f64> = Ray {
            origin: self.pos,
            dir: self.vel.normalize(),
        };

        if collided(obs, cur_ray, config) {
            // try to find an unobstructed direction
            // only affect acceleration if unobstructed direction exists
            if let Some(dir) = self.unobstructed_dir(obs, config) {
                acc += self.calc_acc(&dir, config) * obstacle_w;
            }
        }

        acc
    }
}

lazy_static! {
    static ref RAY_DIRS: [Vector3<f64>; 100] = {
        let mut ray_dirs = [Vector3::new(0.0, 0.0, 0.0); 100];

        // initialize ray angles
        let golden_ratio: f64 = 1.618;
        let angle_increment = std::f64::consts::PI * 2.0 * golden_ratio;

        for (i, dir) in ray_dirs.iter_mut().enumerate() {
            let t: f64 = i as f64 / 100.0;
            let inclination: f64 = (1.0 - 2.0 * t).acos();
            let azimuth: f64 = angle_increment * i as f64;

            let x = inclination.sin() * azimuth.cos();
            let y = inclination.sin() * azimuth.sin();
            let z = inclination.cos();
            *dir = Vector3::new(x, y, z);
        }

        ray_dirs
    };
}

/// Check if a ray collides with the given obstacles
fn collided(obs: &[Obstacle], ray: Ray<f64>, config: &BoidsConfig) -> bool {
    obs.iter()
        .any(|(shape, iso)| shape.intersects_ray(iso, &ray, config.obstacle_dist))
}

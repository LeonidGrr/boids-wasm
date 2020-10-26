/* tslint:disable */
/* eslint-disable */
/**
* @returns {any}
*/
export function boids_config(): any;
/**
* @param {any} obstacle_data
* @param {any} boids_data
* @param {any} config
* @returns {Boids}
*/
export function boids_initialize(obstacle_data: any, boids_data: any, config: any): Boids;
/**
*/
export class Boids {
  free(): void;
/**
* @param {number} delta_time
* @returns {any}
*/
  boids_iteration(delta_time: number): any;
/**
* @param {any} config
*/
  update_config(config: any): void;
/**
* @param {any} obstacle_data
*/
  update_obstacles(obstacle_data: any): void;
/**
* @param {any} boids_data
*/
  update_boids(boids_data: any): void;
}
/**
*/
export class BoidsConfig {
  free(): void;
}

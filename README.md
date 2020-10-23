Rust-WebAssembly Boids based on https://blog.bitsacm.in/a-fistful-of-boids/

Original paper by Craig W. Reynolds http://www.cs.toronto.edu/~dt/siggraph97-course/cwr87/

Demo (with BabylonJS for rendering): https://leonidgrr.github.io/pet-project-zero/

Notes:
- Increasing MAX_VEL and MIN_VEL is a helpful step. It keeps the flock from collapsing on itself due to cohesive forces.
- Low COHESION_W and ALIGN_W is good. It keeps the flock from becoming too uniform.
- Increasing MAX_ACC can make the boids jittery because a large acceleration causes sudden changes in velocity.

import {Drone} from 'drone';


/**
 * A system to manage the state transitions and animations for Drones.
 */
export class DroneSystem {
  private drones: ComponentGroup = engine.getComponentGroup(Drone, Transform);
  private droneSpeed: number = 6;
  /**
   * Update all Drones!
   */
  public update(dt: number) {
    for (let entity of this.drones.entities) {
      
      let drone = entity.getComponent(Drone);
      let transform = entity.getComponent(Transform);
      
      if (drone.soundTimer >= 0) {
        entity.getComponent(AudioSource).playOnce();
        drone.soundTimer = -14.928; // length of drone sound.
      }
      drone.soundTimer += dt;
      
      switch(drone.state) {
        case "spawning": {
          this.updateSpawning(drone, transform, dt);
          break;
        }
        case "despawning": {
          this.updateDespawning(drone, transform, dt);
          break;
        }
        case "hover": {
          this.updateHover(drone, transform, dt);
          break;
        }
        case "wander": {
          this.updateWander(drone, transform, dt);
          break;
        }
        case "goto": {
          this.updateGoto(drone, transform, dt);
          break;
        }
      }
    }
  }
  
  /**
   * Update drone position and state while spawning.
   */
  private updateSpawning(drone: Drone, transform: Transform, dt: number) {
    drone.spawnTimer += dt;
    transform.position.z -= dt; // rise at 1m/s TODO make better
    if (drone.spawnTimer > 4) {
      log("Drone transitioning to wandering!");
      drone.spawnTimer = 0;
      drone.state = "wander";
      drone.chooseRandomTarget();
    }
  }
  
  private updateDespawning(drone: Drone, transform: Transform, dt: number) {
    drone.spawnTimer += dt;
    transform.position.y -= dt; // TODO
    if (drone.spawnTimer > 4) {
      drone.state = "";
      drone.spawnTimer = 0;
      drone.resolveDespawn(); // Let anybody waiting know despawn done.
    }
  }
  
  /**
   * Update drone position and state while hovering (and following the user).
   */
  private updateHover(drone: Drone, transform: Transform, dt: number) {
    
    // Check if user escaped while it was hovering, and chase them down if so.
    if (transform.position.subtract(Camera.instance.position).length() > 20) {
      drone.state = "wander";
      drone.speed = 8; // Enable it to catch up!
      return;
    }
    
    transform.position.y = Math.cos(drone.hoverAngle) * 0.1 + drone.hoverHeight; // 0.1m hover amplitude.
    
    drone.hoverAngle += Math.PI * 2 * dt; // 0.5-second period on the hover.
    
    if (Math.random() > 299/300) { // Should happen roughly once in 5 seconds.
      log("Drone transitioning to wandering!");
      drone.state = "wander"; // Already should have a target picked.
    }
  }
  
  /**
   * Update drone position and state while wandering (and following the user).
   */
  private updateWander(drone: Drone, transform: Transform, dt: number) {
    
    // Check to make sure target position is still in range of the camera. If not, pick a new one.
    if (drone.targetPos.subtract(Camera.instance.position).length() > 20) {
      drone.chooseRandomTarget();
      drone.speed = 8; // Enable it to catch up!
    }
    
    // Move, and if this move path is done, choose a new wander target, and then possibly transition to hovering!
    if (this.updateTargetMove(drone, transform, dt)) {
      log("Drone wander: arrived at target!");
      drone.chooseRandomTarget();
      drone.speed = 3; // Slow down again if it was catching up.
      
      if (Math.random() > 0.8) {
        log("Drone transitioning to hovering!");
        drone.state = "hover";
        drone.hoverHeight = transform.position.y;
      }
    }
  }
  
  /**
   * Update drone position and state while being instructed to go somewhere.
   *
   */
  private updateGoto(drone: Drone, transform: Transform, dt: number) {
    
    // If we're already there, don't bother.
    if (drone.gotoResolved) {
      return;
    }
    
    // Resolve our goto promise, if needed.
    if (this.updateTargetMove(drone, transform, dt)) {
      drone.resolveGoto();
    }
  }
  
  /**
   * Update drone position towards its target.
   * @returns true if at the target..
   */
  private updateTargetMove(drone: Drone, transform: Transform, dt: number): boolean {
    
    // Get our offset to the target location, plus distance to there.
    let delta = drone.targetPos.subtract(transform.position);
    let moveDist = delta.length();
    if (moveDist < 0.0001) {
      return true;
    }
    
    // Check if we're within one move of getting there.
    let doneMove = moveDist < dt * drone.speed;
    if (!doneMove) {
      moveDist = dt * drone.speed;
    }
    delta = delta.normalize().scale(moveDist);
    
    // Now move the drone!
    transform.position.set(delta.x + transform.position.x, delta.y + transform.position.y, delta.z + transform.position.z);
    
    return doneMove;
  }
}

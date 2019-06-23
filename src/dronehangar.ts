import {Drone} from 'drone';

/**
 * Represents the drone hangar.
 */
export class DroneHangar {
  
  public rootGroup: Entity;
  
  public playerHasDrone: boolean;
  public playerDrone: Entity;
  
  constructor(transform: Transform) {
    
    this.playerHasDrone = false;
    
    this.rootGroup = new Entity();
    this.rootGroup.addComponent(transform);
    engine.addEntity(this.rootGroup);
    
    let dummyHangar = new Entity();
    dummyHangar.setParent(this.rootGroup);
    dummyHangar.addComponent(new GLTFShape('models/drone/DroneHut.glb'));
    dummyHangar.addComponent(new Transform({scale: new Vector3(0.8, 0.8, 0.8)}));
    
    // When drone hangar is clicked, make it spawn a drone.
    dummyHangar.addComponent(new OnClick(() => {
      this.createDrone();
    }));
  }
  
  public createDrone() {
    
    if (this.playerHasDrone) {
      return;
    }
    
    this.playerHasDrone = true;
    
    // Our drone entity.
    this.playerDrone = new Entity();
    this.playerDrone.addComponent(new GLTFShape('models/drone/vacuum_spinning.glb'));
    this.playerDrone.addComponent(new Transform({
      position: this.getDroneSpot(),
      scale: new Vector3(0.2, 0.2, 0.2)
    }));
    this.playerDrone.addComponent(new Drone(this)); // Make the drone entity have a Drone component!
    
    // Drone animation:
    let animator = new Animator();
    let spinClip = new AnimationState("rotations");
    animator.addClip(spinClip);
    this.playerDrone.addComponent(animator);
    spinClip.play();
    
    // Add a sound to the drone!
    let droneSoundClip = new AudioClip('sounds/dronesound.mp3');
    let droneSoundSource = new AudioSource(droneSoundClip);
    droneSoundSource.loop = true;
    droneSoundSource.playing = true;
    this.playerDrone.addComponent(droneSoundSource);
    
    engine.addEntity(this.playerDrone);
  }
  
  public removeDrone() {
    if (!this.playerHasDrone) {
      return;
    }
    
    engine.removeEntity(this.playerDrone);
    this.playerDrone = undefined;
  }
  
  /**
   * Get where the drone spawns to or despawns from, in global space.
   */
  public getDroneSpot() {
    let transf = this.rootGroup.getComponent(Transform);
    
    return transf.position.clone(); // TODO shouldn't be hangar's position?
  }
}

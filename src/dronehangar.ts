import {Drone} from 'drone';

/**
 * Represents the drone hangar.
 */
export class DroneHangar {
  
  public rootGroup: Entity;
  public hangar: Entity;
  public hangarAnimator: Animator;
  
  public playerHasDrone: boolean;
  public playerDrone: Entity;
  
  constructor(transform: Transform) {
    
    this.playerHasDrone = false;
    
    this.rootGroup = new Entity();
    this.rootGroup.addComponent(transform);
    engine.addEntity(this.rootGroup);
    
    this.hangar = new Entity();
    this.hangar.setParent(this.rootGroup);
    this.hangar.addComponent(new GLTFShape('models/drone/DroneHut.glb'));
    this.hangar.addComponent(new Transform({scale: new Vector3(0.8, 0.8, 0.8)}));
    
    // Enable animations of hangar.
    this.hangarAnimator = new Animator();
    this.hangar.addComponent(this.hangarAnimator);
    
    // Twirling radar animation
    let radarSpinClip = new AnimationState("Cylinder.001Action.001");
    this.hangarAnimator.addClip(radarSpinClip);
    radarSpinClip.play();
    
    // When drone hangar is clicked, make it spawn a drone.
    this.hangar.addComponent(new OnClick(() => {
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
    droneSoundSource.volume = 0.3;
    this.playerDrone.addComponent(droneSoundSource);
    
    engine.addEntity(this.playerDrone);
    
    // Also do SFX for launch!
    this.playLaunchSound();
    this.playLaunchAnimation();
  }
  
  public playLaunchAnimation() {
    let doorOpenClip = new AnimationState("Cube.001Action");
    this.hangarAnimator.addClip(doorOpenClip);
    doorOpenClip.play();
  }
  
  public playLaunchSound() {
    let clip = new AudioClip('sounds/ecogames_drone_launch.mp3');
    let source = new AudioSource(clip);
    source.playing = true;
    source.volume = 2;
    this.rootGroup.addComponent(source);
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
    
    return transf.position.clone().add(new Vector3(0, 1.6, 0)); // TODO shouldn't be hangar's position?
  }
}

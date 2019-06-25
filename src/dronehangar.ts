import {Drone} from 'drone';

/**
 * Represents the drone hangar.
 */
export class DroneHangar {
  
  public rootGroup: Entity;
  public hangar: Entity;
  public doorOpenClip: AnimationState;
  
  public playerHasDrone: boolean;
  public playerDrone: Entity;
  
  constructor(transform: Transform) {
    
    this.playerHasDrone = false;
    
    this.rootGroup = new Entity();
    this.rootGroup.addComponent(transform);
    engine.addEntity(this.rootGroup);
    
    this.hangar = new Entity();
    this.hangar.setParent(this.rootGroup);
    this.hangar.addComponent(new GLTFShape('models/drone/DroneHut-material-only.gltf'));
    this.hangar.addComponent(new Transform({scale: new Vector3(0.8, 0.8, 0.8)}));
    
    // Enable animations of hangar.
    let hangarAnimator = new Animator();
    this.hangar.addComponent(hangarAnimator);
    
    // Twirling radar animation
    let radarSpinClip = new AnimationState("radar-rotate");
    hangarAnimator.addClip(radarSpinClip);
    radarSpinClip.play();
    
    // Set up hangar door anim.
    this.doorOpenClip = new AnimationState("open-door");
    hangarAnimator.addClip(this.doorOpenClip);
    this.doorOpenClip.looping = false;
    
    // Launch button!
    let button = new Entity();
    let cyl = new CylinderShape();
    cyl.radiusTop = 1;
    button.addComponent(cyl);
    let red = new Material();
    red.albedoColor = Color3.Red();
    button.addComponent(red);
    button.addComponent(new Transform({
      position: new Vector3(-1.6, 0.6, 0),
      rotation: Quaternion.Euler(0, 0, 90),
      scale: new Vector3(0.3, 0.1, 0.3)
    }));
    button.setParent(this.rootGroup);
    
    // When button is clicked, make it spawn a drone.
    button.addComponent(new OnClick(() => {
      this.createDrone();
    }));
    
    // Instructions billboards
    let billboard1 = new Entity();
    billboard1.addComponent(new PlaneShape());
    billboard1.addComponent(new Transform({
      position: new Vector3(-1.7, 1.6, 2.75),
      rotation: Quaternion.Euler(0, 90, 180),
      scale: new Vector3(1.4, 1.4, 1)
    }));
    let billMat1 = new Material();
    billMat1.albedoTexture = new Texture('textures/how-to-play-1.png');
    billboard1.addComponent(billMat1);
    billboard1.setParent(this.rootGroup);
    
    let billboard2 = new Entity();
    billboard2.addComponent(new PlaneShape());
    billboard2.addComponent(new Transform({
      position: new Vector3(-1.7, 1.6, -2.75),
      rotation: Quaternion.Euler(0, 90, 180),
      scale: new Vector3(1.4, 1.4, 1)
    }));
    let billMat2 = new Material();
    billMat2.albedoTexture = new Texture('textures/how-to-play-2.png');
    billboard2.addComponent(billMat2);
    billboard2.setParent(this.rootGroup);
    
    let billboard3 = new Entity();
    billboard3.addComponent(new PlaneShape());
    billboard3.addComponent(new Transform({
      position: new Vector3(-1.4, 2, -5.2),
      rotation: Quaternion.Euler(0, 90, 180),
      scale: new Vector3(2, 2, 1)
    }));
    let billMat3 = new Material();
    billMat3.transparencyMode = 2;
    billMat3.albedoTexture = new Texture('textures/ecogames_trash.png');
    billboard3.addComponent(billMat3);
    billboard3.setParent(this.rootGroup);

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
    droneSoundSource.loop = true; // is broken
    droneSoundSource.playing = true;
    droneSoundSource.volume = 0.1;
    this.playerDrone.addComponent(droneSoundSource); // we repeatedly play the sound source in the DroneSystem.
    
    engine.addEntity(this.playerDrone);
    
    // Also do SFX for launch!
    this.playLaunchSound();
    this.playLaunchAnimation();
  }
  
  public playLaunchAnimation() {
    this.doorOpenClip.play();
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

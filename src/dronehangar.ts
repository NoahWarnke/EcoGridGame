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
    dummyHangar.addComponent(new BoxShape());
    dummyHangar.addComponent(new Transform({position: new Vector3(0, 2.5, 0), scale: new Vector3(4, 5, 8)}));
    
    dummyHangar.addComponent(new OnClick(() => {
      // When drone hangar is clicked, make it spawn a drone. Better animations later.
      
      if (this.playerHasDrone) {
        // TODO Make drone return.
        return;
      }
      
      this.playerHasDrone = true;
      
      // Our drone entity.
      this.playerDrone = new Entity();
      this.playerDrone.addComponent(new GLTFShape('models/drone/vacuum.gltf'));
      this.playerDrone.addComponent(new Transform({
        position: new Vector3(transform.position.x - 6, transform.position.y + 2.5, transform.position.z),
        scale: new Vector3(0.2, 0.2, 0.2)
      }));
      this.playerDrone.addComponent(new Drone(this)); // Make the drone entity have a Drone component!
      
      // Add a sound to the drone!
      let droneSoundClip = new AudioClip('sounds/dronesound.mp3');
      let droneSoundSource = new AudioSource(droneSoundClip);
      droneSoundSource.loop = true;
      droneSoundSource.playing = true;
      this.playerDrone.addComponent(droneSoundSource);
      
      droneSoundSource.playing = true;
      
      engine.addEntity(this.playerDrone);
    }));
  }
}

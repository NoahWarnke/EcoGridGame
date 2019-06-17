import {Drone} from 'drone';

/**
 * Represents the drone hangar.
 */
export default class DroneHangar {
  
  rootGroup: Entity;
  
  playerHasDrone: boolean;
  playerDrone: Entity;
  
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
      if (this.playerHasDrone) {
        // Make drone return.
        return;
      }
      
      this.playerHasDrone = true;
      
      // Our drone entity.
      this.playerDrone = new Entity();
      this.playerDrone.addComponent(new GLTFShape('models/vacuum.gltf'));
      this.playerDrone.addComponent(new Transform({
        position: new Vector3(transform.position.x - 6, transform.position.y + 2.5, transform.position.z),
        scale: new Vector3(0.2, 0.2, 0.2)
      }));
      this.playerDrone.addComponent(new Drone(this)); // Make the drone entity have a Drone component!
      engine.addEntity(this.playerDrone);
    }));
  }
}

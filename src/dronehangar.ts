import Drone from 'drone';

/**
 * Represents the drone hangar.
 */
export default class DroneHangar {
  
  rootGroup: Entity;
  
  playerHasDrone: boolean;
  playerDrone: Drone;
  
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
      
      // Spawn a new drone.
      this.playerDrone = new Drone(this.rootGroup.getComponent(Transform), this);
    }));
  }
}

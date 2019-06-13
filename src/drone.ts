import DroneHangar from 'dronehangar';

/**
 * Represents a drone.
 */
export default class Drone {
  
  hangar: DroneHangar;
  state: string;
  
  constructor(transform: Transform, hangar: DroneHangar) {
    
    this.hangar = hangar;
    this.state = "spawning";
    
    let vacuum = new Entity();
    vacuum.addComponent(new GLTFShape('models/vacuum.gltf'));
    vacuum.addComponent(new Transform({
      position: new Vector3(transform.position.x - 6, transform.position.y + 2.5, transform.position.z),
      scale: new Vector3(0.2, 0.2, 0.2)
    }));
    engine.addEntity(vacuum);
  }
}

import DroneHangar from 'dronehangar';

/**
 * Represents a drone.
 */
 @Component('drone')
export class Drone {
  
  public hangar: DroneHangar;
  
  public entity: IEntity;
  
  public state: string;
  
  public spawnTimer = 0;
  
  public speed = 3;
  
  public targetPos: Vector3; // TODO convert to bezier path
  
  public hoverAngle: number;
  
  public hoverHeight: number;
  
  public resolveGoto: Function;
  
  public gotoResolved: boolean;
  
  /**
   * Construct a new Drone.
   */
  constructor(hangar: DroneHangar) {
    
    // Our hangar.
    this.hangar = hangar;
    
    // Our drone's state.
    this.state = "spawning";
    
    this.targetPos = new Vector3();
    
    this.hoverAngle = 0;
    
    this.hoverHeight = 0;
    
    this.gotoResolved = false;
  }
  
  /**
   * Instruct the drone to drop what it's doing and go to the given point.
   * @returns a Promise that resolves when the drone arrives at the target.
   */
  public goto(targetPos: Vector3): Promise<void> {
    log("Drone forced transition to goto!");
    this.state = "goto";
    this.targetPos = targetPos;
    this.speed = 3;
    this.gotoResolved = false;
    
    return new Promise((resolve, reject) => {
      this.resolveGoto = () => {
        log ("Drone goto promise resolving! Still in goto state, just not moving.");
        this.gotoResolved = true;
        this.resolveGoto = undefined;
        resolve();
      }
    });
  }
  
  /**
   * Instruct the drone to stop what it's doing and resume wandering.
   */
  public resumeWander() {
    log("Drone forced transition to wander!");
    this.state = "wander";
    this.chooseRandomTarget();
  }
  
  /**
   * Choose a target for the Drone, within 20m
   */
  public chooseRandomTarget() {
    
    let random = new Vector3(
      Math.random() - 0.5,
      Math.random() * 0.1 + 0.05, // always over y=0.
      Math.random() - 0.5
    );
    random = random.normalize().scale(Math.random() * 15 + 5); // 20 is max distance from user.
    this.targetPos = random.add(Camera.instance.position);
  }
}
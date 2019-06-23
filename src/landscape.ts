
/**
 * Creates all the landscape items with no interactions.
 */
export class Landscape {
  
  private heightmap: IEntity;
  private pond: IEntity;
  private trees: IEntity[];
  
  constructor() {
    this.createHeightmap();
    this.createPond();
    this.createTrees();
  }
  
  private createHeightmap() {
    // Heightmap.
    this.heightmap = new Entity();
    this.heightmap.addComponent(new Transform({
      position: new Vector3(40, 0, 48),
      scale: new Vector3(6.804, 10, 8.164),
      rotation: Quaternion.Euler(0, 180, 0)
    }));
    this.heightmap.addComponent(new GLTFShape('models/landscape/terrain-smooth-separate.gltf'));
    engine.addEntity(this.heightmap);
  }
  
  private createPond() {
    // Pond surface.
    this.pond = new Entity();
    this.pond.addComponent(new Transform({
      position: new Vector3(36, 2, 65),
      scale: new Vector3(50, 30, 1),
      rotation: Quaternion.Euler(90, 0, 0)
    }));
    this.pond.addComponent(new PlaneShape());
    let lightblue = new Material();
    lightblue.albedoColor = new Color3(0.5, 0.5, 1);
    lightblue.alpha = 0.8;
    lightblue.specularIntensity = 0.5;
    lightblue.hasAlpha = true;
    this.pond.addComponent(lightblue);
    engine.addEntity(this.pond);
  }
  
  private createTrees() {
    
  }
}

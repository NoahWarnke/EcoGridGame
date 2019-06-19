
export class Landscape {
  
  constructor() {
    // Heightmap.
    let heightmap = new Entity();
    heightmap.addComponent(new Transform({
      position: new Vector3(40, 0, 48),
      scale: new Vector3(6.8, 10, 8.145),
      rotation: Quaternion.Euler(0, 180, 0)
    }));
    heightmap.addComponent(new GLTFShape('models/landscape/heightmap_nocollide.glb'));
    engine.addEntity(heightmap);


    let pond = new Entity();
    pond.addComponent(new Transform({
      position: new Vector3(35, 2, 60),
      scale: new Vector3(50, 40, 1),
      rotation: Quaternion.Euler(90, 0, 0)
    }));
    pond.addComponent(new PlaneShape());
    let lightblue = new Material();
    lightblue.albedoColor = new Color3(0.5, 0.5, 1);
    pond.addComponent(lightblue);
    engine.addEntity(pond);
  }
}

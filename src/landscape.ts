import {Carryable, CarryableSystem} from 'carryable';


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
    this.createBillboard();
    this.createTrees();
    
    engine.addSystem(new CarryableSystem()); // temp
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
  
  private createBillboard() {
    let billboard = new Entity();
    billboard.addComponent(new BoxShape());
    billboard.addComponent(new Transform({
      position: new Vector3(69, 6.3, 85),
      rotation: Quaternion.Euler(0, 45, 0),
      scale: new Vector3(8, 4, 0.1)
    }));
    let mat = new Material();
    mat.albedoColor = Color3.Black();
    billboard.addComponent(mat);
    
    let message = new Entity();
    message.addComponent(new PlaneShape());
    message.addComponent(new Transform({
      position: new Vector3(0, 0, 2),
      scale: new Vector3(0.975, -0.95, 1)
    }));
    let billMat = new Material();
    billMat.albedoTexture = new Texture('textures/ecogames_billboard.png');
    message.addComponent(billMat);
    message.setParent(billboard);
    
    engine.addEntity(billboard);
  }
  
  private createTrees() {
    this.trees = [];
    
    // One entry per type of tree (or other natural item).
    let treeTypes = {
      dead: {model: new GLTFShape('models/landscape/Tree2.glb'), scale: 0.1},
      bushy: {model: new GLTFShape('models/landscape/Tree3.glb'), scale: 0.1},
      bush1: {model: new GLTFShape('models/landscape/Bush1.glb'), scale: 0.1},
      bush2: {model: new GLTFShape('models/landscape/Bush2.glb'), scale: 0.1},
      flower1: {model: new GLTFShape('models/landscape/Flower1.glb'), scale: 0.1},
      flower2: {model: new GLTFShape('models/landscape/Flower2.glb'), scale: 0.1},
      flower3: {model: new GLTFShape('models/landscape/Flower3.glb'), scale: 0.1},
      flower4: {model: new GLTFShape('models/landscape/Flower4.glb'), scale: 0.1},
      wheat: {model: new GLTFShape('models/landscape/Grass1.glb'), scale: 0.1},
      small_grass: {model: new GLTFShape('models/landscape/Grass2.glb'), scale: 0.1},
      large_grass: {model: new GLTFShape('models/landscape/Grass3.glb'), scale: 0.1},
      mush1: {model: new GLTFShape('models/landscape/Mushroom1.glb'), scale: 0.1},
      mush2: {model: new GLTFShape('models/landscape/Mushroom2.glb'), scale: 0.1},
      mush3: {model: new GLTFShape('models/landscape/Mushroom3.glb'), scale: 0.1},
      rocks: {model: new GLTFShape('models/landscape/Rocks.glb'), scale: 0.1},
      maple: {model: new GLTFShape('models/landscape/Tree4.glb'), scale: 0.1},
      maple_red: {model: new GLTFShape('models/landscape/Tree5.glb'), scale: 0.1},
      slim_palm: {model: new GLTFShape('models/landscape/Tree6.glb'), scale: 0.1},
      wide_palm: {model: new GLTFShape('models/landscape/Tree7.glb'), scale: 0.1},
      high_palm: {model: new GLTFShape('models/landscape/Tree8.glb'), scale: 0.1},
      banana: {model: new GLTFShape('models/landscape/Tree9.glb'), scale: 0.1},
      slim_banana: {model: new GLTFShape('models/landscape/Tree10.glb'), scale: 0.1},
      ficus: {model: new GLTFShape('models/landscape/Tree11.glb'), scale: 0.1}
    };
    
    // One entry per actual instance of a tree.
    let trees = [
      {transform: {position: new Vector3(40, 3, 40), rotation: Quaternion.Euler(13.4, 7, 57.4)}, type: treeTypes.bushy},
      {transform: {position: new Vector3(60, 3, 40), rotation: Quaternion.Euler(7.5, 3.3, 75.5)}, type: treeTypes.bushy},
      {transform: {position: new Vector3(60, 3, 40), rotation: Quaternion.Euler(25.9, 2.3, 50)}, type: treeTypes.dead},
    ]
    
    // Create tree entities!
    for (let i = 0; i < trees.length; i++) {
      let tree = new Entity();
      let treeTransform = new Transform({
        position: trees[i].transform.position,
        rotation: trees[i].transform.rotation,
        scale: new Vector3(trees[i].type.scale, trees[i].type.scale, trees[i].type.scale)
      });
      tree.addComponent(treeTransform);
      tree.addComponent(trees[i].type.model);
      
      // Temp
      let treeCarry = new Carryable();
      tree.addComponent(treeCarry);
      tree.addComponent(new OnClick(() => {
        treeCarry.toggleCarry(treeTransform);
      }));
      
      this.trees.push(tree);
      engine.addEntity(tree);
    }
    
    
  }
}

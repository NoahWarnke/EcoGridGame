
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
      flower1: {model: new GLTFShape('models/landscape/Flower1.glb'), scale: 0.05},
      flower2: {model: new GLTFShape('models/landscape/Flower2.glb'), scale: 0.05},
      flower3: {model: new GLTFShape('models/landscape/Flower3.glb'), scale: 0.05},
      flower4: {model: new GLTFShape('models/landscape/Flower4.glb'), scale: 0.05},
      wheat: {model: new GLTFShape('models/landscape/Grass1.glb'), scale: 0.07},
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
      {transform: {position: new Vector3(39.90, 2.29, 35.40), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.dead},
      {transform: {position: new Vector3(13.4, 7, 57.4), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.bushy},
      {transform: {position: new Vector3(7.5, 3.3, 75.5), rotation: Quaternion.Euler(0, -150, 0)}, type: treeTypes.bushy},
      {transform: {position: new Vector3(25.70, 2.02, 50.15), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.maple},

      {transform: {position: new Vector3(61.9, 2.7, 49.45), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.high_palm},
      {transform: {position: new Vector3(66.3, 2.7, 63.2), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.high_palm},

      {transform: {position: new Vector3(30.64, 1.51, 69.0), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.mush1},
      {transform: {position: new Vector3(22.32, 2.14, 54.82), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.mush1},

      {transform: {position: new Vector3(46.21, 1.96, 38.92), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.mush1},
      {transform: {position: new Vector3(61.59, 2.31, 27.86), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.mush1},
      {transform: {position: new Vector3(16.4, -0.43, 10.27), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.mush1},

      {transform: {position: new Vector3(43.58, 3.99, 38.63), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.wheat},
      {transform: {position: new Vector3(48.72, 3.56, 29.05), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.wheat},
      {transform: {position: new Vector3(71.21, 0.78, 2.71), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.wheat},
      {transform: {position: new Vector3(74.17, 1.75, 7.96), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.wheat},
      {transform: {position: new Vector3(77.96, 0.543, 8.126), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.wheat},

      {transform: {position: new Vector3(30.64, -0.319, 5.21), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.ficus},
      {transform: {position: new Vector3(44.84, 5.72, 17.10), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.ficus},
      {transform: {position: new Vector3(57.26, 0.41, 3.72), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.ficus},
      {transform: {position: new Vector3(50.30, 7.43, 18.92), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.ficus},

      {transform: {position: new Vector3(7.41, -0.56, 4.7), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.wide_palm},

      {transform: {position: new Vector3(69.5, 3.14, 11.1), rotation: Quaternion.Euler(0, 0, 0)}, type: treeTypes.maple_red},
      {transform: {position: new Vector3(65.09, 7.50, 79.98), rotation: Quaternion.Euler(0, 80, 0)}, type: treeTypes.maple_red},
      {transform: {position: new Vector3(16.40, -0.43, 10.27), rotation: Quaternion.Euler(0, 160, 0)}, type: treeTypes.maple_red},
      {transform: {position: new Vector3(72.70, 0.99, 43.58), rotation: Quaternion.Euler(0, 130, 0)}, type: treeTypes.maple_red},
      {transform: {position: new Vector3(19.16, 4.58, 32.28), rotation: Quaternion.Euler(0, -50, 0)}, type: treeTypes.maple_red},
      {transform: {position: new Vector3(9.74, 1.62, 23.74), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.maple_red},

      {transform: {position: new Vector3(45.84, 2.56, 36.55), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.flower1},
      {transform: {position: new Vector3(77.90, 0.32, 25.16), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.flower1},
      {transform: {position: new Vector3(78.08, -0.15, 6.89), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.flower2},
      {transform: {position: new Vector3(66.26, 2.65, 8.69), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.flower3},
      {transform: {position: new Vector3(67.53, -0.15, 1.86), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.flower4},

      {transform: {position: new Vector3(15.48, 4.23, 73.40), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.flower2},
      {transform: {position: new Vector3(11.76, 6.49, 75.33), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.flower2},
      {transform: {position: new Vector3(12.53, 7.34, 78.57), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.flower2},
      {transform: {position: new Vector3(11.41, 1, 90.81), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.flower2},
      {transform: {position: new Vector3(40.69, 3.06, 11.74), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.flower2},
      {transform: {position: new Vector3(41.41, 2.53, 7.45), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.flower2},
      {transform: {position: new Vector3(43.56, 3.13, 11.78), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.flower2},
      {transform: {position: new Vector3(46.48, 2.84, 28.87), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.flower2},
      {transform: {position: new Vector3(43.73, 6.24, 18.30), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.flower2},
      {transform: {position: new Vector3(57.53, 3.10, 45.37), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.flower3},
      {transform: {position: new Vector3(63.26, 2.91, 51.92), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.flower3},
      {transform: {position: new Vector3(43.12, 2.88, 36.06), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.flower3},
      {transform: {position: new Vector3(23.56, -1.49, 89.63), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.flower3},
      {transform: {position: new Vector3(33.93, 2.11, 68.53), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.flower3},
      {transform: {position: new Vector3(24.24, 3.03, 53.08), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.flower3},
      {transform: {position: new Vector3(15.81, 8.27, 50.21), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.flower3},
      {transform: {position: new Vector3(12.09, 6.91, 59.42), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.flower3},
      {transform: {position: new Vector3(10.61, 5.64, 64.89), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.flower3},
      {transform: {position: new Vector3(13.14, 5.58, 66.09), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.flower3},
      {transform: {position: new Vector3(16.08, 4.02, 63.76), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.flower3},

      {transform: {position: new Vector3(72.13, -0.14, 92.47), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.flower2},
      {transform: {position: new Vector3(74.91, 0, 85), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.flower3},
      {transform: {position: new Vector3(74.91, 0, 86), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.flower4},
      {transform: {position: new Vector3(77.19, -0.05, 87.11), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.mush2},
      {transform: {position: new Vector3(74.34, 0.04, 90.76), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.mush3},
      {transform: {position: new Vector3(69.92, -1.43, 92.15), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.bush2},

      {transform: {position: new Vector3(22.10, -0.47, 3.10), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.flower1},
      {transform: {position: new Vector3(18.32, -0.47, 1.97), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.flower1},
      {transform: {position: new Vector3(17.23, -0.47, 5.38), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.flower2},
      {transform: {position: new Vector3(19.55, -0.37, 7.97), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.flower3},
      {transform: {position: new Vector3(19.61, -0.48, 7.88), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.flower4},
      {transform: {position: new Vector3(14.58, 2.55, 14.70), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.flower1},
      {transform: {position: new Vector3(7.98, 2.62, 13.39), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.flower1},
      {transform: {position: new Vector3(8.27, 2.64, 30.62), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.flower2},
      {transform: {position: new Vector3(14.93, 5.57, 35.73), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.flower3},
      {transform: {position: new Vector3(12.70, 6.23, 44.23), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.flower4},
      {transform: {position: new Vector3(3.26, 1.73, 53.48), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.flower2},
      {transform: {position: new Vector3(1.01, -0.36, 65.05), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.flower3},

      {transform: {position: new Vector3(70.54, 1.83, 7.48), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.flower2},
      {transform: {position: new Vector3(78.79, -0.42, 5.20), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.flower3},
      {transform: {position: new Vector3(79.03, -0.03, 11.17), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.flower4},
      {transform: {position: new Vector3(75.25, 0.33, 7.19), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.slim_palm},

      {transform: {position: new Vector3(73.19, 6, 24.33), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.slim_palm},
      {transform: {position: new Vector3(74, 5.5, 25), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.flower2},
      {transform: {position: new Vector3(73, 5.5, 23), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.flower3},
      {transform: {position: new Vector3(74, 5.8, 22), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.flower4},

      {transform: {position: new Vector3(60.68, 3.12, 48.16), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.small_grass},
      {transform: {position: new Vector3(58.74, 3.25, 46.65), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.small_grass},
      {transform: {position: new Vector3(56.07, 3.5, 42.6), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.small_grass},

      {transform: {position: new Vector3(14.76, 8, 52.87), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.large_grass},
      {transform: {position: new Vector3(14.05, 8.05, 56.09), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.large_grass},
      {transform: {position: new Vector3(12.1, 6.18, 73.2), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.large_grass},
      {transform: {position: new Vector3(12.2, 6, 70.52), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.large_grass},

      {transform: {position: new Vector3(26.7, 4.553, 23.48), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.banana},
      {transform: {position: new Vector3(19.756, -0.9, 5.53), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.banana},
      {transform: {position: new Vector3(11.15, 2.68, 13.43), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.banana},
      {transform: {position: new Vector3(4.24, -0.61, 87.26), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.banana},
      {transform: {position: new Vector3(45.79, 1.588, 91), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.banana},
      {transform: {position: new Vector3(56, 3.05, 90.47), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.banana},
      {transform: {position: new Vector3(68.98, 6.89, 74.22), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.banana},

      {transform: {position: new Vector3(67.93, 2.57, 89.79), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.slim_banana},
      {transform: {position: new Vector3(77.11, -0.078, 82.895), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.slim_banana},
      {transform: {position: new Vector3(78.91, -0.078, 76.03), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.slim_banana},

      {transform: {position: new Vector3(44.53, 4.16, 46.64), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.bush1},
      {transform: {position: new Vector3(65.39, 1.70, 50.33), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.bush1},
      {transform: {position: new Vector3(74.14, 1.94, 39.49), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.bush1},
      {transform: {position: new Vector3(75.36, -1.24, 87.08), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.bush1},

      {transform: {position: new Vector3(39.45, 6.62, 42.47), rotation: Quaternion.Euler(0, 20, 0)}, type: treeTypes.bush2},
      {transform: {position: new Vector3(29.23, 2.68, 85.47), rotation: Quaternion.Euler(0, -70, 0)}, type: treeTypes.bushy},
    ];
    
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
      /*
      let treeCarry = new Carryable();
      tree.addComponent(treeCarry);
      tree.addComponent(new OnClick(() => {
        if (!treeCarry.beingCarried) {
          log("Start: " + treeTransform.position.x + ", " + treeTransform.position.y + ", " + treeTransform.position.z);
        }
        else {
          log("Stop: " + treeTransform.position.x.toFixed(2) + ", " + treeTransform.position.y.toFixed(2) + ", " + treeTransform.position.z.toFixed(2));
        }
        treeCarry.toggleCarry(treeTransform);
      }));
      */
      
      this.trees.push(tree);
      engine.addEntity(tree);
    }
  }
}

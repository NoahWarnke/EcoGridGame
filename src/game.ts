import GameState from 'gamestate';
import GamePiece from 'gamepiece';
import GamePieceSlideSystem from 'gamepieceslidesystem';
import GamePieceDeleteSystem from 'gamepiecedeletesystem';
import GameBoard from 'gameboard';

// Add our systems for animation.
engine.addSystem(new GamePieceSlideSystem());
engine.addSystem(new GamePieceDeleteSystem());

// Instantiate a new game board.
/*
let gameBoard = new GameBoard({
  dimensions: {x: 4,y: 4},
  transform: new Transform({
    position: new Vector3(8, 0, 8)
  }),
  boardShape: new BoxShape(),
  pieceTypes: [
    // Landfill
    {
        receptacleShape: new CylinderShape(),
        receptacleTransform: new Transform({
          position: new Vector3(-3, 0, 0)
        }),
        shapes: [new SphereShape()]
    },
    // Recycling
    {
        receptacleShape: new CylinderShape(),
        receptacleTransform: new Transform({
          position: new Vector3(0, 0, 3)
        }),
        shapes: [new BoxShape()]
    },
    // Compost
    {
        receptacleShape: new CylinderShape(),
        receptacleTransform: new Transform({
          position: new Vector3(3, 0, 0)
        }),
        shapes: [new ConeShape()]
    }
  ],
  // Nature
  donePieceShapes: [new CylinderShape()]
});
*/

const p = new Entity()
  const q = new GLTFShape('models/flower2.glb')
  p.addComponentOrReplace(q)
  const transform0 = new Transform({
    position: new Vector3(8, 0, 8),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1)
  })
  p.addComponentOrReplace(transform0)
  engine.addEntity(p)

  const vacuum = new Entity()
  const gltfShape1 = new GLTFShape('models/vacuum.gltf')
  vacuum.addComponentOrReplace(gltfShape1)
  const transform1 = new Transform({
    position: new Vector3(8, 0, 9),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1)
  })
  vacuum.addComponentOrReplace(transform1)
  engine.addEntity(vacuum)
  /*

let vacuum = new Entity();
vacuum.addComponent(new GLTFShape('models/vacuum.gltf'));
vacuum.addComponent(new Transform({
  position: new Vector3(8, 1, 8)
}));
engine.addEntity(vacuum);
*/

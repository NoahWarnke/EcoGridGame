import GameState from 'gamestate';
import GamePiece from 'gamepiece';
import GamePieceSlideSystem from 'gamepieceslidesystem';
import GamePieceDeleteSystem from 'gamepiecedeletesystem';
import GameBoard from 'gameboard';
import DroneHangar from 'dronehangar';

// Add our systems for animation.
engine.addSystem(new GamePieceSlideSystem());
engine.addSystem(new GamePieceDeleteSystem());

// Instantiate a new game board.
let cyl = new CylinderShape();
cyl.radiusTop = 1.0; // So it's not a cone.
cyl.arc = 0.5;

// 4x4 with just trash bag versus bottle.
let gameBoardSmall = new GameBoard({
  dimensions: {x: 4, y: 4},
  transform: new Transform({
    position: new Vector3(4, 0, 4)
  }),
  boardShape: new BoxShape(),
  pieceTypes: [
    // Landfill
    {
        receptacleShape: new CylinderShape(),
        receptacleTransform: new Transform({
          position: new Vector3(-3, 0, 0)
        }),
        shapes: [new GLTFShape('models/coffee.gltf')]
    },
    // Recycling
    {
        receptacleShape: new CylinderShape(),
        receptacleTransform: new Transform({
          position: new Vector3(0, 0, 3)
        }),
        shapes: [new GLTFShape('models/bottle.gltf')]
    },
  ],
  // Nature
  donePieceShapes: [cyl]
});

// 5x5 with two types of recycling and trash
let gameBoardMedium = new GameBoard({
  dimensions: {x: 5,y: 5},
  transform: new Transform({
    position: new Vector3(4, 0, 12)
  }),
  boardShape: new BoxShape(),
  pieceTypes: [
    // Landfill
    {
        receptacleShape: new CylinderShape(),
        receptacleTransform: new Transform({
          position: new Vector3(-3, 0, 0)
        }),
        shapes: [new GLTFShape('models/chips-orange.gltf'), new GLTFShape('models/chips-green.gltf')]
    },
    // Recycling
    {
        receptacleShape: new CylinderShape(),
        receptacleTransform: new Transform({
          position: new Vector3(0, 0, 3)
        }),
        shapes: [new GLTFShape('models/water.gltf'), new GLTFShape('models/plate.gltf')]
    }
  ],
  // Nature
  donePieceShapes: [cyl]
});

// 6x6 with 2x trash, recycling, compost
let gameBoardMedHard = new GameBoard({
  dimensions: {x: 6, y: 6},
  transform: new Transform({
    position: new Vector3(16, 0, 12)
  }),
  boardShape: new BoxShape(),
  pieceTypes: [
    // Landfill
    {
        receptacleShape: new CylinderShape(),
        receptacleTransform: new Transform({
          position: new Vector3(-3, 0, 0)
        }),
        shapes: [new GLTFShape('models/boxsugar.gltf'), new GLTFShape('models/coffee.gltf')]
    },
    // Recycling
    {
        receptacleShape: new CylinderShape(),
        receptacleTransform: new Transform({
          position: new Vector3(0, 0, 3)
        }),
        shapes: [new GLTFShape('models/lightbulb.gltf'), new GLTFShape('models/wine-green.gltf')]
    },
    // Compost
    {
        receptacleShape: new CylinderShape(),
        receptacleTransform: new Transform({
          position: new Vector3(3, 0, 0)
        }),
        shapes: [new GLTFShape('models/cigarettes-on-the-ground.gltf'), new GLTFShape('models/banana.gltf')]
    }
  ],
  // Nature
  donePieceShapes: [cyl]
});

// 8x8 with 3x(eventually) trash, recycling, Compost
let gameBoardHard = new GameBoard({
  dimensions: {x: 6,y: 6},
  transform: new Transform({
    position: new Vector3(16, 0, 4)
  }),
  boardShape: new BoxShape(),
  pieceTypes: [
    // Landfill
    {
        receptacleShape: new CylinderShape(),
        receptacleTransform: new Transform({
          position: new Vector3(-3, 0, 0)
        }),
        shapes: [new GLTFShape('models/boxsugar.gltf'), new GLTFShape('models/bagtrash.gltf'), new GLTFShape('models/coffee.gltf')]
    },
    // Recycling
    {
        receptacleShape: new CylinderShape(),
        receptacleTransform: new Transform({
          position: new Vector3(0, 0, 3)
        }),
        shapes: [new GLTFShape('models/wine-green.gltf'), new GLTFShape('models/plate.gltf'), new GLTFShape('models/lightbulb.gltf')]
    },
    // Compost
    {
        receptacleShape: new CylinderShape(),
        receptacleTransform: new Transform({
          position: new Vector3(3, 0, 0)
        }),
        shapes: [new GLTFShape('models/cigarettes-on-the-ground.gltf'), new GLTFShape('models/chicken.gltf'), new GLTFShape('models/banana.gltf')]
    }
  ],
  // Nature
  donePieceShapes: [cyl]
});

let hangar = new DroneHangar(new Transform({position: new Vector3(24, 0, 8)}));

import GameState from 'gamestate';
import GamePiece from 'gamepiece';
import GamePieceSlideSystem from 'gamepieceslidesystem';
import GamePieceDeleteSystem from 'gamepiecedeletesystem';
import {DroneSystem} from 'dronesystem';
import GameBoard from 'gameboard';
import {DroneHangar} from 'dronehangar';

// Add our systems for animation.
engine.addSystem(new GamePieceSlideSystem());
engine.addSystem(new GamePieceDeleteSystem());
engine.addSystem(new DroneSystem());

// Heightmap.
let heightmap = new Entity();
heightmap.addComponent(new Transform({
  position: new Vector3(40, 0, 48),
  scale: new Vector3(6.79, 8, 8.145)
}));
heightmap.addComponent(new GLTFShape('models/heightmap_nocollide.glb'));
engine.addEntity(heightmap);

// Drone hangar for spawning drones.
let hangar = new DroneHangar(new Transform({position: new Vector3(24, 0, 8)}));

// Instantiate a new game board.
let cyl = new CylinderShape();
cyl.radiusTop = 1.0; // So it's not a cone.



// 4x4 with just trash bag versus bottle.
let gameBoardSmallLandfillPieces: [Shape, number][] = [
  [new GLTFShape('models/bagtrash.gltf'), 0.25]
];

let gameBoardSmallRecyclePieces: [Shape, number][] = [
  [new GLTFShape('models/bottle.gltf'), 0.1]
];

let gameBoardSmall = new GameBoard({
  dimensions: {x: 4, y: 4},
  transform: new Transform({
    position: new Vector3(4, 0, 4)
  }),
  pieceTypes: [
    // Landfill
    {
        receptacleShape: cyl,
        receptacleTransform: new Transform({
          position: new Vector3(-3, 0, 5),
          scale: new Vector3(1, 1.5, 1)
        }),
        shapes: gameBoardSmallLandfillPieces // can't define in place, for some reason.
    },
    // Recycling
    {
        receptacleShape: cyl,
        receptacleTransform: new Transform({
          position: new Vector3(0, 0, 5),
          scale: new Vector3(1, 1.5, 1)
        }),
        shapes: gameBoardSmallRecyclePieces
    },
  ],
  // Nature
  donePieceShapes: [cyl],
  hangar
});
/*
// 5x5 with two types of recycling and trash
let gameBoardMedium = new GameBoard({
  dimensions: {x: 5,y: 5},
  transform: new Transform({
    position: new Vector3(4, 0, 12)
  }),
  pieceTypes: [
    // Landfill
    {
        receptacleShape: new CylinderShape(),
        receptacleTransform: new Transform({
          position: new Vector3(-3, 0, 0)
        }),
        shapes: [new GLTFShape('models/chips05.gltf'), new GLTFShape('models/bagtrash.gltf')]
    },
    // Recycling
    {
        receptacleShape: new CylinderShape(),
        receptacleTransform: new Transform({
          position: new Vector3(0, 0, 3)
        }),
        shapes: [new GLTFShape('models/bottle.gltf'), new GLTFShape('models/plate.gltf')]
    }
  ],
  // Nature
  donePieceShapes: [cyl],
  hangar
});

// 6x6 with 2x trash, recycling, compost
let gameBoardMedHard = new GameBoard({
  dimensions: {x: 6, y: 6},
  transform: new Transform({
    position: new Vector3(16, 0, 12)
  }),
  pieceTypes: [
    // Landfill
    {
        receptacleShape: new CylinderShape(),
        receptacleTransform: new Transform({
          position: new Vector3(-3, 0, 0)
        }),
        shapes: [new GLTFShape('models/chips05.gltf'), new GLTFShape('models/bagtrash.gltf')]
    },
    // Recycling
    {
        receptacleShape: new CylinderShape(),
        receptacleTransform: new Transform({
          position: new Vector3(0, 0, 3)
        }),
        shapes: [new GLTFShape('models/bottle.gltf'), new GLTFShape('models/plate.gltf')]
    },
    // Compost
    {
        receptacleShape: new CylinderShape(),
        receptacleTransform: new Transform({
          position: new Vector3(3, 0, 0)
        }),
        shapes: [new ConeShape(), new BoxShape()]
    }
  ],
  // Nature
  donePieceShapes: [cyl],
  hangar
});

// 8x8 with 3x(eventually) trash, recycling, Compost
let gameBoardHard = new GameBoard({
  dimensions: {x: 6,y: 6},
  transform: new Transform({
    position: new Vector3(16, 0, 4)
  }),
  pieceTypes: [
    // Landfill
    {
        receptacleShape: new CylinderShape(),
        receptacleTransform: new Transform({
          position: new Vector3(-3, 0, 0)
        }),
        shapes: [new GLTFShape('models/chips05.gltf'), new GLTFShape('models/bagtrash.gltf')] // plus coffee when it works
    },
    // Recycling
    {
        receptacleShape: new CylinderShape(),
        receptacleTransform: new Transform({
          position: new Vector3(0, 0, 3)
        }),
        shapes: [new GLTFShape('models/bottle.gltf'), new GLTFShape('models/plate.gltf'), new GLTFShape('models/water.gltf')]
    },
    // Compost
    {
        receptacleShape: new CylinderShape(),
        receptacleTransform: new Transform({
          position: new Vector3(3, 0, 0)
        }),
        shapes: [new ConeShape(), new BoxShape(), cyl]
    }
  ],
  // Nature
  donePieceShapes: [cyl],
  hangar
});
*/

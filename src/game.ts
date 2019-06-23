import GameState from 'gamestate';
import GamePiece from 'gamepiece';
import IGameBoardSpecification from 'igameboardspecification';
import GamePieceSlideSystem from 'gamepieceslidesystem';
import GamePieceDeleteSystem from 'gamepiecedeletesystem';
import {DroneSystem} from 'dronesystem';
import GameBoard from 'gameboard';
import {DroneHangar} from 'dronehangar';
import {Landscape} from 'landscape';
import {NPC} from 'npc';

// Temporary.
import {Carryable, CarryableSystem} from 'carryable';
engine.addSystem(new CarryableSystem());

// This will be shared into any objects that need to know global info about game state.
let globalGameState = {
  totalGames: 0,
  finishedGames: 0
};

// Add our systems for animation.
engine.addSystem(new GamePieceSlideSystem());
engine.addSystem(new GamePieceDeleteSystem());
engine.addSystem(new DroneSystem());

// Non-interactive landscape elements.
let landscape = new Landscape();

// Temporary model for npcs, bins, etc.
let cyl = new CylinderShape();
cyl.radiusTop = 1.0; // So it's not a cone.

// NPCs.
let droneMechanic = new NPC(
  new Transform({position: new Vector3(33, 2.93, 87)}),
  new GLTFShape('models/npcs/mechanic_temp.glb'),
  new AudioClip('sounds/ecogames_mechanic_pre.wav'),
  new AudioClip('sounds/ecogames_mechanic_post.wav'),
  globalGameState
);

// Drone hangar for spawning drones.
let hangar = new DroneHangar(new Transform({
  position: new Vector3(38, 2.9, 87),
  rotation: Quaternion.Euler(0, -90, 0) //Quaternion.Euler(4, -50, 7)// new Quaternion(0.0185, -0.7068, -0.0185, 0.70686)
}));



let pieceModels: {[index: string]: [Shape, number]} = {
  'trashbag': [new GLTFShape('models/trash/landfill/bagtrash.gltf'), 0.25],
  'chips': [new GLTFShape('models/trash/landfill/chips05.gltf'), 0.1],
  'bottle': [new GLTFShape('models/trash/recycling/bottle.gltf'), 0.1],
  'plate': [new GLTFShape('models/trash/recycling/plate.gltf'), 0.2],
  'water': [new GLTFShape('models/trash/recycling/water.gltf'), 0.1],
  'rock0': [new GLTFShape('models/nature/rock.gltf'), 0.02],
  'rock1': [new GLTFShape('models/nature/rock1.gltf'), 0.02],
  'rock2': [new GLTFShape('models/nature/rock2.gltf'), 0.02],
  //'rocks': [new GLTFShape('models/nature/rocks.gltf'), 0.01], // doesn't look quite right for a single piece.
};

let gameSpecs: IGameBoardSpecification[] = [
  // 4x4 with just trash bag versus bottle.
  {
    dimensions: {x: 4, y: 4},
    transform: new Transform({
      position: new Vector3(21, 3, 86)
    }),
    pieceTypes: [
      // Landfill
      {
          receptacleShape: cyl,
          receptacleTransform: new Transform({
            position: new Vector3(-3, 0, 5),
            scale: new Vector3(1, 1.5, 1)
          }),
          shapes: [pieceModels.trashbag] // can't define in place, for some reason.
      },
      // Recycling
      {
          receptacleShape: cyl,
          receptacleTransform: new Transform({
            position: new Vector3(0, 0, 5),
            scale: new Vector3(1, 1.5, 1)
          }),
          shapes: [pieceModels.bottle]
      },
    ],
    // Nature
    donePieceShapes: [pieceModels.rock0, pieceModels.rock1, pieceModels.rock2],
    hangar
  },
  // 5x5 with two types of recycling and trash
  /*
  {
    dimensions: {x: 5,y: 5},
    transform: new Transform({
      position: new Vector3(4, 0, 4)
    }),
    pieceTypes: [
      // Landfill
      {
          receptacleShape: new CylinderShape(),
          receptacleTransform: new Transform({
            position: new Vector3(-3, 0, 0)
          }),
          shapes: [pieceModels.chips, pieceModels.trashbag]
      },
      // Recycling
      {
          receptacleShape: new CylinderShape(),
          receptacleTransform: new Transform({
            position: new Vector3(0, 0, 3)
          }),
          shapes: [pieceModels.bottle, pieceModels.plate]
      }
    ],
    // Nature
    donePieceShapes: [pieceModels.rock0, pieceModels.rock1, pieceModels.rock2],
    hangar
  }
  */
];

let gameBoards = [];
for (let i = 0; i < gameSpecs.length; i++) {
  gameBoards.push(new GameBoard(gameSpecs[i], globalGameState));
}
globalGameState.totalGames = gameSpecs.length;


/*
let all = engine.getComponentGroup(Transform);

for (let entity of all.entities) {
  let carryable = new Carryable();
  entity.addComponent(carryable);
  entity.addComponentOrReplace(new OnClick(() => {
    carryable.toggleCarry(entity.getComponent(Transform));
  }));
}
*/

/*

let gameBoardMedium = new GameBoard();

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

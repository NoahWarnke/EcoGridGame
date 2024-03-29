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

// NPCs.
let droneMechanic = new NPC(
  new Transform({position: new Vector3(33, 2.93, 87)}),
  new GLTFShape('models/npcs/mechanic_temp.glb'),
  new AudioClip('sounds/ecogames_mechanic_pre.mp3'),
  new AudioClip('sounds/ecogames_mechanic_post.mp3'),
  globalGameState
);

let hiker = new NPC(
  new Transform({position: new Vector3(48.84442138671875, 3, 8.56), scale: new Vector3(0.09, 0.09, 0.09)}),
  new GLTFShape('models/npcs/hiker.gltf'),
  new AudioClip('sounds/ecogames_hiker_pre.mp3'),
  new AudioClip('sounds/ecogames_hiker_post.mp3'),
  globalGameState
);

let girl = new NPC(
  new Transform({position: new Vector3(26.17, 14.4, 37.62)}),
  new GLTFShape('models/npcs/mechanic_temp.glb'),
  new AudioClip('sounds/ecogames_girl_pre.mp3'),
  new AudioClip('sounds/ecogames_girl_post.mp3'),
  globalGameState
);

let boy = new NPC(
  new Transform({position: new Vector3(27.24, 2.05, 58.5), scale: new Vector3(0.6, 0.6, 0.6)}),
  new GLTFShape('models/npcs/mechanic_temp.glb'),
  new AudioClip('sounds/ecogames_boy_pre.mp3'),
  new AudioClip('sounds/ecogames_boy_post.mp3'),
  globalGameState
);

// Drone hangar for spawning drones.
let hangar = new DroneHangar(new Transform({
  position: new Vector3(38, 2.9, 87),
  rotation: Quaternion.Euler(0, -90, 0) //Quaternion.Euler(4, -50, 7)// new Quaternion(0.0185, -0.7068, -0.0185, 0.70686)
}));


let pieceModels: {[index: string]: [Shape, number]} = {
  // Landfill
  'trashbag': [new GLTFShape('models/trash/landfill/bag.gltf'), 0.7],
  'chips': [new GLTFShape('models/trash/landfill/chips-yellow.gltf'), 0.6],
  'eggcarton': [new GLTFShape('models/trash/landfill/boxeggs2.gltf'), 1],
  'foodcontainer': [new GLTFShape('models/trash/landfill/foodcontainer-dirty.gltf'), 0.2],
  'coffee': [new GLTFShape('models/trash/landfill/coffe.gltf'), 1],
  'chicken': [new GLTFShape('models/trash/landfill/chicken.gltf'), 0.5],
  'cigarettes': [new GLTFShape('models/trash/landfill/cigarettes-on-the-ground.gltf'), 0.4],
  'lightbulb': [new GLTFShape('models/trash/landfill/lightbulb.gltf'), 0.4],
  // Recycling
  'bottle': [new GLTFShape('models/trash/recycling/bottle.gltf'), 1.2],
  'plate': [new GLTFShape('models/trash/recycling/plate.gltf'), 0.3],
  'water': [new GLTFShape('models/trash/recycling/water.gltf'), 0.4],
  'soda': [new GLTFShape('models/trash/recycling/soda.gltf'), 0.6],
  'tincan': [new GLTFShape('models/trash/recycling/tin-can.gltf'), 0.5],
  'sugar': [new GLTFShape('models/trash/recycling/boxsugar.gltf'), 0.16],
  'wine': [new GLTFShape('models/trash/recycling/wine-green.gltf'), 0.5],
  'newspaper': [new GLTFShape('models/trash/recycling/newspaper-rolled.gltf'), 0.3],
  // Compost
  'apple': [new GLTFShape('models/trash/compost/apple.gltf'), 2],
  'pizza': [new GLTFShape('models/trash/compost/pizza.gltf'), 1],
  'banana': [new GLTFShape('models/trash/compost/banana-clear.gltf'), 0.1],
  // Nature
  'rock0': [new GLTFShape('models/nature/rock.gltf'), 0.02],
  'rock1': [new GLTFShape('models/nature/rock1.gltf'), 0.02],
  'rock2': [new GLTFShape('models/nature/rock2.gltf'), 0.02],
};

let recycleBin = new GLTFShape('models/trash/bins/recycle-bin.gltf');
let landfillBin = new GLTFShape('models/trash/bins/trash-bin.gltf');
let compostBin = new GLTFShape('models/trash/bins/compost-bin.gltf');

let gameSpecs: IGameBoardSpecification[] = [
  // Super simple intro 3x3
  {
    dimensions: {x: 3, y: 3},
    transform: new Transform({
      position: new Vector3(24.81, 3.05, 85.193),
      rotation: Quaternion.Euler(3, 0, 0)
    }),
    pieceTypes: [
      // Landfill
      {
          receptacleShape: landfillBin,
          receptacleTransform: new Transform({
            position: new Vector3(-3.5, 0, -1),
            scale: new Vector3(0.5, 0.5, 0.5)
          }),
          shapes: [pieceModels.trashbag] // can't define in place, for some reason.
      },
      // Recycling
      {
          receptacleShape: recycleBin,
          receptacleTransform: new Transform({
            position: new Vector3(-3.5, 0, 1),
            scale: new Vector3(0.5, 0.5, 0.5)
          }),
          shapes: [pieceModels.bottle]
      },
    ],
    // Nature
    donePieceShapes: [pieceModels.rock0, pieceModels.rock1, pieceModels.rock2],
    hangar
  },
  // 4x4 with just trash bag versus bottle.
  {
    dimensions: {x: 4, y: 4},
    transform: new Transform({
      position: new Vector3(65.5, 3.09, 54)
    }),
    pieceTypes: [
      // Landfill
      {
          receptacleShape: landfillBin,
          receptacleTransform: new Transform({
            position: new Vector3(-0.5, 0, 7),
            scale: new Vector3(0.5, 0.5, 0.5)
          }),
          shapes: [pieceModels.trashbag] // can't define in place, for some reason.
      },
      // Recycling
      {
          receptacleShape: recycleBin,
          receptacleTransform: new Transform({
            position: new Vector3(1, 0, 7),
            scale: new Vector3(0.5, 0.5, 0.5)
          }),
          shapes: [pieceModels.soda]
      },
    ],
    // Nature
    donePieceShapes: [pieceModels.rock0, pieceModels.rock1, pieceModels.rock2],
    hangar
  },
  // 5x5 with two types of recycling and trash
  {
    dimensions: {x: 5,y: 5},
    transform: new Transform({
      position: new Vector3(44.61, 3.09, 31.99),
      rotation: Quaternion.Euler(0, 0, -2)
    }),
    pieceTypes: [
      // Landfill
      {
          receptacleShape: landfillBin,
          receptacleTransform: new Transform({
            position: new Vector3(-4, 0, 0),
            scale: new Vector3(0.5, 0.5, 0.5)
          }),
          shapes: [pieceModels.chips, pieceModels.lightbulb]
      },
      // Recycling
      {
          receptacleShape: recycleBin,
          receptacleTransform: new Transform({
            position: new Vector3(0, 0, 4),
            scale: new Vector3(0.5, 0.5, 0.5)
          }),
          shapes: [pieceModels.bottle, pieceModels.plate]
      }
    ],
    // Nature
    donePieceShapes: [pieceModels.rock0, pieceModels.rock1, pieceModels.rock2],
    hangar
  },
  // 5x5 with 2x of each trash type
  {
    dimensions: {x: 5, y: 5},
    transform: new Transform({
      position: new Vector3(77.13, 0.1, 2.57)
    }),
    pieceTypes: [
      // Landfill
      {
          receptacleShape: landfillBin,
          receptacleTransform: new Transform({
            position: new Vector3(-3.5, 0, -1),
            scale: new Vector3(0.5, 0.5, 0.5)
          }),
          shapes: [pieceModels.foodcontainer, pieceModels.eggcarton]
      },
      // Recycling
      {
          receptacleShape: recycleBin,
          receptacleTransform: new Transform({
            position: new Vector3(-3.5, 0, 1),
            scale: new Vector3(0.5, 0.5, 0.5)
          }),
          shapes: [pieceModels.tincan, pieceModels.water]
      },
      // Compost
      {
          receptacleShape: compostBin,
          receptacleTransform: new Transform({
            position: new Vector3(0, 0, 3),
            scale: new Vector3(0.5, 0.5, 0.5)
          }),
          shapes: [pieceModels.banana, pieceModels.apple]
      }
    ],
    // Nature
    donePieceShapes: [pieceModels.rock0, pieceModels.rock1, pieceModels.rock2],
    hangar
  },
  // 6x6 with 2-3x of each trash type
  {
    dimensions: {x: 6, y: 6},
    transform: new Transform({
      position: new Vector3(10.85, 3.05, 17.63)
    }),
    pieceTypes: [
      // Landfill
      {
          receptacleShape: landfillBin,
          receptacleTransform: new Transform({
            position: new Vector3(6, 0, 6),
            scale: new Vector3(0.5, 0.5, 0.5)
          }),
          shapes: [pieceModels.chicken, pieceModels.cigarettes, pieceModels.coffee]
      },
      // Recycling
      {
          receptacleShape: recycleBin,
          receptacleTransform: new Transform({
            position: new Vector3(0, 0, 4.4),
            scale: new Vector3(0.5, 0.5, 0.5)
          }),
          shapes: [pieceModels.bottle /* wine */, pieceModels.newspaper, pieceModels.sugar]
      },
      // Compost
      {
          receptacleShape: compostBin,
          receptacleTransform: new Transform({
            position: new Vector3(4.4, 0, -1),
            scale: new Vector3(0.5, 0.5, 0.5)
          }),
          shapes: [pieceModels.pizza, pieceModels.apple, pieceModels.banana]
      }
    ],
    // Nature
    donePieceShapes: [pieceModels.rock0, pieceModels.rock1, pieceModels.rock2],
    hangar
  }
];

// Instantiate boards with the list of specs!
let gameBoards = [];
for (let i = 0; i < gameSpecs.length; i++) {
  gameBoards.push(new GameBoard(gameSpecs[i], globalGameState));
}
globalGameState.totalGames = gameSpecs.length;

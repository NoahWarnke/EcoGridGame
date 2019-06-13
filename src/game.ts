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
  donePieceShapes: [cyl]
});

let hangar = new DroneHangar(new Transform({position: new Vector3(24, 0, 8)}));

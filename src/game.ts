import GameState from 'gamestate';
import GamePiece from 'gamepiece';
import GamePieceSlideSystem from 'gamepieceslidesystem';
import GamePieceDeleteSystem from 'gamepiecedeletesystem';
import GameBoard from 'gameboard';

// Add our systems for animation.
engine.addSystem(new GamePieceSlideSystem());
engine.addSystem(new GamePieceDeleteSystem());

// Instantiate a new game board.
let gameBoard = new GameBoard();

import GameBoardSpecification from 'igameboardspecification';
import PieceType from 'ipiecetype';
import GameState from 'gamestate';
import GamePiece from 'gamepiece';

/**
 * Represents a game board with its pieces.
 */
export default class GameBoard {
  private gameState: GameState;
  private gamePieces: GamePiece[];
  
  private pieceTypes: PieceType[];
  private donePieceShapes: Shape[];
  
  private animating: boolean;
  
  private gameGroup: Entity;
  private pieceSet: Entity;
  
  /**
   * Construct a new GameBoard from the given GameBoardSpec.
   */
  constructor(spec: GameBoardSpecification) {
    
    // Create the state.
    this.gameState = new GameState(
      spec.pieceTypes.length,
      spec.dimensions.x,
      spec.dimensions.y
    );
    
    // Save our list of trash types and done piece shapes.
    this.pieceTypes = spec.pieceTypes;
    this.donePieceShapes = spec.donePieceShapes;
    
    // Game entity is a group that contains everything.
    this.gameGroup = new Entity();
    this.gameGroup.addComponent(spec.transform);
    engine.addEntity(this.gameGroup);
    
    // Pieceset entity is a group that contains all pieces, and has its center at the lower left corner of the board.
    this.pieceSet = new Entity();
    this.pieceSet.setParent(this.gameGroup);
    this.pieceSet.addComponent(new Transform({
      position: new Vector3(
        -(this.gameState.getWidth() - 1) / 2,
        0.25,
        -(this.gameState.getHeight() - 1) / 2)
    }));
    
    this.gamePieces = [];
    this.createPieceEntities();
    
    this.animating = false;
    
    //this.placeEnvironmentObjects();
  }
  
  /**
   * Remove existing entities.
   */
  public removeEntities() {
    for (let i = 0; i < this.gamePieces.length; i++) {
      engine.removeEntity(this.gamePieces[i].entity);
    }
    this.gamePieces = [];
  }
    
  public createPieceEntities() {

    for (let x = 0; x < this.gameState.getWidth(); x++) {
      for (let y = 0; y < this.gameState.getHeight(); y++) {
        let type = this.gameState.getCellAt(x, y).type;
        if (type === 0) {
          continue;
        }
        
        // Create a new entity for the piece, and add it to the pieceSet group.
        let ent = new Entity();
        ent.setParent(this.pieceSet);
        
        // Create a new GamePiece component and add it to the entity.
        let piece = ent.addComponent(new GamePiece(x, y, type, ent));
        this.gamePieces.push(piece); // Also keep track of all GamePiece components, for internal logic.
        
        // Position the piece on the board.
        ent.addComponent(new Transform({position: new Vector3(x, 0, y), scale: new Vector3(0.3, 0.3, 0.3)}));
        
        // Give the piece the correct shape.
        let pieceType = this.pieceTypes[type - 1];
        ent.addComponent(pieceType.shapes[Math.floor(Math.random() * pieceType.shapes.length)]);
        
        // Make sure the piece is clickable!
        ent.addComponent(new OnClick(() => {
          this.handleClick(piece);
        }));
      }
    }
  }
  
  /**
   * Handle a click on a certain game piece.
   */
  public async handleClick(piece: GamePiece) {
    log('Clicked ' + piece.x + ', ' + piece.y);
    
    if (this.animating) {
      return; // Can't click during an animation.
    }
    
    // Increment the number of moves.
    this.gameState.incrementMoves();
    
    // See if a slide is valid.
    let slidePairs = this.gameState.getSlidePairsFromClick(piece.x, piece.y);
    if (slidePairs.length === 0) {
      log('Cannot swap there!'); // TODO buzz noise
      return;
    }
    
    // Perform slide.
    this.gameState.performSlide(slidePairs);
    
    // Lock game until animations are done.
    this.animating = true;
    
    // Slide the pieces to their new spots.
    let slides = [];
    
    for (let [x, y, newX, newY] of slidePairs) {
      for (let i = 0; i < this.gamePieces.length; i++) {
        let piece = this.gamePieces[i];
        if (piece.x === x && piece.y === y) {
          log ('sliding ' + x + ', ' + y + ' to ' + newX + ', ' + newY);
          slides.push(piece.slide(newX, newY));
          break;
        }
      }
    }
    await Promise.all(slides);
    
    this.animating = false;
    
    log('Slides done!');
    
    // See if we have any 2x2 squares generated from the slide.
    let squares: [number, number, number][] = this.gameState.checkWholeGridForSquaresOfSameType();
    if (squares.length === 0) {
      this.animating = false;
      log('No squares found.');
      return;
    }
    
    // Mark all squares for deletion, and get a list of square types found.
    let types: number[] = [];
    for (let [x, y, type] of squares) {
      this.gameState.markSquareForDeletion(x, y);
      if (types.indexOf(type) === -1) {
        types.push(type);
      }
    }
    
    // For each type, mark connected pieces for deletion.
    for (let type of types) {
      this.gameState.markConnectedForDeletion(type);
    }
    
    // For each type, get a list of the pieces that will be deleted.
    let deletedPiecesByType: {[index: number]: GamePiece[]} = {};
    for (let type of types) {
      deletedPiecesByType[type] = [];
      for (let piece of this.gamePieces) {
        let cell = this.gameState.getCellAt(piece.x, piece.y);
        if (cell.del && cell.type === type) {
          deletedPiecesByType[type].push(piece);
        }
      }
    }
    
    // For each type, blink the deleted pices (TODO replace with drone sucking and dumping into bins)).
    for (let type of types) {
      let blinkPromises = [];
      for (let piece of deletedPiecesByType[type]) {
        blinkPromises.push(piece.showDeletion());
      }
      
      log ('Blinking ' + blinkPromises.length + ' of type ' + type);
      await Promise.all(blinkPromises);
      
      log ('Blinking done.');
    }
    
    // Delete all pieces of all types that are marked for deletion, and replace with done types.
    this.gameState.deleteAndReplace();
    
    // Update pieces with new done types.
    for (let piece of this.gamePieces) {
      
      // Grab new cell type, and if it's -1 but the piece's type isn't -1, we know we have a swap to do!
      if (piece.type !== -1 && this.gameState.getCellAt(piece.x, piece.y).type === -1) {
        piece.type = -1;
        piece.entity.addComponentOrReplace(this.donePieceShapes[Math.floor(Math.random() * this.donePieceShapes.length)]);
      }
    }
    
    // Unlock game state now that animations and updates are done.
    this.animating = false;
  }

  public placeEnvironmentObjects() {

    let penguin = new Entity();
    penguin.addComponent(new Transform({
      position: new Vector3(8, 8, 2),
      scale: new Vector3(1, 1, 1)
    }));
    penguin.addComponent(new GLTFShape("models/shoe.glb"))
    engine.addEntity(penguin);


    let sealion = new Entity();
    sealion.addComponent(new Transform({
      position: new Vector3(5, 1, -2),
      scale: new Vector3(0.5, 0.5, 0.5)
    }));
    sealion.addComponent(new GLTFShape("models/sealion.glb"))
    engine.addEntity(sealion);

  }
}

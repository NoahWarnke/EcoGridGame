import GameBoardSpecification from 'gameboardspecification';
import PieceType from 'gameboardspecification';
import GameState from 'gamestate';
import GamePiece from 'gamepiece';

/**
 * Represents a game board with its pieces. */
export default class GameBoard {
  private gameState: GameState;
  private gamePieces: GamePiece[];
  
  private pieceTypes: TrashType[];
  private donePieceShapes: Shape[];
  
  private animating: boolean;
  
  private gameGroup: Entity;
  private pieceSet: Entity;
  
  constructor(spec: GameBoardSpecification) {
    
    // Create the state.
    this.gameState = new GameState(
      spec.pieceTypes.length,
      GameState.generateRandomGridLayout(
        spec.dimensions.x,
        spec.dimensions.y,
        spec.pieceTypes.length
      )
    );
    
    // Save our list of trash types and
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
    
    // Board entity is a box that the pieces sit on. Doesn't need to be a box, or to exist at all, really.
    let board = new Entity();
    board.setParent(this.gameGroup);
    board.addComponent(new BoxShape());
    let black = new Material();
    black.albedoColor = Color3.Black();
    board.addComponent(black);
    board.addComponent(new Transform({scale: new Vector3(this.gameState.getWidth() + 0.5, 0.5, this.gameState.getHeight() + 0.5)}));
    /*
    board.addComponent(new OnClick(() => {
      this.updateMats();
    }));
    */
    
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
        piece.shape = pieceType.shapes[Math.floor(Math.random() * pieceType.shapes.length)]; // Save shape (can't use getComponent to get it currently)
        ent.addComponent(piece.shape);
        
        ent.addComponent(new OnClick(() => {
          this.handleClick(piece);
        }));
      }
    }
  }
  
  /* Temporary, to try and get the types to update correctly. */
  /*
  public updateMats() {
    log('updateMats');
    for (let piece of this.gamePieces) {
      
      try {
        log(piece.x + ", " + piece.y);
        let mat = piece.entity.getComponent(Material);
        piece.entity.removeComponent(mat);
        log('successful removal');
        piece.entity.addComponent(this.materials[this.gameState.getCellAt(piece.x, piece.y).type - 1]);
        

        
      }
      catch (e) {
        log('no mat found at ' + piece.x + ", " + piece.y);
      }
      
      //piece.entity.addComponent(this.materials[this.gameState.getCellAt(piece.x, piece.y).type - 1]);
    }
  }
  */
  
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
    
    // See if a swap is valid.
    let [swapX, swapY] = this.gameState.getSwapCoordsFromClick(piece.x, piece.y);
    if (swapX === piece.x && swapY === piece.y) {
      log('Cannot swap there!'); // TODO buzz noise
      return;
    }
    
    // Update GameState.
    if (!this.gameState.performSwap(piece.x, piece.y, swapX, swapY)) {
      log('Swap failed (should never happen)...');
      return;
    }
    
    // Lock game until animations are done.
    this.animating = true;
    
    // Slide the piece to its new spot.
    await piece.slide(swapX, swapY);
    
    log('Slide done.');
    
    // See if we have a 2x2 square generated from the swap.
    let [cornerX, cornerY, squareType] = this.gameState.checkForSquareOfSameType(swapX, swapY);
    if (cornerX === -1 || cornerY === -1) {
      this.animating = false;
      log ('No square found.');
      return;
    }
    
    // Mark the square, and any connected same-type objects, for deletion.
    this.gameState.markSquareForDeletion(cornerX, cornerY);
    this.gameState.markConnectedForDeletion(squareType);
    
    let blinkPromises = [];
    for (let piece of this.gamePieces) {
      if (this.gameState.getCellAt(piece.x, piece.y).del) {
        blinkPromises.push(piece.showDeletion());
      }
    }
    log ('Blinking ' + blinkPromises.length);
    await Promise.all(blinkPromises);
    
    log ('Blinking done.');
    
    // Do the deletion and replace with new things.
    this.gameState.deleteAndReplace();
    
    // Update pieces with new types.
    for (let piece of this.gamePieces) {
      
      // Grab new cell type.
      let newType = this.gameState.getCellAt(piece.x, piece.y).type;
      if (newType === 0) {
        // Ignore hole.
        log('piece at hole? ' + piece.x + ', ' + piece.y);
      }
      else if (newType === this.pieceTypes.length) {
        // It's now of the 'done' type
        log('Piece is done!');
        
        let oldShape = piece.shape;
        piece.entity.removeComponent(oldShape);
        piece.shape = this.donePieceShapes[Math.floor(Math.random() * this.donePieceShapes.length)];
        piece.entity.addComponent(piece.shape);
        
        /*.
        log('swapping type to ' + newType + ' from ' + piece.type);
        piece.type = newType;
        try {
          //let oldShape = piece.entity.getComponent(Shape); // Doesn't work currently, hence piece.shape
          let oldShape = piece.shape;
          piece.entity.removeComponent(oldShape);
          let pieceType = this.pieceTypes[piece.type - 1];
          piece.shape = pieceType.shapes[Math.floor(Math.random() * pieceType.shapes.length)];
          piece.entity.addComponent(piece.shape);
        }
        catch(e) {
          log('Failed to find shape for piece at ' + piece.x + ', ' + piece.y + ': ' + e);
        }
        */
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

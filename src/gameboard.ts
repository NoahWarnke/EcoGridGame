import GameState from 'gamestate';
import GamePiece from 'gamepiece';

/**
 * Represents a game board with its pieces. */
export default class GameBoard {
  private gameState: GameState;
  private gamePieces: GamePiece[];
  private shape: Shape;
  private materials: Material[];
  private animating: boolean;
  private gameGroup: Entity;
  private pieceSet: Entity;
  
  constructor() {
    
    // Create the state.
    this.gameState = new GameState(3, GameState.getHardcoded4x4GridLayout());
    
    // Game entity is a group that contains everything.
    this.gameGroup = new Entity();
    this.gameGroup.addComponent(new Transform({position: new Vector3(8, 0, 8)}));
    engine.addEntity(this.gameGroup);
    
    // Pieceset entity is a group that contains all pieces.
    this.pieceSet = new Entity();
    this.pieceSet.setParent(this.gameGroup);
    this.pieceSet.addComponent(new Transform({position: new Vector3(-(this.gameState.getWidth() - 1) / 2, 0.25, -(this.gameState.getHeight() - 1) / 2)}));
    
    // Board entity is a box that the pieces sit on. Doesn't need to be a box, or to exist at all, really.
    let board = new Entity();
    board.setParent(this.gameGroup);
    board.addComponent(new BoxShape());
    let black = new Material();
    black.albedoColor = Color3.Black();
    board.addComponent(black);
    board.addComponent(new Transform({scale: new Vector3(this.gameState.getWidth() + 0.5, 0.5, this.gameState.getHeight() + 0.5)}));
    board.addComponent(new OnClick(() => {
      this.updateMats();
    }));
    
    // Create shape and materials.
    this.shape = new SphereShape(); //GLTFShape("models/pumpkin.glb");
    this.materials = [new Material(), new Material(), new Material(), new Material(), new Material()];
    this.materials[0].albedoColor = Color3.Red();
    this.materials[1].albedoColor = Color3.Green();
    this.materials[2].albedoColor = Color3.Blue();
    this.materials[3].albedoColor = Color3.Purple();
    this.materials[4].albedoColor = Color3.Yellow();
    
    this.gamePieces = [];
    this.createEntities();
    
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
    
  public createEntities() {

    for (let x = 0; x < this.gameState.getWidth(); x++) {
      for (let y = 0; y < this.gameState.getHeight(); y++) {
        let type = this.gameState.getCellAt(x, y).type;
        if (type === 0) {
          continue;
        }
        
        let ent = new Entity();
        ent.setParent(this.pieceSet);
        let piece = ent.addComponent(new GamePiece(x, y, type, ent));
        this.gamePieces.push(piece); // Keep track of all piece components, for internal logic.
        ent.addComponent(new Transform({position: new Vector3(x, 0, y), scale: new Vector3(0.2, 0.2, 0.2)}));
        ent.addComponent(this.shape);
        ent.addComponent(this.materials[type - 1]);
        ent.addComponent(new OnClick(() => {
          this.handleClick(piece);
        }));
      }
    }
  }
  
  /* Temporary, to try and get the types to update correctly. */
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
      let newType = this.gameState.getCellAt(piece.x, piece.y).type;
      if (newType === 0) {
        log('piece at hole? ' + piece.x + ', ' + piece.y);
        this.gameState.showGrid();
      }
      else if (newType !== piece.type) {
        log('swapping type to ' + newType + ' from ' + piece.type);
        piece.type = newType;
        try {
          piece.entity.removeComponent(piece.entity.getComponent(Material));
          piece.entity.addComponent(this.materials[newType - 1]);
        }
        catch(e) {
          log('Failed to find material for piece at ' + piece.x + ', ' + piece.y);
        }
      }
    }
    
    // Check for game completion.
    if (this.gameState.getClearedFraction() == 1.0) {
      log('You win!');
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

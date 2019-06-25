import GameBoardSpecification from 'igameboardspecification';
import PieceType from 'ipiecetype';
import GameState from 'gamestate';
import GamePiece from 'gamepiece';
import {DroneHangar} from 'dronehangar';
import {Drone} from 'drone';

/**
 * Represents a game board with its pieces.
 */
export default class GameBoard {
  
  private globalGameState: {finishedGames: number, totalGames: number};
  private gameState: GameState;
  private gamePieces: GamePiece[];
  
  private pieceTypes: PieceType[];
  private donePieceShapes: [Shape, number][];
  
  private hangar: DroneHangar
  
  private animating: boolean;
  
  private gameGroup: Entity;
  private pieceSet: Entity;
  
  private audioSources: {[index: string]: AudioSource};
  
  /**
   * Construct a new GameBoard from the given GameBoardSpec.
   */
  constructor(spec: GameBoardSpecification, globalGameState: {finishedGames: number, totalGames: number}) {
    
    // Pointer to global state we might want to modify.
    this.globalGameState = globalGameState;
    
    // Create the state.
    this.gameState = new GameState(
      spec.pieceTypes.length,
      spec.dimensions.x,
      spec.dimensions.y
    );
    
    // Save our list of trash types and done piece shapes.
    this.pieceTypes = spec.pieceTypes;
    this.donePieceShapes = spec.donePieceShapes;
    
    // Save a reference to our drone hangar, so that we can fetch the drone (and hence control it when needed).
    this.hangar = spec.hangar;
    
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
        0.0,
        -(this.gameState.getHeight() - 1) / 2)
    }));
    
    this.gamePieces = [];
    this.createPieceEntities();
    
    // Create bins.
    for (let type of this.pieceTypes) {
      let bin = new Entity();
      bin.addComponent(type.receptacleShape);
      bin.addComponent(type.receptacleTransform);
      bin.setParent(this.gameGroup);
    }
    
    // Various sounds associated with game.
    let audioSrcs = {
      vacuum: 'sounds/ecogames_vacuum.mp3',
      winBoard: 'sounds/ecogames_finished_board.mp3',
      winGame: 'sounds/ecogames_finished_everything.mp3',
      slide0: 'sounds/ecogames_swoosh1.mp3',
      slide1: 'sounds/ecogames_swoosh2.mp3',
      needdrone: 'sounds/ecogames_need_drone.mp3'
    }
    
    // Set up clips, sources, entities for sounds.
    this.audioSources = {};
    for (let srcName in audioSrcs) {
      let entity = new Entity();
      let clip = new AudioClip(audioSrcs[srcName]);
      let audioSource = new AudioSource(clip);
      audioSource.playing = false;
      this.audioSources[srcName] = audioSource;
      entity.addComponent(audioSource);
      entity.setParent(this.gameGroup);
    }
    
    this.animating = false;
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
        
        // Give the piece the correct shape.
        let pieceType = this.pieceTypes[type - 1];
        let index = Math.floor(Math.random() * pieceType.shapes.length);
        let whichShape = pieceType.shapes[index];
        ent.addComponent(whichShape[0]);
        
        // Position the piece on the board.
        ent.addComponent(new Transform({
          position: new Vector3(x, 0, y),
          scale: new Vector3(whichShape[1], whichShape[1], whichShape[1]), // Scale piece according to its piece type scale factor.
          rotation: Quaternion.Euler(0, Math.random() * 360, 0)
        }));
        
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
    
    // Make sure player has a drone.
    if (!this.hangar.playerHasDrone) {
      this.audioSources.needdrone.playing = false;
      this.audioSources.needdrone.playOnce();
      return;
    }
    
    /**
     * Game is won, so no further interaction needed.
     */
    if (this.gameState.isWon()) {
      return;
    }
    
    // Make sure animation not happening (can't click during it).
    if (this.animating) {
      return;
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
    
    // Play slide sound.
    this.audioSources[Math.random() > 0.5 ? "slide0" : "slide1"].playOnce();
    
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
      this.gameState.unmarkPiecesNeededForAtLeastFour();
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
    let drone = this.hangar.playerDrone.getComponent(Drone);
    for (let type of types) {
      
      // Calculate center of gravity of the pieces of this type.
      let cg = new Vector3();
      for (let piece of deletedPiecesByType[type]) {
        cg.x += piece.x;
        cg.z += piece.y; // y on gameboard is z coordinate in normal space
      }
      cg.x /= deletedPiecesByType[type].length;
      cg.z /= deletedPiecesByType[type].length;
      
      // Convert CG to worldspace from gameboard space.
      let gameTransf = this.gameGroup.getComponent(Transform);
      let gamePos = gameTransf.position.clone();
      let gameRot = gameTransf.rotation.clone();
      let piecesPos = this.pieceSet.getComponent(Transform).position.clone(); // no rotation on that.
      
      let droneMouthWorldspace = gamePos.clone();
      droneMouthWorldspace.addInPlace(piecesPos.rotate(gameRot));
      droneMouthWorldspace.addInPlace(cg); // again, no rotation on pieceSet.
      
      // Add height to CG in worldspace (this is where mouth of drone will go)
      droneMouthWorldspace.y += 1; // drone 1m up?
      
      // Convert worldspace CG+height back to gameboard space
      let droneMouthGamespace = droneMouthWorldspace.clone();
      droneMouthGamespace.subtractInPlace(gamePos);
      droneMouthGamespace.subtractInPlace(piecesPos.rotate(gameRot));
      
      // Send drone to worldspace CG+height.
      await drone.goto(droneMouthWorldspace);
      log('Drone hovering over pieces of type ' + type + ' to suck them up!');
      
      // Play sucking sound.
      this.audioSources.vacuum.playOnce();
      
      // TODO change blinking to suck-to-dronemouth anims.
      let suckPromises = [];
      for (let piece of deletedPiecesByType[type]) {
        suckPromises.push(piece.showDeletion(droneMouthGamespace));
      }
      
      log('Sucking ' + suckPromises.length + ' of type ' + type);
      await Promise.all(suckPromises);
      log('sucking done.');
      
      // Calculate worldspace coords of appropriate bin.
      let binWorldspace = gamePos.clone();
      binWorldspace.addInPlace(this.pieceTypes[type - 1].receptacleTransform.position.clone().rotate(gameRot));
      binWorldspace.y += 2; // Make drone hover above it, not in it :P
      
      // Send drone there next.
      await drone.goto(binWorldspace);
      log('Drone hovering over bin for type ' + type + 'to dump the pieces!');
      
      // TODO splat sound etc.
      
      drone.resumeWander();
      log('Drone done with trash duty; resuming random wander.');
    }
    
    // Delete all pieces of all types that are marked for deletion, and replace with done types.
    this.gameState.deleteAndReplace();
    
    // Update pieces with new done types.
    for (let piece of this.gamePieces) {
      
      // Grab new cell type, and if it's -1 but the piece's type isn't -1, we know we have a swap to do!
      if (piece.type !== -1 && this.gameState.getCellAt(piece.x, piece.y).type === -1) {
        piece.type = -1;
        let donePiece: [Shape, number] = this.donePieceShapes[Math.floor(Math.random() * this.donePieceShapes.length)];
        piece.entity.addComponentOrReplace(donePiece[0]);
        piece.entity.getComponent(Transform).scale.set(donePiece[1], donePiece[1], donePiece[1]);
      }
    }
    
    // Unlock game state now that board animations and updates are done.
    this.animating = false;
    
    // Finally, check for global game being won, and send the drone home if so.
    if (this.gameState.isWon()) {
      log("Woo congrats, you finished the board!");
      this.globalGameState.finishedGames++; // let global state know.
      
      if (this.globalGameState.finishedGames === this.globalGameState.totalGames) {
        let drone = this.hangar.playerDrone.getComponent(Drone);
        log("Wow, all boards complete! You win!!!");
        
        // You win the whole game sound!
        this.audioSources.winGame.playOnce();
        
        await drone.goto(this.hangar.getDroneSpot());
        await drone.despawn();
      }
      else {
        // You win this board sound (have to swap out audio source which drone vacuum sound already occupied)
        this.audioSources.winBoard.playOnce();
      }
    }
  }
}

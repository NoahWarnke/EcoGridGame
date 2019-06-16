import GameCell from 'gamecell';

/**
 * A GameState instance represents the current state of play for one instance of the Eco Grid Game :)
 */
export default class GameState {
  
  /**
   * This is the X size of the grid.
   */
  private nx: number;
  
  /**
   * This is the Y size of the grid.
   */
  private ny: number;
  
  /**
   * This is the number of object types in the grid (not counting the hole).
   */
  private numTypes: number;
  
  /**
   * This keeps track of how many of each type remain on the board. Used for preventing that number being 0<x<4.
   */
  private numOfEachType: number[];
  
  /**
   * This is the number of moves you've performed.
   */
  private numMoves = 0;
  
  /**
   * This is the actual grid. Each grid cell is a GameCell object.
   */
  private grid: GameCell[][] = [];

  /**
   * Construct a new GameState given the size of the grid and the number of objects in it.
   * @param numTypes how many types of object there are in the grid.
   * @param gridLayout a layout
   */
  constructor(numTypes: number, width: number, height: number) {
    
    this.numTypes = numTypes;
    this.nx = width;
    this.ny = height;
    
    
    this.numOfEachType = [];
    for(let i = 1; i <= this.numTypes; i++) {
      this.numOfEachType[i] = 0;
    }
    
    // Set up our grid.
    let gridLayout = this.createGridLayout();
    this.setGridToGridLayout(gridLayout);
  }
  
  public getWidth() {
    return this.nx;
  }
  
  public getHeight() {
    return this.ny;
  }
  
  public getCellAt(x: number, y: number): GameCell {
    return this.grid[x][y];
  }
  
  /**
   * Generate a random grid layout for this GameState.
   */
  public createGridLayout(): number[][] {
    
    // Quick validation that a valid game state is possible.
    if (this.numTypes * 4 > this.nx * this.ny - 1) {
      throw new Error("Impossible to fit at least 4 of each type on the board!");
    }
    
    let gridLayout: number[][];
    let gridSlots: number[][];
    
    
    let squareExists;
    do {
      gridLayout = [];
      gridSlots = [];
      
      // Generate grid.
      for (let x = 0; x < this.nx; x++) {
        gridLayout[x] = [];
        for (let y = 0; y < this.ny; y++) {
          gridLayout[x][y] = 0;
          gridSlots.push([x, y]);
        }
      }
      
      // Generate random objects in grid.
      // Want there to be an almost-equal (off by at most 1) number of each type, randomly scattered.
      // Note we're leaving one slot at 0, which is the hole.
      // Also, repeat the generation process until we get a grid with no squares.
      let type = 0;
      for (let i = 0; i < this.nx * this.ny - 1; i++) { // -1 leaves the hole.
        let randomIndex = Math.floor(Math.random() * gridSlots.length);
        let [x, y] = gridSlots[randomIndex];
        
        gridLayout[x][y] = type + 1;
        gridSlots.splice(randomIndex, 1); // remove from gridSlots.
        type = (type + 1) % this.numTypes;
      }
      
      // Verify we don't have any 2x2 squares already.
      squareExists = false;
      for (let x = 0; x < this.nx - 1 && !squareExists; x++) {
        for (let y = 0; y < this.ny - 1 && !squareExists; y++) {
            
          let squareType = gridLayout[x][y];
          if (
            squareType !== -1 && // If it's of the done type, can't make squares out of it.
            gridLayout[x + 1][y    ] === squareType &&
            gridLayout[x    ][y + 1] === squareType &&
            gridLayout[x + 1][y + 1] === squareType
          ) {
            squareExists = true;
          }
        }
      }
    } while (squareExists);
    
    
    return gridLayout;
  }
  
  /**
   * Set the grid's state using a given grid layout.
   */
  private setGridToGridLayout(gridLayout: number[][]) {
    
    this.grid = [];
    
    for (let x = 0; x < this.nx; x++) {
      this.grid[x] = [];
      for (let y = 0; y < this.ny; y++) {
        let type: number = gridLayout[x][y];
        this.grid[x].push(new GameCell(type));
        if (type !== 0) {
          this.numOfEachType[type]++; // keep track of counts.
        }
      }
    }
    
    // Quick validation that there are enough of each type.
    for (let i = 1; i <= this.numTypes; i++) {
      if (this.numOfEachType[i] < 4) {
        throw new Error("Insufficient number of pieces of type " + i);
      }
      else {
        log('type ' + i + ' has ' + this.numOfEachType[i] + ' pieces.');
      }
    }
  }
  
  /**
   * Determine if we're able to slide a line of pieces towards the hole from the clicked position clickX, clickY.
   * @returns an array of sets of four numbers: the x and y of a piece that can slide, and the x and y of the adjacent slot it slides into. Importantly, in order from the hole back to the clic.
   */
  public getSlidePairsFromClick(clickX: number, clickY: number): [number, number, number, number][] {
    let holeX = -1;
    let holeY = -1;
    for (let x = 0; x < this.nx && holeX === -1; x++) {
      if (this.grid[x][clickY].type === 0) {
        holeX = x;
        holeY = clickY;
      }
    }
    for (let y = 0; y < this.ny && holeY === -1; y++) {
      if (this.grid[clickX][y].type === 0) {
        holeX = clickX;
        holeY = y;
      }
    }
    
    // Return if no hole found in the same row or column as the click, or if you somehow clicked on the hole (should be impossible).
    if (holeX === -1 || holeY === -1 || (holeX === clickX && holeY === clickY)) {
      return [];
    }
    
    // Let's get our set of pieces that will be slid, plus their new positions.
    let result = [];
    if (holeY === clickY) {
      if (clickX < holeX) {
        for (let x = holeX - 1; x >= clickX; x--) {
          result.push([x, clickY, x + 1, clickY]);
        }
      }
      else {
        for (let x = holeX + 1; x <= clickX; x++) {
          result.push([x, clickY, x - 1, clickY]);
        }
      }
    }
    else {
      if (clickY < holeY) {
        for (let y = holeY - 1; y >= clickY; y--) {
          result.push([clickX, y, clickX, y + 1]);
        }
      }
      else {
        for (let y = holeY + 1; y <= clickY; y++) {
          result.push([clickX, y, clickX, y - 1]);
        }
      }
    }
    
    return result;
  }
  
  /**
   * Slide a set of pieces from old to (theoretically adjacent) new spots.
   * Depends on the input list going backwards along the slide direction.
   */
  public performSlide(pieceSlides: [number, number, number, number][]) {
    for (let [x, y, newX, newY] of pieceSlides) {
      this.grid[newX][newY].type = this.grid[x][y].type;
      this.grid[x][y].type = 0;
    }
  }
  
  /**
   * Check for a 2x2 square of the same type with the lower left corner at the given coords.
   * @returns the type, if squre present, or -1 if no square.
   */
  public checkForSquareOfSameType(x: number, y: number): number {
    let squareType = this.grid[x][y].type;
    if (
      squareType !== -1 && // If it's of the done type, can't make squares out of it.
      this.grid[x + 1][y    ].type === squareType &&
      this.grid[x    ][y + 1].type === squareType &&
      this.grid[x + 1][y + 1].type === squareType
    ) {
      return squareType;
    }
    return -1;
  }
  
  /**
   * Check the whole grid for 2x2 squares of the same type.
   * @returns a list of tuples containing the x and y coords of each square, and the type of the square.
   */
  public checkWholeGridForSquaresOfSameType(): [number, number, number][] {
    let result = [];
    for (let x = 0; x < this.nx - 1; x++) {
      for (let y = 0; y < this.ny - 1; y++) {
        let type = this.checkForSquareOfSameType(x, y);
        if (type !== -1) {
          result.push([x, y, type]);
        }
      }
    }
    return result;
  }
  
  /**
   * For a square with the given corners, mark the four elements for deletion.
   */
  public markSquareForDeletion(cornerX: number, cornerY: number) {
    log('Marking square for deletion...');
    // Simply go through the 4 square cells and mark for deletion! If it was already marked, that's fine.
    for (let x = cornerX; x < cornerX + 2; x++) {
      for (let y = cornerY; y < cornerY + 2; y++) {
        this.grid[x][y].del = true;
      }
    }
  }
  
  /**
   * For a given type and given that a square of that type has already had its cells marked for deletion, mark all other connected cells of same type for deletion.
   */
  public markConnectedForDeletion(squareType: number) {
    log('marking connected, given type ' + squareType);
    // Now proceed to find the other adjacent same-type objects.
    // We'll just iterate, each time checking the whole grid, until we don't find any other adjacent same-type objects.
    
    let again = true; // Indicates we need to do another iteration because new cells were marked the last round.
    
    while (again) {
      again = false;
      for (let x = 0; x < this.nx; x++) {
        for (let y = 0; y < this.ny; y++) {
          if (this.grid[x][y].type === squareType && !this.grid[x][y].del) {
            
            // Check the four adjacent ones, like earlier - if one of them is scheduled for deletion, this one should be too!
            if (
              x > 0 && this.grid[x - 1][y].del
              || x < this.nx - 1 && this.grid[x + 1][y].del
              || y > 0 && this.grid[x][y - 1].del
              || y < this.ny - 1 && this.grid[x][y + 1].del
            ) {
              log('mark ' + x + ', ' + y);
              this.grid[x][y].del = true;
              again = true;
            }
          }
        }
      }
    }
  }
  
  /**
   * Delete all cells marked for deletion and replace with new random(?) values.
   */
  public deleteAndReplace() {
    
    // Count how many will remain of the deleted type.
    
    let markedForDeletion: GameCell[] = [];
    for (let x = 0; x < this.nx; x++) {
      for (let y = 0; y < this.ny; y++) {
        if (this.grid[x][y].del) {
          markedForDeletion.push(this.grid[x][y]);
          this.grid[x][y].del = false;
          log(x + ", " + y);
          log(this.grid[x][y]);
        }
      }
    }
    
    // Make sure we're actually deleting.
    if (markedForDeletion.length === 0) {
      return;
    }
    
    let typeBeingDeleted = markedForDeletion[0].type;
    log('current number of type ' + typeBeingDeleted + ': ' + this.numOfEachType[typeBeingDeleted]);
    
    log('Markedfordeletion length ' + markedForDeletion.length);
    
    if (markedForDeletion.length > this.numOfEachType[typeBeingDeleted]) {
      log('Error!!!');
    }
    
    // Calculate how many of this type of piece need to not be turned into the done piece, in order to have either 0 or at least 4 pieces left.
    // Invariant: before the deletion, there were at least 4 of that piece, and at least 4 of that piece are being deleted.
    let numLeft = this.numOfEachType[typeBeingDeleted] - markedForDeletion.length;
    log('Number of type ' + markedForDeletion[0].type + ' that would be remaining after this: ' + numLeft);
    let numKept = 0;
    if (numLeft > 0 && numLeft < 4) {
      numKept = 4 - numLeft;
      
      // Randomly 'save from deletion' the correct number.
      for (var i = 0; i < numKept; i++) {
        markedForDeletion.splice(Math.floor(Math.random() * markedForDeletion.length), 1);
      }
    }
    
    // Finally swap types for all the ones still marked for deletion to -1, aka the done piece.
    for (let cell of markedForDeletion) {
      cell.type = -1;
    }
    this.numOfEachType[typeBeingDeleted] -= markedForDeletion.length;
  }
  
  /**
   * One more move has been made.
   */
  public incrementMoves() {
    this.numMoves++;
  }
}

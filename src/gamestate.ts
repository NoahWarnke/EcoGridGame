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
    
    // Each cell of the grid has a type, a del value (it's marked for deletion), and a cleared value (already deleted an object on it once.)
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
   * Get coordinates of empty cell you can swap an object at the given clickX and clickY to.
   * Returns the click coordinates if the swap is impossible.
   * @param clickX The x coordinate of the click.
   * @param clickY the y coordinate of the click.
   * @returns A tuple containing the x and y coordinates you can swap to, or just clickX, clickY if you can't.
   */
  public getSwapCoordsFromClick(clickX: number, clickY: number): [number, number] {
    
    let swapX = clickX, swapY = clickY;

    // Want to check the 4 pixels to up, down, left, right of clicked one (unless it's at an edge/corner).
    if (clickX > 0 && this.grid[clickX - 1][clickY].type === 0) {
      swapX = clickX - 1;
    }
    else if (clickX < this.nx - 1 && this.grid[clickX + 1][clickY].type === 0) {
      swapX = clickX + 1;
    }
    else if (clickY > 0 && this.grid[clickX][clickY - 1].type === 0) {
      swapY = clickY - 1;
    }
    else if (clickY < this.ny - 1 && this.grid[clickX][clickY + 1].type === 0) {
      swapY = clickY + 1;
    }
    else {
      // Can't move. Note this can also happen if you click on the hole.
    }
    
    return [swapX, swapY];
  }
  
  /**
   * Perform a swap between the cell at (clickX, clickY) and the cell at (swapX, swapY).
   * Does nothing if not adjacent, on the grid, etc.
   * @returns true if swap successful.
   */
  public performSwap(clickX: number, clickY: number, swapX: number, swapY: number) {
    
    // Sanity check to make sure swap is adjacent.
    if (Math.abs(clickX - swapX) + Math.abs(clickY - swapY) !== 1) {
      log('Click and swap were not adjacent!');
      return false;
    }
    
    // Sanity check to make sure swap is on grid.
    if (swapX < 0 || swapX > this.nx - 1 || clickX < 0 || clickX > this.nx - 1
      || swapY < 0 || swapY > this.ny - 1 || clickY < 0 || clickY > this.ny - 1
    ) {
      log('Click or swap cell was not on the grid!');
      return false;
    }
    
    // Move the object into the hole.
    this.grid[swapX][swapY].type = this.grid[clickX][clickY].type;
    
    // Move the hole to where the object was.
    this.grid[clickX][clickY].type = 0;
    
    return true;
  }
  
  /**
   * Check the grid for a 2x2 square of same-type objects that may have been generated from a swap into a given coordinate.
   * @returns A tuple containing the square's lower left corner plus the type of the square, or -1, -1 if none found. Greedy, so returns first such square found.
   */
  public checkForSquareOfSameTypeAroundPoint(swapX: number, swapY: number): [number, number, number] {
    
    // Only need to look at the up-to 4 2x2 squares that include swapX, swapY, since that's the only thing that changed.
    for (let x = Math.max(0, swapX - 1); x < Math.min(this.nx - 1, swapX + 1); x++) {
      for (let y = Math.max(0, swapY - 1); y < Math.min(this.ny - 1, swapY + 1); y++) {
        log ('checking ' + x + ', ' + y);
        
        // Check all four cells in this have the same type.
        let type = this.checkForSquareOfSameType(x, y);
        if (type !== -1) {
          return [x, y, type];
        }
      }
    }
    
    // Failed to find a square.
    return [-1, -1, -1];
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
   * For a square with the given corners, mark the four elements for deletion.
   */
  public markSquareForDeletion(cornerX: number, cornerY: number) {
    
    // Simply go through the 4 square cells and mark for deletion!
    for (let squareX = 0; squareX < 2; squareX++) {
      for (let squareY = 0; squareY < 2; squareY++) {
        this.grid[cornerX + squareX][cornerY + squareY].del = true;
        this.grid[cornerX + squareX][cornerY + squareY].cleared = true;
      }
    }
  }
  
  /**
   * For a given type and given that a square of that type has already had its cells marked for deletion, mark all other connected cells of same type for deletion.
   */
  public markConnectedForDeletion(squareType: number) {
    
    // Now proceed to find the other adjacent same-type objects.
    // We'll just iterate, each time checking the whole grid, until we don't find any other adjacent same-type objects.
    
    let again = true; // Indicates we need to do another iteration because new cells were marked the last round.
    
    while (again) {
      again = false;
      for (let x = 0; x < this.nx; x++) {
        for (let y = 0; y < this.ny; y++) {
          if (!this.grid[x][y].del && this.grid[x][y].type === squareType) {
            
            // Check the four adjacent ones, like earlier - if one of them is scheduled for deletion, this one should be too!
            if (
              x > 0 && this.grid[x - 1][y].del
              || x < this.nx - 1 && this.grid[x + 1][y].del
              || y > 0 && this.grid[x][y - 1].del
              || y < this.ny - 1 && this.grid[x][y + 1].del
            ) {
              this.grid[x][y].del = true;
              if (!this.grid[x][y].cleared) {
                this.grid[x][y].cleared = true;
              }
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
        }
      }
    }
    
    // Make sure we're actually deleting.
    if (markedForDeletion.length === 0) {
      return;
    }
    
    let typeBeingDeleted = markedForDeletion[0].type;
    log('current number of type ' + typeBeingDeleted + ': ' + this.numOfEachType[typeBeingDeleted]);
    
    log('Markedfordeletion length ' + markedForDeletion.length)
    
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
      cell.del = false;
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

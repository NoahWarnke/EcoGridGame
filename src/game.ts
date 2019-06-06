

/**
 * A GameState instance represents the current state of play for one instance of the Eco Grid Game :)
 */
class GameState {
  
  /**
   * This is the X size of the grid.
   */
  private nx = 4;
  
  /**
   * This is the Y size of the grid.
   */
  private ny = 4;
  
  /**
   * This is the number of object types in the grid (not counting the hole).
   */
  private numTypes = 3;
  
  /**
   * This is the number of objects cleared from the grid. Get this to n*n-1 to win!
   */
  private numCleared = 0;
  
  /**
   * This is the number of moves you've performed.
   */
  private numMoves = 0;
  
  /**
   * This is the actual grid. Each grid cell has four values.
   * type is a number indicating what kind of object is there.
   * del is a boolean indicating if the cell is currently marked for deletion.
   * delTimer is a number indicating how many cells away from the 2x2 the cell is, if marked for deletion.
   * cleared is a boolean indicating if the cell has previously been cleared.
   */
  private grid: {type: number, del: boolean, delTimer: number, cleared: boolean}[][] = [];

  /**
   * Construct a new GameState given the size of the grid and the number of objects in it.
   * @param numTypes how many types of object there are in the grid.
   * @param gridLayout a layout
   */
  constructor(numTypes: number, gridLayout: number[][]) {
    this.nx = gridLayout.length;
    this.ny = gridLayout[0].length;
    this.numTypes = numTypes;
    
    // Set up our grid.
    this.setGridToGridLayout(gridLayout);
  }
  
  /**
   * Generate a random grid layout of the given dimensions.
   */
  public static generateRandomGridLayout(nx: number, ny: number, numTypes: number): number[][] {
    
    let gridLayout: number[][] = [];
    
    // Generate random objects in grid.
    for (var x = 0; x < nx; x++) {
      gridLayout[x] = [];
      for (var y = 0; y < ny; y++) {
        gridLayout[x].push(Math.floor(Math.random() * numTypes) + 1)
      }
    }
    
    // Generate the hole.
    gridLayout[Math.floor(Math.random() * nx)][Math.floor(Math.random() * ny)] = 0;
    
    return gridLayout;
  }
  
  /**
   * Generate a non-random grid layout with 4x4 dimensions.
   */
  public static getHardcoded4x4GridLayout(): number[][] {
    return [
      [2, 1, 3, 2],
      [3, 3, 1, 2],
      [3, 0, 3, 2],
      [1, 3, 3, 2]
    ];
  }
  
  /**
   * Set the grid's state using a given grid layout.
   */
  private setGridToGridLayout(gridLayout: number[][]) {
    
    this.grid = [];
    
    // Each cell of the grid has a type, a del value (it's marked for deletion), and a cleared value (already deleted an object on it once.)
    for (var x = 0; x < this.nx; x++) {
      this.grid[x] = [];
      for (var y = 0; y < this.ny; y++) {
        this.grid[x].push({
          type: gridLayout[x][y], //Math.floor(Math.random() * numTypes) + 1, // What type of object is at that position.
          del: false,                                     // Object is scheduled for deletion.
          delTimer: 0,                                    // How much of a delay for deletion animation.
          cleared: false                                  // Position has been cleared before.
        });
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
  public checkForSquareOfSameType(swapX: number, swapY: number): [number, number, number] {
    
    // Only need to look at the up-to 4 2x2 squares that include swapX, swapY, since that's the only thing that changed.
    for (let x = Math.max(0, swapX - 1); x < Math.min(this.nx - 1, swapX); x++) {
      for (let y = Math.max(0, swapY - 1); y < Math.min(this.ny - 1, swapY); y++) {
        log ('checking ' + x + ', ' + y);
        
        // Check all four boxes.
        let squareType = -1;
        let notYetInvalid = true; //
        for (let squareX = 0; squareX < 2 && notYetInvalid; squareX++) {
          for (let squareY = 0; squareY < 2 && notYetInvalid; squareY++) {
            if (squareType === -1) {
              squareType = this.grid[x + squareX][y + squareY].type; // Type of lower left corner is the one we need the other 3 to be.
            }
            else {
              if (this.grid[x + squareX][y + squareY].type !== squareType) {
                log ('failed due to ' + (x + squareX) + ', ' + (y + squareY) + ': ' + squareType + ' but not ' + this.grid[x + squareX][y + squareY].type);
                notYetInvalid = false; // Hit a wrong-type object.
              }
            }
          }
        }
        
        if (notYetInvalid) {
          log('Success! Found square at ' + x + ', ' + y);
          return [x, y, squareType];
        }
      }
    }
    
    // Failed to find a square.
    return [-1, -1, -1];
  }
  
  public markSquareForDeletion(cornerX: number, cornerY: number) {
    
    // Simply go through the 4 square cells and mark for deletion!
    for (let squareX = 0; squareX < 2; squareX++) {
      for (let squareY = 0; squareY < 2; squareY++) {
        this.grid[cornerX + squareX][cornerY + squareY].del = true;
        this.grid[cornerX + squareX][cornerY + squareY].delTimer = 0;
        this.grid[cornerX + squareX][cornerY + squareY].cleared = true;
        this.numCleared++;
      }
    }
  }
  
  public markConnectedForDeletion(squareType: number) {
    
    // Now proceed to find the other adjacent same-type objects.
    // We'll just iterate, each time checking the whole grid, until we don't find any other adjacent same-type objects.
    
    let again = true; // Indicates we need to do another iteration because new cells were marked the last round.
    let distance = 0; // How many iterations we've done, aka how far the deleted cells have spread.
    
    while (again) {
      again = false;
      distance++;
      log('Scanning, round ' + distance);
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
              log('Deleting ' + x + ', ' + y);
              this.grid[x][y].del = true;
              this.grid[x][y].delTimer = distance;
              this.grid[x][y].cleared = true;
              this.numCleared++;
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
    for (let x = 0; x < this.nx; x++) {
      for (let y = 0; y < this.ny; y++) {
        let cell = this.grid[x][y];
        if (cell.del) {
          cell.del = false;
          cell.delTimer = 0;
          cell.type = -1; // temp - should be a random new one.
        }
      }
    }
  }
  
  /**
   * Handle a click on the given cell.
   */
  public click(clickX: number, clickY: number) {
    
    // Increment the number of moves.
    this.numMoves++;
    
    // See if a swap is valid.
    let [swapX, swapY] = this.getSwapCoordsFromClick(clickX, clickY);
    if (swapX === clickX && swapY === clickY) {
      log('Cannot swap there!');
      return;
    }
    
    // Do the swap.
    if (!this.performSwap(clickX, clickY, swapX, swapY)) {
      log('Swap failed (should not though)...');
      return;
    }
    
    // See if we have a 2x2 square generated from the swap.
    let [cornerX, cornerY, squareType] = this.checkForSquareOfSameType(swapX, swapY);
    if (cornerX === -1 || cornerY === -1) {
      log('No new 2x2.');
      return;
    }
    
    // Mark the square, and any connected same-type objects, for deletion.
    this.markSquareForDeletion(cornerX, cornerY);
    this.markConnectedForDeletion(squareType);
    
    // Do the deletion and replace with new things.
    this.deleteAndReplace();
    
    // Check for game completion.
    if (this.getClearedFraction() == 1.0) {
      log('You win!');
    }
  }
  
  /**
   * Quickly render grid to log.
   */
  public showGrid() {
    for (let y = 0; y < this.ny; y++) {
      let line = "";
      for (let x = 0; x < this.nx; x++) {
        line += this.grid[x][y].type + " ";
      }
      log(line);
    }
  }
  
  /**
   * Get the fraction of the grid that you've cleared.
   */
  public getClearedFraction() {
    return this.numCleared / (this.nx * this.ny);
  }
}


// Instantiate our new game state! Let's start with hardcoded for now.
let gameState: GameState = new GameState(3, GameState.getHardcoded4x4GridLayout());
gameState.showGrid();

// Simulate a click at (2, 2).
gameState.click(2, 2);
gameState.showGrid();
log((gameState.getClearedFraction() * 100) + '% done.');


/**
 * Represents a single game cell in the game state.
 * type is a number indicating what kind of object is there.
 * del is a boolean indicating if the cell is currently marked for deletion.
 * delTimer is a number indicating how many cells away from the 2x2 the cell is, if marked for deletion.
 * cleared is a boolean indicating if the cell has previously been cleared.
 */
export default class GameCell {
  public type: number;
  public del: boolean;
  public delTimer: number;
  public cleared: boolean;
  
  constructor(type: number) {
    this.type = type;
    this.del = false;
    this.delTimer = 0;
    this.cleared = false;
  }
}

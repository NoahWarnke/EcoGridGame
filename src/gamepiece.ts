
/**
 * Represents a single game piece in the game scene.
 */
@Component('gamePiece')
export default class GamePiece {
  public entity: Entity;
  public x: number;
  public y: number;
  public type: number;
  
  // Stuff for sliding the piece.
  public sliding: boolean;
  public slideAlpha: number;
  public slideTargetX: number;
  public slideTargetY: number;
  public resolveSlide: Function;
  
  // Stuff for animating the piece deletion/replacement.
  public deleting: boolean;
  public deleteTime: number; // seconds since delete anim started.
  public deleteBlink: boolean;
  public normalMat: Material;
  public resolveDeletion: Function;
  
  constructor(x: number, y: number, type: number, entity: Entity) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.entity = entity;
    
    this.sliding = false;
    this.slideAlpha = 0;
    this.slideTargetX = x;
    this.slideTargetY = y;
    this.resolveSlide = undefined;
    
    this.deleting = false;
    this.deleteTime = 0;
    this.deleteBlink = false;
    this.resolveDeletion = undefined;
  }
  
  /**
   * Start the piece sliding to a new position.
   * @returns a Promise that resolves when the slide finishes.
   */
  slide(slideX: number, slideY: number) {
    this.sliding = true;
    this.slideAlpha = 0;
    this.slideTargetX = slideX;
    this.slideTargetY = slideY;
    
    return new Promise((resolve, reject) => {
      this.resolveSlide = () => {
        this.resolveSlide = undefined;
        this.sliding = false;
        this.x = this.slideTargetX;
        this.y = this.slideTargetY;
        this.slideAlpha = 0;
        resolve();
      }
    });
  }
  
  /**
   * Start the deletion animation.
   * @returns a Promise that resolves when the slide finishes.
   */
  showDeletion() {
    this.deleting = true;
    try {
      this.normalMat = this.entity.getComponent(Material); // save so we can go back to it when done.
    }
    catch (e) {
      log('Unable to find normalMat for piece at ' + this.x + ', ' + this.y + ' with type ' + this.type);
      this.normalMat = undefined;
    }
    return new Promise((resolve, reject) => {
      let curMat: Material;
      try {
        let curMat = this.entity.getComponent(Material);
      }
      catch(e) {
        log('Unable to find curMat for piece at ' + this.x + ', ' + this.y + ' with type ' + this.type);
        curMat = undefined;
      }
      if (curMat !== this.normalMat && curMat !== undefined) {
        this.entity.removeComponent(curMat);
        this.entity.addComponent(this.normalMat);
      }
      this.resolveDeletion = () => {
        this.resolveDeletion = undefined;
        this.deleting = false;
        this.deleteTime = 0;
        resolve();
      }
    })
  }
}

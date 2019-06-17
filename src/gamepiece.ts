
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
  slide(slideX: number, slideY: number): Promise<void> {
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
  showDeletion(): Promise<void> {
    this.deleting = true;
    
    return new Promise((resolve, reject) => {
      this.entity.getComponent(Transform).scale.set(1, 1, 1); // Make sure we're at normal scale.
      this.resolveDeletion = () => {
        this.resolveDeletion = undefined;
        this.deleting = false;
        this.deleteTime = 0;
        resolve();
      }
    })
  }
}

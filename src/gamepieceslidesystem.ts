import GamePiece from 'gamepiece';

/**
 * Updates a GamePiece as it slides.
 */
export default class GamePieceSlideSystem implements ISystem {
  pieces: ComponentGroup = engine.getComponentGroup(GamePiece, Transform);
  
  public update(dt: number) {
    for (let entity of this.pieces.entities) {
      let piece = entity.getComponent(GamePiece);
      
      if (!piece.sliding) {
        continue;
      }
      
      // Calculate new alpha along slide (lasts for 0.75 seconds).
      piece.slideAlpha = Math.min(1, piece.slideAlpha + dt / 0.75);
      
      // Update piece position.
      let pos = entity.getComponent(Transform).position;
      pos.set(
        (piece.slideTargetX - piece.x) * piece.slideAlpha + piece.x,
        pos.y,
        (piece.slideTargetY - piece.y) * piece.slideAlpha + piece.y // DCL is dumb and y is up, not z.
      );
      
      // Check for the end of the slide, and resolve it if so.
      if (piece.slideAlpha === 1) {
        piece.resolveSlide();
      }
    }
  }
}

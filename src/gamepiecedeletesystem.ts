import GamePiece from 'gamepiece';

/**
 * Updates a GamePiece as it is deleted (collected as trash).
 */
export default class GamePieceDeleteSystem implements ISystem {
  pieces: ComponentGroup = engine.getComponentGroup(GamePiece, Material);
  blinkMat: Material = new Material();
  
  public update(dt: number) {
    for (let entity of this.pieces.entities) {
      let piece = entity.getComponent(GamePiece);
      
      if (!piece.deleting) {
        continue;
      }
      
      piece.deleteTime += dt;
      
      if (piece.deleteTime > 1.5) {
        piece.resolveDeletion();
        continue;
      }
      
      // Blink twice every second.
      let blink = Math.floor(piece.deleteTime * 4) % 2 === 0;
      if (blink && !piece.deleteBlink) {
        entity.removeComponent(piece.normalMat);
        entity.addComponent(this.blinkMat);
        piece.deleteBlink = true;
      }
      else if (!blink && piece.deleteBlink) {
        entity.removeComponent(this.blinkMat);
        entity.addComponent(piece.normalMat);
        piece.deleteBlink = false;
      }
    }
  }
}

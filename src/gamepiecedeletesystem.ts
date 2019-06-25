import GamePiece from 'gamepiece';

/**
 * Updates a GamePiece as it is deleted (collected as trash).
 */
export default class GamePieceDeleteSystem implements ISystem {
  pieces: ComponentGroup = engine.getComponentGroup(GamePiece, Transform);
  
  public update(dt: number) {
    for (let entity of this.pieces.entities) {
      let piece = entity.getComponent(GamePiece);
      
      if (!piece.deleting) {
        continue;
      }
      
      piece.deleteTime += dt;
      
      if (piece.deleteTime > 1) {
        entity.getComponent(Transform).position.set(piece.x, 0, piece.y);
        piece.resolveDeletion();
        continue;
      }
      
      entity.getComponent(Transform).position.set(
        (piece.deleteCoord.x - piece.x) / 1 * piece.deleteTime + piece.x,
        (piece.deleteCoord.y) / 1 * piece.deleteTime,
        (piece.deleteCoord.z - piece.y) / 1 * piece.deleteTime + piece.y
      );
      
    }
  }
}

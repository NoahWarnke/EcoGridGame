
/**
 * This is the type for the specification you construct a GameBoard with.
 */
export default interface GameBoardSpecification {
  dimensions: {
    x: Number,
    y: Number
  },
  transform: Transform,
  boardShape: Shape,
  pieceTypes: PieceType[],
  donePieceShapes: Shape[]
}

export interface PieceType   {
    receptacleShape: Shape,
    receptacleTransform: Transform,
    shapes: Shape[]
}

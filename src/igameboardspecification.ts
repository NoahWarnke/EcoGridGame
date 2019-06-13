import IPieceType from 'ipiecetype';

/**
 * This is the type for the specification you construct a GameBoard with.
 */
export default interface IGameBoardSpecification {
  dimensions: {
    x: number,
    y: number
  },
  transform: Transform,
  boardShape: Shape,
  pieceTypes: IPieceType[],
  donePieceShapes: Shape[]
}

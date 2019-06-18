import IPieceType from 'ipiecetype';
import {DroneHangar} from 'dronehangar';

/**
 * This is the type for the specification you construct a GameBoard with.
 */
export default interface IGameBoardSpecification {
  dimensions: {
    x: number,
    y: number
  },
  transform: Transform,
  pieceTypes: IPieceType[],
  donePieceShapes: Shape[],
  hangar: DroneHangar
}


/**
 * Simple interface representing a piece type (e.g. recyclable, landfill, compost).
 */
export default interface IPieceType {
  receptacleShape: Shape,
  receptacleTransform: Transform,
  shapes: [Shape, number][]
}

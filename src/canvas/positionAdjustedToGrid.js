// @flow

const positionAdjustedToGrid = (
  position: number,
  gridSize: ?number
): number => {
  if (!gridSize) {
    return position;
  }
  const normalizedPosition = position % gridSize;
  const normalizedStartPoint = position - normalizedPosition;
  return normalizedPosition > gridSize / 2
    ? normalizedStartPoint + gridSize
    : normalizedStartPoint;
};

export default positionAdjustedToGrid;

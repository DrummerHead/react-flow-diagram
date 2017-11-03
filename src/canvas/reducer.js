// @flow

import type { ActionShape, Action } from '../diagram/reducer';

export type CanvasState = {
  offsetX: number,
  offsetY: number,
};

export type CanvasAction =
  | ActionShape<'rd/canvas/SET_OFFSET', CanvasState>
  | ActionShape<'rd/canvas/TRACK', TrackMovementProps>;

const canvasReducer = (
  state: CanvasState = { offsetX: 0, offsetY: 0 },
  action: Action
): CanvasState => {
  switch (action.type) {
    case 'rd/canvas/SET_OFFSET':
      return action.payload;
    default:
      return state;
  }
};

export type SetOffsetProps = CanvasState;
export const setOffset = (payload: SetOffsetProps): CanvasAction => ({
  type: 'rd/canvas/SET_OFFSET',
  payload,
});

export type TrackMovementProps = { x: number, y: number };
export const trackMovement = (payload: TrackMovementProps): CanvasAction => ({
  type: 'rd/canvas/TRACK',
  payload,
});

export default canvasReducer;

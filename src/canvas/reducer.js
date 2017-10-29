// @flow

import type { ActionShape, Action } from '../diagram/reducer';

export type CanvasState = {
  offsetX: number,
  offsetY: number,
};

export type CanvasAction = ActionShape<'rd/canvas/SET_OFFSET', CanvasState>;

const canvasReducer = (
  state: CanvasState = { offsetX: 0, offsetY: 0 },
  action: Action
) => {
  switch (action.type) {
    case 'rd/canvas/SET_OFFSET':
      return action.payload;
    default:
      return state;
  }
};

export type SetOffsetProps = CanvasState;
export const setOffset = (offset: SetOffsetProps): CanvasAction => ({
  type: 'rd/canvas/SET_OFFSET',
  payload: offset,
});

export default canvasReducer;

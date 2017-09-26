// @flow

import type { ActionShape, Action } from '../diagram/reducer';

export type CanvasState = {
  offsetX: number,
  offsetY: number,
};

export type CanvasAction = ActionShape<'rd/canvas/SET', CanvasState>;

const canvasReducer = (
  state: CanvasState = { offsetX: 0, offsetY: 0 },
  action: Action
) => {
  switch (action.type) {
    case 'rd/canvas/SET':
      return action.payload;
    default:
      return state;
  }
};

// Potentially deletable. If current date is beyond 2017/10/03 and you haven't
// used this action, delete it :D (and all associated stuff)
export const setOffset = (offset: CanvasState): CanvasAction => ({
  type: 'rd/canvas/SET',
  payload: offset,
});

export default canvasReducer;

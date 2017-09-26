// @flow

import entityReducer from '../entity/reducer';
import canvasReducer from '../canvas/reducer';

import type { EntityState, EntityAction } from '../entity/reducer';
import type { CanvasState, CanvasAction } from '../canvas/reducer';

export type State = {
  entity: EntityState,
  canvas: CanvasState,
};

export type ActionShape<S, P> = { type: S, payload: P };

export type Action = EntityAction | CanvasAction;

const initialState = {
  entity: [],
  canvas: {
    offsetX: 0,
    offsetY: 0,
  },
};

const appReducer = (state: State = initialState, action: Action) => ({
  entity: entityReducer(state.entity, action),
  canvas: canvasReducer(state.canvas, action),
});

export default appReducer;

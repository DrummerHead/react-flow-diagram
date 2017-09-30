// @flow

import entityReducer, { metaEntityReducer } from '../entity/reducer';
import canvasReducer from '../canvas/reducer';

import type {
  EntityState,
  MetaEntityState,
  EntityAction,
} from '../entity/reducer';
import type { CanvasState, CanvasAction } from '../canvas/reducer';

export type State = {
  entity: EntityState,
  metaEntity: MetaEntityState,
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
  metaEntity: [],
};

const appReducer = (state: State = initialState, action: Action) => ({
  entity: entityReducer(state.entity, action),
  canvas: canvasReducer(state.canvas, action),
  metaEntity: metaEntityReducer(state.metaEntity, action),
});

export default appReducer;

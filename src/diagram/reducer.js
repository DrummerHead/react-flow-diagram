// @flow

import entityReducer, { metaEntityReducer } from '../entity/reducer';
import canvasReducer from '../canvas/reducer';
import configReducer from './configReducer';

import type {
  EntityState,
  MetaEntityState,
  EntityAction,
} from '../entity/reducer';
import type { CanvasState, CanvasAction } from '../canvas/reducer';
import type { ConfigState } from './configReducer';

export type State = {
  entity: EntityState,
  metaEntity: MetaEntityState,
  canvas: CanvasState,
  config: ConfigState,
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
  config: {
    entityTypes: {},
  },
};

const appReducer = (state: State = initialState, action: Action) => ({
  entity: entityReducer(state.entity, action),
  canvas: canvasReducer(state.canvas, action),
  metaEntity: metaEntityReducer(state.metaEntity, action),
  config: configReducer(state.config, action),
});

export default appReducer;

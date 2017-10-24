// @flow

import entityReducer, { metaEntityReducer } from '../entity/reducer';
import canvasReducer from '../canvas/reducer';
import configReducer from './configReducer';
import history from '../history/reducer';

import type {
  EntityState,
  MetaEntityState,
  EntityAction,
} from '../entity/reducer';
import type { CanvasState, CanvasAction } from '../canvas/reducer';
import type { ConfigState } from './configReducer';
import type { HistoryState, HistoryAction } from '../history/reducer';

export type State = {
  entity: EntityState,
  metaEntity: MetaEntityState,
  canvas: CanvasState,
  config: ConfigState,
  history: HistoryState<{ entity: EntityState, metaEntity: MetaEntityState }>,
};

export type ActionShape<S, P> = { type: S, payload: P };

export type Action = EntityAction | CanvasAction | HistoryAction;

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
  history: {
    past: [],
    future: [],
  },
};

const appReducer = (state: State = initialState, action: Action) => ({
  entity: entityReducer(state.entity, action),
  canvas: canvasReducer(state.canvas, action),
  metaEntity: metaEntityReducer(state.metaEntity, action),
  config: configReducer(state.config, action),
  history: state.history,
});

export default history(appReducer);

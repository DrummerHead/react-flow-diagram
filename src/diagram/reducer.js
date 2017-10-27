// @flow

import entityReducer, { metaEntityReducer } from '../entity/reducer';
import canvasReducer from '../canvas/reducer';
import configReducer from '../config/reducer';
import history from '../history/reducer';

import type {
  EntityState,
  MetaEntityState,
  EntityAction,
} from '../entity/reducer';
import type { CanvasState, CanvasAction } from '../canvas/reducer';
import type { ConfigState, ConfigAction } from '../config/reducer';
import type { HistoryState, HistoryAction } from '../history/reducer';

export type State = {
  entity: EntityState,
  metaEntity: MetaEntityState,
  canvas: CanvasState,
  config: ConfigState,
  history: HistoryState,
};

export type ActionShape<S, P> = { type: S, payload: P };
type InitAction = ActionShape<'@@INIT', void>;
export type Action =
  | InitAction
  | EntityAction
  | CanvasAction
  | ConfigAction
  | HistoryAction;
export type ActionType = $PropertyType<Action, 'type'>;

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
    lastAction: '@@INIT',
  },
};

const appReducer = (state: State = initialState, action: Action) => ({
  entity: entityReducer(state.entity, action),
  canvas: canvasReducer(state.canvas, action),
  metaEntity: metaEntityReducer(state.metaEntity, action, state.config),
  config: configReducer(state.config, action),
  history: state.history,
});

export default history(appReducer);

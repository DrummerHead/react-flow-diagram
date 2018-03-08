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

export type ActionShape<S, P> = { type: S, payload: P };
type InitAction = ActionShape<'@@INIT', void>;
export type Action =
  | InitAction
  | EntityAction
  | CanvasAction
  | ConfigAction
  | HistoryAction;
export type ActionType = $PropertyType<Action, 'type'>;

export type State = {
  entity: EntityState,
  metaEntity: MetaEntityState,
  canvas: CanvasState,
  config: ConfigState,
  history: HistoryState,
  lastAction: ActionType,
};

const defaultCoords = { x: 0, y: 0 };
const initialState = {
  entity: [],
  metaEntity: [],
  canvas: {
    cursor: defaultCoords,
    canvasViewport: {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    },
    canvasArtboard: {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    },
    connecting: {
      currently: false,
      from: '',
    },
    anchoredEntity: {
      isAnchored: false,
      id: '',
    },
    canvasAnchor: {
      isMoving: false,
      coords: defaultCoords,
    },
    zoom: 1,
  },
  config: {
    entityTypes: {},
  },
  history: {
    past: [],
    future: [],
    lastAction: '@@INIT',
  },
  lastAction: '@@INIT',
};

const appReducer = (state: State = initialState, action: Action): State => ({
  canvas: canvasReducer(state.canvas, action),
  entity: entityReducer(state.entity, action, state.metaEntity, state.canvas),
  metaEntity: metaEntityReducer(
    state.metaEntity,
    action,
    state.entity,
    state.canvas
  ),
  config: configReducer(state.config, action),
  history: state.history,
  lastAction: action.type,
});

export default history(appReducer);

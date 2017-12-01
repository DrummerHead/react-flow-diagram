// @flow

import type { ActionShape, Action } from '../diagram/reducer';
import type { EntityType } from '../entity/reducer';

export type ConfigEntityTypes = {
  [EntityType]: {
    width: number,
    height: number,
  },
};

export type ConfigState = {
  entityTypes: ConfigEntityTypes,
  gridSize?: number,
};

export type ConfigAction = ActionShape<'rd/config/SET', ConfigState>;

const configReducer = (state: ConfigState, action: Action): ConfigState => {
  switch (action.type) {
    case 'rd/config/SET':
      return action.payload;

    default:
      return state;
  }
};

export const setConfig = (payload: ConfigState): ConfigAction => ({
  type: 'rd/config/SET',
  payload,
});

export default configReducer;

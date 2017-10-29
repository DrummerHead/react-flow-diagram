// @flow

import type { ActionShape, Action } from '../diagram/reducer';
import type { EntityType } from '../entity/reducer';

export type ConfigState = {
  entityTypes: {
    [EntityType]: {
      width: number,
      height: number,
    },
  },
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

export const setConfig = (config: ConfigState): ConfigAction => ({
  type: 'rd/config/SET',
  payload: config,
});

export default configReducer;

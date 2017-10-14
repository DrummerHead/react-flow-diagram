//@flow

import type { Action } from '../diagram/reducer';
import type { EntityType, MetaConfig } from '../entity/reducer';

export type ConfigState = {
  entityTypes: {
    [EntityType]: {
      width: number,
      height: number,
    },
  },
};

const returnConfig = (payload: MetaConfig): ConfigState => ({
  entityTypes: payload.reduce(
    (acc, curr) => ({
      ...acc,
      [curr.type]: {
        width: curr.width,
        height: curr.height,
      },
    }),
    {}
  ),
});

const configReducer = (state: ConfigState, action: Action): ConfigState => {
  switch (action.type) {
    case 'rd/entity/CONFIG':
      return returnConfig(action.payload);

    default:
      return state;
  }
};

export default configReducer;

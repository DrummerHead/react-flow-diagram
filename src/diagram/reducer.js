// @flow

import { combineReducers } from 'redux';
import entityReducer from '../entity/reducer';

import type { EntityState } from '../entity/reducer';

export type State = {
  entity: EntityState,
};

const appReducer = combineReducers({
  entity: entityReducer,
});

export default appReducer;

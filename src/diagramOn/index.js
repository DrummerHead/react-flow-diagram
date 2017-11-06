// @flow

import { store } from '../diagram/component';
import {
  EntityActionTypeOpen,
  EntityActionTypesModify,
} from '../entity/reducer';

import type { ActionType } from '../diagram/reducer';
import type { EntityState } from '../entity/reducer';

type DiagramOnAction = ActionType | Array<ActionType>;
type DiagramOnCallback = EntityState => *;
type DiagramOnReturn = () => void;

// ['a','b','c'].indexOf('a') > -1 === ['a','b','c'].includes('a')
//
const isLastAction = (
  lastAction: ActionType,
  action: DiagramOnAction
): boolean =>
  typeof action === 'string'
    ? lastAction === action
    : action.indexOf(lastAction) > -1;

// Here we respond to two custom events, 'anyChange' and 'open', both related
// just to entity reducer actions (since what we return is just the entity
// reducer state).
//
// 'open' will respond to setting a completely new diagram ('rd/entity/SET')
// 'anyChange' will respond to any other change except opening a new diagram
//
const lastActionMatchesAction = (
  lastAction: ActionType,
  action: DiagramOnAction | 'anyChange' | 'open'
): boolean => {
  switch (action) {
    case 'anyChange':
      return EntityActionTypesModify.indexOf(lastAction) > -1;
    case 'open':
      return lastAction === EntityActionTypeOpen;
    default:
      return isLastAction(lastAction, action);
  }
};

// diagramOn will return a function
// that allows you to unsubscribe from the store
// http://redux.js.org/docs/api/Store.html#subscribelistener
//
const diagramOn = (
  action: DiagramOnAction | 'anyChange' | 'open',
  fn: DiagramOnCallback
): DiagramOnReturn =>
  store.subscribe(() => {
    const state = store.getState();
    if (lastActionMatchesAction(state.lastAction, action)) {
      fn(state.entity);
    }
  });

export default diagramOn;

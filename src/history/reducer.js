// @flow

import type { Reducer } from 'redux';
import type { State, Action, ActionShape } from '../diagram/reducer';

export type HistoryState<T> = { past: Array<T>, future: Array<T> };

export type HistoryAction =
  | ActionShape<'rd/history/UNDO', void>
  | ActionShape<'rd/history/REDO', void>;

const historyLimit = 50;

const history = (reducer: Reducer<State, Action>) => (
  state: State,
  action: Action
): State => {
  const nextState = reducer(state, action);
  switch (action.type) {
    case '@@INIT':
      return nextState;

    case 'rd/history/UNDO':
      const pastStep =
        nextState.history.past[nextState.history.past.length - 1];
      return pastStep
        ? {
            ...nextState,
            entity: pastStep.entity,
            metaEntity: pastStep.metaEntity,
            history: {
              past: nextState.history.past.slice(
                0,
                nextState.history.past.length - 1
              ),
              future: [
                {
                  entity: nextState.entity,
                  metaEntity: nextState.metaEntity,
                },
                ...nextState.history.future,
              ],
            },
          }
        : nextState;

    case 'rd/history/REDO':
      const futureStep = nextState.history.future[0];
      return futureStep
        ? {
            ...nextState,
            entity: futureStep.entity,
            metaEntity: futureStep.metaEntity,
            history: {
              past: [
                ...nextState.history.past,
                {
                  entity: state.entity,
                  metaEntity: state.metaEntity,
                },
              ],
              future: nextState.history.future.slice(1),
            },
          }
        : nextState;

    default:
      const newPast = [
        ...nextState.history.past,
        {
          entity: state.entity,
          metaEntity: state.metaEntity,
        },
      ];
      return {
        ...nextState,
        history: {
          past: newPast.length > historyLimit ? newPast.slice(1) : newPast,
          future: [],
        },
      };
  }
};

export const undo = (): HistoryAction => ({
  type: 'rd/history/UNDO',
  payload: undefined,
});

export const redo = (): HistoryAction => ({
  type: 'rd/history/REDO',
  payload: undefined,
});

export default history;

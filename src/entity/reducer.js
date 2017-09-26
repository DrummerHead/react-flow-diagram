// @flow

import type { Action } from '../diagram/types';

export type EntityState = Array<EntityModel>;

export type EntityModel = {
  id: string,
  name: string,
  x: number,
  y: number,
};

type MovePayload = {
  x: number,
  y: number,
  id: string,
};

export type EntityAction =
  | Action<'rd/entity/SET', EntityState>
  | Action<'rd/entity/MOVE', MovePayload>;

const entityReducer = (
  state: EntityState = [],
  action: EntityAction
): EntityState => {
  switch (action.type) {
    case 'rd/entity/SET':
      return action.payload;

    case 'rd/entity/MOVE':
      const { id, x, y } = action.payload;
      return state.map(
        entity =>
          entity.id === id
            ? {
                ...entity,
                x,
                y,
              }
            : entity
      );
    default:
      return state;
  }
};

export const setEntities = (entities: EntityState): EntityAction => ({
  type: 'rd/entity/SET',
  payload: entities,
});

export const move = (movePayload: MovePayload): EntityAction => ({
  type: 'rd/entity/MOVE',
  payload: movePayload,
});

export default entityReducer;

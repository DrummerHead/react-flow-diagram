// @flow

import type { ActionShape, Action } from '../diagram/reducer';

export type EntityModel = {
  id: string,
  name: string,
  x: number,
  y: number,
};

export type EntityState = Array<EntityModel>;

export type MovePayload = {
  x: number,
  y: number,
  id: string,
};

export type EntityAction =
  | ActionShape<'rd/entity/SET', EntityState>
  | ActionShape<'rd/entity/MOVE', MovePayload>
  | ActionShape<'rd/entity/ADD', EntityModel>;

const entityReducer = (
  state: EntityState = [],
  action: Action
): EntityState => {
  switch (action.type) {
    case 'rd/entity/SET':
      return action.payload;

    case 'rd/entity/ADD':
      return [...state, action.payload];

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

export const addEntity = (entity: EntityModel): EntityAction => ({
  type: 'rd/entity/ADD',
  payload: entity,
});

export default entityReducer;

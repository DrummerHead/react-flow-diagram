// @flow

import type { ActionShape, Action } from '../diagram/reducer';

export type EntityModel = {
  id: string,
  name: string,
  x: number,
  y: number,
};

export type MetaEntityModel = {
  id: string,
  isAnchored: boolean,
};

export type EntityState = Array<EntityModel>;

export type MetaEntityState = Array<MetaEntityModel>;

export type MovePayload = {
  x: number,
  y: number,
  id: string,
};

export type EntityAction =
  | ActionShape<'rd/entity/SET', EntityState>
  | ActionShape<'rd/entity/ADD', EntityModel & MetaEntityModel>
  | ActionShape<'rd/entity/MOVE', MovePayload>;

const entityReducer = (
  state: EntityState = [],
  action: Action
): EntityState => {
  switch (action.type) {
    case 'rd/entity/SET':
      return action.payload;

    case 'rd/entity/ADD':
      return [
        ...state,
        {
          id: action.payload.id,
          name: action.payload.name,
          x: action.payload.x,
          y: action.payload.y,
        },
      ];

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

export const metaEntityReducer = (
  state: MetaEntityState = [],
  action: Action
): MetaEntityState => {
  switch (action.type) {
    case 'rd/entity/SET':
      return action.payload.map(entity => ({
        id: entity.id,
        isAnchored: false,
      }));

    case 'rd/entity/ADD':
      return [
        ...state,
        {
          id: action.payload.id,
          isAnchored: action.payload.isAnchored,
        },
      ];

    default:
      return state;
  }
};

export const setEntities = (entities: EntityState): EntityAction => ({
  type: 'rd/entity/SET',
  payload: entities,
});

export const addEntity = (
  entity: EntityModel & MetaEntityModel
): EntityAction => ({
  type: 'rd/entity/ADD',
  payload: entity,
});

export const move = (movePayload: MovePayload): EntityAction => ({
  type: 'rd/entity/MOVE',
  payload: movePayload,
});

export default entityReducer;

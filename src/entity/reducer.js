// @flow

import type { ActionShape, Action } from '../diagram/reducer';

export type Id = string;

export type EntityType = 'Task' | 'Event';

export type EntityModel = {
  id: Id,
  type: EntityType,
  x: number,
  y: number,
  name: string,
  linksTo?: Array<Id>,
};

export type EntityState = Array<EntityModel>;

export type MetaEntityModel = {
  id: string,
  type: EntityType,
  isAnchored: boolean,
  width: number,
  height: number,
};

export type MetaEntityState = Array<MetaEntityModel>;

export type EntityAction =
  | ActionShape<'rd/entity/SET', EntityState>
  | ActionShape<'rd/entity/ADD', EntityModel & MetaEntityModel>
  | ActionShape<'rd/entity/MOVE', MovePayload>
  | ActionShape<'rd/entity/SET_NAME', SetNamePayload>;

export type MetaEntityAction = ActionShape<'rd/entity/CONFIG', MetaConfig>;

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
          type: action.payload.type,
          x: action.payload.x,
          y: action.payload.y,
          name: action.payload.name,
        },
      ];

    case 'rd/entity/MOVE':
      var { id, x, y } = action.payload;
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
    case 'rd/entity/SET_NAME':
      var { id, name } = action.payload;
      return state.map(
        entity =>
          entity.id === id
            ? {
                ...entity,
                name,
              }
            : entity
      );
    default:
      return state;
  }
};

const defaultWidth = 50;
const defaultHeight = 50;

export const metaEntityReducer = (
  state: MetaEntityState = [],
  action: Action
): MetaEntityState => {
  switch (action.type) {
    case 'rd/entity/SET':
      return action.payload.map(entity => ({
        id: entity.id,
        type: entity.type,
        isAnchored: false,
        width: defaultWidth,
        height: defaultHeight,
      }));

    case 'rd/entity/CONFIG':
      const configs: MetaConfig = action.payload;
      return state.map(metaModel => {
        const relevantConfig = configs.find(
          metaConfig => metaConfig.type === metaModel.type
        );
        return relevantConfig
          ? {
              ...metaModel,
              width: relevantConfig.width,
              height: relevantConfig.height,
            }
          : metaModel;
      });

    case 'rd/entity/ADD':
      return [
        ...state,
        {
          id: action.payload.id,
          type: action.payload.type,
          isAnchored: action.payload.isAnchored,
          width: action.payload.width,
          height: action.payload.height,
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

export type MovePayload = { x: number, y: number, id: string };
export const move = (movePayload: MovePayload): EntityAction => ({
  type: 'rd/entity/MOVE',
  payload: movePayload,
});

export type SetNamePayload = { id: Id, name: string };
export const setName = (payload: SetNamePayload): EntityAction => ({
  type: 'rd/entity/SET_NAME',
  payload,
});

export type MetaConfig = Array<{
  type: EntityType,
  width: number,
  height: number,
}>;
export const setConfig = (config: MetaConfig): MetaEntityAction => ({
  type: 'rd/entity/CONFIG',
  payload: config,
});

export default entityReducer;

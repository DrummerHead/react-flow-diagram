// @flow

import type { ActionShape, Action } from '../diagram/reducer';
import type { ConfigState } from '../config/reducer';
import type { CanvasState } from '../canvas/reducer';

export type Id = string;

// export type EntityType = 'Task' | 'Event';
// I don't like that since the user can name any type of entity, now I lose on
// the EntityType specificity. Will this be a problem in the future? Who knows!
// Programming is full of surprises. The dragons approach.
export type EntityType = string;

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
  width: number,
  height: number,
  isAnchored: boolean,
  isSelected: boolean,
};

export type MetaEntityState = Array<MetaEntityModel>;

export type AddLinkedEntityPayload = {
  entity: EntityModel & MetaEntityModel,
  id: Id,
};
export type MovePayload = { x: number, y: number, id: string };
export type SetNamePayload = { id: Id, name: string };
export type EntityAction =
  | ActionShape<'rd/entity/SET', EntityState>
  | ActionShape<'rd/entity/ADD', EntityModel & MetaEntityModel>
  | ActionShape<'rd/entity/LINK_TO', Id>
  | ActionShape<'rd/entity/ADD_LINKED', AddLinkedEntityPayload>
  | ActionShape<'rd/entity/REMOVE', Id>
  | ActionShape<'rd/entity/MOVE', MovePayload>
  | ActionShape<'rd/entity/SET_NAME', SetNamePayload>;

export const EntityActionTypeOpen = 'rd/entity/SET';
export const EntityActionTypesModify = [
  'rd/entity/ADD',
  'rd/entity/ADD_LINKED',
  'rd/entity/REMOVE',
  'rd/entity/MOVE',
  'rd/entity/SET_NAME',
];

export type MetaEntityAction = ActionShape<
  'rd/entity/SELECT',
  { id: Id, isSelected: boolean }
>;

const entityReducer = (
  state: EntityState = [],
  action: Action,
  canvas: CanvasState
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

    case 'rd/entity/LINK_TO': {
      const { payload } = action;
      return state.map(
        entity =>
          entity.id === canvas.connecting.from
            ? {
                ...entity,
                linksTo: [...(entity.linksTo ? entity.linksTo : []), payload],
              }
            : entity
      );
    }

    case 'rd/entity/ADD_LINKED': {
      const { entity, id } = action.payload;
      return [
        ...state.map(
          existingEntity =>
            existingEntity.id === id
              ? {
                  ...existingEntity,
                  linksTo: [
                    ...(existingEntity.linksTo ? existingEntity.linksTo : []),
                    entity.id,
                  ],
                }
              : existingEntity
        ),
        {
          id: entity.id,
          type: entity.type,
          x: entity.x,
          y: entity.y,
          name: entity.name,
        },
      ];
    }

    case 'rd/entity/REMOVE':
      return state.filter(entity => entity.id !== action.payload).map(
        entity =>
          entity.linksTo
            ? {
                ...entity,
                linksTo: entity.linksTo.filter(
                  entityId => entityId !== action.payload
                ),
              }
            : entity
      );

    case 'rd/entity/MOVE': {
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
    }
    case 'rd/entity/SET_NAME': {
      const { id, name } = action.payload;
      return state.map(
        entity =>
          entity.id === id
            ? {
                ...entity,
                name,
              }
            : entity
      );
    }
    default:
      return state;
  }
};

const defaultConfig = {
  width: 50,
  height: 50,
};
export const metaEntityReducer = (
  state: MetaEntityState = [],
  action: Action,
  config: ConfigState
): MetaEntityState => {
  switch (action.type) {
    case 'rd/entity/SET':
      return action.payload.map(entity => {
        const conf = config.entityTypes[entity.type]
          ? config.entityTypes[entity.type]
          : defaultConfig;
        return {
          id: entity.id,
          type: entity.type,
          width: conf.width,
          height: conf.height,
          isAnchored: false,
          isSelected: false,
        };
      });

    case 'rd/config/SET': {
      const configs = action.payload;
      return state.map(metaModel => {
        const relevantConfig = configs.entityTypes[metaModel.type];
        return relevantConfig
          ? {
              ...metaModel,
              width: relevantConfig.width,
              height: relevantConfig.height,
            }
          : metaModel;
      });
    }

    case 'rd/entity/ADD':
      return [
        ...state,
        {
          id: action.payload.id,
          type: action.payload.type,
          width: action.payload.width,
          height: action.payload.height,
          isAnchored: action.payload.isAnchored,
          isSelected: action.payload.isSelected,
        },
      ];
    case 'rd/entity/ADD_LINKED':
      return [
        ...state,
        {
          id: action.payload.entity.id,
          type: action.payload.entity.type,
          width: action.payload.entity.width,
          height: action.payload.entity.height,
          isAnchored: action.payload.entity.isAnchored,
          isSelected: action.payload.entity.isSelected,
        },
      ];

    case 'rd/entity/SELECT': {
      const { id, isSelected } = action.payload;
      return state.map(
        metaEntity =>
          metaEntity.id === id
            ? { ...metaEntity, isSelected }
            : { ...metaEntity, isSelected: false }
      );
    }

    case 'rd/entity/REMOVE':
      return state.filter(entity => entity.id !== action.payload);

    default:
      return state;
  }
};

export const setEntities = (payload: EntityState): EntityAction => ({
  type: 'rd/entity/SET',
  payload,
});

export const addEntity = (
  payload: EntityModel & MetaEntityModel
): EntityAction => ({ type: 'rd/entity/ADD', payload });

export const linkTo = (payload: Id): EntityAction => ({
  type: 'rd/entity/LINK_TO',
  payload,
});

export const addLinkedEntity = (
  payload: AddLinkedEntityPayload
): EntityAction => ({ type: 'rd/entity/ADD_LINKED', payload });

export const removeEntity = (payload: Id): EntityAction => ({
  type: 'rd/entity/REMOVE',
  payload,
});

export const move = (payload: MovePayload): EntityAction => ({
  type: 'rd/entity/MOVE',
  payload,
});

export const setName = (payload: SetNamePayload): EntityAction => ({
  type: 'rd/entity/SET_NAME',
  payload,
});

export const selectEntity = (
  id: Id,
  isSelected?: boolean = true
): MetaEntityAction => ({
  type: 'rd/entity/SELECT',
  payload: { id, isSelected },
});

export default entityReducer;

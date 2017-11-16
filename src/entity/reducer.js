// @flow

import calcLinkPoints from '../links/calcLinkPoints';

import type { ActionShape, Action } from '../diagram/reducer';
import type { ConfigState } from '../config/reducer';
import type { CanvasState } from '../canvas/reducer';

export type EntityId = string;

export type Point = {
  x: number,
  y: number,
};

type Link = {
  target: EntityId,
  points?: Array<Point>,
  label?: string,
  color?: string,
};

export type Links = Array<Link>;

export type EntityType = string;
export type EntityModel = {
  id: EntityId,
  type: EntityType,
  x: number,
  y: number,
  name: string,
  linksTo?: Links,
  custom?: Object,
};

export type EntityState = Array<EntityModel>;

export type MetaEntityModel = {
  id: EntityId,
  type: EntityType,
  width: number,
  height: number,
  isAnchored: boolean,
  isSelected: boolean,
};

export type MetaEntityState = Array<MetaEntityModel>;

export type AddLinkedEntityPayload = {
  entity: EntityModel & MetaEntityModel,
  id: EntityId,
};
export type MovePayload = { x: number, y: number, id: string };
export type SetNamePayload = { id: EntityId, name: string };
export type SetLinkPointsPayload = {
  from: EntityId,
  to: EntityId,
  points: Array<Point>,
};
export type SetCustomPayload = { id: EntityId, custom: Object };
export type EntityAction =
  | ActionShape<'rd/entity/SET', EntityState>
  | ActionShape<'rd/entity/ADD', EntityModel & MetaEntityModel>
  | ActionShape<'rd/entity/LINK_TO', EntityId>
  | ActionShape<'rd/entity/ADD_LINKED', AddLinkedEntityPayload>
  | ActionShape<'rd/entity/REMOVE', EntityId>
  | ActionShape<'rd/entity/MOVE', MovePayload>
  | ActionShape<'rd/entity/SET_NAME', SetNamePayload>
  | ActionShape<'rd/entity/LINK_POINTS', SetLinkPointsPayload>
  | ActionShape<'rd/entity/SET_CUSTOM', SetCustomPayload>;

export const EntityActionTypeOpen = 'rd/entity/SET';
export const EntityActionTypesModify = [
  'rd/entity/ADD',
  'rd/entity/LINK_TO',
  'rd/entity/ADD_LINKED',
  'rd/entity/REMOVE',
  'rd/entity/MOVE',
  'rd/entity/SET_NAME',
];

export type MetaEntityAction = ActionShape<
  'rd/entity/SELECT',
  { id: EntityId, isSelected: boolean }
>;

const entityReducer = (
  state: EntityState = [],
  action: Action,
  canvas: CanvasState,
  metaState: MetaEntityState
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
                linksTo: [
                  ...(entity.linksTo ? entity.linksTo : []),
                  ...(entity.linksTo &&
                  entity.linksTo.some(link => link.target === payload)
                    ? []
                    : [
                        {
                          target: payload,
                          points: calcLinkPoints(
                            {
                              ...entity,
                              ...metaState.find(
                                metaEntity => metaEntity.id === entity.id
                              ),
                            },
                            {
                              ...state.find(entity => entity.id === payload),
                              ...metaState.find(
                                metaEntity => metaEntity.id === payload
                              ),
                            }
                          ),
                        },
                      ]),
                ],
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
                    { target: entity.id },
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
                  link => link.target !== action.payload
                ),
              }
            : entity
      );

    case 'rd/entity/MOVE': {
      const { id, x, y } = action.payload;
      return state.map(entity => {
        if (entity.linksTo && entity.id === id) {
          return {
            ...entity,
            x,
            y,
            linksTo: entity.linksTo.map(link => ({
              ...link,
              points: calcLinkPoints(
                {
                  ...entity,
                  ...metaState.find(metaEntity => metaEntity.id === entity.id),
                },
                {
                  ...state.find(entity => entity.id === link.target),
                  ...metaState.find(
                    metaEntity => metaEntity.id === link.target
                  ),
                }
              ),
            })),
          };
        } else if (entity.id === id) {
          return {
            ...entity,
            x,
            y,
          };
        } else if (
          entity.linksTo &&
          entity.linksTo.some(link => link.target === id)
        ) {
          return {
            ...entity,
            linksTo: entity.linksTo.map(
              link =>
                link.target === id
                  ? {
                      ...link,
                      points: calcLinkPoints(
                        {
                          ...entity,
                          ...metaState.find(
                            metaEntity => metaEntity.id === entity.id
                          ),
                        },
                        {
                          ...state.find(entity => entity.id === id),
                          ...metaState.find(metaEntity => metaEntity.id === id),
                        }
                      ),
                    }
                  : link
            ),
          };
        } else {
          return entity;
        }
      });
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

    case 'rd/entity/LINK_POINTS': {
      const { from, to, points } = action.payload;
      return state.map(
        entity =>
          entity.id === from
            ? {
                ...entity,
                linksTo: entity.linksTo
                  ? entity.linksTo.map(
                      link =>
                        link.target === to
                          ? {
                              ...link,
                              points,
                            }
                          : link
                    )
                  : [{ target: to, points }],
              }
            : entity
      );
    }

    case 'rd/entity/SET_CUSTOM': {
      const { id, custom } = action.payload;
      return state.map(
        entity =>
          entity.id === id
            ? {
                ...entity,
                custom,
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

export const linkTo = (payload: EntityId): EntityAction => ({
  type: 'rd/entity/LINK_TO',
  payload,
});

export const addLinkedEntity = (
  payload: AddLinkedEntityPayload
): EntityAction => ({ type: 'rd/entity/ADD_LINKED', payload });

export const removeEntity = (payload: EntityId): EntityAction => ({
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

// TODO: Check if this following action (and types and stuff associated to it)
// are necessesary, 'cause I think I don't need this action given the approach
// I'm concocting for defining link points
export const setLinkPoints = (payload: SetLinkPointsPayload): EntityAction => ({
  type: 'rd/entity/LINK_POINTS',
  payload,
});

export const setCustom = (payload: SetCustomPayload): EntityAction => ({
  type: 'rd/entity/SET_CUSTOM',
  payload,
});

export const selectEntity = (
  id: EntityId,
  isSelected?: boolean = true
): MetaEntityAction => ({
  type: 'rd/entity/SELECT',
  payload: { id, isSelected },
});

export default entityReducer;

// @flow

import calcLinkPoints from '../links/calcLinkPoints';
import positionAdjustedToGrid from '../canvas/positionAdjustedToGrid';

import type { ActionShape, Action } from '../diagram/reducer';
import type { CanvasState, Coords } from '../canvas/reducer';

export type EntityId = string;

export type Point = Coords;

export type Link = {
  target: EntityId,
  edited: boolean,
  points?: Array<Point>,
  label?: string,
  color?: string,
};

export type Links = Array<Link>;

export type EntityType = string;
export type EntityModel = {
  id: EntityId,
  type: EntityType,
  width: number,
  height: number,
  x: number,
  y: number,
  name: string,
  linksTo?: Links,
  custom?: Object,
};

export type EntityState = Array<EntityModel>;

export type MetaEntityModel = {
  id: EntityId,
  isAnchored: boolean,
  isSelected: boolean,
  anchor: Coords,
};

export type MetaEntityState = Array<MetaEntityModel>;

export type AddLinkedEntityPayload = {
  entity: EntityModel & MetaEntityModel,
  id: EntityId,
};
export type MovePayload = { x: number, y: number, id: string };
export type SetNamePayload = { id: EntityId, name: string };
export type SetCustomPayload = { id: EntityId, custom: Object };
export type EntityAction =
  | ActionShape<'rd/entity/SET', EntityState>
  | ActionShape<'rd/entity/ADD', EntityModel & MetaEntityModel>
  | ActionShape<'rd/entity/LINK_TO', EntityId>
  | ActionShape<'rd/entity/ADD_LINKED', AddLinkedEntityPayload>
  | ActionShape<'rd/entity/REMOVE', EntityId>
  | ActionShape<'rd/entity/MOVE', MovePayload>
  | ActionShape<'rd/entity/SET_NAME', SetNamePayload>
  | ActionShape<'rd/entity/SET_CUSTOM', SetCustomPayload>;

export const EntityActionTypeOpen = 'rd/entity/SET';
export const EntityActionTypesModify = [
  'rd/entity/ADD',
  'rd/entity/LINK_TO',
  'rd/entity/ADD_LINKED',
  'rd/entity/REMOVE',
  'rd/entity/MOVE',
  'rd/entity/SET_NAME',
  'rd/entity/SET_CUSTOM',
];

export type MetaEntityAction =
  | ActionShape<'rd/metaentity/SELECT', { id: EntityId, isSelected: boolean }>
  | ActionShape<'rd/metaentity/UNSELECTALL', null>;

const entityReducer = (
  state: EntityState = [],
  action: Action,
  metaEntity: MetaEntityState,
  canvas: CanvasState
): EntityState => {
  switch (action.type) {
    case 'rd/entity/SET':
      return action.payload;

    case 'rd/config/SET': {
      const configs = action.payload;
      return state.map(entity => {
        const relevantConfig = configs.entityTypes[entity.type];
        return relevantConfig
          ? {
              ...entity,
              width: relevantConfig.width,
              height: relevantConfig.height,
            }
          : entity;
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
                          edited: false,
                          points: calcLinkPoints(
                            entity,
                            state.find(ent => ent.id === payload)
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
                    { target: entity.id, edited: false },
                  ],
                }
              : existingEntity
        ),
        {
          id: entity.id,
          type: entity.type,
          width: entity.width,
          height: entity.height,
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

    case 'rd/canvas/TRACK': {
      if (canvas.anchoredEntity.isAnchored) {
        const { id } = canvas.anchoredEntity;
        const mEntity = metaEntity.find(e => e.id === id) || {
          anchor: { x: 0, y: 0 },
        };
        const x = canvas.cursor.x - mEntity.anchor.x;
        const y = canvas.cursor.y - mEntity.anchor.y;
        const gridX = positionAdjustedToGrid(x, canvas.gridSize);
        const gridY = positionAdjustedToGrid(y, canvas.gridSize);
        return state.map(entity => {
          if (entity.linksTo && entity.id === id) {
            return {
              ...entity,
              x: gridX,
              y: gridY,
              linksTo: entity.linksTo.map(link => ({
                ...link,
                points: calcLinkPoints(
                  entity,
                  state.find(ent => ent.id === link.target)
                ),
              })),
            };
          } else if (entity.id === id) {
            return {
              ...entity,
              x: gridX,
              y: gridY,
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
                          entity,
                          state.find(ent => ent.id === id)
                        ),
                      }
                    : link
              ),
            };
          } else {
            return entity;
          }
        });
      } else {
        return state;
      }
    }

    // All this logic can be potentially removed, research if I'll still use
    // the MOVE action... or perhaps put all this into its own function and
    // reuse :shrug:
    case 'rd/entity/MOVE': {
      const { id, x, y } = action.payload;
      const gridX = positionAdjustedToGrid(x, canvas.gridSize);
      const gridY = positionAdjustedToGrid(y, canvas.gridSize);
      return state.map(entity => {
        if (entity.linksTo && entity.id === id) {
          return {
            ...entity,
            x: gridX,
            y: gridY,
            linksTo: entity.linksTo.map(link => ({
              ...link,
              points: calcLinkPoints(
                entity,
                state.find(ent => ent.id === link.target)
              ),
            })),
          };
        } else if (entity.id === id) {
          return {
            ...entity,
            x: gridX,
            y: gridY,
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
                        entity,
                        state.find(ent => ent.id === id)
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

const unselectMetaEntity = metaEntity => ({ ...metaEntity, isSelected: false });

export const metaEntityReducer = (
  state: MetaEntityState = [],
  action: Action,
  entity: EntityState,
  canvas: CanvasState
): MetaEntityState => {
  switch (action.type) {
    case 'rd/entity/SET':
      return action.payload.map(ent => ({
        id: ent.id,
        isAnchored: false,
        isSelected: false,
        anchor: {
          x: ent.width / 2,
          y: ent.height / 2,
        },
      }));

    case 'rd/entity/ADD':
      return [
        ...state,
        {
          id: action.payload.id,
          isAnchored: action.payload.isAnchored,
          isSelected: action.payload.isSelected,
          anchor: {
            x: action.payload.width / 2,
            y: action.payload.height / 2,
          },
        },
      ];
    case 'rd/entity/ADD_LINKED':
      return [
        ...state.map(unselectMetaEntity),
        {
          id: action.payload.entity.id,
          isAnchored: action.payload.entity.isAnchored,
          isSelected: action.payload.entity.isSelected,
          anchor: {
            x: action.payload.entity.width / 2,
            y: action.payload.entity.height / 2,
          },
        },
      ];

    case 'rd/metaentity/SELECT': {
      const { id, isSelected } = action.payload;
      return state.map(
        metaEntity =>
          metaEntity.id === id
            ? { ...metaEntity, isSelected }
            : { ...metaEntity, isSelected: false }
      );
    }

    case 'rd/canvas/ANCHOR_ENTITY': {
      const { id } = action.payload;
      return state.map(
        metaEntity =>
          metaEntity.id === id
            ? {
                ...metaEntity,
                isAnchored: true,
                anchor: {
                  x:
                    canvas.cursor.x -
                    (entity.find(e => e.id === id) || { x: 0 }).x,
                  y:
                    canvas.cursor.y -
                    (entity.find(e => e.id === id) || { y: 0 }).y,
                },
              }
            : { ...metaEntity, isAnchored: false }
      );
    }

    case 'rd/entity/REMOVE':
      return state.filter(ent => ent.id !== action.payload);

    case 'rd/entity/CONNECT':
    case 'rd/metaentity/UNSELECTALL':
    case 'rd/canvas/ANCHOR_CANVAS':
      return state.map(unselectMetaEntity);

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

export const setCustom = (payload: SetCustomPayload): EntityAction => ({
  type: 'rd/entity/SET_CUSTOM',
  payload,
});

export const selectEntity = (
  id: EntityId,
  isSelected?: boolean = true
): MetaEntityAction => ({
  type: 'rd/metaentity/SELECT',
  payload: { id, isSelected },
});

export const unselectAll = (): MetaEntityAction => ({
  type: 'rd/metaentity/UNSELECTALL',
  payload: null,
});

export default entityReducer;

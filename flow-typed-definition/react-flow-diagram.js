// @flow

import type { ComponentType, Element } from 'React';

declare module 'react-flow-diagram' {
  // Entity
  //
  declare export type EntityId = string;

  declare type EntityType = string;

  declare export type EntityModel = {
    id: EntityId,
    type: EntityType,
    x: number,
    y: number,
    name: string,
    linksTo?: Array<EntityId>,
    custom?: Object,
  };

  declare export type EntityState = Array<EntityModel>;

  declare export type MetaEntityModel = {
    id: EntityId,
    type: EntityType,
    width: number,
    height: number,
    isAnchored: boolean,
    isSelected: boolean,
  };

  declare type MetaEntityState = Array<MetaEntityModel>;

  declare type AddLinkedEntityPayload = {
    entity: EntityModel & MetaEntityModel,
    id: EntityId,
  };
  declare type MovePayload = { x: number, y: number, id: string };
  declare export type SetNamePayload = { id: EntityId, name: string };
  declare type SetCustomPayload = { id: EntityId, custom: Object };
  declare export type EntityAction =
    | ActionShape<'rd/entity/SET', EntityState>
    | ActionShape<'rd/entity/ADD', EntityModel & MetaEntityModel>
    | ActionShape<'rd/entity/LINK_TO', EntityId>
    | ActionShape<'rd/entity/ADD_LINKED', AddLinkedEntityPayload>
    | ActionShape<'rd/entity/REMOVE', EntityId>
    | ActionShape<'rd/entity/MOVE', MovePayload>
    | ActionShape<'rd/entity/SET_NAME', SetNamePayload>
    | ActionShape<'rd/entity/SET_CUSTOM', SetCustomPayload>;

  declare type MetaEntityAction = ActionShape<
    'rd/entity/SELECT',
    { id: EntityId, isSelected: boolean }
  >;

  // Canvas
  //
  declare type CanvasState = {
    offset: {
      x: number,
      y: number,
    },
    cursor: {
      x: number,
      y: number,
    },
    connecting: {
      currently: boolean,
      from: EntityId,
    },
  };

  declare type Coords = { x: number, y: number };
  declare type ConnectingPayload = {
    currently: boolean,
    from: EntityId,
  };
  declare type CanvasAction =
    | ActionShape<'rd/canvas/SET_OFFSET', Coords>
    | ActionShape<'rd/canvas/TRACK', Coords>
    | ActionShape<'rd/canvas/CONNECT', ConnectingPayload>;

  // Config
  //
  declare type ConfigEntityTypes = {
    [EntityType]: {
      width: number,
      height: number,
    },
  };

  declare export type ConfigState = {
    entityTypes: ConfigEntityTypes,
  };

  declare type ConfigAction = ActionShape<'rd/config/SET', ConfigState>;

  // History
  //
  declare type HistoryStateShape<T> = {
    past: Array<T>,
    future: Array<T>,
    lastAction: ActionType,
  };
  declare type HistoryState = HistoryStateShape<{
    entity: EntityState,
    metaEntity: MetaEntityState,
  }>;

  declare type HistoryAction =
    | ActionShape<'rd/history/UNDO', void>
    | ActionShape<'rd/history/REDO', void>;

  // Diagram
  //
  declare type ActionShape<S, P> = { type: S, payload: P };
  declare type InitAction = ActionShape<'@@INIT', void>;
  declare type Action =
    | InitAction
    | EntityAction
    | CanvasAction
    | ConfigAction
    | HistoryAction;
  declare type ActionType = $PropertyType<Action, 'type'>;

  declare type State = {
    entity: EntityState,
    metaEntity: MetaEntityState,
    canvas: CanvasState,
    config: ConfigState,
    history: HistoryState,
    lastAction: ActionType,
  };

  declare export type CustomEntities = {
    [type: EntityType]: {
      component: ComponentType<DiagComponentProps>,
      icon: {
        path: Element<*>,
        size: number,
      },
    },
  };

  // diagramOn
  //
  declare type DiagramOnAction = ActionType | Array<ActionType>;
  declare type DiagramOnCallback = (EntityState) => *;
  declare type DiagramOnReturn = () => void;

  // Redux
  //
  declare type DispatchAPI<A> = (action: A) => A;
  declare type Dispatch<A: { type: $Subtype<string> }> = DispatchAPI<A>;
  declare type Reducer<S, A> = (state: S, action: A) => S;
  declare type Store<S, A, D = Dispatch<A>> = {
    dispatch: D,
    getState(): S,
    subscribe(listener: () => void): () => void,
    replaceReducer(nextReducer: Reducer<S, A>): void,
  };

  // Helper types
  //
  declare export type DiagComponentProps = {
    model: EntityModel,
    meta: MetaEntityModel,
    setName: SetNamePayload => EntityAction,
  };

  // Explicit export
  //
  declare export function Diagram(): React$Element<any>;

  declare export function diagramOn(
    DiagramOnAction | 'anyChange' | 'open',
    DiagramOnCallback
  ): DiagramOnReturn;

  declare export var store: Store<State, Action>;

  declare export function setEntities(EntityState): EntityAction;

  declare export function setConfig(ConfigState): ConfigAction;

  declare export function setCustom(SetCustomPayload): EntityAction;
}

// @flow

declare module 'react-flow-diagram' {
  // Entity
  //
  declare type Id = string;

  declare type EntityType = 'Task' | 'Event';

  declare type EntityModel = {
    id: Id,
    type: EntityType,
    x: number,
    y: number,
    name: string,
    linksTo?: Array<Id>,
  };

  declare export type EntityState = Array<EntityModel>;

  declare type MetaEntityModel = {
    id: string,
    type: EntityType,
    width: number,
    height: number,
    isAnchored: boolean,
    isSelected: boolean,
  };

  declare type MetaEntityState = Array<MetaEntityModel>;

  declare type AddLinkedEntityPayload = {
    entity: EntityModel & MetaEntityModel,
    id: Id,
  };
  declare type MovePayload = { x: number, y: number, id: string };
  declare type SetNamePayload = { id: Id, name: string };
  declare type EntityAction =
    | ActionShape<'rd/entity/SET', EntityState>
    | ActionShape<'rd/entity/ADD', EntityModel & MetaEntityModel>
    | ActionShape<'rd/entity/ADD_LINKED', AddLinkedEntityPayload>
    | ActionShape<'rd/entity/REMOVE', Id>
    | ActionShape<'rd/entity/MOVE', MovePayload>
    | ActionShape<'rd/entity/SET_NAME', SetNamePayload>;

  declare type MetaEntityAction = ActionShape<
    'rd/entity/SELECT',
    { id: Id, isSelected: boolean }
  >;

  // Canvas
  //
  declare type CanvasState = {
    offsetX: number,
    offsetY: number,
  };

  declare type CanvasAction = ActionShape<'rd/canvas/SET_OFFSET', CanvasState>;

  // Config
  //
  declare type ConfigState = {
    entityTypes: {
      [EntityType]: {
        width: number,
        height: number,
      },
    },
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
  declare type State = {
    entity: EntityState,
    metaEntity: MetaEntityState,
    canvas: CanvasState,
    config: ConfigState,
    history: HistoryState,
    lastAction: ActionType,
  };

  declare type ActionShape<S, P> = { type: S, payload: P };
  declare type InitAction = ActionShape<'@@INIT', void>;
  declare type Action =
    | InitAction
    | EntityAction
    | CanvasAction
    | ConfigAction
    | HistoryAction;
  declare type ActionType = $PropertyType<Action, 'type'>;

  // diagramOn
  //
  declare type DiagramOnAction = ActionType | Array<ActionType>;
  declare type DiagramOnCallback = (EntityState) => any;
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
}

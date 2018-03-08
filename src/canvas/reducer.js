// @flow

import type { ActionShape, Action } from '../diagram/reducer';
import type { EntityId } from '../entity/reducer';

export type Coords = { x: number, y: number };
export type CanvasState = {
  cursor: Coords,
  canvasViewport: {
    x: number,
    y: number,
    width: number,
    height: number,
  },
  canvasArtboard: {
    x: number,
    y: number,
    width: number,
    height: number,
  },
  connecting: {
    currently: boolean,
    from: EntityId,
  },
  anchoredEntity: {
    isAnchored: boolean,
    id: EntityId,
  },
  canvasAnchor: {
    isMoving: boolean,
    coords: Coords,
  },
  zoom: number,
  gridSize?: number,
};

export type ConfigViewportPayload = {
  x: number,
  y: number,
  width: number,
  height: number,
};
export type ConnectingPayload = {
  currently: boolean,
  from: EntityId,
};
export type AnchorEntityPayload = {
  isAnchored: boolean,
  id: EntityId,
};
export type CanvasAction =
  | ActionShape<'rd/canvas/CONFIG_VIEWPORT', ConfigViewportPayload>
  | ActionShape<'rd/canvas/TRACK', Coords>
  | ActionShape<'rd/canvas/TRANSLATE', Coords>
  | ActionShape<'rd/canvas/ZOOM', number>
  | ActionShape<'rd/canvas/CONNECT', ConnectingPayload>
  | ActionShape<'rd/canvas/ANCHOR_ENTITY', AnchorEntityPayload>
  | ActionShape<'rd/canvas/ANCHOR_CANVAS', boolean>;

const canvasReducer = (state: CanvasState, action: Action): CanvasState => {
  switch (action.type) {
    case 'rd/canvas/CONFIG_VIEWPORT':
      return {
        ...state,
        canvasViewport: action.payload,
        canvasArtboard: {
          ...state.canvasArtboard,
          width: action.payload.width,
          height: action.payload.height,
        },
      };

    case 'rd/config/SET':
      return {
        ...state,
        gridSize: action.payload.gridSize,
      };

    case 'rd/canvas/TRACK':
      return state.canvasAnchor.isMoving
        ? {
            ...state,
            canvasArtboard: {
              ...state.canvasArtboard,
              x:
                action.payload.x -
                state.canvasViewport.x -
                state.canvasAnchor.coords.x,
              y:
                action.payload.y -
                state.canvasViewport.y -
                state.canvasAnchor.coords.y,
            },
          }
        : {
            ...state,
            cursor: {
              x:
                action.payload.x -
                state.canvasViewport.x -
                state.canvasArtboard.x,
              y:
                action.payload.y -
                state.canvasViewport.y -
                state.canvasArtboard.y,
            },
          };

    case 'rd/canvas/TRANSLATE':
      return {
        ...state,
        canvasArtboard: {
          ...state.canvasArtboard,
          x: action.payload.x,
          y: action.payload.y,
        },
      };

    case 'rd/canvas/ZOOM':
      return {
        ...state,
        zoom: action.payload,
      };

    case 'rd/canvas/CONNECT':
      return {
        ...state,
        connecting: action.payload,
      };

    case 'rd/canvas/ANCHOR_CANVAS':
      return {
        ...state,
        canvasAnchor: {
          isMoving: action.payload,
          coords: state.cursor,
        },
      };

    case 'rd/canvas/ANCHOR_ENTITY':
      return {
        ...state,
        anchoredEntity: action.payload,
      };

    case 'rd/entity/ADD':
      return {
        ...state,
        anchoredEntity: {
          isAnchored: true,
          id: action.payload.id,
        },
      };

    case 'rd/entity/ADD_LINKED':
      return {
        ...state,
        anchoredEntity: {
          isAnchored: true,
          id: action.payload.entity.id,
        },
      };

    case 'rd/entity/LINK_TO':
      return {
        ...state,
        connecting: {
          currently: false,
          from: '',
        },
      };

    default:
      return state;
  }
};

export const configViewport = (
  payload: ConfigViewportPayload
): CanvasAction => ({
  type: 'rd/canvas/CONFIG_VIEWPORT',
  payload,
});

export const trackMovement = (payload: Coords): CanvasAction => ({
  type: 'rd/canvas/TRACK',
  payload,
});

export const translate = (payload: Coords): CanvasAction => ({
  type: 'rd/canvas/TRANSLATE',
  payload,
});

export const zoom = (payload: number): CanvasAction => ({
  type: 'rd/canvas/ZOOM',
  payload,
});

export const connecting = (payload: ConnectingPayload): CanvasAction => ({
  type: 'rd/canvas/CONNECT',
  payload,
});

export const anchorEntity = ({
  isAnchored = true,
  id = '',
}: AnchorEntityPayload): CanvasAction => ({
  type: 'rd/canvas/ANCHOR_ENTITY',
  payload: { isAnchored, id },
});

export const anchorCanvas = (payload: boolean): CanvasAction => ({
  type: 'rd/canvas/ANCHOR_CANVAS',
  payload,
});

export default canvasReducer;

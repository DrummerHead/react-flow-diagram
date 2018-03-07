// @flow

import type { ActionShape, Action } from '../diagram/reducer';
import type { EntityId } from '../entity/reducer';

export type Coords = { x: number, y: number };
export type CanvasState = {
  cursor: Coords,
  pageOffset: Coords,
  position: Coords,
  connecting: {
    currently: boolean,
    from: EntityId,
  },
  anchoredEntity: {
    isAnchored: boolean,
    id: EntityId,
  },
  zoom: number,
  gridSize?: number,
};

export type ConnectingPayload = {
  currently: boolean,
  from: EntityId,
};
export type AnchorPayload = {
  isAnchored: boolean,
  id: EntityId,
};
export type CanvasAction =
  | ActionShape<'rd/canvas/SET_OFFSET', Coords>
  | ActionShape<'rd/canvas/TRACK', Coords>
  | ActionShape<'rd/canvas/TRANSLATE', Coords>
  | ActionShape<'rd/canvas/ZOOM', number>
  | ActionShape<'rd/canvas/CONNECT', ConnectingPayload>
  | ActionShape<'rd/canvas/ANCHOR', AnchorPayload>;

const canvasReducer = (state: CanvasState, action: Action): CanvasState => {
  switch (action.type) {
    case 'rd/canvas/SET_OFFSET':
      return {
        ...state,
        pageOffset: action.payload,
      };

    case 'rd/config/SET':
      return {
        ...state,
        gridSize: action.payload.gridSize,
      };

    case 'rd/canvas/TRACK':
      /* TODO: these coordinates are also useful for entity in general. I
       * shouldn't be tracking mouse position in several places independently
       * and perhaps I should converge to always using the cursor position as
       * calculated in the canvas reducer
       *
       * I'm on it :D love you dude <3
       *
       */

      return {
        ...state,
        cursor: {
          x: action.payload.x - state.pageOffset.x - state.position.x,
          y: action.payload.y - state.pageOffset.y - state.position.y,
        },
      };

    case 'rd/canvas/TRANSLATE':
      return {
        ...state,
        position: action.payload,
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

    case 'rd/canvas/ANCHOR':
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

export const setOffset = (payload: Coords): CanvasAction => ({
  type: 'rd/canvas/SET_OFFSET',
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
}: AnchorPayload): CanvasAction => ({
  type: 'rd/canvas/ANCHOR',
  payload: { isAnchored, id },
});

export default canvasReducer;

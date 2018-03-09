// @flow

import React from 'react';
import style from 'styled-components';
import { connect } from 'react-redux';
import { undo, redo } from '../history/reducer';
import { zoom, translate } from '../canvas/reducer';

import type { State } from '../diagram/reducer';
import type { CanvasState } from '../canvas/reducer';
import type { HistoryAction } from '../history/reducer';
import type { CanvasAction, Coords } from '../canvas/reducer';
import type { MapStateToProps } from 'react-redux';

const Panel = style.div`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 777;

  & button {
    cursor: pointer;
  }
`;

type DebugProps = {
  undo: () => HistoryAction,
  redo: () => HistoryAction,
  zoom: number => CanvasAction,
  translate: Coords => CanvasAction,
};
type DebugState = {
  zoomStep: number,
  positionStep: number,
};
class Debug extends React.Component<DebugProps, DebugState> {
  state: DebugState = {
    zoomStep: 0,
    positionStep: 0,
  };
  zoomPhases: Array<number> = [0.5, 2, 0.75, 1];
  positionPhases: Array<[number, number]> = [
    [100, 100],
    [100, 400],
    [400, 100],
    [-100, 100],
    [-100, -100],
    [100, -100],
    [200, 200],
    [100, 100],
    [0, 0],
  ];

  toggleZoom = () => {
    this.setState(prevState => ({
      zoomStep: (prevState.zoomStep + 1) % this.zoomPhases.length,
    }));
    this.props.zoom(this.zoomPhases[this.state.zoomStep]);
  };

  moveAround = () => {
    this.setState(prevState => ({
      positionStep: (prevState.positionStep + 1) % this.positionPhases.length,
    }));
    this.props.translate({
      x: this.positionPhases[this.state.positionStep][0],
      y: this.positionPhases[this.state.positionStep][1],
    });
  };

  render() {
    return (
      <Panel>
        <button onClick={this.props.undo}>UNDO</button>
        <button onClick={this.props.redo}>REDO</button>
        <button onClick={this.toggleZoom}>zoom</button>
        <button onClick={this.moveAround}>move around</button>
      </Panel>
    );
  }
}

// Default export is <Debug /> component, to live inside of <CanvasViewport>.
// It adds buttons to move history, zoom and pan.
export default connect(null, { undo, redo, zoom, translate })(Debug);

// https://github.com/flowtype/flow-typed/issues/1269#issuecomment-332100335
const mapStateToProps: MapStateToProps<any, any, any> = (state: State) => ({
  canvas: state.canvas,
});

// <Fairy /> component lives inside <CanvasArtboard>
// and follows the cursor around
export const Fairy = connect(mapStateToProps)(style.div.attrs({
  style: props => ({
    transform: `translate(${props.canvas.cursor.x}px, ${props.canvas.cursor
      .y}px)`,
  }),
})`
  position: absolute;
  top: 0;
  left: 0;
  width: 11px;
  height: 18px;
  background-color: rgba(255, 0, 0, 0.5);
`);

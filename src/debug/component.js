// @flow

import React from 'react';
import style from 'styled-components';
import { connect } from 'react-redux';
import { undo, redo } from '../history/reducer';
import { zoom, translate } from '../canvas/reducer';

import type { HistoryAction } from '../history/reducer';
import type { CanvasAction, Coords } from '../canvas/reducer';

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

export default connect(null, { undo, redo, zoom, translate })(Debug);

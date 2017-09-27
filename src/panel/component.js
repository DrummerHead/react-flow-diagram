// @flow

import React from 'react';
import style from 'styled-components';
import { connect } from 'react-redux';
import { addEntity } from '../entity/reducer';

import type { CanvasState } from '../canvas/reducer';
import type { EntityModel, EntityAction } from '../entity/reducer';
import type { State } from '../diagram/reducer';

/*
 * Presentational
 * ==================================== */

const PanelStyle = style.div`
  position: absolute;
  left: 0;
  top: 0;
`;

const PanelTools = style.ul`
`;

const PanelTool = style.li`
  background-color: #fff;
  cursor: pointer;
`;

type PanelProps = {};
const Panel = props => (
  <PanelStyle>
    <PanelTools>
      <PanelTool onClick={props.addEntity}>Add entity</PanelTool>
    </PanelTools>
  </PanelStyle>
);

/*
 * Container
 * ==================================== */

type PanelContainerProps = {
  canvas: CanvasState,
  addEntity: EntityModel => EntityAction,
};
class PanelContainer extends React.PureComponent<PanelContainerProps> {
  addEntity: (SyntheticMouseEvent<HTMLElement>) => void;

  constructor() {
    super();
    this.addEntity = this.addEntity.bind(this);
  }

  addEntity(ev: SyntheticMouseEvent<HTMLElement>) {
    this.props.addEntity({
      id: window.Date.now().toString(36),
      name: 'test',
      x: ev.pageX - this.props.canvas.offsetX,
      y: ev.pageY - this.props.canvas.offsetY,
    });
  }

  render() {
    return <Panel addEntity={this.addEntity} />;
  }
}

const mapStateToProps = (state: State) => ({
  canvas: state.canvas,
});

export default connect(mapStateToProps, { addEntity })(PanelContainer);

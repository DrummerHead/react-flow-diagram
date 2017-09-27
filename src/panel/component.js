// @flow

import React from 'react';
import style from 'styled-components';
import { connect } from 'react-redux';
import { addEntity } from '../entity/reducer';

import type { EntityModel, EntityAction } from '../entity/reducer';

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
      name: 'fa',
      x: 0,
      y: 0,
    });
  }

  render() {
    return <Panel addEntity={this.addEntity} />;
  }
}

export default connect(null, { addEntity })(PanelContainer);

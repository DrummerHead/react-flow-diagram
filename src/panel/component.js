// @flow

import React from 'react';
import style from 'styled-components';
import { connect } from 'react-redux';
import { addEntity } from '../entity/reducer';

import type { CanvasState } from '../canvas/reducer';
import type { EntityModel, EntityAction, EntityType } from '../entity/reducer';
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

type PanelProps = {
  addTask: (SyntheticMouseEvent<HTMLElement>) => void,
  addEvent: (SyntheticMouseEvent<HTMLElement>) => void,
};
const Panel = (props: PanelProps) => (
  <PanelStyle>
    <PanelTools>
      <PanelTool onMouseDown={props.addTask}>Add Task</PanelTool>
      <PanelTool onMouseDown={props.addEvent}>Add Event</PanelTool>
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
  addEntity: *;
  addTask: *;
  addEvent: *;

  constructor() {
    super();
    this.addEntity = this.addEntity.bind(this);
    this.addTask = this.addTask.bind(this);
    this.addEvent = this.addEvent.bind(this);
  }

  addEntity(
    entityType: EntityType = 'Task',
    ev: SyntheticMouseEvent<HTMLElement>
  ) {
    this.props.addEntity({
      id: window.Date.now().toString(36),
      type: entityType,
      x: ev.pageX - this.props.canvas.offsetX - 25, // 15 and 15 are distances
      y: ev.pageY - this.props.canvas.offsetY - 25, // from anchor to center of
      name: 'test', // entity, should be calculted
      isAnchored: true,
    });
  }

  addTask(ev: SyntheticMouseEvent<HTMLElement>) {
    this.addEntity('Task', ev);
  }

  addEvent(ev: SyntheticMouseEvent<HTMLElement>) {
    this.addEntity('Event', ev);
  }

  render() {
    return <Panel addTask={this.addTask} addEvent={this.addEvent} />;
  }
}

const mapStateToProps = (state: State) => ({
  canvas: state.canvas,
});

export default connect(mapStateToProps, { addEntity })(PanelContainer);

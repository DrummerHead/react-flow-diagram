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

type sizeConfig = { width: number, height: number };
type PanelContainerProps = {
  canvas: CanvasState,
  addEntity: EntityModel => EntityAction,
  taskConfig: sizeConfig,
  eventConfig: sizeConfig,
};
class PanelContainer extends React.PureComponent<PanelContainerProps> {
  addEntity: (EntityType, sizeConfig, SyntheticMouseEvent<HTMLElement>) => void;
  addTask: (SyntheticMouseEvent<HTMLElement>) => void;
  addEvent: (SyntheticMouseEvent<HTMLElement>) => void;

  constructor() {
    super();
    this.addEntity = this.addEntity.bind(this);
    this.addTask = this.addTask.bind(this);
    this.addEvent = this.addEvent.bind(this);
  }

  addEntity(
    entityType: EntityType = 'Task',
    { width, height }: sizeConfig,
    ev: SyntheticMouseEvent<HTMLElement>
  ) {
    this.props.addEntity({
      // Perhaps something less naive for id generation
      id: window.Date.now().toString(36),
      type: entityType,
      x: ev.pageX - this.props.canvas.offsetX - width / 2,
      y: ev.pageY - this.props.canvas.offsetY - height / 2,
      width,
      height,
      name: 'test',
      isAnchored: true,
    });
  }

  addTask(ev: SyntheticMouseEvent<HTMLElement>) {
    this.addEntity('Task', this.props.taskConfig, ev);
  }

  addEvent(ev: SyntheticMouseEvent<HTMLElement>) {
    this.addEntity('Event', this.props.eventConfig, ev);
  }

  render() {
    return <Panel addTask={this.addTask} addEvent={this.addEvent} />;
  }
}

const mapStateToProps = (state: State) => ({
  canvas: state.canvas,
  taskConfig: state.config.entityTypes.Task,
  eventConfig: state.config.entityTypes.Event,
});

export default connect(mapStateToProps, { addEntity })(PanelContainer);

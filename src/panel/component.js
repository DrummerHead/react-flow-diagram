// @flow

import React from 'react';
import style from 'styled-components';
import { connect } from 'react-redux';
import { addEntity } from '../entity/reducer';
import defaultEntity from '../entity/defaultEntity';

import type {
  EntityModel,
  MetaEntityModel,
  EntityAction,
  EntityType,
} from '../entity/reducer';
import type { DefaultEntityProps } from '../entity/defaultEntity';
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
  addEntity: (EntityModel & MetaEntityModel) => EntityAction,
  defaultEntity: DefaultEntityProps => EntityModel & MetaEntityModel,
};
class PanelContainer extends React.PureComponent<PanelContainerProps> {
  addEntity: (EntityType, SyntheticMouseEvent<HTMLElement>) => void;
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
    ev: SyntheticMouseEvent<HTMLElement>
  ) {
    this.props.addEntity(this.props.defaultEntity({ entityType, ev }));
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
  defaultEntity: defaultEntity(state),
});

export default connect(mapStateToProps, { addEntity })(PanelContainer);

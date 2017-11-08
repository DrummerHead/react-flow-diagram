// @flow

import React from 'react';
import style from 'styled-components';

import type {
  EntityModel,
  MetaEntityModel,
  DiagComponentProps,
} from 'react-flow-diagram';

/*
 * Presentational
 * ==================================== */

const TaskStyle = style.div`
  background-color: #fff;
  display: flex;
  flex-flow: row nowrap;
  align-items: ${props => (props.isEditing ? 'stretch' : 'center')};
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  border-radius: .5rem;
  border: 2px solid #888;
`;

const Name = style.span`
  flex: 1 0;
  padding: .5em;
  font-size: .8rem;
`;

const EditName = style.textarea`
  padding: .5em;
  font-size: .8rem;
  text-align: center;
  resize: none;
  border: none;
  border-radius: .5rem;
`;

export type TaskProps = {
  model: EntityModel,
  meta: MetaEntityModel,
  name: string,
  isEditing: boolean,
  toggleEdit: boolean => void,
  refreshName: (SyntheticEvent<HTMLTextAreaElement>) => void,
  handleKeyPress: (SyntheticKeyboardEvent<HTMLTextAreaElement>) => void,
};
const Task = (props: TaskProps) => (
  <TaskStyle
    width={props.meta.width}
    height={props.meta.height}
    isEditing={props.isEditing}
  >
    {props.isEditing ? (
      <EditName
        value={props.name}
        onChange={props.refreshName}
        onKeyDown={props.handleKeyPress}
      />
    ) : (
      <Name onDoubleClick={() => props.toggleEdit(true)}>
        {props.model.name}
      </Name>
    )}
  </TaskStyle>
);

/*
 * Container
 * ==================================== */

type TaskComponentProps = DiagComponentProps;
type TaskComponentState = {
  isEditing: boolean,
  name: string,
};
class TaskComponent extends React.PureComponent<
  TaskComponentProps,
  TaskComponentState
> {
  state = {
    isEditing: false,
    name: this.props.model.name,
  };

  toggleEdit = (isEditing: boolean) => {
    this.setState({ isEditing });
  };

  refreshName = (ev: SyntheticEvent<HTMLTextAreaElement>) => {
    this.setState({ name: ev.currentTarget.value });
  };

  handleKeyPress = (ev: SyntheticKeyboardEvent<HTMLTextAreaElement>) => {
    switch (ev.key) {
      case 'Enter':
        this.toggleEdit(false);
        this.props.setName({ id: this.props.model.id, name: this.state.name });
        break;
      case 'Escape':
        this.toggleEdit(false);
        this.setState({ name: this.props.model.name });
        break;
      // no default
    }
  };

  render() {
    return (
      <Task
        {...this.props}
        isEditing={this.state.isEditing}
        name={this.state.name}
        toggleEdit={this.toggleEdit}
        refreshName={this.refreshName}
        handleKeyPress={this.handleKeyPress}
      />
    );
  }
}

export default TaskComponent;

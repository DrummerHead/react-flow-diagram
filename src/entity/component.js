// @flow

import React from 'react';
import style from 'styled-components';
import { connect } from 'react-redux';
import { move } from './reducer';

import type { EntityModel, MovePayload, EntityAction } from './reducer';

/*
 * Presentational
 * ==================================== */

const EntityStyle = style.div`
  background-color: #fff;
  position: absolute;
  min-width: 8rem;
  text-align: center;
  min-height: 5rem;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  border-radius: .5rem;
  border: .1rem solid #888;
  user-select: none;
  cursor: move;
`;

const Name = style.span`
  flex: 1 0;
  padding: 1rem;
`;

type EntityProps = EntityModel & {
  selected: boolean,
  onMouseDown: (SyntheticMouseEvent<HTMLElement>) => void,
  onMouseLeave: (SyntheticMouseEvent<HTMLElement>) => void,
  onMouseMove: (SyntheticMouseEvent<HTMLElement>) => void,
  onMouseUp: (SyntheticMouseEvent<HTMLElement>) => void,
};

const Entity = (props: EntityProps) => (
  <EntityStyle
    style={{
      top: props.y,
      left: props.x,
      zIndex: props.selected ? '100' : '10',
    }}
    onMouseDown={props.onMouseDown}
    onMouseLeave={props.onMouseLeave}
    onMouseMove={props.onMouseMove}
    onMouseUp={props.onMouseUp}
  >
    <Name>{props.name}</Name>
  </EntityStyle>
);

/*
 * Container
 * ==================================== */

type EntityContainerState = {
  isMoving: boolean,
  initialX: number,
  initialY: number,
};
type EntityContainerProps = EntityModel & {
  move: MovePayload => EntityAction,
};
class EntityContainer extends React.PureComponent<
  EntityContainerProps,
  EntityContainerState
> {
  onMouseDown: (SyntheticMouseEvent<HTMLElement>) => void;
  onMouseLeave: (SyntheticMouseEvent<HTMLElement>) => void;
  onMouseMove: (SyntheticMouseEvent<HTMLElement>) => void;
  onMouseUp: (SyntheticMouseEvent<HTMLElement>) => void;

  constructor(props: EntityContainerProps) {
    super(props);
    this.state = {
      isMoving: false,
      initialX: 0,
      initialY: 0,
    };
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
  }

  onMouseDown(ev: SyntheticMouseEvent<HTMLElement>) {
    this.setState({
      isMoving: true,
      initialX: ev.clientX,
      initialY: ev.clientY,
    });
  }

  onMouseLeave(ev: SyntheticMouseEvent<HTMLElement>) {
    this.setState({
      isMoving: false,
    });
  }
  onMouseMove(ev: SyntheticMouseEvent<HTMLElement>) {
    if (this.state.isMoving) {
      const deltaX = ev.clientX - this.state.initialX;
      const deltaY = ev.clientY - this.state.initialY;
      this.setState({
        initialX: ev.clientX,
        initialY: ev.clientY,
      });
      this.props.move({
        x: this.props.x + deltaX,
        y: this.props.y + deltaY,
        id: this.props.id,
      });
    }
  }
  onMouseUp(ev: SyntheticMouseEvent<HTMLElement>) {
    this.setState({
      isMoving: false,
    });
  }

  render() {
    return (
      <Entity
        {...this.props}
        onMouseDown={this.onMouseDown}
        onMouseLeave={this.onMouseLeave}
        onMouseMove={this.onMouseMove}
        onMouseUp={this.onMouseUp}
        selected={this.state.isMoving}
      />
    );
  }
}

export default connect(null, { move })(EntityContainer);

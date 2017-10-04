// @flow

import React from 'react';
import style from 'styled-components';
import { connect } from 'react-redux';
import { move } from './reducer';
import Task from '../task/component';

import type {
  EntityModel,
  MetaEntityModel,
  MovePayload,
  EntityAction,
} from './reducer';
import type { CanvasState } from '../canvas/reducer';
import type { State } from '../diagram/reducer';

/*
 * Presentational
 * ==================================== */

const EntityStyle = style.div`
  position: absolute;
  text-align: center;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  user-select: none;
  cursor: move;
`;

type EntityProps = {
  model: EntityModel,
  selected: boolean,
  onMouseDown: (SyntheticMouseEvent<HTMLElement>) => void,
  onMouseLeave: (SyntheticMouseEvent<HTMLElement>) => void,
  onMouseMove: (SyntheticMouseEvent<HTMLElement>) => void,
  onMouseUp: (SyntheticMouseEvent<HTMLElement>) => void,
};

const Entity = (props: EntityProps) => (
  <EntityStyle
    style={{
      top: props.model.y,
      left: props.model.x,
      zIndex: props.selected ? '100' : '10',
    }}
    onMouseDown={props.onMouseDown}
    onMouseLeave={props.onMouseLeave}
    onMouseMove={props.onMouseMove}
    onMouseUp={props.onMouseUp}
  >
    {(type => {
      switch (type) {
        case 'Task':
          return <Task model={props.model} />;
        default:
          return <Task model={props.model} />;
      }
    })(props.model.type)}
  </EntityStyle>
);

/*
 * Container
 * ==================================== */

type EntityContainerState = {
  anchorX: number,
  anchorY: number,
  isAnchored: boolean,
  onMouseUpWouldBeClick: boolean,
};
type EntityContainerProps = {
  model: EntityModel,
  move: MovePayload => EntityAction,
  canvas: CanvasState,
  meta: MetaEntityModel,
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
      anchorX: 60,
      anchorY: 40,
      isAnchored: this.props.meta.isAnchored,
      onMouseUpWouldBeClick: true,
    };
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
  }

  componentDidMount() {
    const wouldBeClick = () => this.setState({ onMouseUpWouldBeClick: false });
    if (this.state.isAnchored) {
      setTimeout(wouldBeClick, 16 * 12);
    } else {
      wouldBeClick();
    }
  }

  onMouseDown(ev: SyntheticMouseEvent<HTMLElement>) {
    this.setState({
      anchorX: ev.pageX - this.props.canvas.offsetX - this.props.model.x,
      anchorY: ev.pageY - this.props.canvas.offsetY - this.props.model.y,
      isAnchored: true,
    });
  }

  onMouseLeave(ev: SyntheticMouseEvent<HTMLElement>) {
    this.setState({
      isAnchored: false,
    });
  }

  onMouseMove(ev: SyntheticMouseEvent<HTMLElement>) {
    if (this.state.isAnchored) {
      this.props.move({
        x: ev.pageX - this.props.canvas.offsetX - this.state.anchorX,
        y: ev.pageY - this.props.canvas.offsetY - this.state.anchorY,
        id: this.props.model.id,
      });
    }
  }

  onMouseUp(ev: SyntheticMouseEvent<HTMLElement>) {
    if (!this.state.onMouseUpWouldBeClick) {
      // Behaves as if it was spawned with a mouse drag
      // meaning that when you release the mouse button,
      // the element will de-anchor
      this.setState({
        isAnchored: false,
      });
    }
    // else it behaves as if it was spawned with a mouse click
    // meaning it needs another click to de-anchor from mouse
  }

  render() {
    return (
      <Entity
        {...this.props}
        onMouseDown={this.onMouseDown}
        onMouseLeave={this.onMouseLeave}
        onMouseMove={this.onMouseMove}
        onMouseUp={this.onMouseUp}
        selected={this.state.isAnchored}
        model={this.props.model}
      />
    );
  }
}

const mapStateToProps = (state: State, ownProps) => ({
  canvas: state.canvas,
  meta: state.metaEntity.find(
    metaEntity => metaEntity.id === ownProps.model.id
  ),
});

export default connect(mapStateToProps, { move })(EntityContainer);

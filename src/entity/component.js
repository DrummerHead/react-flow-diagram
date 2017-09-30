// @flow

import React from 'react';
import style from 'styled-components';
import { connect } from 'react-redux';
import { move } from './reducer';

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
    <Name>
      {props.name} {props.x}, {props.y}
    </Name>
  </EntityStyle>
);

/*
 * Container
 * ==================================== */

type EntityContainerState = {
  anchorX: number,
  anchorY: number,
  isAnchored: boolean,
  bornHeld: boolean,
};
type EntityContainerProps = EntityModel & {
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
      bornHeld: this.props.meta.isAnchored,
    };
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
  }

  onMouseDown(ev: SyntheticMouseEvent<HTMLElement>) {
    this.setState({
      anchorX: ev.pageX - this.props.canvas.offsetX - this.props.x,
      anchorY: ev.pageY - this.props.canvas.offsetY - this.props.y,
      isAnchored: true,
      bornHeld: false,
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
        id: this.props.id,
      });
    }
  }

  onMouseUp(ev: SyntheticMouseEvent<HTMLElement>) {
    if (!this.state.bornHeld) {
      this.setState({
        isAnchored: false,
      });
    }
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
      />
    );
  }
}

const mapStateToProps = (state: State, ownProps) => ({
  canvas: state.canvas,
  meta: state.metaEntity.find(metaEntity => metaEntity.id === ownProps.id),
});

export default connect(mapStateToProps, { move })(EntityContainer);

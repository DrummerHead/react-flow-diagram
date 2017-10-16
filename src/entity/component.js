// @flow

import React from 'react';
import style from 'styled-components';
import { connect } from 'react-redux';
import { move } from './reducer';
import Task from '../task/component';

import type { ComponentType, Node } from 'react';
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
  top: 0;
  left: 0;
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
  children: Node,
};

const Entity = (props: EntityProps) => (
  <EntityStyle
    style={{
      transform: `translate(${props.model.x}px, ${props.model.y}px)`,
      zIndex: props.selected ? '100' : '10',
    }}
    onMouseDown={props.onMouseDown}
    onMouseLeave={props.onMouseLeave}
    onMouseMove={props.onMouseMove}
    onMouseUp={props.onMouseUp}
  >
    {props.children}
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
  meta: MetaEntityModel,
  move: MovePayload => EntityAction,
  canvas: CanvasState,
};
const EntityContainerHOC = WrappedComponent =>
  class extends React.PureComponent<
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
        anchorX: this.props.meta.width / 2,
        anchorY: this.props.meta.height / 2,
        isAnchored: this.props.meta.isAnchored,
        onMouseUpWouldBeClick: true,
      };
      this.onMouseDown = this.onMouseDown.bind(this);
      this.onMouseLeave = this.onMouseLeave.bind(this);
      this.onMouseMove = this.onMouseMove.bind(this);
      this.onMouseUp = this.onMouseUp.bind(this);
    }

    componentDidMount() {
      const wouldBeClick = () =>
        this.setState({ onMouseUpWouldBeClick: false });
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
      if (this.state.isAnchored) {
        // If the entity is still being dragged while leaving (mouse movement
        // faster than state refresh on DOM) then (discussing only X
        // coordinate, calculations the same with Y):
        //
        // This is where the anchor point was (in relation to diagram coordinates):
        // this.state.anchorX + this.props.model.x
        //
        // This is where the mouse was (in relation to diagram coordinates)
        // ev.pageX - this.props.canvas.offsetX
        //
        // This is the difference:
        // (ev.pageX - this.props.canvas.offsetX) - (this.state.anchorX + this.props.model.x)
        //
        // The above number signifies by how much has the mouse left the original
        // anchor point. If we add this difference to where we would have
        // calculated our original location, we're left with:
        // (ev.pageX - this.props.canvas.offsetX - this.state.anchorX) +
        // ((ev.pageX - this.props.canvas.offsetX) - (this.state.anchorX + this.props.model.x))
        //
        // Which simplified leaves us with:
        // 2 * (ev.pageX - this.props.canvas.offsetX - this.state.anchorX) - this.props.model.x
        //
        this.props.move({
          x:
            2 * (ev.pageX - this.props.canvas.offsetX - this.state.anchorX) -
            this.props.model.x,
          y:
            2 * (ev.pageY - this.props.canvas.offsetY - this.state.anchorY) -
            this.props.model.y,
          id: this.props.model.id,
        });
      }
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
        >
          <WrappedComponent model={this.props.model} meta={this.props.meta} />
        </Entity>
      );
    }
  };

const mapStateToProps = (state: State, ownProps) => ({
  canvas: state.canvas,
  meta: state.metaEntity.find(
    metaEntity => metaEntity.id === ownProps.model.id
  ),
});

export default (WrappedComponent: ComponentType<*>) =>
  connect(mapStateToProps, { move })(EntityContainerHOC(WrappedComponent));

// @flow

import React from 'react';
import style from 'styled-components';
import { connect } from 'react-redux';
import { setOffset } from './reducer';
import Entity from '../entity/component';
import { setEntities } from '../entity/reducer';
import Panel from '../panel/component';

import type { setOffsetProps, CanvasAction } from '../canvas/reducer';
import type { EntityState, EntityAction } from '../entity/reducer';
import type { State } from '../diagram/reducer';

/*
 * Presentational
 * ==================================== */

const CanvasStyle = style.div`
  position: relative;
  background-color: #eee;
  flex: 1 0;

  & * {
    box-sizing: border-box;
  }
  & ul,
  & ol {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }
`;

type CanvasProps = {
  entities: EntityState,
  handleRef: HTMLElement => void,
};
const Canvas = (props: CanvasProps) => (
  <CanvasStyle innerRef={div => props.handleRef(div)}>
    <Panel />
    {props.entities.map(entity => <Entity key={entity.id} {...entity} />)}
  </CanvasStyle>
);

/*
 * Container
 * ==================================== */

type CanvasContainerProps = {
  entities: EntityState,
  model: EntityState,
  setEntities: EntityState => EntityAction,
  setOffset: setOffsetProps => CanvasAction,
};
class CanvasContainer extends React.PureComponent<CanvasContainerProps> {
  canvasDOM: ?HTMLElement;
  handleRef: HTMLElement => void;

  constructor() {
    super();
    this.handleRef = this.handleRef.bind(this);
  }

  componentDidMount() {
    this.props.setEntities(this.props.model);
  }

  setOffset() {
    if (this.canvasDOM) {
      const { left, top } = this.canvasDOM.getBoundingClientRect();
      this.props.setOffset({
        offsetX: parseInt(left, 10),
        offsetY: parseInt(top, 10),
      });
    }
  }

  handleRef(div: HTMLElement) {
    if (this.canvasDOM === undefined) {
      this.canvasDOM = div;
      this.setOffset();
    }
  }

  render() {
    return <Canvas entities={this.props.entities} handleRef={this.handleRef} />;
  }
}

const mapStateToProps = (state: State) => ({ entities: state.entity });

export default connect(mapStateToProps, { setEntities, setOffset })(
  CanvasContainer
);

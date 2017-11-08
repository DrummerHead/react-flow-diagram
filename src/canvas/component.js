// @flow

import React from 'react';
import style from 'styled-components';
import { connect } from 'react-redux';
import { setOffset, trackMovement } from './reducer';
import { undo, redo } from '../history/reducer';
import { setName } from '../entity/reducer';
import EntityHOC from '../entity/component';
import Panel from '../panel/component';
import Links from '../links/component';
import ArrowMarker from '../arrowMarker/component';
import Debug from '../debug/component';

import type { ComponentType } from 'React';
import type { Coords, CanvasAction } from '../canvas/reducer';
import type { EntityModel, EntityState } from '../entity/reducer';
import type { CustomEntities } from '../diagram/component';
import type { State } from '../diagram/reducer';
import type { HistoryAction } from '../history/reducer';

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

const SvgLand = style.svg`
  position: absolute;
  top: 0;
  left: 0;
`;

type CanvasProps = {
  entities: EntityState,
  wrappedCustomEntities: { [type: string]: ComponentType<*> },
  isConnecting: boolean,
  connectingEntity: EntityModel,
  handleRef: HTMLElement => void,
  onMouseMove: (SyntheticMouseEvent<HTMLElement>) => void,
};
const Canvas = (props: CanvasProps) => (
  <CanvasStyle
    innerRef={div => props.handleRef(div)}
    onMouseMove={props.onMouseMove}
  >
    <Debug />
    <SvgLand width="100%" height="100%">
      {props.entities
        .filter(entity => 'linksTo' in entity)
        .map(entity => <Links key={entity.id} model={entity} />)}

      {props.isConnecting && <Links model={props.connectingEntity} />}

      <ArrowMarker />
    </SvgLand>

    {props.entities
      .map(entity => ({
        entity: entity,
        CustomEntity: props.wrappedCustomEntities[entity.type],
      }))
      .map(Combo => (
        <Combo.CustomEntity key={Combo.entity.id} model={Combo.entity} />
      ))}

    <Panel />
  </CanvasStyle>
);

/*
 * Container
 * ==================================== */

type CanvasContainerProps = {
  entities: EntityState,
  customEntities: CustomEntities,
  isConnecting: boolean,
  connectingEntity: EntityModel,
  setOffset: Coords => CanvasAction,
  trackMovement: Coords => CanvasAction,
  undo: () => HistoryAction,
  redo: () => HistoryAction,
};
class CanvasContainer extends React.PureComponent<CanvasContainerProps> {
  canvasDOM: ?HTMLElement;

  wrappedCustomEntities = Object.assign(
    {},
    ...Object.keys(this.props.customEntities).map(type => ({
      [type]: EntityHOC(
        connect(null, { setName })(this.props.customEntities[type])
      ),
    }))
  );

  componentDidMount() {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.document.addEventListener('keydown', this.handleKey);
  }

  componentWillUnmount() {
    window.document.removeEventListener('keydown', this.handleKey);
  }

  setOffset() {
    if (this.canvasDOM) {
      const cd = this.canvasDOM;
      if (window.scrollY !== 0) {
        window.scrollTo(0, 0);
      }
      const { left, top } = cd.getBoundingClientRect();
      this.props.setOffset({
        x: parseInt(left, 10),
        y: parseInt(top, 10),
      });
    }
  }

  handleKey = (ev: SyntheticKeyboardEvent<HTMLElement>) => {
    if (ev.getModifierState('Meta') || ev.getModifierState('Control')) {
      switch (ev.key) {
        case 'z':
          ev.preventDefault();
          this.props.undo();
          break;
        case 'y':
          ev.preventDefault();
          this.props.redo();
          break;
        // no default
      }
    }
  };

  onMouseMove = (ev: SyntheticMouseEvent<HTMLElement>) => {
    this.props.trackMovement({
      x: ev.pageX,
      y: ev.pageY,
    });
  };

  handleRef = (div: HTMLElement) => {
    if (this.canvasDOM === undefined) {
      this.canvasDOM = div;
      this.setOffset();
    }
  };

  render() {
    return (
      <Canvas
        entities={this.props.entities}
        wrappedCustomEntities={this.wrappedCustomEntities}
        handleRef={this.handleRef}
        onMouseMove={this.onMouseMove}
        isConnecting={this.props.isConnecting}
        connectingEntity={this.props.connectingEntity}
      />
    );
  }
}

const mapStateToProps = (state: State) => ({
  entities: state.entity,
  connectingEntity: state.entity.find(
    entity => entity.id === state.canvas.connecting.from
  ),
  isConnecting: state.canvas.connecting.currently,
});

export default connect(mapStateToProps, {
  setOffset,
  trackMovement,
  undo,
  redo,
})(CanvasContainer);

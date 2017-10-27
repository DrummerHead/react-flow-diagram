// @flow

import React from 'react';
import style from 'styled-components';
import { connect } from 'react-redux';
import { setOffset } from './reducer';
import { setEntities } from '../entity/reducer';
import { setConfig } from '../config/reducer';
import { undo, redo } from '../history/reducer';
import EntityHOC from '../entity/component';
import Task from '../task/component';
import Event from '../event/component';
import Panel from '../panel/component';
import Links from '../links/component';
import ArrowMarker from '../arrowMarker/component';
import Debug from '../debug/component';

import type { ComponentType } from 'react';
import type { setOffsetProps, CanvasAction } from '../canvas/reducer';
import type {
  EntityState,
  EntityAction,
  EntityType,
  MetaEntityAction,
} from '../entity/reducer';
import type { ConfigState, ConfigAction } from '../config/reducer';
import type { State } from '../diagram/reducer';
import type { TaskProps } from '../task/component';
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
  handleRef: HTMLElement => void,
};

const EntitiesHOCList = {
  Task: EntityHOC(Task),
  Event: EntityHOC(Event),
};
const Canvas = (props: CanvasProps) => (
  <CanvasStyle innerRef={div => props.handleRef(div)}>
    <Debug />
    <SvgLand width="100%" height="100%">
      {props.entities
        .filter(entity => entity.hasOwnProperty('linksTo'))
        .map(entity => <Links key={entity.id} model={entity} />)}
      <ArrowMarker />
    </SvgLand>
    {props.entities.map(entity => {
      switch (entity.type) {
        case 'Task':
          return <EntitiesHOCList.Task key={entity.id} model={entity} />;
        case 'Event':
          return <EntitiesHOCList.Event key={entity.id} model={entity} />;
        default:
          return <EntitiesHOCList.Task key={entity.id} model={entity} />;
      }
    })}
    <Panel />
  </CanvasStyle>
);

/*
 * Container
 * ==================================== */

type CanvasContainerProps = {
  entities: EntityState,
  setEntities: EntityState => EntityAction,
  setOffset: setOffsetProps => CanvasAction,
  setConfig: ConfigState => ConfigAction,
  undo: () => HistoryAction,
  redo: () => HistoryAction,
};
class CanvasContainer extends React.PureComponent<CanvasContainerProps> {
  canvasDOM: ?HTMLElement;
  handleRef: HTMLElement => void;
  handleKey: (SyntheticKeyboardEvent<HTMLElement>) => void;

  constructor() {
    super();
    this.handleRef = this.handleRef.bind(this);
    this.handleKey = this.handleKey.bind(this);
  }

  componentDidMount() {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.document.addEventListener('keydown', this.handleKey);
  }

  componentWillUnmount() {
    window.document.removeEventListener('keydown', this.handleKey);
  }

  handleKey(ev: SyntheticKeyboardEvent<HTMLElement>) {
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
      }
    }
  }

  setOffset() {
    if (this.canvasDOM) {
      const cd = this.canvasDOM;
      if (window.scrollY !== 0) {
        window.scrollTo(0, 0);
      }
      const { left, top } = cd.getBoundingClientRect();
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

export default connect(mapStateToProps, {
  setEntities,
  setOffset,
  setConfig,
  undo,
  redo,
})(CanvasContainer);

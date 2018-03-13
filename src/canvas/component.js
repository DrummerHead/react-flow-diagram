// @flow

import React from 'react';
import style from 'styled-components';
import { connect } from 'react-redux';
import { configViewport, trackMovement, anchorCanvas } from './reducer';
import { undo, redo } from '../history/reducer';
import { setName } from '../entity/reducer';
import { icons } from '../icon/component';
import EntityHOC from '../entity/component';
import Panel from '../panel/component';
import Links from '../links/component';
import ArrowMarker from '../arrowMarker/component';
import Debug, { Fairy } from '../debug/component';
import calcLinkPoints from '../links/calcLinkPoints';
import elemLayout from './elemLayout';

import type { ComponentType } from 'React';
import type { Coords, CanvasAction } from './reducer';
import type {
  EntityState,
  Point,
  Links as LinksType,
  MetaEntityAction,
} from '../entity/reducer';
import type { CustomEntities } from '../diagram/component';
import type { State } from '../diagram/reducer';
import type { HistoryAction } from '../history/reducer';

/*
 * Presentational
 * ==================================== */

const CanvasViewport = style.div`
  min-height: 10em;
  flex: 1 0 auto;
  position: relative;
  overflow: hidden;
  background-color: #282828;

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

const CanvasArtboard = style.div.attrs({
  style: props => {
    const restPercentage = 100 - 100 / props.gridSize;
    const defaultStyles = {
      transform: `translate(${props.artboard.x}px, ${props.artboard
        .y}px) scale(${props.zoom})`,
      width: `${props.artboard.width}px`,
      height: `${props.artboard.height}px`,
    };
    const gridStyle = {
      backgroundImage: `linear-gradient(0deg, transparent 0%, transparent ${restPercentage}%, rgba(0, 0, 0, .2) 100%),
linear-gradient(90deg, transparent 0%, transparent ${restPercentage}%, rgba(0, 0, 0, .2) 100%)`,
      backgroundSize: `${props.gridSize}px ${props.gridSize}px`,
    };
    return props.gridSize ? { ...defaultStyles, ...gridStyle } : defaultStyles;
  },
})`
  position: relative;
  transform-origin: 0 0;
  background-color: #eee;
  overflow: hidden;
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
  gridSize: ?number,
  connectingLink: LinksType,
  handleRef: HTMLElement => void,
  zoom: number,
  artboard: { x: number, y: number, width: number, height: number },
  onMouseDown: () => void,
  onMouseMove: (SyntheticMouseEvent<HTMLElement>) => void,
  onMouseUp: () => void,
};
const Canvas = (props: CanvasProps) => (
  <CanvasViewport
    onMouseMove={props.onMouseMove}
    innerRef={div => props.handleRef(div)}
  >
    <CanvasArtboard
      onMouseDown={props.onMouseDown}
      onMouseUp={props.onMouseUp}
      gridSize={props.gridSize}
      artboard={props.artboard}
      zoom={props.zoom}
    >
      <SvgLand width="100%" height="100%">
        {props.entities
          .filter(entity => 'linksTo' in entity)
          // $FlowFixMe
          .map(entity => <Links key={entity.id} links={entity.linksTo} />)}
        // https://github.com/facebook/flow/issues/1414
        {props.isConnecting && <Links links={props.connectingLink} />}
        <ArrowMarker />
      </SvgLand>

      {props.entities
        .map(entity => ({
          entity,
          CustomEntity: props.wrappedCustomEntities[entity.type],
        }))
        .map(Combo => (
          <Combo.CustomEntity key={Combo.entity.id} model={Combo.entity} />
        ))}
    </CanvasArtboard>
    <Panel />
    <Debug />
  </CanvasViewport>
);

/*
 * Container
 * ==================================== */

type CanvasContainerProps = {
  entities: EntityState,
  customEntities: CustomEntities,
  isConnecting: boolean,
  connectingLink: LinksType,
  gridSize: ?number,
  zoom: number,
  artboard: { x: number, y: number, width: number, height: number },
  configViewport: () => CanvasAction,
  trackMovement: Coords => CanvasAction,
  anchorCanvas: boolean => CanvasAction,
  undo: () => HistoryAction,
  redo: () => HistoryAction,
};
class CanvasContainer extends React.PureComponent<CanvasContainerProps> {
  canvasDOM: ?HTMLElement;

  componentDidMount() {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    window.document.addEventListener('keydown', this.handleKey);

    Object.keys(this.props.customEntities).forEach(entityType => {
      icons.addIcon({
        [entityType]: this.props.customEntities[entityType].icon,
      });
    });
  }

  componentWillUnmount() {
    window.document.removeEventListener('keydown', this.handleKey);
    this.canvasDOM = undefined;
    elemLayout.gc();
  }

  wrappedCustomEntities = Object.assign(
    {},
    ...Object.keys(this.props.customEntities).map(type => ({
      [type]: EntityHOC(
        connect(null, { setName })(this.props.customEntities[type].component)
      ),
    }))
  );

  setOffset() {
    if (this.canvasDOM) {
      const cd = this.canvasDOM;
      elemLayout.set(cd);
      if (window.scrollY !== 0) {
        window.scrollTo(0, 0);
      }
      this.props.configViewport();
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

  onMouseDown = () => {
    this.props.anchorCanvas(true);
  };

  onMouseMove = (ev: SyntheticMouseEvent<HTMLElement>) => {
    this.props.trackMovement({
      x: ev.pageX,
      y: ev.pageY,
    });
  };

  onMouseUp = () => {
    this.props.anchorCanvas(false);
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
        onMouseDown={this.onMouseDown}
        onMouseMove={this.onMouseMove}
        onMouseUp={this.onMouseUp}
        isConnecting={this.props.isConnecting}
        connectingLink={this.props.connectingLink}
        zoom={this.props.zoom}
        artboard={this.props.artboard}
        gridSize={this.props.gridSize}
      />
    );
  }
}

const makeConnectingLinks = (state: State): LinksType => {
  if (state.canvas.connecting.currently) {
    const points: Array<Point> = calcLinkPoints(
      state.entity.find(entity => entity.id === state.canvas.connecting.from),
      {
        x: state.canvas.cursor.x,
        y: state.canvas.cursor.y,
        width: 0,
        height: 0,
      }
    );
    return [
      {
        target: 'will_connect',
        edited: false,
        points,
      },
    ];
  } else {
    return [{ target: 'noop', edited: false }];
  }
};

const mapStateToProps = (state: State) => ({
  entities: state.entity,
  isConnecting: state.canvas.connecting.currently,
  connectingLink: makeConnectingLinks(state),
  gridSize: state.canvas.gridSize,
  artboard: state.canvas.canvasArtboard,
  zoom: state.canvas.zoom,
});

export default connect(mapStateToProps, {
  configViewport,
  trackMovement,
  undo,
  redo,
  anchorCanvas,
})(CanvasContainer);

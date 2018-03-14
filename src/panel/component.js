// @flow

import React from 'react';
import style from 'styled-components';
import { connect } from 'react-redux';
import Icon from '../icon/component';
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
import type { ConfigEntityTypes } from '../config/reducer';

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
  width: ${props => props.width}px;
  height: ${props => props.width}px;
  padding: .6em;
  ${props =>
    props.separator ? 'border-top: 1px solid rgba(0, 0, 0, .25);' : ''}
  background-color: #ddd;
  transition: background-color ease-in 80ms;
  cursor: pointer;

  &:hover {
    background-color: #ccc;
  }

  & > svg {
    display: block;
    width: 100%;
  }
`;

type PanelProps = {
  addEntityHelper: EntityType => void,
  entityTypeNames: Array<EntityType>,
  toolWidth(): number,
  zoomIn: () => void,
  zoomOut: () => void,
};
const Panel = (props: PanelProps) => (
  <PanelStyle>
    <PanelTools>
      {props.entityTypeNames.map(entityTypeName => (
        <PanelTool
          width={props.toolWidth()}
          key={entityTypeName}
          onMouseDown={() => props.addEntityHelper(entityTypeName)}
        >
          <Icon name={entityTypeName} label={`Add ${entityTypeName}`} />
        </PanelTool>
      ))}
      <PanelTool
        separator
        width={props.toolWidth()}
        onMouseDown={() => props.zoomIn()}
      >
        <Icon name="zoomIn" label="Zoom in" />
      </PanelTool>
      <PanelTool width={props.toolWidth()} onMouseDown={() => props.zoomOut()}>
        <Icon name="zoomOut" label="Zoom out" />
      </PanelTool>
    </PanelTools>
  </PanelStyle>
);

/*
 * Container
 * ==================================== */

type PanelContainerProps = {
  entityTypes: ConfigEntityTypes,
  addEntity: (EntityModel & MetaEntityModel) => EntityAction,
  defaultEntity: DefaultEntityProps => EntityModel & MetaEntityModel,
  zoomIn: () => void,
  zoomOut: () => void,
  gridSize: ?number,
};
class PanelContainer extends React.PureComponent<PanelContainerProps> {
  entityTypeNames = Object.keys(this.props.entityTypes);
  minToolSize = 40;
  niceToolSize = 50;

  addEntityHelper = (entityType: EntityType = 'Task') => {
    this.props.addEntity(this.props.defaultEntity({ entityType }));
  };

  toolWidth = (): number => {
    if (typeof this.props.gridSize === 'number') {
      const gridSize = this.props.gridSize;
      const howManyFit = parseInt(this.minToolSize / this.props.gridSize, 10);
      const theRest = (this.minToolSize * howManyFit) % gridSize;
      const fittingSize =
        theRest === 0 ? howManyFit * gridSize : (howManyFit + 1) * gridSize;
      return fittingSize === 0 ? gridSize : fittingSize;
    } else {
      return this.niceToolSize;
    }
  };

  render() {
    return (
      <Panel
        addEntityHelper={this.addEntityHelper}
        entityTypeNames={this.entityTypeNames}
        toolWidth={this.toolWidth}
        zoomIn={this.props.zoomIn}
        zoomOut={this.props.zoomOut}
      />
    );
  }
}

const mapStateToProps = (state: State) => ({
  entityTypes: state.config.entityTypes,
  defaultEntity: defaultEntity(state),
  gridSize: state.canvas.gridSize,
});

export default connect(mapStateToProps, { addEntity })(PanelContainer);

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
  background-color: #ddd;
  cursor: pointer;
  padding: .6em;
  transition: background-color ease-in 80ms;

  &:hover {
    background-color: #ccc;
  }

  & > svg {
    display: block;
    width: 100%;
  }
`;

type PanelProps = {
  addEntityHelper: (EntityType, SyntheticMouseEvent<HTMLElement>) => void,
  entityTypeNames: Array<EntityType>,
  toolWidth(): number,
};
const Panel = (props: PanelProps) => (
  <PanelStyle>
    <PanelTools>
      {props.entityTypeNames.map(entityTypeName => (
        <PanelTool
          width={props.toolWidth()}
          key={entityTypeName}
          onMouseDown={ev => props.addEntityHelper(entityTypeName, ev)}
        >
          <Icon name={entityTypeName} label={`Add ${entityTypeName}`} />
        </PanelTool>
      ))}
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
  gridSize: number,
};
class PanelContainer extends React.PureComponent<PanelContainerProps> {
  entityTypeNames = Object.keys(this.props.entityTypes);
  minToolSize = 40;

  addEntityHelper = (
    entityType: EntityType = 'Task',
    ev: SyntheticMouseEvent<HTMLElement>
  ) => {
    this.props.addEntity(this.props.defaultEntity({ entityType, ev }));
  };

  toolWidth = () => {
    const howManyFit = parseInt(this.minToolSize / this.props.gridSize, 10);
    const theRest = (this.minToolSize * howManyFit) % this.props.gridSize;
    const fittingSize =
      theRest === 0
        ? howManyFit * this.props.gridSize
        : (howManyFit + 1) * this.props.gridSize;
    return fittingSize === 0 ? this.props.gridSize : fittingSize;
  };

  render() {
    return (
      <Panel
        addEntityHelper={this.addEntityHelper}
        entityTypeNames={this.entityTypeNames}
        toolWidth={this.toolWidth}
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

// @flow

import React from 'react';
import style from 'styled-components';
import { connect } from 'react-redux';
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
  background-color: #fff;
  cursor: pointer;
`;

type PanelProps = {
  addEntityHelper: (EntityType, SyntheticMouseEvent<HTMLElement>) => void,
  entityTypeNames: Array<EntityType>,
};
const Panel = (props: PanelProps) => (
  <PanelStyle>
    <PanelTools>
      {props.entityTypeNames.map(entityTypeName => (
        <PanelTool
          key={entityTypeName}
          onMouseDown={ev => props.addEntityHelper(entityTypeName, ev)}
        >
          Add {entityTypeName}
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
};
class PanelContainer extends React.PureComponent<PanelContainerProps> {
  entityTypeNames = Object.keys(this.props.entityTypes);

  addEntityHelper = (
    entityType: EntityType = 'Task',
    ev: SyntheticMouseEvent<HTMLElement>
  ) => {
    this.props.addEntity(this.props.defaultEntity({ entityType, ev }));
  };

  render() {
    return (
      <Panel
        addEntityHelper={this.addEntityHelper}
        entityTypeNames={this.entityTypeNames}
      />
    );
  }
}

const mapStateToProps = (state: State) => ({
  entityTypes: state.config.entityTypes,
  defaultEntity: defaultEntity(state),
});

export default connect(mapStateToProps, { addEntity })(PanelContainer);

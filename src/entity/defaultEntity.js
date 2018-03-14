// @flow

import type { State } from '../diagram/reducer';
import type {
  EntityModel,
  MetaEntityModel,
  EntityType,
} from '../entity/reducer';

// This function is probably a hack. Is supposed to be called on a
// mapStateToProps function and have access to state, so that I can use
// configuration in Redux state without having to actually fetch this
// information on every component that needs to render a new entity. If you're
// reading this and have a better alternative, please open an issue.
//
// I think this is probably a hack because I end up returning a function on a
// place that is supposed to return attributes.

export type DefaultEntityProps = {
  entityType: EntityType,
};
const defaultEntity = (state: State) => ({
  entityType,
}: DefaultEntityProps): EntityModel & MetaEntityModel => ({
  // Perhaps something less naive for id generation
  id: window.Date.now().toString(36),
  type: entityType,
  x: state.canvas.cursor.x - state.config.entityTypes[entityType].width / 2,
  y: state.canvas.cursor.y - state.config.entityTypes[entityType].height / 2,
  width: state.config.entityTypes[entityType].width,
  height: state.config.entityTypes[entityType].height,
  name: 'test',
  isAnchored: true,
  isSelected: false,
  anchor: {
    x: state.config.entityTypes[entityType].width / 2,
    y: state.config.entityTypes[entityType].height / 2,
  },
});

export default defaultEntity;

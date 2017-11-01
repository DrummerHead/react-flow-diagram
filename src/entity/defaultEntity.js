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
  ev: SyntheticMouseEvent<HTMLElement>,
};
const defaultEntity = (state: State) => ({
  entityType,
  ev,
}: DefaultEntityProps): EntityModel & MetaEntityModel => ({
  // Perhaps something less naive for id generation
  id: window.Date.now().toString(36),
  type: entityType,
  x:
    ev.pageX -
    state.canvas.offsetX -
    state.config.entityTypes[entityType].width / 2,
  y:
    ev.pageY -
    state.canvas.offsetY -
    state.config.entityTypes[entityType].height / 2,
  width: state.config.entityTypes[entityType].width,
  height: state.config.entityTypes[entityType].height,
  name: 'test',
  isAnchored: true,
  isSelected: false,
});

export default defaultEntity;
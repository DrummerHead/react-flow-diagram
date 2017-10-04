// @flow

import React from 'react';
import style from 'styled-components';
import { connect } from 'react-redux';

import type { EntityModel, EntityState, Id } from '../entity/reducer';
import type { State } from '../diagram/reducer';

/*
 * Presentational
 * ==================================== */

const Line = style.polyline`
  fill: none;
  stroke-width: .1em;
  stroke: black;
  stroke-linejoin: round;
  marker-end: url("#arrow-end");
`;

type Point = {
  x: number,
  y: number,
};
type LinkProps = {
  from: Point,
  to: Point,
};
const Link = ({ from, to }: LinkProps) => (
  <Line points={`${from.x},${from.y} ${to.x},${to.y}`} />
);

/*
 * Container
 * ==================================== */

type LinksContainerProps = {
  model: EntityModel,
  linksTo: Array<?EntityModel>,
};
const LinksContainer = (props: LinksContainerProps) => (
  <g>
    {props.linksTo.map(
      link => link && <Link key={link.id} from={props.model} to={link} />
    )}
  </g>
);

const mapStateToProps = (state: State, ownProps) => {
  const linksTo = ownProps.model.linksTo || ['nil'];
  return {
    linksTo: linksTo.map(entityId =>
      state.entity.find(entity => entity.id === entityId)
    ),
  };
};

export default connect(mapStateToProps, {})(LinksContainer);

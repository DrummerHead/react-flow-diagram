// @flow

import React from 'react';
import style from 'styled-components';

import type { Links, Point } from '../entity/reducer';

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

const InteractionLine = style.polyline`
  fill: none;
  stroke-width: 1em;
  stroke: transparent;
  stroke-linejoin: round;
`;

type ArrowBodyProps = {
  points: string,
};
const ArrowBody = ({ points }: ArrowBodyProps) => (
  <g>
    <Line points={points} />
    <InteractionLine points={points} />
  </g>
);

/*
 * Container
 * ==================================== */

const pointsToString = (points: Array<Point>): string =>
  points.reduce((acc, curr) => `${acc} ${curr.x},${curr.y}`, '');

type ArrowBodyContainerProps = {
  links: Links,
};
const ArrowBodyContainer = (props: ArrowBodyContainerProps) => (
  <g>
    {props.links.map(
      link =>
        link.points && (
          <ArrowBody key={link.target} points={pointsToString(link.points)} />
        )
    )}
  </g>
);

export default ArrowBodyContainer;

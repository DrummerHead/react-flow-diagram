// @flow

import React from 'react';
import style from 'styled-components';

import type { Links, Point, EntityId } from '../entity/reducer';

/*
 * Presentational
 * ==================================== */

const Line = style.path`
  fill: none;
  stroke-width: .1em;
  stroke: black;
  stroke-linejoin: round;
  marker-end: url("#arrow-end");
`;

const InteractionLine = style.path`
  fill: none;
  stroke-width: 1em;
  stroke: transparent;
  stroke-linejoin: round;
`;

type ArrowBodyProps = {
  points: string,
  id: EntityId,
  label: ?string,
};
const ArrowBody = ({ points, id, label }: ArrowBodyProps) => (
  <g>
    <Line d={points} id={`line${id}`} />
    <InteractionLine d={points} />
    {label && (
      <text dy="-.25rem">
        <textPath
          xlinkHref={`#line${id}`}
          startOffset="33%"
          style={{ fontSize: '.8rem' }}
        >
          {label}
        </textPath>
      </text>
    )}
  </g>
);

/*
 * Container
 * ==================================== */

const pointsToString = (points: Array<Point>): string =>
  points
    .reduce((acc, curr) => `${acc} ${curr.x},${curr.y} L`, 'M')
    .replace(/ L$/, '');

type ArrowBodyContainerProps = {
  links: Links,
};
const ArrowBodyContainer = (props: ArrowBodyContainerProps) => (
  <g>
    {props.links.map(
      link =>
        link.points && (
          <ArrowBody
            key={link.target}
            id={link.target}
            label={link.label}
            points={pointsToString(link.points)}
          />
        )
    )}
  </g>
);

export default ArrowBodyContainer;

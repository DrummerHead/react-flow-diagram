// @flow

import React from 'react';
import style from 'styled-components';

/*
 * Presentational
 * ==================================== */

const Arrow = style.path`
  fill: black;
  stroke-width: 1px;
  stroke-linecap: round;
  stroke-dasharray: 10000, 1;
  stroke: black;
`;

const ArrowMarker = () => (
  <marker
    id="arrow-end"
    viewBox="0 0 20 20"
    refX="11"
    refY="10"
    markerWidth="10"
    markerHeight="10"
    orient="auto"
  >
    <Arrow d="M 1 5 L 11 10 L 1 15 Z" />
  </marker>
);

export default ArrowMarker;

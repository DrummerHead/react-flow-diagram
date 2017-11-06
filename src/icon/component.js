// @flow
/* eslint-disable react/require-default-props */

import React from 'react';
import style from 'styled-components';

import type { Element } from 'react';

// Presentational Component
// ==================================================================

const Svg = style.svg`
  width: 1.25em;
`;
const Path = style.path`
  fill: #444;
`;

type IconList = {
  [string]: {
    path: Element<*>,
    size: number,
  },
};
const iconList: IconList = {
  delete: {
    path: (
      <Path d="M3 16h10l1-11H2zm7-14V0H6v2H1v3l1-1h12l1 1V2h-5zM9 2H7V1h2v1z" />
    ),
    size: 16,
  },
  task: {
    path: (
      <Path d="M14 0H2C1 0 0 1 0 2v12c0 1 1 2 2 2h12c1 0 2-1 2-2V2c0-1-1-2-2-2z" />
    ),
    size: 16,
  },
  event: {
    path: <Path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8z" />,
    size: 16,
  },
  arrow: {
    path: <Path d="M4.5 0l4 4L0 12.5 3.5 16 12 7.5l4 4V0H4.5z" />,
    size: 16,
  },
};

export type IconVariety = $Keys<typeof iconList>;

type IconProps = {
  name: IconVariety,
  label?: string,
};
const Icon = ({ name, label }: IconProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox={`0 0 ${iconList[name].size} ${iconList[name].size}`}
  >
    {label && <title>{label}</title>}
    {iconList[name].path}
  </Svg>
);

export default Icon;

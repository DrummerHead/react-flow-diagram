// @flow

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

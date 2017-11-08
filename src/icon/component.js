// @flow
/* eslint-disable react/require-default-props */

import React from 'react';
import style from 'styled-components';

import type { Element } from 'react';

// Presentational Component
// ==================================================================

const Svg = style.svg`
  width: 1.25em;
  & > path {
    fill: #444;
  }
`;

type IconList = {
  [string]: {
    path: Element<*>,
    size: number,
  },
};

const icons = (function() {
  let iconList: IconList = {
    delete: {
      path: (
        <path d="M3 16h10l1-11H2zm7-14V0H6v2H1v3l1-1h12l1 1V2h-5zM9 2H7V1h2v1z" />
      ),
      size: 16,
    },
    arrow: {
      path: <path d="M4.5 0l4 4L0 12.5 3.5 16 12 7.5l4 4V0H4.5z" />,
      size: 16,
    },
  };

  return {
    get(iconName: string) {
      return iconList[iconName];
    },
    addIcon(icon: IconList): void {
      iconList = {
        ...iconList,
        ...icon,
      };
    },
  };
})();

export type IconVariety = string;

type IconProps = {
  name: IconVariety,
  label?: string,
};
const Icon = ({ name, label }: IconProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox={`0 0 ${icons.get(name).size.toString()} ${icons
      .get(name)
      .size.toString()}`}
  >
    {label && <title>{label}</title>}
    {icons.get(name).path}
  </Svg>
);

export default Icon;
export { icons };

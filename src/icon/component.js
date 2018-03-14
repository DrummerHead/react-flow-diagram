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
    zoomIn: {
      path: (
        <path d="M15.5 13.6l-3.8-3.2c-.4-.4-.8-.5-1-.5.8-1.2 1.3-2.5 1.3-4 0-3.3-2.7-6-6-6S0 2.7 0 6s2.7 6 6 6c1.5 0 2.8-.5 4-1.4 0 .3 0 .7.4 1l3.2 4c.6.5 1.5.6 2 0s.5-1.4 0-2zM6 10c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4zm1-7H5v2H3v2h2v2h2V7h2V5H7z" />
      ),
      size: 16,
    },
    zoomOut: {
      path: (
        <path d="M15.5 13.6l-3.8-3.2c-.4-.4-.8-.5-1-.5.8-1.2 1.3-2.5 1.3-4 0-3.3-2.7-6-6-6S0 2.7 0 6s2.7 6 6 6c1.5 0 2.8-.5 4-1.4 0 .3 0 .7.4 1l3.2 4c.6.5 1.5.6 2 0s.5-1.4 0-2zM6 10c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4zM3 5h6v2H3z" />
      ),
      size: 16,
    },
  };

  return {
    get(iconName: string) {
      return iconName in iconList ? iconList[iconName] : iconList.arrow;
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

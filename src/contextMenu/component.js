// @flow

import React from 'react';
import style from 'styled-components';
import Icon from '../icon/component';

import type { IconVariety } from '../icon/component';

/*
 * Presentational
 * ==================================== */

const ContextMenuStyle = style.ul`
  position: absolute;
  right: -.5em;
  transform: translateX(100%);
  align-self: flex-start;
`;

const Action = style.li`
  cursor: pointer;
`;

export type ContextMenuActions = Array<{
  action: Function, // eslint-disable-line flowtype/no-weak-types
  iconVariety: IconVariety,
  label: string,
}>;

const stopActionPropagation = (action: Function) => (
  ev: SyntheticMouseEvent<HTMLElement>
): void => {
  ev.stopPropagation();
  action(ev);
};

type ContextMenuProps = {
  actions: ContextMenuActions,
};
const ContextMenu = (props: ContextMenuProps) => (
  <ContextMenuStyle>
    {props.actions.map(action => (
      <Action
        key={action.label}
        onMouseDown={stopActionPropagation(action.action)}
      >
        <Icon name={action.iconVariety} label={action.label} />
      </Action>
    ))}
  </ContextMenuStyle>
);

export default ContextMenu;

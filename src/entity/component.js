// @flow

import React from 'react';
import style from 'styled-components';

import type { EntityModel } from './reducer';

/*
 * Presentational
 * ==================================== */

const EntityStyle = style.div`
  background-color: #fff;
  position: absolute;
  min-width: 8rem;
  text-align: center;
  min-height: 5rem;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  border-radius: .5rem;
  border: .1rem solid #888;
`;

const Name = style.span`
  flex: 1 0;
  padding: 1rem;
`;

const Entity = ({ x, y, name, id }: EntityModel) => (
  <EntityStyle style={{ top: x, left: y }}>
    <Name>{name}</Name>
  </EntityStyle>
);

export default Entity;

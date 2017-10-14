// @flow

import React from 'react';
import style from 'styled-components';

import type { EntityModel, MetaEntityModel } from '../entity/reducer';

/*
 * Presentational
 * ==================================== */

const EventStyle = style.div`
  background-color: #fff;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  border-radius: 77rem;
  border: 2px solid #888;
  justify-content: center;
  font-size: .5rem;

`;

export type EventProps = {
  model: EntityModel,
  meta: MetaEntityModel,
};
const Event = ({ model, meta }: EventProps) => (
  <EventStyle width={meta.width} height={meta.height}>
    {model.x}, {model.y}
  </EventStyle>
);

export default Event;

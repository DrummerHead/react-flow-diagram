// @flow

import React from 'react';
import style from 'styled-components';

import type { EntityModel } from '../entity/reducer';

/*
 * Presentational
 * ==================================== */

const EventStyle = style.div`
  background-color: #fff;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  width: 50px;
  height: 50px;
  border-radius: 77rem;
  border: 2px solid #888;
  justify-content: center;
  font-size: .5rem;

`;

export type EventProps = {
  model: EntityModel,
};
const Event = (props: EventProps) => (
  <EventStyle>
    {props.model.x}, {props.model.y}
  </EventStyle>
);

export default Event;

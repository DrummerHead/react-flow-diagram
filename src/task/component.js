// @flow

import React from 'react';
import style from 'styled-components';

import type { EntityModel } from '../entity/reducer';

/*
 * Presentational
 * ==================================== */

const TaskStyle = style.div`
  background-color: #fff;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  width: 120px;
  height: 75px;
  border-radius: .5rem;
  border: 2px solid #888;
`;

const Name = style.span`
  flex: 1 0;
  padding: 1px;
  font-size: .8rem;
`;

export type TaskProps = {
  model: EntityModel,
};
const Task = (props: TaskProps) => (
  <TaskStyle>
    <Name>
      {props.model.name} {props.model.x}, {props.model.y}
    </Name>
  </TaskStyle>
);

export default Task;

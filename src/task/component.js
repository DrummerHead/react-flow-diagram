// @flow

import React from 'react';
import style from 'styled-components';

import type { EntityModel, MetaEntityModel } from '../entity/reducer';

/*
 * Presentational
 * ==================================== */

const TaskStyle = style.div`
  background-color: #fff;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
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
  meta: MetaEntityModel,
};
const Task = ({ model, meta }: TaskProps) => (
  <TaskStyle width={meta.width} height={meta.height}>
    <Name>
      {model.name} {model.x}, {model.y}
    </Name>
  </TaskStyle>
);

export default Task;

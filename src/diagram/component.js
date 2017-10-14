// @flow

import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import style from 'styled-components';
import reducer from './reducer';
import Canvas from '../canvas/component';
import Entity from '../entity/component';

import type { EntityModel } from '../entity/reducer';

export const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

type DiagramProps = {
  model: Array<EntityModel>,
  config: Array<{ type: string, width: number, height: number }>,
};
const Diagram = (props: DiagramProps) => (
  <Provider store={store}>
    <Canvas model={props.model} config={props.config} />
  </Provider>
);

export default Diagram;

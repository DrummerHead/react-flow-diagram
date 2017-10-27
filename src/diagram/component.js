// @flow

import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import style from 'styled-components';
import reducer from './reducer';
import Canvas from '../canvas/component';
import Entity from '../entity/component';

import type { EntityState } from '../entity/reducer';
import type { ConfigState } from '../config/reducer';

export const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const Diagram = () => (
  <Provider store={store}>
    <Canvas />
  </Provider>
);

export default Diagram;

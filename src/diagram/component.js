// @flow
/* eslint-disable no-underscore-dangle */

import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reducer';
import Canvas from '../canvas/component';

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

// @flow
/* eslint-disable no-underscore-dangle */

import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reducer';
import Canvas from '../canvas/component';

import type { ComponentType, Element } from 'React';
import type { EntityType } from '../entity/reducer';
import type { DiagComponentProps } from 'react-flow-diagram';

export const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export type CustomEntities = {
  [type: EntityType]: {
    component: ComponentType<DiagComponentProps>,
    icon: {
      path: Element<*>,
      size: number,
    },
  },
};

type DiagramProps = { customEntities: CustomEntities };
const Diagram = (props: DiagramProps) => (
  <Provider store={store}>
    <Canvas customEntities={props.customEntities} />
  </Provider>
);

export default Diagram;

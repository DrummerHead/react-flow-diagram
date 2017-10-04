// @flow

import React from 'react';
import { render } from 'react-dom';
import styled, { injectGlobal } from 'styled-components';

import type { EntityModel } from '../../src/entity/reducer';

import { Diagram, store } from '../../src';

injectGlobal`
  * {
    box-sizing: border-box;
  }
  body {
    margin: 0;
  }
`;
const Main = styled.main`
  max-width: 62em;
  padding: 1em;
  margin: 0 auto;
  font-family: sans-serif;
  display: flex;
  flex-flow: column nowrap;
  min-height: 150vh;
`;

const magicEntities: Array<EntityModel> = [
  {
    id: 'QWxwaGE=',
    type: 'Task',
    x: 50,
    y: 150,
    name: 'Alpha',
    linksTo: ['QnJhdm8='],
  },
  {
    id: 'QnJhdm8=',
    type: 'Task',
    x: 150,
    y: 50,
    name: 'Bravo',
  },
  {
    id: 'Q2hhcmxpZQ==',
    type: 'Task',
    x: 150,
    y: 350,
    name: 'Charlie',
    linksTo: ['RGVsdGE=', 'RWNobw=='],
  },
  {
    id: 'RGVsdGE=',
    type: 'Task',
    x: 300,
    y: 150,
    name: 'Delta',
  },
  {
    id: 'RWNobw==',
    type: 'Task',
    x: 350,
    y: 300,
    name: 'Echo',
  },
  {
    id: 'GjklsSSgj',
    type: 'Event',
    x: 50,
    y: 250,
    name: 'Zulu',
  },
  {
    id: 'OjklscSgj',
    type: 'Event',
    x: 350,
    y: 50,
    name: 'Yankee',
  },
];

class Demo extends React.Component<{}> {
  render() {
    return (
      <Main>
        <h1>react-diagram Demo</h1>
        <Diagram model={magicEntities} />
      </Main>
    );
  }
}

/*
 * this is how you'd get the modified model back
store.subscribe(() => {
  const model = store.getState();
  console.log(model)
});
*/

render(<Demo />, document.querySelector('#demo'));

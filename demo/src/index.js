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
  min-height: 100vh;
`;

const magicEntities: Array<EntityModel> = [
  {
    id: 'QWxwaGE=',
    name: 'Alpha',
    x: 50,
    y: 50,
  },
  {
    id: 'QnJhdm8=',
    name: 'Bravo',
    x: 110,
    y: 90,
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

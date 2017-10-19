// @flow

import React from 'react';
import { render } from 'react-dom';
import styled, { injectGlobal } from 'styled-components';
import { Diagram, store } from '../../src';
import model from './model-example.js';
import config from './config-example.js';

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

class Demo extends React.Component<{}> {
  render() {
    return (
      <Main>
        <h1>react-flow-diagram Demo</h1>
        <Diagram model={model} config={config} />
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

// @flow

import React from 'react';
import { render } from 'react-dom';
import styled, { injectGlobal } from 'styled-components';
import { Diagram, store, setEntities, setConfig } from '../../src';
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

class Demo extends React.PureComponent<{}> {
  componentWillMount() {
    store.dispatch(setEntities(model));
    store.dispatch(setConfig(config));
  }
  render() {
    return (
      <Main>
        <h1>react-flow-diagram Demo</h1>
        <Diagram />
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

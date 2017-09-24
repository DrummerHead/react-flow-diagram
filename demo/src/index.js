// @flow

import React, { Component } from 'react';
import { render } from 'react-dom';
import styled, { injectGlobal } from 'styled-components';

import Diagram from '../../src';

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
`;

const Demo = () => (
  <Main>
    <h1>react-diagram Demo</h1>
    <Diagram />
  </Main>
);

render(<Demo />, document.querySelector('#demo'));

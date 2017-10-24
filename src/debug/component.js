// @flow

import React from 'react';
import style from 'styled-components';
import { connect } from 'react-redux';
import { undo, redo } from '../history/reducer';

const Panel = style.div`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 777;
`;
const Debug = props => (
  <Panel>
    <button onClick={props.undo}>UNDO</button>
    <button onClick={props.redo}>REDO</button>
  </Panel>
);

export default connect(null, { undo, redo })(Debug);

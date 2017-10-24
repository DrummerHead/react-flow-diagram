// @flow

import type { ConfigState } from '../../src/config/reducer';

const config: ConfigState = {
  entityTypes: {
    Task: {
      width: 120,
      height: 75,
    },
    Event: {
      width: 50,
      height: 50,
    },
  },
};

export default config;

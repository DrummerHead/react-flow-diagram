// @flow

import Task from './task/component';
import taskIcon from './task/icon';
import Event from './event/component';
import eventIcon from './event/icon';

import type { ConfigState } from '../../src/config/reducer';
import type { CustomEntities } from '../../src/diagram/component';

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

const customEntities: CustomEntities = {
  Task: {
    component: Task,
    icon: taskIcon,
  },
  Event: {
    component: Event,
    icon: eventIcon,
  },
};

export { config, customEntities };

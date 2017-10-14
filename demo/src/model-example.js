// @flow

import type { EntityModel } from '../../src/entity/reducer';

const model: Array<EntityModel> = [
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

export default model;

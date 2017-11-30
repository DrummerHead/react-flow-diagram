// @flow

import type { EntityState } from '../../src/entity/reducer';

// TODO: I could potentially have a situation where the model for a link only
// has a `target` property and the entity reducer figures out the proper values
// of `points` when SETting the diagram. In this way I'd had a mix of
// declarative in the inital model and then switch to explicit after load.

const model: EntityState = [
  {
    id: 'ja1lnjvx',
    type: 'Task',
    width: 120,
    height: 75,
    x: 127,
    y: 107.5,
    name: 'Gorilla',
    linksTo: [
      {
        target: 'ja1lnkqu',
        edited: false,
        label: 'Is friends with',
        points: [
          {
            x: 187,
            y: 145,
          },
          {
            x: 516,
            y: 145,
          },
          {
            x: 516,
            y: 199,
          },
        ],
      },
      {
        target: 'ja1lnq90',
        edited: true,
        label: 'Eats',
        points: [
          {
            x: 187,
            y: 182.5,
          },
          {
            x: 187,
            y: 234.5,
          },
          {
            x: 246,
            y: 234.5,
          },
          {
            x: 246,
            y: 316.5,
          },
        ],
      },
    ],
  },
  {
    id: 'ja1lnkqu',
    type: 'Event',
    width: 50,
    height: 50,
    x: 490,
    y: 199,
    name: 'Toucan',
    linksTo: [
      {
        target: 'ja1lnx2u',
        edited: false,
        points: [
          {
            x: 515,
            y: 224,
          },
          {
            x: 433,
            y: 224,
          },
          {
            x: 433,
            y: 253,
          },
          {
            x: 411,
            y: 253,
          },
        ],
      },
    ],
  },
  {
    id: 'ja1lnq90',
    type: 'Task',
    width: 120,
    height: 75,
    x: 187,
    y: 316.5,
    name: 'Zebra',
  },
  {
    id: 'ja1lnx2u',
    type: 'Task',
    width: 120,
    height: 75,
    x: 291,
    y: 218.5,
    name: 'Jiraffe',
  },
];

export default model;

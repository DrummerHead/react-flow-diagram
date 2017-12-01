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
    width: 125,
    height: 75,
    x: 50,
    y: 75,
    name: 'Gorilla',
    linksTo: [
      {
        target: 'ja1lnkqu',
        edited: false,
        label: 'Is friends with',
        points: [
          {
            x: 112.5,
            y: 112.5,
          },
          {
            x: 475,
            y: 112.5,
          },
          {
            x: 475,
            y: 150,
          },
        ],
      },
      {
        target: 'ja1lnq90',
        edited: true,
        label: 'Eats',
        points: [
          {
            x: 112.5,
            y: 150,
          },
          {
            x: 112.5,
            y: 234.5,
          },
          {
            x: 212.5,
            y: 234.5,
          },
          {
            x: 212.5,
            y: 325,
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
    x: 450,
    y: 150,
    name: 'Toucan',
    linksTo: [
      {
        target: 'ja1lnx2u',
        edited: false,
        points: [
          {
            x: 475,
            y: 175,
          },
          {
            x: 393.75,
            y: 175,
          },
          {
            x: 393.75,
            y: 212.5,
          },
          {
            x: 375,
            y: 212.5,
          },
        ],
      },
    ],
  },
  {
    id: 'ja1lnq90',
    type: 'Task',
    width: 125,
    height: 75,
    x: 150,
    y: 325,
    name: 'Zebra',
  },
  {
    id: 'ja1lnx2u',
    type: 'Task',
    width: 125,
    height: 75,
    x: 250,
    y: 175,
    name: 'Jiraffe',
  },
];

export default model;

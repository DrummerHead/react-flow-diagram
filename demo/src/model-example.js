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
        points: [
          {
            x: 187,
            y: 145,
          },
          {
            x: 317,
            y: 145,
          },
          {
            x: 317,
            y: 197,
          },
          {
            x: 422,
            y: 197,
          },
        ],
      },
      {
        target: 'ja1lnq90',
        points: [
          {
            x: 187,
            y: 145,
          },
          {
            x: 187,
            y: 234.5,
          },
          {
            x: 256,
            y: 234.5,
          },
          {
            x: 256,
            y: 286.5,
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
    x: 423,
    y: 172,
    name: 'Toucan',
    linksTo: [
      {
        target: 'ja1lnx2u',
        points: [
          {
            x: 448,
            y: 197,
          },
          {
            x: 448,
            y: 141,
          },
          {
            x: 408,
            y: 141,
          },
          {
            x: 408,
            y: 122.5,
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
    x: 196,
    y: 287.5,
    name: 'Zebra',
  },
  {
    id: 'ja1lnx2u',
    type: 'Task',
    width: 120,
    height: 75,
    x: 348,
    y: 47.5,
    name: 'Jiraffe',
  },
];

export default model;

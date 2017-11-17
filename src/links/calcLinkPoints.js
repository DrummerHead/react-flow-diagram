// @flow

import type { Point } from '../entity/reducer';

type Rect = {
  x: number,
  y: number,
  width: number,
  height: number,
};

// TODO: the bend when the elements are close to each other (vertically or
// horizontally) takes the center of each element as the distance to be divided
// by two. It should take the distance between the edges of each element to be
// divided by two.
//
// Imagine you have a wide element connecting to a slim element. The bend would
// be too close to the wide element in relationship to the slim element.
//
const calcLinkPoints = (from: ?Rect, to: ?Rect): Array<Point> => {
  if (from == null || to == null) {
    return [{ x: 0, y: 0 }, { x: 100, y: 100 }];
  }

  const fromMidX = from.x + from.width / 2;
  const fromMidY = from.y + from.height / 2;
  const toMidX = to.x + to.width / 2;
  const toMidY = to.y + to.height / 2;
  const firstPnt: Point = {
    x: fromMidX,
    y: fromMidY,
  };

  if (Math.abs(from.x - to.x) > Math.abs(from.y - to.y)) {
    // If horizontal distance is greater than vertical distance
    if (from.y + from.height > to.y && from.y < to.y + to.height) {
      // If From and To are too close in the Y axis
      const distanceX = (fromMidX + toMidX) / 2;
      const midPntAlpha: Point = {
        x: distanceX,
        y: fromMidY,
      };

      const midPntBeta: Point = {
        x: distanceX,
        y: toMidY,
      };

      const lastPnt: Point = {
        x: from.x > to.x ? to.x + to.width : to.x,
        y: toMidY,
      };

      return [firstPnt, midPntAlpha, midPntBeta, lastPnt];
    } else {
      const midPoint: Point = {
        x: toMidX,
        y: fromMidY,
      };

      const lastPnt: Point = {
        x: toMidX,
        y: from.y > to.y ? to.y + to.height : to.y,
      };

      return [firstPnt, midPoint, lastPnt];
    }
  } else {
    // If vertical distance is greater than horizontal distance
    // eslint-disable-next-line no-lonely-if
    if (from.x + from.width > to.x && from.x < to.x + to.width) {
      // If From and To are too close in the X axis
      const distanceY = (fromMidY + toMidY) / 2;
      const midPntAlpha: Point = {
        x: fromMidX,
        y: distanceY,
      };

      const midPntBeta: Point = {
        x: toMidX,
        y: distanceY,
      };

      const lastPnt: Point = {
        x: toMidX,
        y: from.y > to.y ? to.y + to.height : to.y,
      };

      return [firstPnt, midPntAlpha, midPntBeta, lastPnt];
    } else {
      const midPoint: Point = {
        x: fromMidX,
        y: toMidY,
      };

      const lastPnt: Point = {
        x: from.x > to.x ? to.x + to.width : to.x,
        y: toMidY,
      };

      return [firstPnt, midPoint, lastPnt];
    }
  }
};

export default calcLinkPoints;

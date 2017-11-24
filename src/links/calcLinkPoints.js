// @flow

import type { EntityModel, Point, Link } from '../entity/reducer';

type Rect = {|
  x: number,
  y: number,
  width: number,
  height: number,
|};

// TODO: the bend when the elements are close to each other (vertically or
// horizontally) takes the center of each element as the distance to be divided
// by two. It should take the distance between the edges of each element to be
// divided by two.
//
// Imagine you have a wide element connecting to a slim element. The bend would
// be too close to the wide element in relationship to the slim element.
//

// Calculates Points according to `from`, `to` and the main axis (`x` or `y`)
// This function does not take into account previous state of links, it assumes
// the user has never edited the link and expects a declarative arrow behaviour
//
const calcDefaultPointsAccordingToMainAxis = (
  mainAxis: 'x' | 'y',
  from: EntityModel,
  to: Rect | EntityModel,
  fromMid: Point,
  toMid: Point
): Array<Point> => {
  const crossAxis = mainAxis === 'x' ? 'y' : 'x';
  const mainDimension = mainAxis === 'x' ? 'width' : 'height';
  const crossDimension = mainAxis === 'x' ? 'height' : 'width';

  if (
    from[crossAxis] + from[crossDimension] > to[crossAxis] &&
    from[crossAxis] < to[crossAxis] + to[crossDimension]
  ) {
    // If From and To are too close in the crossAxis
    const distance = (fromMid[mainAxis] + toMid[mainAxis]) / 2;

    const midPntAlpha: Point = {
      [mainAxis]: distance,
      [crossAxis]: fromMid[crossAxis],
    };

    const midPntBeta: Point = {
      [mainAxis]: distance,
      [crossAxis]: toMid[crossAxis],
    };

    const lastPnt: Point = {
      [mainAxis]:
        from[mainAxis] > to[mainAxis]
          ? to[mainAxis] + to[mainDimension]
          : to[mainAxis],
      [crossAxis]: toMid[crossAxis],
    };

    return [fromMid, midPntAlpha, midPntBeta, lastPnt];
  } else {
    const midPoint: Point = {
      [mainAxis]: toMid[mainAxis],
      [crossAxis]: fromMid[crossAxis],
    };

    const lastPnt: Point = {
      [mainAxis]: toMid[mainAxis],
      [crossAxis]:
        from[crossAxis] > to[crossAxis]
          ? to[crossAxis] + to[crossDimension]
          : to[crossAxis],
    };

    return [fromMid, midPoint, lastPnt];
  }
};

// Takes four points
// First and second points represent the first line
// Third and fourth point represent second line
// If they intersect, returns point of intersection
// else it returns null
//
const linesIntersection = (
  p0: Point,
  p1: Point,
  p2: Point,
  p3: Point
): ?Point => {
  const s1x = p1.x - p0.x;
  const s1y = p1.y - p0.y;
  const s2x = p3.x - p2.x;
  const s2y = p3.y - p2.y;
  const s =
    (-s1y * (p0.x - p2.x) + s1x * (p0.y - p2.y)) / (-s2x * s1y + s1x * s2y);
  const t =
    (s2x * (p0.y - p2.y) - s2y * (p0.x - p2.x)) / (-s2x * s1y + s1x * s2y);
  return s >= 0 && s <= 1 && t >= 0 && t <= 1
    ? { x: p0.x + t * s1x, y: p0.y + t * s1y }
    : null;
};

// We have a Point A and an EntityModel (a box with x, y, width, height)
// We make a line J from A to the center of EntityModel (toMid)
// This function finds the intersection between line J and the perimeter of EntityModel
//
// Function takes Point and EntityModel
// Calculates intersection between line J and all sides of EntityModel
// Returns intersection, or `from` in case there is no intersection to any sides
//
const pointEntityIntersection = (from: Point, to: EntityModel): Point => {
  const toMid: Point = {
    x: to.x + to.width / 2,
    y: to.y + to.height / 2,
  };

  const upLeft: Point = {
    x: to.x,
    y: to.y,
  };
  const upRight: Point = {
    x: to.x + to.width,
    y: to.y,
  };
  const downRight: Point = {
    x: to.x + to.width,
    y: to.y + to.height,
  };
  const downLeft: Point = {
    x: to.x,
    y: to.y + to.height,
  };
  const interUp = linesIntersection(upLeft, upRight, from, toMid);
  const interRight = linesIntersection(upRight, downRight, from, toMid);
  const interDown = linesIntersection(downRight, downLeft, from, toMid);
  const interLeft = linesIntersection(downLeft, upLeft, from, toMid);
  return interUp || interRight || interDown || interLeft || from;
};

// Takes two contiguous Point and an EntityModel and returns two Point.
//
// The points are "inContact" and "wanderer".
// "inContact" is the point that is directly in contact to the entity.
// "wanderer" is the potentially orthogonally positioned point closest to the
// "inContact" point.
//
// And we need the actual entity for new values of inContact and wanderer.
// The function returns an array with two points, being the first one the new
// "inContact" and the second one the new "wanderer".
//
const newPointTwins = (
  inContact: Point,
  wanderer: Point,
  entity: EntityModel
): [Point, Point] => {
  if (inContact.x === wanderer.x) {
    //  ·
    //  |
    // ent
    //  |
    //  ·
    if (inContact.y > wanderer.y) {
      //  |
      // ent
      return [
        {
          x: entity.x + entity.width / 2,
          y: entity.y,
        },
        {
          x: entity.x + entity.width / 2,
          y: wanderer.y,
        },
      ];
    } else {
      // ent
      //  |
      return [
        {
          x: entity.x + entity.width / 2,
          y: entity.y + entity.height,
        },
        {
          x: entity.x + entity.width / 2,
          y: wanderer.y,
        },
      ];
    }
  }
  if (inContact.y === wanderer.y) {
    // · - ent - ·
    if (inContact.x > wanderer.x) {
      // - ent
      return [
        {
          x: entity.x,
          y: entity.y + entity.height / 2,
        },
        {
          x: wanderer.x,
          y: entity.y + entity.height / 2,
        },
      ];
    } else {
      // ent -
      return [
        {
          x: entity.x + entity.width,
          y: entity.y + entity.height / 2,
        },
        {
          x: wanderer.x,
          y: entity.y + entity.height / 2,
        },
      ];
    }
  }

  const nonOrthogonalInContact = pointEntityIntersection(wanderer, entity);

  return [nonOrthogonalInContact, wanderer];
};

// In the case Link has been edited, we have to take into account the previous
// state of the Link and return modified points only for the endpoints of the
// Link.
//
// Takes a from and to EntityModel and the actual Link connecting them
//
// Returns an Array<Point> representing the new Points of the Link
//
const calcPointsOfEdited = (
  from: EntityModel,
  to: EntityModel,
  link: ?Link
): Array<Point> => {
  if (link == null || link.points == null) {
    return [{ x: 0, y: 0 }, { x: 100, y: 100 }];
  }

  const points = link.points;

  const [inContactFrom, wandererFrom] = newPointTwins(
    points[0],
    points[1],
    from
  );
  const [inContactTo, wandererTo] = newPointTwins(
    points[points.length - 1],
    points[points.length - 2],
    to
  );

  if (points.length <= 1) {
    return [{ x: 0, y: 0 }, { x: 100, y: 100 }];
  } else if (points.length === 2) {
    const fromMid: Point = {
      x: from.x + from.width / 2,
      y: from.y + from.height / 2,
    };
    const fromMidToIntersection = pointEntityIntersection(fromMid, to);
    return [fromMid, fromMidToIntersection];
  } else if (points.length === 3) {
    if (inContactFrom.x === wandererFrom.x) {
      return [
        inContactFrom,
        { x: inContactFrom.x, y: inContactTo.y },
        inContactTo,
      ];
    } else if (inContactFrom.y === wandererFrom.y) {
      return [
        inContactFrom,
        { x: inContactTo.x, y: inContactFrom.y },
        inContactTo,
      ];
    } else {
      return [inContactFrom, points[1], inContactTo];
    }
  }

  return [
    inContactFrom,
    wandererFrom,
    ...points.slice(2, points.length - 2),
    wandererTo,
    inContactTo,
  ];
};

// Takes a from and to EntityModel and returns an Array<Point> that represents
// the points of the link connecting them
//
// We have two distinctive cases:
// When the link has been edited (the user interacted with the link) we need to
// take into account the previous state of links. The function
// calcPointsOfEdited will take care of this condition
//
// When the link has not been edited, we declaratively generate a new only
// taking into account the position and dimentions of from and to. The function
// calcDefaultPointsAccordingToMainAxis will take care of this
//
const calcLinkPoints = (
  from: ?EntityModel,
  to: ?(Rect | EntityModel)
): Array<Point> => {
  if (from == null || to == null) {
    return [{ x: 0, y: 0 }, { x: 100, y: 100 }];
  }

  if (to.id) {
    const toEnt: EntityModel = to;
    if (
      from.linksTo &&
      from.linksTo.some(
        link => link.edited === true && link.target === toEnt.id
      )
    ) {
      const link = from.linksTo.find(lnk => lnk.target === toEnt.id);
      return calcPointsOfEdited(from, toEnt, link);
    }
  }

  const fromMid: Point = {
    x: from.x + from.width / 2,
    y: from.y + from.height / 2,
  };
  const toMid: Point = {
    x: to.x + to.width / 2,
    y: to.y + to.height / 2,
  };

  if (Math.abs(fromMid.x - toMid.x) > Math.abs(fromMid.y - toMid.y)) {
    // If horizontal distance is greater than vertical distance
    return calcDefaultPointsAccordingToMainAxis('x', from, to, fromMid, toMid);
  } else {
    return calcDefaultPointsAccordingToMainAxis('y', from, to, fromMid, toMid);
  }
};

export default calcLinkPoints;

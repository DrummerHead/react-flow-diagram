// @flow

import React from 'react';
import style from 'styled-components';
import { connect } from 'react-redux';

import type {
  EntityModel,
  MetaEntityModel,
  EntityState,
  Id,
} from '../entity/reducer';
import type { State } from '../diagram/reducer';

type MergedModel = EntityModel & MetaEntityModel;
type Point = {
  x: number,
  y: number,
};

const calculatePoints = (from: MergedModel, to: MergedModel): string => {
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

      return `${firstPnt.x},${firstPnt.y} ${midPntAlpha.x},${midPntAlpha.y} ${midPntBeta.x},${midPntBeta.y} ${lastPnt.x},${lastPnt.y}`;
    } else {
      const midPoint: Point = {
        x: toMidX,
        y: fromMidY,
      };

      const lastPnt: Point = {
        x: toMidX,
        y: from.y > to.y ? to.y + to.height : to.y,
      };

      return `${firstPnt.x},${firstPnt.y} ${midPoint.x},${midPoint.y} ${lastPnt.x},${lastPnt.y}`;
    }
  } else {
    // If vertical distance is greater than horizontal distance
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

      return `${firstPnt.x},${firstPnt.y} ${midPntAlpha.x},${midPntAlpha.y} ${midPntBeta.x},${midPntBeta.y} ${lastPnt.x},${lastPnt.y}`;
    } else {
      const midPoint: Point = {
        x: fromMidX,
        y: toMidY,
      };

      const lastPnt: Point = {
        x: from.x > to.x ? to.x + to.width : to.x,
        y: toMidY,
      };

      return `${firstPnt.x},${firstPnt.y} ${midPoint.x},${midPoint.y} ${lastPnt.x},${lastPnt.y}`;
    }
  }
};

/*
 * Presentational
 * ==================================== */

const Line = style.polyline`
  fill: none;
  stroke-width: .1em;
  stroke: black;
  stroke-linejoin: round;
  marker-end: url("#arrow-end");
`;

type LinkProps = {
  from: MergedModel,
  to: MergedModel,
};
const Link = ({ from, to }: LinkProps) => (
  <Line points={calculatePoints(from, to)} />
);

/*
 * Container
 * ==================================== */

type LinksContainerProps = {
  fromModel: MergedModel,
  toModels: Array<MergedModel>,
};
const LinksContainer = (props: LinksContainerProps) => (
  <g>
    {props.toModels.map(toModel => (
      <Link key={toModel.id} from={props.fromModel} to={toModel} />
    ))}
  </g>
);

const getModelAndMeta = (id: Id, state: State): MergedModel => ({
  ...state.metaEntity.find(entity => entity.id === id),
  ...state.entity.find(entity => entity.id === id),
});
const mapStateToProps = (state: State, ownProps) => ({
  fromModel: getModelAndMeta(ownProps.model.id, state),
  toModels: (ownProps.model.linksTo || ['nil']).map(entityId =>
    getModelAndMeta(entityId, state)
  ),
});

export default connect(mapStateToProps, {})(LinksContainer);

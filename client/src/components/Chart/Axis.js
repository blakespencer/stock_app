import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { dimensionsPropsType } from './utils';
import { useChartDimensions } from './Chart';

const axisComponentsByDimension = {
  x: AxisHorizontal,
  y: AxisVertical,
};

const Axis = ({ dimension, ...props }) => {
  const dimensions = useChartDimensions();
  const Component = axisComponentsByDimension[dimension];
  if (!Component) return null;

  return <Component {...props} dimensions={dimensions} />;
};

Axis.propTypes = {
  dimension: PropTypes.oneOf(['x', 'y']),
  dimensions: dimensionsPropsType,
  scale: PropTypes.func,
  label: PropTypes.string,
  formatTick: PropTypes.func,
  right: PropTypes.bool,
};

const formatNumber = d3.format(',');
Axis.defaultProps = {
  dimension: 'x',
  scale: null,
  formatTick: formatNumber,
};

export default Axis;

function AxisHorizontal({ dimensions, label, formatTick, scale, ...props }) {
  const numberOfTicks =
    dimensions.boundedWidth < 600
      ? dimensions.boundedWidth / 100
      : dimensions.boundedWidth / 250;

  const ticks = scale.ticks(numberOfTicks);
  return (
    <g
      className="Axis AxisHorizontal"
      transform={`translate(0, ${dimensions.boundedHeight})`}
      {...props}
    >
      <line className="Axis__line" x2={dimensions.boundedWidth} />
      {ticks.map((tick, i) => (
        <text
          key={tick}
          className="Axis__tick"
          transform={`translate(${scale(tick)}, 25)`}
        >
          {formatTick(tick)}
        </text>
      ))}
      {label && (
        <text
          className="Axis__label"
          transform={`translate(${dimensions.boundedWidth / 2}, 60)`}
        >
          {label}
        </text>
      )}
    </g>
  );
}

function AxisVertical({
  dimensions,
  label,
  formatTick,
  scale,
  right,
  ...props
}) {
  const numberOfTicks = dimensions.boundedHeight / 70;
  const ticks = scale.ticks(numberOfTicks);
  const position = right ? dimensions.boundedWidth : 0;

  return (
    <g className="Axis AxisVertical" {...props}>
      <line
        className="Axis__line"
        y2={dimensions.boundedHeight}
        x1={position}
        x2={position}
      />
      {ticks.map((tick, i) => (
        <text
          className={`Axis__tick ${right ? 'Axis__tick-right' : ''}`}
          transform={`translate(${right ? position + 8 : -16}, ${scale(tick)})`}
        >
          {formatTick(tick)}
        </text>
      ))}
      {label && (
        <text
          className="Axis__label"
          style={{
            transform: `translate(${right ? position + 60 : -60}px, ${
              dimensions.boundedHeight / 2
            }px) rotate(-90deg)`,
          }}
        >
          {label}
        </text>
      )}
    </g>
  );
}

import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

const ToolBox = ({
  closestValueX,
  closestValueY,
  xScale,
  yScale,
  dimensions,
  opacity,
}) => {
  const formatDate = d3.timeFormat('%B %A %-d, %Y');

  return (
    <div
      id="tooltip"
      className="Tooltip"
      style={{
        transform: `translate(calc(${xScale(
          closestValueX
        )}px + 0px), calc(${yScale(closestValueY)}px + 100px))`,
        opacity,
      }}
    >
      <div className="Tooltip-date">
        <span>{formatDate(closestValueX)}</span>
      </div>
      <div className="Tooltip-price">
        Price: <span>{closestValueY}</span>
      </div>
    </div>
  );
};

ToolBox.propTypes = {
  closestValueX: PropTypes.object,
  closestValueY: PropTypes.number,
  xScale: PropTypes.func,
  yScale: PropTypes.func,
  dimensions: PropTypes.object,
};

export default ToolBox;

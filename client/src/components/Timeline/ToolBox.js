import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { dimensionsPropsType } from '../Chart/utils';
import { calcPosition } from './utils';

const ToolBox = ({
  closestValueX,
  closestValueY,
  xScale,
  yScale,
  dimensions,
  opacity,
  widthAccessor,
}) => {
  const ref = useRef();
  let { marginLeft, marginTop } = dimensions;
  const formatDate = d3.timeFormat('%B %A %-d, %Y');
  let x = xScale(closestValueX) + marginLeft;
  let y = yScale(closestValueY) + marginTop;
  const coordinates = [x, y];

  if (ref.current) {
    calcPosition(ref, dimensions, coordinates, widthAccessor);
  }
  return (
    <div
      id="tooltip"
      className="Tooltip"
      style={{
        // transformOrigin: '0% 0%',
        transform: `translate(${coordinates[0]}px, calc(${coordinates[1]}px + 2em))`,
        opacity,
      }}
      ref={ref}
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
  dimensions: dimensionsPropsType,
};

export default ToolBox;

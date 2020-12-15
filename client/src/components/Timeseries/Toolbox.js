import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { dimensionsPropsType } from '../Chart/utils';
import { calcPosition } from './utils';
import { Tooltip, TooltipDate } from './styles';

const ToolBox = ({
  closestValueX,
  closestValueY,
  xScale,
  yScale,
  dimensions,
  opacity,
}) => {
  const ref = useRef();
  let { marginLeft, marginTop } = dimensions;
  const formatDate = d3.timeFormat('%B %A %-d, %Y');
  let x = xScale(closestValueX) + marginLeft;
  let y = yScale(closestValueY) + marginTop;
  const coordinates = [x, y];

  if (ref.current) {
    calcPosition(ref, dimensions, coordinates);
  }
  return (
    <Tooltip
      style={{
        transform: `translate(${coordinates[0]}px, calc(${coordinates[1]}px))`,
        opacity,
      }}
      ref={ref}
    >
      <TooltipDate>
        <span>{formatDate(closestValueX)}</span>
      </TooltipDate>
      <div>
        Price: <span>{closestValueY}</span>
      </div>
    </Tooltip>
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

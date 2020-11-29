import React from 'react';
import PropTypes from 'prop-types';
import { useChartDimensions } from './Chart';

const ListeningRect = ({ handleMouseMove, handleMouseLeave }) => {
  const dimensions = useChartDimensions();
  return (
    <rect
      className="Listening-Rect"
      style={{
        width: `${dimensions.boundedWidth}`,
        height: `${dimensions.boundedHeight}`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    ></rect>
  );
};

ListeningRect.propTypes = {
  handleMouseMove: PropTypes.func,
  handleMouseLeave: PropTypes.func,
};

export default ListeningRect;

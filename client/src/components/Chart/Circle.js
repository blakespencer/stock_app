import React from 'react';
import PropTypes from 'prop-types';

const Circle = ({ x, y, opacity }) => (
  <circle
    className="Circle"
    style={{
      r: 4,
      stroke: '#af9358',
      fill: 'white',
      strokeWidth: 2,
      opacity,
    }}
    cx={x}
    cy={y}
  />
);

Circle.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  opacity: PropTypes.number,
};

Circle.defaultProps = {
  opacity: 0,
};

export default Circle;

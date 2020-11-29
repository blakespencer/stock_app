import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { dimensionsPropsType } from './utils';
import { useChartDimensions } from './Chart';

const Legend = ({ dimension, values, ...props }) => {
  return (
    <>
      {values.map((v, i) => (
        <g
          style={{
            position: 'absolute',
            transform: `translate(100px, ${25 * i + 5}px)`,
          }}
        >
          <text
            style={{
              transform: 'translate(15px, 9px)',
              fill: '#ddd',
              strokeWidth: 10,
            }}
            fontSize="2em"
          >{`${v['key']} ${v['value']}`}</text>
        </g>
      ))}
    </>
  );
};

Legend.propTypes = {
  dimensions: dimensionsPropsType,
  values: PropTypes.object,
};

const formatNumber = d3.format(',');
Legend.defaultProps = {
  dimension: 'x',
  scale: null,
  formatTick: formatNumber,
};

export default Legend;

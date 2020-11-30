import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { dimensionsPropsType } from './utils';
import { useChartDimensions } from './Chart';

const defaultFontSize = 16;

const Legend = ({ style, values, textStyle, ...props }) => {
  const dimensions = useChartDimensions();
  return (
    <g style={{ transform: `translate(10px, 10px)`, ...style }} {...props}>
      {values.map((v, i) => (
        <g
          style={{
            transform: `translate(0px, ${
              textStyle.fontSize * i || defaultFontSize * i
            }px)`,
          }}
        >
          <text
            style={{ fontSize: defaultFontSize, ...textStyle }}
          >{`${v['key']} ${v['value']}`}</text>
        </g>
      ))}
    </g>
  );
};

Legend.propTypes = {
  values: PropTypes.array,
  textStyle: PropTypes.object,
};

Legend.defaultProps = {
  textStyle: {
    fontSize: defaultFontSize,
  },
};

export default Legend;

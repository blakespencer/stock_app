import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { dimensionsPropsType } from './utils';
import { useChartDimensions } from './Chart';

const defaultFontSize = 16;

const Legend = ({ style, values, textStyle, ...props }) => {
  return (
    <g style={{ transform: `translate(10px, 10px)`, ...style }} {...props}>
      <rect
        style={{
          width: `${d3.max(values, (d) => {
            const charPix = 9.5;
            const basePix = d['key'].length;
            if (typeof d['value'] === 'number')
              return (d['value'].toString().length + basePix) * charPix;
            return (d['value'].length + basePix) * charPix;
          })}px`,
          height: `${values.length * 16.7}px`,
          transform: 'translate(-4px,-16px)',
          fill: 'rgba(255, 255, 255, 0.7)',
          rx: '5',
        }}
      ></rect>
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

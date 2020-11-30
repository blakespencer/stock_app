import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { accessorPropsType, callAccessor } from './utils';

const Bars = ({
  data,
  keyAccessor,
  xAccessor,
  yAccessor,
  widthAccessor,
  heightAccessor,
  handleBarHover,
  colorAccessor,
  ...props
}) => {
  return (
    <React.Fragment>
      {data.map((d, i) => {
        return (
          <rect
            {...props}
            className="Bars__rect"
            key={keyAccessor(d, i)}
            x={
              callAccessor(xAccessor, d, i) -
              callAccessor(widthAccessor, d, i) / 2
            }
            y={callAccessor(yAccessor, d, i)}
            width={d3.max([callAccessor(widthAccessor, d, i), 1])}
            height={d3.max([callAccessor(heightAccessor, d, i), 0])}
            style={{
              fill: callAccessor(colorAccessor(d, i)),
            }}
          />
        );
      })}
    </React.Fragment>
  );
};

Bars.propTypes = {
  data: PropTypes.array,
  keyAccessor: accessorPropsType,
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  widthAccessor: accessorPropsType,
  heightAccessor: accessorPropsType,
  colorAccessor: accessorPropsType,
};

export default Bars;

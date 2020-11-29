import React from 'react';
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
  ...props
}) => (
  <React.Fragment>
    {data.map((d, i) => {
      const color =
        i === 0 ? 'grey' : data[i - 1].close > d.close ? 'BDE7BD' : 'FFB6B3';

      return (
        <rect
          {...props}
          className="Bars__rect"
          key={keyAccessor(d, i)}
          x={callAccessor(xAccessor, d, i) - 1}
          y={callAccessor(yAccessor, d, i)}
          width={d3.max([callAccessor(widthAccessor, d, i), 1])}
          height={d3.max([callAccessor(heightAccessor, d, i), 0])}
          style={{
            fill: color,
          }}
          onMouseOver={handleBarHover}
          data-volume={data[i].volume}
        />
      );
    })}
  </React.Fragment>
);

Bars.propTypes = {
  data: PropTypes.array,
  keyAccessor: accessorPropsType,
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  widthAccessor: accessorPropsType,
  heightAccessor: accessorPropsType,
};

Bars.defaultProps = {};

export default Bars;

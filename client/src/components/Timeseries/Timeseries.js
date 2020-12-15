import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Axis, Chart, Line } from '../Chart';
import { useChartDimensions } from '../Chart/utils';
import { ChartArea } from './styles';
import { genXScale, genYScale, formatDate } from './utils';

export default function Timeseries({ data, xAccessor, yAccessor }) {
  const [ref, dimensions] = useChartDimensions({
    marginLeft: 30,
    marginRight: 75,
  });

  const xScale = useMemo(() => genXScale(data, xAccessor, dimensions), [
    data,
    xAccessor,
    dimensions,
  ]);

  const yScale = useMemo(() => genYScale(data, yAccessor, dimensions), [
    data,
    yAccessor,
    dimensions,
  ]);

  const xAccessorScaled = (d) => xScale(xAccessor(d));
  const yAccessorScaled = (d) => yScale(yAccessor(d));

  return (
    <ChartArea ref={ref}>
      <Chart dimensions={dimensions}>
        <Line
          data={data}
          xAccessor={xAccessorScaled}
          yAccessor={yAccessorScaled}
          style={{
            stroke: 'rgba(153, 128, 250, 0.8)',
          }}
        />
        <Axis dimension="x" scale={xScale} formatTick={formatDate} />
        <Axis dimension="y" right scale={yScale} label="Price" />
      </Chart>
    </ChartArea>
  );
}

Timeseries.propTypes = {
  data: PropTypes.object,
  xAccessor: PropTypes.func,
  yAccessor: PropTypes.func,
};

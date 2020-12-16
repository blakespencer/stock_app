import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Axis,
  Chart,
  Line,
  Gradient,
  Legend,
  ListeningRect,
  Circle,
  Bars,
} from '../Chart';
import { useChartDimensions, useUniqueId } from '../Chart/utils';
import { ChartArea } from './styles';
import ToolBox from './Toolbox';
import {
  genXScale,
  genYScale,
  formatDate,
  gradientColors,
  formatDataLegend,
  handleMouseLeave,
  handleMouseMove,
  genYBarScale,
} from './utils';

export default function Timeseries({
  data,
  xAccessor,
  yAccessor,
  barAccessor,
}) {
  const [ref, dimensions] = useChartDimensions({
    marginLeft: 30,
    marginRight: 75,
  });

  const [mouseValues, setMouseValues] = useState({
    opacity: 0,
    closestValues: [],
    legendValues: formatDataLegend(data[0]),
  });

  const { opacity, closestValues, legendValues } = mouseValues;

  const xScale = useMemo(() => genXScale(data, xAccessor, dimensions), [
    data,
    xAccessor,
    dimensions,
  ]);
  const buffer = 0.2;
  const yScale = useMemo(() => genYScale(data, yAccessor, dimensions, buffer), [
    data,
    yAccessor,
    dimensions,
  ]);

  const xAccessorScaled = (d) => xScale(xAccessor(d));
  const yAccessorScaled = (d) => yScale(yAccessor(d));
  const y0AccessorScaled = yScale(yScale.domain()[0]);

  const yBarScale = genYBarScale(data, barAccessor, dimensions, buffer);
  const yBarAccessorScaled = (d) =>
    yBarScale(barAccessor(d)) + dimensions.boundedHeight * (1 - buffer);
  const xBarAccessorScaled = (d) => xAccessorScaled(d);
  const heightAccessorScaled = (d) =>
    dimensions.boundedHeight * buffer - yBarScale(barAccessor(d));
  const colorAccessor = (d, i) =>
    i === 0
      ? 'rgba(255, 255, 255, 0.6)'
      : yAccessor(d) > yAccessor(data[i - 1])
      ? '#BDE7BD'
      : '#FFB6B3';

  const gradientId = useUniqueId('Timeline-gradient');
  const barPadding = 7;
  const barWidth =
    Math.round(dimensions.boundedWidth / data.length) - barPadding;

  return (
    <>
      <ToolBox
        closestValueX={closestValues[0]}
        closestValueY={closestValues[1]}
        xScale={xScale}
        yScale={yScale}
        dimensions={dimensions}
        opacity={opacity}
      />
      <ChartArea ref={ref}>
        <Chart dimensions={dimensions}>
          <defs>
            <Gradient
              id={gradientId}
              colors={gradientColors}
              x2="0"
              y2="100%"
            />
          </defs>
          <Bars
            data={data}
            xAccessor={xBarAccessorScaled}
            // yAccessor={clicked ? y0AccessorScaled : yBarAccessorScaled}
            yAccessor={yBarAccessorScaled}
            widthAccessor={(d) => barWidth}
            // heightAccessor={clicked ? () => 0 : heightAccessorScaled}
            heightAccessor={heightAccessorScaled}
            keyAccessor={(d, i) => i}
            colorAccessor={colorAccessor}
          />
          <Line
            type="area"
            data={data}
            xAccessor={xAccessorScaled}
            yAccessor={yAccessorScaled}
            y0Accessor={y0AccessorScaled}
            style={{ fill: `url(#${gradientId})` }}
          />
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
          <Legend
            values={legendValues}
            textStyle={{
              fill: 'rgba(0, 0, 0, 0.4)',
            }}
          />
          <Circle
            x={xScale(closestValues[0])}
            y={yScale(closestValues[1])}
            opacity={opacity}
          />
          <ListeningRect
            handleMouseMove={(evt) =>
              handleMouseMove(
                evt,
                data,
                xScale,
                xAccessor,
                yAccessor,
                mouseValues,
                setMouseValues
              )
            }
            handleMouseLeave={() =>
              handleMouseLeave(mouseValues, setMouseValues)
            }
          />
        </Chart>
      </ChartArea>
    </>
  );
}

Timeseries.propTypes = {
  data: PropTypes.object,
  xAccessor: PropTypes.func,
  yAccessor: PropTypes.func,
};

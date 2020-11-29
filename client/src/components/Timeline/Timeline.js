import React, { useState } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import {
  Axis,
  Chart,
  Gradient,
  Line,
  ListeningRect,
  Circle,
  Bars,
  Legend,
} from '../Chart';
import ToolBox from './ToolBox';
import ReactTextTransition, { presets } from 'react-text-transition';

import {
  useChartDimensions,
  accessorPropsType,
  useUniqueId,
} from '../Chart/utils';
import './Timeline.css';
import { formatDataLegend } from './utils';

const formatDate = d3.timeFormat('%-b %-d');
const gradientColors = ['rgb(226, 222, 243)', '#f8f9fa'];

const Timeline = ({ data, xAccessor, yAccessor, barAccessor, label }) => {
  const [values, setValues] = useState(formatDataLegend(data[0]));
  const [opacity, setOpacity] = useState(0);
  const [closestValues, setClosestValues] = useState([new Date(), 0]);
  const [volume, setVolume] = useState(1);
  const [ref, dimensions] = useChartDimensions();
  const gradientId = useUniqueId('Timeline-gradient');
  const xScale = d3
    .scaleTime()
    .domain(d3.extent(data, xAccessor))
    .range([0, dimensions.boundedWidth]);

  const yMin = d3.min(data, yAccessor);
  const yMax = d3.max(data, yAccessor);
  const buffer = 0.2;
  const yBuffer = (yMax - yMin) * buffer;

  const yScale = d3
    .scaleLinear()
    // .domain(d3.extent(data, yAccessor))
    .domain([yMin - yBuffer, yMax])
    .range([dimensions.boundedHeight, 0])
    .nice();

  const xAccessorScaled = (d) => xScale(xAccessor(d));
  const yAccessorScaled = (d) => yScale(yAccessor(d));
  const y0AccessorScaled = yScale(yScale.domain()[0]);

  const handleMouseMove = (evt) => {
    const mousePosition = d3.pointer(evt);
    const hoveredDate = xScale.invert(mousePosition[0]);
    const getDistanceFromHoveredDate = (d) =>
      Math.abs(xAccessor(d) - hoveredDate);

    const closestIndex = d3.scan(
      data,
      (a, b) => getDistanceFromHoveredDate(a) - getDistanceFromHoveredDate(b)
    );

    const closestDataPoint = data[closestIndex];
    const closestXValue = xAccessor(closestDataPoint);
    const closestYValue = yAccessor(closestDataPoint);

    setClosestValues([closestXValue, closestYValue]);
    setOpacity(1);
    setVolume(data[closestIndex]['volume']);
    setValues(formatDataLegend(data[closestIndex]));
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  const yBarScale = d3
    .scaleLinear()
    .domain(d3.extent(data, barAccessor))
    .range([dimensions.boundedHeight * buffer, 0])
    .nice();
  const yBarAccessorScaled = (d) =>
    yBarScale(barAccessor(d)) + dimensions.boundedHeight * (1 - buffer);
  const barPadding = 10;
  const barWidth =
    Math.round(dimensions.boundedWidth / data.length) - barPadding;
  const widthAccessorScaled = (d) => barWidth;
  const heightAccessorScaled = (d) =>
    dimensions.boundedHeight * buffer - yBarScale(barAccessor(d));
  const colorAccessor = (d, i) => {
    return i === data.length - 1
      ? 'rgba(255, 255, 255, 0.6)'
      : data[i + 1].close > d.close
      ? 'BDE7BD'
      : 'FFB6B3';
  };

  const keyAccessor = (d, i) => i;

  const handleBarHover = (e) => {
    // console.log(e.target.dataset.volume);
    setVolume(e.target.dataset.volume);
  };
  return (
    <div className="Timeline" ref={ref}>
      <Header text={`${label}`} className="big" inline noOverflow />
      {/* <h1>{volume}</h1>  */}
      <Legend dimensions={dimensions} values={values} />
      <ToolBox
        xScale={xScale}
        yScale={yScale}
        dimensions={dimensions}
        opacity={opacity}
        closestValueX={closestValues[0]}
        closestValueY={closestValues[1]}
      />
      <Chart dimensions={dimensions}>
        <defs>
          <Gradient id={gradientId} colors={gradientColors} x2="0" y2="100%" />
        </defs>
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
        />
        <Bars
          data={data}
          xAccessor={xAccessorScaled}
          yAccessor={yBarAccessorScaled}
          widthAccessor={widthAccessorScaled}
          heightAccessor={heightAccessorScaled}
          keyAccessor={keyAccessor}
          handleBarHover={handleBarHover}
          colorAccessor={colorAccessor}
        />
        <Axis dimension="x" scale={xScale} formatTick={formatDate} />
        <Axis dimension="y" scale={yScale} label="Price" />
        <ListeningRect
          handleMouseMove={handleMouseMove}
          handleMouseLeave={handleMouseLeave}
        />
        <Circle
          x={xScale(closestValues[0])}
          y={yScale(closestValues[1])}
          opacity={opacity}
        />
      </Chart>
    </div>
  );
};

Timeline.propTypes = {
  data: PropTypes.array,
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  barAccessor: accessorPropsType,
  label: PropTypes.string,
};

Timeline.defaultProps = {
  xAccessor: (d) => d.x,
  yAccessor: (d) => d.y,
};

function Header({ ...props }) {
  return (
    // <div style={{ margin: '5px' }}>
    <div>
      <span>Ticker: </span> <ReactTextTransition {...props} />
    </div>
  );
}

export default Timeline;

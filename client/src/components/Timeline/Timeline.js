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
import Select from 'react-select';

import {
  useChartDimensions,
  accessorPropsType,
  useUniqueId,
} from '../Chart/utils';
import './Timeline.css';
import { formatDataLegend, movingAverage, customStyles } from './utils';

const formatDate = d3.timeFormat('%-b %-d');
const gradientColors = ['rgba(226, 222, 243, 1)', 'rgba(226, 222, 243, 0.2)'];

const Timeline = ({ data, xAccessor, yAccessor, barAccessor, label }) => {
  const [opacity, setOpacity] = useState(0);
  const [values, setValues] = useState(formatDataLegend(data[0]));
  const [closestValues, setClosestValues] = useState([new Date(), 0]);
  const [numberOfPricePoints, setNumberOfPricePoints] = useState({
    label: 'Select Moving Average Points',
    value: null,
  });
  const [clicked, setClicked] = useState(false);
  const [ref, dimensions] = useChartDimensions();
  const gradientId = useUniqueId('Timeline-gradient');

  const handleClick = () => {
    setClicked(!clicked);
  };

  const xScale = d3
    .scaleTime()
    .domain(
      data.map((d, i) => {
        return xAccessor(data[data.length - 1 - i]);
      })
    )
    .range(
      d3.range(
        0,
        dimensions.boundedWidth + 0.5,
        dimensions.boundedWidth / (data.length - 1)
      )
    );

  const yMin = d3.min(data, yAccessor);
  const yMax = d3.max(data, yAccessor);
  const buffer = 0.2;
  const yBuffer = (yMax - yMin) * buffer;

  const yScale = d3
    .scaleLinear()
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
  const barPadding = 7;
  const barWidth =
    Math.round(dimensions.boundedWidth / data.length) - barPadding;
  const widthAccessorScaled = (d) => barWidth;
  const xBarAccessorScaled = (d) => xAccessorScaled(d);
  const heightAccessorScaled = (d) =>
    dimensions.boundedHeight * buffer - yBarScale(barAccessor(d));
  const colorAccessor = (d, i) =>
    i === data.length - 1
      ? 'rgba(255, 255, 255, 0.6)'
      : d.close > data[i + 1].close
      ? 'BDE7BD'
      : 'FFB6B3';

  const keyAccessor = (d, i) => i;
  const handleChange = (evt) => setNumberOfPricePoints(evt);
  return (
    <div className="Timeline" ref={ref}>
      <div className="Timeline-header">
        <Header text={`${label}`} className="big" inline noOverflow />
        <SelectNumberOfPricePoints
          defaultValue={numberOfPricePoints}
          onChange={handleChange}
        />
        <button onClick={handleClick}>Percentage Change</button>
      </div>
      <ToolBox
        closestValueX={closestValues[0]}
        closestValueY={closestValues[1]}
        xScale={xScale}
        yScale={yScale}
        dimensions={dimensions}
        opacity={opacity}
      />
      <Chart dimensions={dimensions}>
        <defs>
          <Gradient id={gradientId} colors={gradientColors} x2="0" y2="100%" />
        </defs>
        <line
          className="Axis__line"
          y1={yScale(yAccessor(data[data.length - 1]))}
          y2={yScale(yAccessor(data[data.length - 1]))}
          x1={xScale(d3.min(data, xAccessor))}
          x2={
            clicked
              ? xScale(d3.min(data, xAccessor))
              : xScale(d3.max(data, xAccessor))
          }
          strokeDasharray="4"
          style={{
            transition: 'all 0.3s ease-out',
          }}
          strokeDashoffset={xScale(d3.max(data, xAccessor))}
        />
        <Bars
          data={data}
          xAccessor={xBarAccessorScaled}
          yAccessor={clicked ? y0AccessorScaled : yBarAccessorScaled}
          widthAccessor={widthAccessorScaled}
          heightAccessor={clicked ? () => 0 : heightAccessorScaled}
          keyAccessor={keyAccessor}
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
        {numberOfPricePoints.value && (
          <Line
            data={movingAverage(data, numberOfPricePoints.value)}
            xAccessor={xAccessorScaled}
            yAccessor={yAccessorScaled}
            // style={{ stroke: 'rgba(153, 128, 250, 1)', strokeWidth: 2 }
            style={{ stroke: 'FFDC97', strokeWidth: 2 }}
          />
        )}
        <Axis dimension="x" scale={xScale} formatTick={formatDate} />
        <Axis dimension="y" scale={yScale} label="Price" />
        <Legend
          values={values}
          textStyle={{
            fill: 'rgba(0, 0, 0, 0.4)',
          }}
        />
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
    <div>
      <span>Ticker: </span> <ReactTextTransition {...props} />
    </div>
  );
}

function SelectNumberOfPricePoints({ ...props }) {
  return (
    <Select
      {...props}
      className="Timeline-select"
      options={[
        { label: 'Select Moving Average Points', value: null },
        { label: '15', value: 15 },
        { label: '45', value: 45 },
      ]}
      isSearchable={false}
      minMenuWidth={1000}
      styles={customStyles}
    />
  );
}

export default Timeline;

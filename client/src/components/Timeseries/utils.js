import * as d3 from 'd3';

export const formatDate = d3.timeFormat('%-b %-d');

export function genXScale(data, xAccessor, dimensions) {
  return d3
    .scaleTime()
    .domain(data.map(xAccessor))
    .range(
      d3.range(
        0,
        dimensions.boundedWidth + 0.5,
        dimensions.boundedWidth / (data.length - 1)
      )
    );
}

export function genYScale(data, yAccessor, dimensions, buffer) {
  const yMin = d3.min(data, yAccessor);
  const yMax = d3.max(data, yAccessor);
  const yBuffer = (yMax - yMin) * buffer;

  return d3
    .scaleLinear()
    .domain([yMin - yBuffer, yMax])
    .range([dimensions.boundedHeight, 0])
    .nice();
}

export function genYBarScale(data, barAccessor, dimensions, buffer) {
  return d3
    .scaleLinear()
    .domain(d3.extent(data, barAccessor))
    .range([dimensions.boundedHeight * buffer, 0])
    .nice();
}

export const gradientColors = [
  'rgba(226, 222, 243, 1)',
  'rgba(226, 222, 243, 0.2)',
];

export const formatDataLegend = (data) => {
  if (!data) return [];
  const output = [
    { key: 'Date', value: formatDate(data['t']) },
    { key: 'Close', value: data['c'] },
    { key: 'High', value: data['h'] },
    { key: 'Low', value: data['l'] },
    { key: 'Open', value: data['o'] },
    { key: 'Volume', value: data['v'] },
  ];
  return output;
};

export const handleMouseMove = (
  evt,
  data,
  xScale,
  xAccessor,
  yAccessor,
  mouseValues,
  setMouseValues
) => {
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

  setMouseValues({
    ...mouseValues,
    closestValues: [closestXValue, closestYValue],
    opacity: 1,
    legendValues: formatDataLegend(data[closestIndex]),
  });
};

export const handleMouseLeave = (mouseValues, setMouseValues) => {
  setMouseValues({ ...mouseValues, opacity: 0 });
};

export const calcPosition = (ref, dimensions, coordinates) => {
  let { marginLeft, boundedWidth } = dimensions;
  const { offsetWidth: width, offsetHeight: height } = ref.current;
  coordinates[0] -= width / 2;
  coordinates[1] -= height + 10;
  if (coordinates[0] < marginLeft - 20) coordinates[0] = marginLeft - 20;
  if (coordinates[0] > boundedWidth - marginLeft - width / 2)
    coordinates[0] = boundedWidth - marginLeft - width / 2;
};

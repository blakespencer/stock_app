import * as d3 from 'd3';

export const formatDate = d3.timeFormat('%-b %-d');

export function genXScale(data, xAccessor, dimensions) {
  return d3
    .scaleTime()
    .domain(d3.extent(data, xAccessor))
    .range([0, dimensions.boundedWidth]);
}

export function genYScale(data, yAccessor, dimensions) {
  const yMin = d3.min(data, yAccessor);
  const yMax = d3.max(data, yAccessor);
  const buffer = 0.2;
  const yBuffer = (yMax - yMin) * buffer;

  return d3
    .scaleLinear()
    .domain([yMin - yBuffer, yMax])
    .range([dimensions.boundedHeight, 0])
    .nice();
}

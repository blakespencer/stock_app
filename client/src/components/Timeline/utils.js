import * as d3 from 'd3';

export const formatDataLegend = (data) => {
  if (!data) return [];
  const output = [
    { key: 'Date', value: data['date'] },
    { key: 'Close', value: data['close'] },
    { key: 'High', value: data['high'] },
    { key: 'Low', value: data['low'] },
    { key: 'Open', value: data['open'] },
    { key: 'Volume', value: data['volume'] },
  ];
  return output;
};

export const calcPosition = (ref, dimensions, coordinates) => {
  let {
    marginLeft,
    marginRight,
    marginTop,
    width: dimensionsWidth,
  } = dimensions;
  const { offsetWidth: width, offsetHeight: height } = ref.current;
  coordinates[1] -= 1.7 * height;
  const [x, y] = coordinates;
  // if (x + marginLeft > width - widthAccessor()) coordinates[0] -= width / 2;
  if (x + marginLeft > width) coordinates[0] -= width / 2;
  else coordinates[0] = marginLeft / 2;

  if (x + width / 2 > dimensionsWidth - marginRight / 2) {
    coordinates[0] = dimensionsWidth - marginRight / 2 - width;
  }
  if (y < -marginTop) coordinates[1] = -marginTop - 10;
};

export const movingAverage = (data, numberOfPricePoints) => {
  data = [...data].reverse();
  return data.map((row, index, total) => {
    const start = Math.max(0, index - numberOfPricePoints);
    const end = index;
    const subset = total.slice(start, end + 1);
    const sum = subset.reduce((a, b) => a + b['close'], 0);
    return {
      date: row['date'],
      close: sum / subset.length,
    };
  });
};

export const customStyles = {
  option: (provided, state) => {
    return {
      ...provided,
      backgroundColor: state.isSelected ? 'rgba(153, 128, 250, 1)' : 'white',
      ':active': {
        backgroundColor: 'rgba(153, 128, 250, 0.5)',
      },
    };
  },
  control: (base, state) => {
    return {
      ...base,
      borderColor:
        state.isFocused || state.menuIsOpen
          ? 'rgba(153, 128, 250, 1)'
          : state.theme.colors.neutral20,
      boxShadow: state.isFocused ? '0 0 0 1px rgba(153, 128, 250, 1)' : 'none',
      '&:hover': {
        ...base['&:hover'],
        borderColor: state.menuIsOpen
          ? 'rgba(153, 128, 250, 1)'
          : state.theme.colors.neutral30,
      },
    };
  },
};

export const formatDataPercentageChange = (data) => {
  const accumulateData = [];
  let prevAccPercentChange = initialPercentageChange(data);
  data.forEach((d, i) => {
    if (i === data.length - 1) {
      accumulateData.push({
        ...d,
        percentChange: 0,
        accPercentChange: 0,
      });
      return;
    }

    const oldValue = data[i + 1].close;
    const newValue = d.close;
    const delta = newValue - oldValue;
    const percentChange = (delta / oldValue) * 100;

    const accPercentChange = prevAccPercentChange - percentChange;

    accumulateData.push({
      ...d,
      percentChange,
      accPercentChange,
    });
    prevAccPercentChange = accPercentChange;
  });

  return accumulateData;
};

function initialPercentageChange(data) {
  if (!data.length) {
    return 0;
  }
  const oldValue = data[data.length - 1].close;
  const newValue = data[0].close;
  return calcPercentageChange(oldValue, newValue);
}

function calcPercentageChange(oldValue, newValue) {
  const delta = newValue - oldValue;
  const percentChange = (delta / oldValue) * 100;
  return percentChange;
}

export const xScaleGen = (dimensions, xAccessor, data) =>
  d3
    .scaleTime()
    .domain(
      data.map((d, i) => {
        return xAccessor(data[data.length - 1 - i]);
      })
    )
    .range(
      d3.range(
        0,
        dimensions.boundedWidth,
        dimensions.boundedWidth / data.length
      )
    );

export const yScaleGen = (dimensions, yAccessor, data, buffer) => {
  const yMin = d3.min(data, yAccessor);
  const yMax = d3.max(data, yAccessor);
  const yBuffer = (yMax - yMin) * buffer;

  return d3
    .scaleLinear()
    .domain([yMin - yBuffer, yMax])
    .range([dimensions.boundedHeight, 0])
    .nice();
};

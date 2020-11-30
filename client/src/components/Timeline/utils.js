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

export const calcPosition = (ref, dimensions, coordinates, widthAccessor) => {
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

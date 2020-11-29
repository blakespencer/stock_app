export const formatDataLegend = (data) => {
  if (!data) return data;
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

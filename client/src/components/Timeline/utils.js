export const formatDataLegend = (data) => [
  { key: 'Date', value: data['date'] },
  { key: 'Close', value: data['close'] },
  { key: 'High', value: data['high'] },
  { key: 'Low', value: data['low'] },
  { key: 'Open', value: data['open'] },
  { key: 'Volume', value: data['volume'] },
];

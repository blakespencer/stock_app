const axios = require('axios');
const { ALPHA_VANTAGE_BASE_URL, ALPHA_VANTAGE_API_KEY } = process.env;

class AlphaVantageService {
  formatData(rawData) {
    const timeSeries = rawData['Time Series (Daily)'];
    const symbol = rawData['Meta Data']['2. Symbol'];
    const data = [];
    for (let date in timeSeries) {
      const day = timeSeries[date];
      data.push({
        date,
        open: parseFloat(day['1. open']),
        high: parseFloat(day['2. high']),
        low: parseFloat(day['3. low']),
        close: parseFloat(day['4. close']),
        volume: parseFloat(day['6. volume']),
      });
    }
    return { timeSeries: data, symbol };
  }

  async getTimeSeriesAdjusted(sym) {
    try {
      const res = await axios.get(
        `${ALPHA_VANTAGE_BASE_URL}/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${sym}&apikey=${ALPHA_VANTAGE_API_KEY}`
      );
      const data = this.formatData(res.data);
      return data;
    } catch (error) {
      throw new Error();
    }
  }
}

module.exports = AlphaVantageService;

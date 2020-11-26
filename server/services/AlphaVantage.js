const axios = require('axios');
const { ALPHA_VANTAGE_BASE_URL, ALPHA_VANTAGE_API_KEY } = process.env;

class AlphaVantageService {
  async getTimeSeriesAdjusted(sym) {
    try {
      const res = await axios.get(
        `${ALPHA_VANTAGE_BASE_URL}//query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${sym}&apikey=${ALPHA_VANTAGE_API_KEY}`
      );
      return res.data;
    } catch (error) {
      throw new Error();
    }
  }
}

module.exports = AlphaVantageService;

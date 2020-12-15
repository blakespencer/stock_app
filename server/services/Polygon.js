const axios = require('axios');
const { POLYGON_BASE_URL, POLYGON_API_KEY } = process.env;

class PolygonService {
  async timeSeries(sym, from, to) {
    try {
      if (!to) to = new Date().toISOString().substring(0, 10);
      const res = await axios.get(
        `${POLYGON_BASE_URL}/aggs/ticker/${sym}/range/1/day/${from}/${to}?unadjusted=false&sort=asc&limit=120&apikey=${POLYGON_API_KEY}`
      );
      return res.data;
    } catch (error) {
      console.log(error.message);
      throw new Error();
    }
  }
}

module.exports = PolygonService;

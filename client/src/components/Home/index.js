import React, { useState, useEffect } from 'react';
import Search from './Search';
// import Chart from '../ReactChart';
// import { TimeSeries } from '../Charts';
import Timeline from '../Timeline/Timeline';
import * as d3 from 'd3';
import axios from 'axios';

const parseDate = d3.timeParse('%Y-%m-%d');
const dateAccessor = (d) => parseDate(d.date);
const priceAccessor = (d) => d.close;
const volumeAccessor = (d) => d.volume;

export default function Home() {
  const [data, setData] = useState({ timeSeries: [], symbol: 'SPY' });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/av/SPY');
        setData(res.data);
      } catch (error) {}
    };
    fetchData();
  }, []);
  return (
    <>
      <h1>Time Series Data</h1>
      <Search setData={setData} />
      <div className="App__charts">
        {data.timeSeries.length ? (
          <Timeline
            data={data.timeSeries}
            xAccessor={dateAccessor}
            yAccessor={priceAccessor}
            barAccessor={volumeAccessor}
            label={data.symbol}
          />
        ) : null}
      </div>
    </>
  );
}

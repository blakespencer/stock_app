import React, { useState } from 'react';
import Search from './Search';
// import Chart from '../ReactChart';
// import { TimeSeries } from '../Charts';
import Timeline from '../Timeline/Timeline';
import * as d3 from 'd3';

const parseDate = d3.timeParse('%Y-%m-%d');
const dateAccessor = (d) => parseDate(d.date);
const priceAccessor = (d) => d.close;

export default function Home() {
  const [data, setData] = useState({ timeSeries: [], symbol: '' });
  return (
    <>
      <h1>Time Series Data</h1>
      <Search setData={setData} />

      {/* {data.data.length ? <TimeSeries data={data} /> : <div></div>} */}
      <div className="App__charts">
        <Timeline
          data={data.timeSeries}
          xAccessor={dateAccessor}
          yAccessor={priceAccessor}
          label={data.symbol}
        />
      </div>
    </>
  );
}

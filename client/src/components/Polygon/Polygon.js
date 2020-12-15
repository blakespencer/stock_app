import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Timeseries from '../Timeseries';
import moment from 'moment';

export default function FetchTicker({ children }) {
  const [data, setData] = useState({});

  useEffect(() => {
    fetchData('SPY', setData);
  }, []);

  const handleSubmit = (evt, query) => {
    evt.preventDefault();
    if (query) {
      fetchData(query, setData);
    }
  };

  return (
    <>
      <Search handleSubmit={handleSubmit}></Search>
      {data.results ? (
        <Timeseries
          data={data.results}
          xAccessor={(d) => d.t}
          yAccessor={(d) => d.c}
        />
      ) : null}
    </>
  );
}

function Search({ handleSubmit }) {
  const [query, setQuery] = useState('');

  const handleChange = (evt) => {
    setQuery(evt.target.value.toUpperCase());
  };

  return (
    <div>
      <form
        onSubmit={(evt) => {
          handleSubmit(evt, query);
          setQuery('');
        }}
      >
        <input
          onChange={handleChange}
          placeholder="search ticker"
          value={query}
        />
      </form>
    </div>
  );
}

async function fetchData(ticker, setData) {
  try {
    const from = moment().subtract(3, 'months').format('YYYY-MM-DD');
    const params = new URLSearchParams([['from', from]]);
    const res = await axios.get(`/api/polygon/${ticker}`, { params });
    setData(res.data);
  } catch (error) {
    console.log(error);
  }
}

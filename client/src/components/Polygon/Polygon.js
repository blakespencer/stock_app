import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Timeseries from '../Timeseries';
import moment from 'moment';
import { SearchInput, SearchForm } from './styles';
import ReactTextTransition, { presets } from 'react-text-transition';

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
        <>
          <Header
            text={`${data.ticker}`}
            className="big"
            inline
            // noOverflow
            style={{
              fontSize: 40,
              fontWeight: 900,
              width: 'auto',
            }}
          />
          <Timeseries
            data={data.results}
            xAccessor={(d) => d.t}
            yAccessor={(d) => d.c}
          />
        </>
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
    <SearchForm
      onSubmit={(evt) => {
        handleSubmit(evt, query);
        setQuery('');
      }}
    >
      <SearchInput
        onChange={handleChange}
        placeholder="Search ticker"
        value={query}
      />
    </SearchForm>
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

function Header({ ...props }) {
  return <ReactTextTransition {...props} />;
}

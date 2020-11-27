import React, { useState } from 'react';
import axios from 'axios';

export default function Search({ setData }) {
  const [values, setValues] = useState({
    query: '',
  });

  const { query } = values;

  const handleChange = (evt) => {
    let { name, value } = evt.target;
    value = value.toUpperCase();
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = async (evt) => {
    try {
      evt.preventDefault();
      const res = await axios.get(`/api/av/${query}`);
      setData(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Search Ticker</label>
        <input type="text" name="query" value={query} onChange={handleChange} />
        <button type="submit">Search</button>
      </form>
    </div>
  );
}

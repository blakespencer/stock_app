import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { Home, Polygon } from './components';

import React from 'react';

export default function Routes() {
  return (
    <Router>
      <Route path="/" exact component={Home} />
      <Route path="/polygon" exact component={Polygon} />
    </Router>
  );
}

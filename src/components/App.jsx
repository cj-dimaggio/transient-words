import React from 'react';

import { BrowserRouter as Router, Route } from "react-router-dom";
import Workspace from './Workspace';

export default (props) => (
    <Router basename={process.env.PUBLIC_URL}>
    <Route path="/manifest.json" onEnter={() => window.location.reload()} />
    <Route path="/assets/*" onEnter={() => window.location.reload()} />
    <Route path="/" exact component={Workspace} />
  </Router>
)

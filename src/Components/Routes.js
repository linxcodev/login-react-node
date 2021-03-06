import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { Feed } from './Routes/Feed.js';
import { Profile } from './Routes/Profile.js';
import { Authentication } from './Routes/Authentication.js';

export default () => {
  return (
    <Switch>
        <Route path="/" component={Feed} exact/>
        <Route path="/login" component={Authentication} exact/>
        <Route path="/register" component={Authentication} exact/>
        <Route path="/profiles/:profile" component={Profile} exact/>
    </Switch>
  );
};

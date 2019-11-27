import React from 'react';
import { Route, Switch, useRouteMatch, } from 'react-router-dom';

import ProfilePage from '../profile/profilePage';
import PublicLadderPage from './ladder/ladderPage';


function PublicRouter() {
  // The `path` lets us build <Route> paths that are
  // relative to the parent route, while the `url` lets
  // us build relative links.
  const { url } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${url}/users/:username`} component={ProfilePage}/>
      <Route path={`${url}/ladder`} component={PublicLadderPage}/>
    </Switch>
  );
} export default PublicRouter;

import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard/Dashboard';
import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';
import Signup from '../pages/Signup/Signup';

const MainRouter: React.FC = () => (
  <BrowserRouter>
    <Switch>
      <Route path='/' exact>
        <Home right={Login} />
      </Route>
      <Route path='/signup'>
        <Home right={Signup} />
      </Route>
      <Route path='/dashboard' component={Dashboard} />
    </Switch>
  </BrowserRouter>
);

export default MainRouter;

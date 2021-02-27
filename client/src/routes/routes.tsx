import React from 'react';
import { Switch, BrowserRouter } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import RestrictedRoute from './RestrictedRoute';
import Dashboard from '../pages/Dashboard/Dashboard';
import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';
import Signup from '../pages/Signup/Signup';

const LoginHome = () => <Home right={Login} />;
const SignupHome = () => <Home right={Signup} />;

const MainRouter: React.FC = () => (
  <BrowserRouter>
    <Switch>
      {/* Restricted Routes */}
      <RestrictedRoute path='/' exact component={LoginHome} />
      <RestrictedRoute path='/signup' component={SignupHome} />

      {/* Private Routes */}
      <PrivateRoute path='/dashboard' component={Dashboard} />

      {/* Private Routes */}
      <PublicRoute component={() => <div>404, page not found!</div>} />
    </Switch>
  </BrowserRouter>
);

export default MainRouter;

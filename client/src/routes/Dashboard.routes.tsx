import Profile from 'pages/Profile/Profile';
import { Switch } from 'react-router';
import PrivateRoute from './PrivateRoute';

const DashboardRoutes = () => (
  <Switch>
    <PrivateRoute exact path='/profile/:username' component={Profile} />
  </Switch>
);

export default DashboardRoutes;

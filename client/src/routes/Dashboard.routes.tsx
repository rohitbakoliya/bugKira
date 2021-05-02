import Bugs from 'pages/Bugs/Bugs';
import Profile from 'pages/Profile/Profile';
import { Switch } from 'react-router';
import PrivateRoute from './PrivateRoute';

const DashboardRoutes = () => (
  <Switch>
    <PrivateRoute exact path="/dashboard/bugs" component={Bugs} />
    <PrivateRoute exact path="/profile/:username" component={Profile} />
  </Switch>
);

export default DashboardRoutes;

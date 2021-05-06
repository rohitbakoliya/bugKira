import AddBug from 'components/AddBug/AddBug';
import Bugs from 'pages/Bugs/Bugs';
import Profile from 'pages/Profile/Profile';
import SingleBug from 'pages/SingleBug/SingleBug';
import { Switch } from 'react-router';
import PrivateRoute from './PrivateRoute';

const DashboardRoutes = () => (
  <Switch>
    <PrivateRoute exact path="/dashboard/bugs" component={Bugs} />
    <PrivateRoute exact path="/dashboard/bugs/:bugId" component={SingleBug} />
    <PrivateRoute exact path="/dashboard/new-bug" component={AddBug} />
    <PrivateRoute exact path="/profile/:username" component={Profile} />
  </Switch>
);

export default DashboardRoutes;

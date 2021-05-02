import Sidebar from 'components/Sidebar/Sidebar';
import React from 'react';
import DashboardRoutes from 'routes/Dashboard.routes';
import { DashboardBody, DashboardWrapper } from './Dashboard.style';

const Dashboard: React.FC = () => {
  return (
    <DashboardWrapper>
      <Sidebar />
      <DashboardBody>
        <DashboardRoutes />
      </DashboardBody>
    </DashboardWrapper>
  );
};
export default Dashboard;

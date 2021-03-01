import { Button } from '@bug-ui';
import React from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { StoreState } from 'store';
import { logoutUser } from 'store/ducks';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const state = useSelector((state: StoreState) => state.auth.user);
  const logout = () => {
    dispatch(logoutUser())
      .then(() => {
        toast.success('Logged out successfully!');
      })
      .catch((err: string) => toast.error(err));
  };
  return (
    <div>
      <Button variant='secondary' onClick={logout} icon='sign-out-alt'>
        Log out
      </Button>
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </div>
  );
};
export default Dashboard;

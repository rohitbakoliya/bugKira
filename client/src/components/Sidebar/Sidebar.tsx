import { Flex, IconLink } from '@bug-ui';
import Avatar from '@bug-ui/Avatar';
import Navbar from 'components/Navbar/Navbar';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { StoreState } from 'store';
import { logoutUser } from 'store/ducks';
import { SidebarWrapper, SidebarLinks } from './Sidebar.style';

const Sidebar: React.FC = React.memo(() => {
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector((state: StoreState) => state.auth.user);

  const [isOpen, setIsOpen] = useState(() => false);
  const handleOpen = () => setIsOpen(!isOpen);

  useEffect(() => {
    // to close the sidebar in mobile view by clicking outside
    document.addEventListener('click', (e: any) => {
      if (e.target.closest('.hamburger--icon')) return;
      if (e.target.closest('a') || !e.target.closest('.sidebar--wrapper')) {
        setIsOpen(false);
      }
    });
  }, []);

  const logout = () => {
    dispatch(logoutUser())
      .then(() => {
        toast.success(`Logged out successfully!`);
        history.push('/');
      })
      .catch((err: string) => {
        toast.error(err);
      });
  };

  return (
    <>
      <Navbar isOpen={isOpen} handleSidebar={handleOpen} />
      <SidebarWrapper isOpen={isOpen} className='sidebar--wrapper'>
        <div className='sidebar--sticky'>
          <Flex align='center' className='dashboard__user'>
            <Avatar
              className='dashboard__avatar'
              username={user?.username}
              size='150'
              height='auto'
              width='100%'
            />
            <div className='dashboard__info'>
              <h2 className='text--bold'>{user?.name}</h2>
              <p className='color--gray'>@{user?.username}</p>
            </div>
          </Flex>
          <SidebarLinks>
            <Flex gap='large' direction='column'>
              <IconLink className='nav--link' circleIcon to='/dashboard' startIcon='home'>
                Dashboard
              </IconLink>
              <IconLink className='nav--link' circleIcon to='/bugs' startIcon='user'>
                Bugs
              </IconLink>
              <IconLink
                className='nav--link'
                circleIcon
                to={`/profile/${user?.username}`}
                startIcon='user'
              >
                Profile
              </IconLink>
              <IconLink className='nav--link' circleIcon to='/notification' startIcon='bell'>
                Notification
              </IconLink>
              <IconLink
                className='nav--link'
                circleIcon
                startIcon='sign-out-alt'
                to='#'
                onClick={logout}
              >
                Logout
              </IconLink>
            </Flex>
          </SidebarLinks>
        </div>
      </SidebarWrapper>
    </>
  );
});

export default Sidebar;

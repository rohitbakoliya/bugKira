import React from 'react';
import styled from 'styled-components/macro';
import googleLogo from 'assets/svg/google.svg';
import { Button } from '@bug-ui';
import { useDispatch } from 'react-redux';
import { checkAuth } from 'store/ducks';
import toast from 'react-hot-toast';

const StyledGB = styled(Button)`
  display: flex;
  align-items: center;
  color: ${p => p.theme.colors.black};
  background-color: white;
  box-shadow: ${p => p.theme.shadows.small};
  margin: 10px auto 25px auto !important;
  img {
    margin-right: ${p => p.theme.space.medium}px;
    width: 20px;
  }
`;

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

const GoogleButton: React.FC<Props> = props => {
  const dispatch = useDispatch();

  const authEndPoint = `/api/user/auth/google`;

  const initOAuthWindow = () => {
    let url = process.env.NODE_ENV === 'development' ? 'localhost:5000' : window.location.host;

    window.open(
      `${window.location.protocol}//${url}${authEndPoint}`,
      '__blank',
      'width=500&height=800'
    );
    window.addEventListener('message', event => {
      if (event.data === 'success') {
        dispatch(checkAuth())
          .then(() => {
            toast.success('Login success');
          })
          .catch((err: string) => {
            toast.error(err);
          });
      }
    });
  };

  return (
    <StyledGB onClick={initOAuthWindow} {...props}>
      <img src={googleLogo} alt='google logo' /> Continue with Google
    </StyledGB>
  );
};
export default GoogleButton;

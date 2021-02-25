import React from 'react';
import styled from 'styled-components/macro';
import googleLogo from 'assets/svg/google.svg';
import { Button } from '@bug-ui';

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
  return (
    <StyledGB {...props}>
      <img src={googleLogo} alt='google logo' /> Continue with Google
    </StyledGB>
  );
};
export default GoogleButton;

import React from 'react';
import { Input } from '@bug-ui/Form';
import { Button, Flex, IconLink } from '@bug-ui';
import LoginWrapper from './Login.style';
import GoogleButton from 'components/GoogleButton';
import AppLogo from 'components/Logo';

const Login: React.FC = () => {
  return (
    <LoginWrapper>
      <Flex direction='column' align='center' justify='center'>
        <AppLogo width='50px' />
        <h2 className='text--bold'>Hello, Welcome back!</h2>
        <form>
          <Input type='email' name='email' placeholder='example@gmail.com' icon='envelope' />
          <Input type='password' name='password' placeholder='password' icon='lock' />
          <Button icon='arrow-right' type='submit' width='50%'>
            Login
          </Button>
        </form>
        <GoogleButton />
        <IconLink to='/signup' endIcon='arrow-right' className='color--gray'>
          Don't have an account?
        </IconLink>
      </Flex>
    </LoginWrapper>
  );
};

export default Login;

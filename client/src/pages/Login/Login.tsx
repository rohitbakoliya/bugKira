import React from 'react';
import { Input } from '@bug-ui/Form';
import { Button } from '@bug-ui';
import LoginWrapper from './Login.style';

const Login: React.FC = () => {
  return (
    <LoginWrapper>
      <form action=''>
        <h2 className='text--bold'>Hello, Welcome back!</h2>
        <Input type='email' name='email' placeholder='example@gmail.com' icon='envelope' />
        <Input type='password' name='password' placeholder='password' icon='lock' />
        <Button icon='arrow-right' type='submit' width='50%'>
          Login
        </Button>
      </form>
    </LoginWrapper>
  );
};

export default Login;

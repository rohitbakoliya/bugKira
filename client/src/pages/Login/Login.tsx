import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from '@bug-ui/Form';
import { Button, Flex, IconLink } from '@bug-ui';
import LoginSchema from './LoginSchema';
import LoginWrapper from './Login.style';
import GoogleButton from 'components/GoogleButton';
import AppLogo from 'components/Logo';

const Login: React.FC = () => {
  const { register, handleSubmit, errors } = useForm({
    mode: 'onChange',
    resolver: yupResolver(LoginSchema),
  });
  const onSubmit = (data: any) => {
    console.log(data);
    // TODO: dispatch an action for LOGIN_IN
  };
  return (
    <LoginWrapper>
      <Flex direction='column' align='center' justify='center'>
        <AppLogo width='50px' />
        <h2 className='text--bold'>Hello, Welcome back!</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            type='email'
            name='email'
            placeholder='example@gmail.com'
            icon='envelope'
            errors={errors}
            inputRef={register}
          />
          <Input
            type='password'
            name='password'
            placeholder='password'
            icon='lock'
            errors={errors}
            inputRef={register}
          />
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

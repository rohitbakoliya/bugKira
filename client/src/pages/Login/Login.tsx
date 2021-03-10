import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { StoreState } from 'store';
import { loginUser } from 'store/ducks';
import { Input } from '@bug-ui/Form';
import { Button, Flex, IconLink } from '@bug-ui';
import toast from 'react-hot-toast';
import LoginSchema from './LoginSchema';
import LoginWrapper from './Login.style';
import GoogleButton from 'components/GoogleButton';
import AppLogo from 'components/Logo';

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state: StoreState) => state.loading['user/LOGIN']);

  const { register, handleSubmit, errors } = useForm({
    mode: 'onChange',
    resolver: yupResolver(LoginSchema),
  });
  const onSubmit = (data: { uoe: string; password: string }) => {
    dispatch(loginUser(data))
      .then(() => {
        // TODO: add welcome back ${name} toast
        toast.success('Logged in successfully!');
      })
      .catch((err: string) => {
        toast.error(err);
      });
  };
  return (
    <LoginWrapper>
      <Flex direction='column' align='center' justify='center'>
        <AppLogo width='50px' />
        <h2 className='text--bold'>Hello, Welcome back!</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            type='text'
            name='uoe'
            placeholder='use email or username'
            icon='user'
            autoComplete='username'
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
          <Button isLoading={isLoading as boolean} icon='arrow-right' type='submit' width='50%'>
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

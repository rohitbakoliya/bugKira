import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Flex, IconLink } from '@bug-ui';
import { Input, InputLarge } from '@bug-ui/Form';
import AvatarUploader from 'components/AvatarUploader';
import GoogleButton from 'components/GoogleButton';
import AppLogo from 'components/Logo';

import SignupSchema from './SignupSchema';
import SignupWrapper from '../Login/Login.style';
import { StoreState } from 'store';
import { signupUser } from 'store/ducks';
interface PreviewFile extends File {
  preview?: any;
}

const Signup: React.FC = () => {
  const [file, setFile] = useState<PreviewFile>();
  const dispatch = useDispatch();
  const [isLoading, signupError] = useSelector((state: StoreState) => [
    state.loading['user/SIGN_UP'],
    state.error['user/SIGN_UP'],
  ]);
  console.log('from Signup.tsx', isLoading, signupError);
  const { register, handleSubmit, errors } = useForm({
    mode: 'onChange',
    resolver: yupResolver(SignupSchema),
  });
  const onSubmit = (data: any) => {
    const formData = new FormData();
    if (file) {
      formData.append('image', file);
    }
    for (let name in data) {
      formData.append(name, data[name]);
    }
    // TODO: add toast
    dispatch(signupUser(formData)).then(() => {
      console.log(`from signup.tsx: signuped successfully`);
    });
  };
  return (
    <SignupWrapper>
      <Flex direction='column' justify='center' align='center'>
        <AppLogo width='50px' />
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* 
            // ? avatar is not required for now
          */}
          <AvatarUploader name='image' file={file} handleFile={file => setFile(file)} />
          <InputLarge
            icon='user'
            placeholder='Enter username'
            type='text'
            name='username'
            autoComplete='off'
            errors={errors}
            inputRef={register}
          />
          <Input
            icon='envelope'
            placeholder='example@gmail.com'
            type='email'
            name='email'
            errors={errors}
            inputRef={register}
          />
          <Input
            icon='lock'
            placeholder='password'
            type='password'
            name='password'
            errors={errors}
            inputRef={register}
          />
          <Input
            icon='lock'
            placeholder='confim password'
            type='password'
            name='confirmPassword'
            errors={errors}
            inputRef={register}
          />
          <Button
            isLoading={isLoading as boolean}
            type='submit'
            icon='arrow-right'
            width='50%'
          >
            Signup
          </Button>
        </form>
        <GoogleButton />
        <IconLink to='/' endIcon='arrow-right' className='color--gray'>
          Already have an account?
        </IconLink>
      </Flex>
    </SignupWrapper>
  );
};

export default Signup;

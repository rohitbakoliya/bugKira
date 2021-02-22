import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Flex, IconLink } from '@bug-ui';
import { Input, InputLarge } from '@bug-ui/Form';
import AvatarUploader from 'components/AvatarUploader';
import GoogleButton from 'components/GoogleButton';
import AppLogo from 'components/Logo';

import SignupSchema from './SignupSchema';
import SignupWrapper from '../Login/Login.style';
interface PreviewFile extends File {
  preview?: any;
}

const Signup: React.FC = () => {
  const [file, setFile] = useState<PreviewFile>();
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
    formData.forEach(f => console.log(f));
    // TODO: dispatch an action for SIGN_UP
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
          <Button type='submit' icon='arrow-right' width='50%'>
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

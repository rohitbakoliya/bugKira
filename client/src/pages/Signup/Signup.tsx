import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Flex, IconLink } from '@bug-ui';
import { Input, InputLarge } from '@bug-ui/Form';
import AvatarUploader from 'components/AvatarUploader';
import GoogleButton from 'components/GoogleButton';

import SignupSchema from './SignupSchema';
import SignupWrapper from '../Login/Login.style';
import { StoreState } from 'store';
import { signupUser } from 'store/ducks';

interface PreviewFile extends File {
  preview?: any;
}

const Signup: React.FC = () => {
  const [file, setFile] = useState<PreviewFile>();
  const [fileError, setFileError] = useState<string>('');
  const dispatch = useDispatch();
  const isLoading = useSelector((state: StoreState) => state.loading['user/SIGN_UP']);
  const { register, handleSubmit, errors } = useForm({
    mode: 'onChange',
    resolver: yupResolver(SignupSchema),
  });
  const onSubmit = (data: any) => {
    const formData = new FormData();
    if (file) {
      formData.append('image', file);
    } else {
      return setFileError('Image is Required');
    }
    for (let name in data) {
      formData.append(name, data[name]);
    }
    dispatch(signupUser(formData))
      .then(() => {
        toast.success('Signuped successfully');
      })
      .catch((e: string) => {
        toast.error(e);
      });
  };

  return (
    <SignupWrapper>
      <Flex direction='column' justify='center' align='center'>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* 
            // ? avatar is required for now
          */}
          <AvatarUploader
            name='avatar'
            file={file}
            handleFile={file => setFile(file)}
            handleError={err => setFileError(err)}
            fileError={fileError}
          />
          <InputLarge
            icon='edit'
            placeholder='Username'
            type='text'
            name='username'
            autoComplete='off'
            errors={errors}
            inputRef={register}
          />
          {/* 
          // ? name is not required for now
          <Input
            icon='user'
            placeholder='full name'
            type='text'
            name='name'
            errors={errors}
            inputRef={register}
          /> */}
          <Input
            icon='envelope'
            placeholder='email@example.com'
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
          <Button isLoading={isLoading as boolean} type='submit' icon='arrow-right' width='50%'>
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

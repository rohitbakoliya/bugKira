import { Button, Flex, IconLink } from '@bug-ui';
import { Input, InputLarge } from '@bug-ui/Form';
import AvatarUploader from 'components/AvatarUploader';
import GoogleButton from 'components/GoogleButton';
import AppLogo from 'components/Logo';
import React, { useState } from 'react';
import SignupWrapper from '../Login/Login.style';
interface PreviewFile {
  preview?: any;
}

const Signup: React.FC = () => {
  const [file, setFile] = useState<PreviewFile>();
  return (
    <SignupWrapper>
      <Flex direction='column' justify='center' align='center'>
        <AppLogo width='50px' />
        <form>
          <AvatarUploader name='image' file={file} handleFile={file => setFile(file)} />
          <InputLarge icon='edit' placeholder='Enter your name' type='text' name='name' />
          <Input icon='user' placeholder='Enter username' type='text' name='username' />
          <Input icon='envelope' placeholder='example@gmail.com' type='email' name='email' />
          <Input icon='lock' placeholder='password' type='password' name='password' />
          <Input
            icon='lock'
            placeholder='confim password'
            type='password'
            name='confirm-password'
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

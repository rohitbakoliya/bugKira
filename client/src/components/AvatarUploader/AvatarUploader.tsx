import React, { useEffect, useState } from 'react';
import avatarDefault from 'assets/images/avatar-default.jpg';
import AvatarContainer, { AvatarUploaderWrapper } from './AvatarUploader.style';
import { CSSProperties } from 'styled-components';
import { useDropzone } from 'react-dropzone';
import { Flex } from '@bug-ui';

interface PreviewFile {
  preview?: any;
}

interface Props {
  size?: CSSProperties['width'];
  name?: string;
  file?: PreviewFile;
  handleFile: (file: any) => void;
}

const AvatarUploader: React.FC<Props> = ({ size, name, file, handleFile }) => {
  const [error, setError] = useState<string>();

  const onDrop = (acceptedFiles: any, rejectedFiles: any): void => {
    if (acceptedFiles.length !== 0) {
      acceptedFiles[0].preview = URL.createObjectURL(acceptedFiles[0]);
      handleFile(acceptedFiles[0]);
      setError('');
    } else if (rejectedFiles.length !== 0) {
      const errorCode = rejectedFiles[0].errors[0].code;
      switch (errorCode) {
        case 'file-invalid-type':
          setError('Invalid File type');
          break;
        case 'file-too-large':
          setError('Image too big, max allowed size is 2MB');
          break;
        default:
          setError('Something went wrong!');
          break;
      }
    }
  };
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    multiple: false,
    maxSize: 1 * 1024 * 1024,
    onDrop,
  });
  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      file && URL.revokeObjectURL(file.preview);
    },
    [file]
  );
  return (
    <AvatarUploaderWrapper>
      <Flex justify='center' align='center' direction='column'>
        <AvatarContainer size={size}>
          <div {...getRootProps({ className: 'dropzone' })}>
            <input type='file' name={name} {...getInputProps()} />
            <p>Change Avatar</p>
          </div>
          <img
            // * or may be `!error` can be removed
            src={file && !error ? file.preview : avatarDefault}
            alt={file ? 'avatar' : 'default avatar'}
          />
        </AvatarContainer>
        <div className={`text--error ${error && 'show-error'}`}>{error}</div>
      </Flex>
    </AvatarUploaderWrapper>
  );
};
export default AvatarUploader;

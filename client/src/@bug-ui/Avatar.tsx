import React, { CSSProperties, useState } from 'react';
import styled from 'styled-components';
import Loading from './Loading';

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  username?: string;
  size?: CSSProperties['width'];
}

interface IAvatarImg {
  loader: boolean;
}

interface ILoading {
  loader: boolean;
  size?: CSSProperties['width'];
}

const AvatarImage = styled.img<IAvatarImg>(p => ({
  display: p.loader ? 'none' : 'block',
  maxWidth: '200px',
  border: p.theme.border,
  borderRadius: '50%',
  objectFit: 'cover',
  margin: 0,
}));

const LoadingImage = styled.div<ILoading>`
  width: 100%;
  max-width: 200px;
  min-height: 168px;
  display: ${p => (p.loader ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
`;

const Avatar: React.FC<Props> = ({ username, size, ...rest }) => {
  const [loading, setLoading] = useState(true);

  const handleLoading = () => {
    setLoading(false);
  };
  return (
    <>
      <LoadingImage loader={loading} {...rest}>
        <Loading varient='primary' />
      </LoadingImage>
      <AvatarImage
        src={`/api/user/${username}/avatar/raw?size=${size}`}
        {...rest}
        loader={loading}
        onLoad={handleLoading}
      />
    </>
  );
};

export default Avatar;
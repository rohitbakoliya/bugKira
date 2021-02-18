import React from 'react';
import HomeWrapper from './Home.style';

interface Props {
  right: React.FC;
}
const Home: React.FC<Props> = ({ right: RightComponent }) => {
  return (
    <HomeWrapper as='section'>
      <div className='home__left'>Home Left</div>
      <div className='home__right'>
        <RightComponent />
      </div>
    </HomeWrapper>
  );
};

export default Home;

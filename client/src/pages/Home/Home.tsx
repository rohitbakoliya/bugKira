import React from 'react';
import { Flex } from '@bug-ui';
import HomeWrapper from './Home.style';

interface Props {
  right: React.FC;
}
const Home: React.FC<Props> = ({ right: RightComponent }) => {
  return (
    <HomeWrapper>
      <Flex>
        <div className='home__left'>Home Left</div>
        <div className='home__right'>
          <RightComponent />
        </div>
      </Flex>
    </HomeWrapper>
  );
};

export default Home;

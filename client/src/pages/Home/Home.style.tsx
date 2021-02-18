import styled from 'styled-components';
import { Flex } from '@bug-ui';

const HomeWrapper = styled(Flex)`
  min-height: 100vh;
  .home__left {
    flex-basis: 450px;
    background-color: ${p => p.theme.colors.primary};
    background-image: radial-gradient(circle at 0% 0%, #373b52, #252736 51%, #1d1e26);
    color: ${p => p.theme.colors.white};
  }
  .home__right {
    flex: 1;
  }
  @media screen and (${p => p.theme.media.tablet}) {
    flex-direction: column;
    .home__left {
      flex-basis: 45vh;
    }
  }
`;
export default HomeWrapper;

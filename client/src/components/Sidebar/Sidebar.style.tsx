import styled from 'styled-components';

export const SidebarWrapper = styled.aside<{ isOpen: boolean }>`
  padding: 40px;
  background-color: ${p => p.theme.colors.white};
  border-right: ${p => p.theme.border};

  .sidebar--sticky {
    position: sticky;
    top: 0;
  }
  p {
    margin: 0;
  }
  .nav--link:hover,
  .nav--link.active {
    color: ${p => p.theme.colors.primary};
    .start--icon {
      background-color: ${p => p.theme.colors.primary};
      color: ${p => p.theme.colors.accent};
    }
  }
  .dashboard__avatar {
    margin-bottom: 5px;
    margin-top: ${p => p.theme.spacings.top}px;
  }

  @media all and (${p => p.theme.media.tablet}) {
    position: fixed;
    left: ${p => (p.isOpen ? '0px' : '-200px')};
    top: 0;
    padding: 60px 25px;
    width: 200px;
    height: 100vh;
    z-index: 1;
    background-color: ${p => p.theme.colors.white};
    transition: 0.3s;

    a {
      font-size: 14px;
    }

    .dashboard__avatar {
      width: 100px;
      height: 100px;
      margin-top: calc(${p => p.theme.spacings.top}px / 2);
    }
  }
`;

export const SidebarLinks = styled.div`
  margin-top: ${p => p.theme.spacings.top}px;
  a {
    margin: 15px 0;
  }
`;

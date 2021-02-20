import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';
import styled from 'styled-components';

const INavLink = styled(NavLink)<NavLinkProps>`
  display: flex;
  align-items: center;
  svg.fa-arrow-right {
    transition: 0.3s;
  }

  &:hover {
    svg.fa-arrow-right {
      transform: translateX(5px);
      transition: 0.3s;
    }
  }
`;

interface Props extends NavLinkProps {
  startIcon?: IconProp;
  endIcon?: IconProp;
}

export const IconLink: React.FC<Props> = ({ startIcon, endIcon, children, ...rest }) => {
  return (
    <INavLink {...rest}>
      {startIcon && <FontAwesomeIcon icon={startIcon} />}
      {children}
      {endIcon && <FontAwesomeIcon icon={endIcon} />}
    </INavLink>
  );
};
export default IconLink;

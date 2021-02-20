import { IconProp } from '@fortawesome/fontawesome-svg-core';
import React from 'react';
import styled from 'styled-components';
import Input from './Input';

const InputWrapper = styled.div`
  width: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 0px;
  label {
    flex-direction: row;
    background-color: initial;
    border: none;
  }
  input {
    width: 100%;
    font-family: ${p => p.theme.font.primaryBold};
    font-size: 24px;
    text-align: center;
    outline: none;
    border: none;
  }
  .text--error {
    margin-left: 30px;
    text-align: left;
  }
`;

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: IconProp;
}

export const InputLarge: React.FC<Props> = ({ icon, ...rest }) => (
  <InputWrapper>
    <Input icon={icon} {...rest} />
  </InputWrapper>
);
export default InputLarge;

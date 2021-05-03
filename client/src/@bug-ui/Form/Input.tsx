import React, { Ref } from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import styled from 'styled-components/macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ErrorMessage } from '@hookform/error-message';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: IconProp;
  inputRef?: Ref<HTMLInputElement>;
  errors?: any;
}

interface LabelProps {
  indicateError?: boolean;
}

export const InputWrapper = styled.div`
  margin-bottom: 10px;
  width: 100%;
  .text--error {
    font-size: 12px;
    margin-top: 5px;
    margin-left: 16px;
    transition: 0.3s;
    transform: translateY(-20px);
    opacity: 0;

    &:before {
      content: '* ';
    }
  }
  .show-error {
    transform: translateY(0);
    opacity: 1;
    transition: 0.3s;
  }
`;
const InputLabel = styled.label<LabelProps>`
  display: flex;
  flex-direction: row-reverse;
  justify-content: center;
  align-items: center;
  background-color: ${p => p.theme.colors.offwhite};
  color: ${p => p.theme.colors.black};
  border: 1px solid ${p => (p.indicateError ? p.theme.colors.red : 'transparent')};
  border-radius: 50px;
  height: 40px;
  padding: ${p => p.theme.space.small}px;
  padding: 0 20px;

  span {
    color: ${p => (p.indicateError ? p.theme.colors.red : p.theme.colors.gray)} !important;
    transition: 0.2s;
  }
`;
const StyledInput = styled.input`
  width: 100%;
  border: none;
  outline: none;
  background: none;
  margin-left: 10px;
  padding: 10px;

  &:focus + span {
    color: ${p => p.theme.colors.primary} !important;
    transition: 0.2s;
  }
  &::placeholder {
    color: ${p => p.theme.colors.gray};
  }
`;

export const Input: React.FC<Props> = ({ icon, inputRef, errors, ...rest }) => {
  return (
    <InputWrapper>
      <InputLabel indicateError={errors && errors[rest.name as string]}>
        <StyledInput ref={inputRef} {...rest} />
        <span>
          <FontAwesomeIcon icon={icon} />
        </span>
      </InputLabel>
      {errors && (
        <div className={`text--error ${errors[rest.name as string] && 'show-error'}`}>
          <ErrorMessage name={rest.name as string} errors={errors} />
        </div>
      )}
    </InputWrapper>
  );
};
export default Input;

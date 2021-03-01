import styled from 'styled-components';

const LoginWrapper = styled.div`
  padding: 30px 0;
  height: 100%;
  display: flex;
  justify-content: center;
  h2 {
    margin-bottom: ${p => p.theme.spacings.my};
  }
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 300px;
  }
`;

export default LoginWrapper;

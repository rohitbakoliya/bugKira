import styled from 'styled-components';

const LoginWrapper = styled.div`
  padding: 30px 0;
  height: 100%;
  display: flex;
  justify-content: center;
  .logo {
    width: 100px;
    margin: 5px 0;
  }
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 300px;
    margin-top: ${p => p.theme.spacings.my};
  }
`;

export default LoginWrapper;

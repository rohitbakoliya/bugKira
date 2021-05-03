import styled from 'styled-components';

const AddBugWrapper = styled.section`
  margin-bottom: 40px;

  .bug__button {
    float: right;
    margin-bottom: 0;
  }
  label {
    width: 40%;
    margin: 10px 0;
    padding: 0;
    justify-content: flex-start;

    span {
      margin-right: 0;
      font-size: 20px;
    }

    .bug__edit-title {
      text-align: left;
      font-family: ${p => p.theme.font.primary};
      font-size: 20px;
      .text--error {
        margin-left: 0;
      }
    }
    @media screen and (${p => p.theme.media.tablet}) {
      width: 100%;
    }
  }
`;

export default AddBugWrapper;

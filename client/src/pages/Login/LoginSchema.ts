import * as yup from 'yup';

const LoginSchema = yup.object().shape({
  email: yup.string().required().min(5).max(100).email().trim(),
  password: yup.string().required().min(6).max(50),
});
export default LoginSchema;

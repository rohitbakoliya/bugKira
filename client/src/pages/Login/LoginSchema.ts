import * as yup from 'yup';

const LoginSchema = yup.object().shape({
  uoe: yup
    .string()
    .required('Only letters, numbers, single period or underscore is allowed')
    .max(100, 'No more than 100 characters allowed')
    .test({
      test: value => (value ? !/(^(_|\.).*$)|(.*(_|\.)$)/.test(value) : true),
      message: `username or email cannot begin or end with period or underscore`,
    })
    .matches(
      /(^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$)|(^[A-Za-z0-9]+(_|.)?[A-Za-z0-9]+$)/,
      'Invalid username or email'
    )
    .trim(),
  password: yup.string().required().min(6).max(50),
});
export default LoginSchema;

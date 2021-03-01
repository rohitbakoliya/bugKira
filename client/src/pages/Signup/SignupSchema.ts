import * as yup from 'yup';

const SignupSchema = yup.object().shape({
  // name: yup.string().required().min(4).max(50).trim(),
  username: yup
    .string()
    .required()
    .min(4)
    .max(50)
    .trim()
    .test({
      test: value => (value ? !/(^(_|\.).*$)|(.*(_|\.)$)/.test(value) : true),
      message: `username or email cannot begin or end with period or underscore`,
    })
    .matches(
      /(^[A-Za-z0-9]+(_|.)?[A-Za-z0-9]+$)/,
      'Only letters, numbers, single period or underscore is allowed'
    ),
  email: yup.string().required().min(5).max(100).email().trim(),
  password: yup.string().required().min(6).max(50),
  confirmPassword: yup
    .string()
    .required()
    .min(6)
    .max(50)
    .oneOf([yup.ref('password'), null], 'Confirm Password does not match'),
});

export default SignupSchema;

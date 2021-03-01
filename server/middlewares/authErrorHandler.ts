import { Request, Response, NextFunction } from 'express';
import { validateUserSignup, User } from '../models/User';
import httpStatus from 'http-status-codes';

export const signupErrorHandler = async (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = validateUserSignup(req.body);
  if (error) {
    return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({ error: error.details[0].message });
  }
  // check for username or email conflicts
  try {
    const findWithEmail = await User.findOne({ email: value.email });
    const findWithUsername = await User.findOne({ username: value.username });
    if (findWithEmail || findWithUsername) {
      return res.status(httpStatus.CONFLICT).json({ error: `Username / Email Already Exists` });
    }
    return next();
  } catch (err) {
    return next(err);
  }
};

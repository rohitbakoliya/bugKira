import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { IUser, User } from '../models/User';

import Joi from 'joi';

/**
 * @desc    user info
 * @route   GET /api/user/:username
 * @access  private
 */
export const getUserFromUsername = async (req: Request, res: Response) => {
  const {
    error,
    value: { username },
  } = Joi.object({
    username: Joi.string().required().min(4).max(50).trim(),
  }).validate({ username: req.params.username });
  if (error) {
    return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({ error: error.details[0].message });
  }
  try {
    const user = await User.findOne({
      username: { $regex: `^${username}$`, $options: 'i' },
    }).select('-password');
    if (!user)
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: `User not found with username ${username}` });
    return res.status(httpStatus.OK).json({ data: user });
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: `something went wrong` });
  }
};

/**
 * @desc    current user
 * @route   GET /api/user/me
 * @access  private
 */
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.user as IUser;
    const user = await User.findById(id).select('-password');
    if (!user) return res.status(httpStatus.NOT_FOUND).json({ error: 'User not found' });
    return res.status(httpStatus.OK).json({ data: user });
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: `something went wrong` });
  }
};

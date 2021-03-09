import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { IUser, User } from '../models/User';
import { validateBio, validateName, validateUsername } from '../validators/User.validators';

/**
 * @desc    user info
 * @route   GET /api/user/:username
 * @access  private
 */
export const getUserFromUsername = async (req: Request, res: Response) => {
  const { error, value: username } = validateUsername(req.params.username);
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

/**
 * @desc    update bio
 * @route   PATCH /api/user/me/bio
 * @access  private
 */
export const updateBio = async (req: Request, res: Response) => {
  const { error, value: bio } = validateBio(req.body.bio);
  if (error) {
    return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({ error: error.details[0].message });
  }
  try {
    const { id } = req.user as IUser;
    const user = await User.findByIdAndUpdate(
      id,
      { bio },
      { new: true, useFindAndModify: false }
    ).select('-password');
    if (!user) return res.status(httpStatus.NOT_FOUND).json({ error: 'User not found' });
    return res.status(httpStatus.OK).json({ data: user.bio });
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: `something went wrong` });
  }
};

/**
 * @desc    update name
 * @route   PATCH /api/user/me/name
 * @access  private
 */
export const updateName = async (req: Request, res: Response) => {
  const { error, value: name } = validateName(req.body.name);
  if (error) {
    return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({ error: error.details[0].message });
  }
  try {
    const { id } = req.user as IUser;
    const user = await User.findByIdAndUpdate(
      id,
      { name },
      { new: true, useFindAndModify: false }
    ).select('-password');
    if (!user) return res.status(httpStatus.NOT_FOUND).json({ error: 'User not found' });
    return res.status(httpStatus.OK).json({ data: user.name });
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: `something went wrong` });
  }
};

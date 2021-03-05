import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import Joi from 'joi';
import { GridFSBucket } from 'mongodb';
import mongoose from 'mongoose';

import { IUser, User } from '../models/User';

let gfs: GridFSBucket;
mongoose.connection.once('open', () => {
  gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: 'images',
  });
});

const removeFile = (id: any) => {
  gfs.delete(id, () => {
    console.log('Removed Old User Image:', id);
  });
};

/**
 * @route PATCH /api/user/me/avatar/upload
 * @description upload profile picture of user
 */
export const updateProfileImage = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ _id: (req.user as IUser).id });
    if (!user) return res.status(httpStatus.NOT_FOUND).json({ error: 'User not found' });

    // if user avatar is already exists then delete the
    // old image and upload new
    if (user.avatar) {
      removeFile(user.avatar);
    }
    user.avatar = req.file.id;
    await user.save();

    return res
      .status(httpStatus.OK)
      .json({ data: user.avatar, message: 'Profile picture updated' });
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: 'Something went wrong',
    });
  }
};

/**
 * @route GET /api/user/me/avatar
 * @description current user avatar
 */
export const getCurrentUserAvatar = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ username: (req.user as IUser).username });
    if (!user) return res.status(httpStatus.NOT_FOUND).json({ error: 'User not found!' });

    const avatars = await gfs.find({ _id: user.avatar });
    avatars.toArray((_err, files) => {
      if (!files || files.length === 0) {
        return res.status(httpStatus.NOT_FOUND).json({ error: 'Image not found' });
      }
      return res.status(httpStatus.OK).json({ data: files[0] });
    });
    return;
  } catch (err) {
    // console.log(err);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: 'Something went wrong',
    });
  }
};

/**
 * @route GET /api/user/:username/avatar
 * @description avatar of user by username
 */
export const getAvatarImageByUsername = async (req: Request, res: Response) => {
  const {
    error,
    value: { username },
  } = Joi.object({
    username: Joi.string().required().min(4).max(50).trim(),
  }).validate({ username: req.params.username });

  // username validation
  if (error) {
    return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({ error: error.details[0].message });
  }
  try {
    const user = await User.findOne({ username: RegExp(`/^${username}$/`, 'i') });
    if (!user) return res.status(httpStatus.NOT_FOUND).json({ error: 'User not found' });

    const avatars = await gfs.find({ _id: user.avatar });
    avatars.toArray((_err, files) => {
      if (!files || files.length === 0) {
        return res.status(httpStatus.NOT_FOUND).json({ error: 'Image not found' });
      }
      return res.status(httpStatus.OK).json({ data: files[0] });
    });
    return;
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: `something went wrong` });
  }
};

/**
 * @route GET /api/user/:username/avatar
 * @description raw avatar of user by username
 */
export const getRawAvatarImageByUsername = async (req: Request, res: Response) => {
  // Incomplete
  const {
    error,
    value: { username },
  } = Joi.object({
    username: Joi.string().required().min(4).max(50).trim(),
  }).validate({ username: req.params.username });

  // username validation
  if (error) {
    return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({ error: error.details[0].message });
  }
  try {
    const user = await User.findOne({ username: RegExp(`/^${username}$/`, 'i') });
    if (!user) return res.status(httpStatus.NOT_FOUND).json({ error: 'User not found' });

    return;
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: `something went wrong` });
  }
};

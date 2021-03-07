import express from 'express';
import passport from 'passport';
import {
  getAvatarImageByUsername,
  getRawAvatarImageByUsername,
  getCurrentUserAvatar,
  updateProfileImage,
} from '../controllers/image.controller';
import upload from '../middlewares/fileUpload';

const passportJWT = passport.authenticate('jwt', { session: false });
const avatarUpload = upload.single('image');

const router = express.Router();

/**
 * @route GET /api/user/me/avatar
 * @description current user avatar
 */

router.get('/me/avatar', passportJWT, getCurrentUserAvatar);

router.patch('/me/avatar/upload', passportJWT, avatarUpload, updateProfileImage);

router.get('/:username/avatar', passportJWT, getAvatarImageByUsername);

router.get('/:username/avatar/raw', passportJWT, getRawAvatarImageByUsername);

export default router;

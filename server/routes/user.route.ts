import express from 'express';
import passport from 'passport';
import { CLIENT_URL } from '../config/siteUrls';
import { checkAuth, login, logout, signup } from '../controllers/user.controller';
import { generateToken } from '../middlewares/generateToken';
import { signupErrorHandler } from '../middlewares/authErrorHandler';
import upload from '../middlewares/fileUpload';
const avatarUpload = upload.single('image');

const router = express.Router();
const passportGoogle = passport.authenticate('google', {
  session: false,
  failureRedirect: CLIENT_URL,
});
const passportJWT = passport.authenticate('jwt', { session: false });

/**
 * @description Auth with google
 * @route       GET /api/user/auth/google
 */
router.get(
  '/auth/google',
  passport.authenticate('google', { session: false, scope: ['profile', 'email'] })
);

/**
 * @description Google auth callback
 * @route       GET /api/user/auth/google
 */

router.get('/auth/google/callback', passportGoogle, generateToken);

router.get('/check-auth', passportJWT, checkAuth);

router.post('/login', login);

router.get('/logout', passportJWT, logout);

router.post('/signup', avatarUpload, signupErrorHandler, signup);
export default router;

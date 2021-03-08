import express from 'express';
import passport from 'passport';
import { CLIENT_URL } from '../config/siteUrls';
import { generateToken } from '../middlewares/generateToken';
import { checkAuth, login, logout, signup, verifyEmail } from '../controllers/user.auth.controller';
import { passportJWT } from '../middlewares/passportJWT';
import { signupErrorHandler } from '../middlewares/authErrorHandler';
import upload from '../middlewares/fileUpload';

const router = express.Router();
const avatarUpload = upload.single('image');

const passportGoogle = passport.authenticate('google', {
  session: false,
  failureRedirect: CLIENT_URL,
});

/**
 * @description Auth with google
 * @route       GET /api/user/auth/google
 */
router.get(
  '/google',
  passport.authenticate('google', { session: false, scope: ['profile', 'email'] })
);

/**
 * @description Google auth callback
 * @route       GET /api/user/auth/google
 */

router.get('/google/callback', passportGoogle, generateToken);

router.get('/check-auth', passportJWT, checkAuth);

router.post('/login', login);

router.get('/logout', passportJWT, logout);

router.post('/signup', avatarUpload, signupErrorHandler, signup);

router.get('/verify-email', verifyEmail);

export default router;

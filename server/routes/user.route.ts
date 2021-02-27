import express, { Response } from 'express';
import passport from 'passport';
import { CLIENT_URL } from '../config/siteUrls';
import { checkAuth } from '../controllers/user.controller';
import { generateToken } from '../middlewares/generateToken';

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

router.get('/', (_, res: Response) => {
  res.send('Hello world');
});

export default router;

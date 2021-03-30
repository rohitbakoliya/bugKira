import express, { Response } from 'express';
import httpStatus from 'http-status-codes';
import userRoute from './user.route';
import imageRoute from './image.route';
import authRoute from './user.auth.route';
import bugsRoute from './bugs.route';
import commentsRoute from './comments.route';
import { passportJWT } from '../middlewares/passportJWT';

const router = express.Router();

// user auth routes
router.use('/user/auth', authRoute);

// user routes
router.use('/user', userRoute, imageRoute);

// bugs routes
router.use('/bugs', passportJWT, bugsRoute, commentsRoute);

// other routes
router.use('/*', (_, res: Response) => {
  res.status(httpStatus.NOT_IMPLEMENTED).json({ error: 'Api endpoint Not Implemented!' });
});

export default router;

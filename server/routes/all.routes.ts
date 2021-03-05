import express, { Response } from 'express';
import httpStatus from 'http-status-codes';
import userRoute from './user.route';
import imageRoute from './image.route';

const router = express.Router();

// user routes
router.use('/user', userRoute, imageRoute);

// other routes
router.use('/*', (_, res: Response) => {
  res.status(httpStatus.NOT_IMPLEMENTED).json({ error: 'Api endpoint Not Implemented!' });
});

export default router;

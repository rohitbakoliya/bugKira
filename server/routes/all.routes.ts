import express, { Response } from 'express';
import userRoute from './user.route';

const router = express.Router();

// user routes
router.use('/user', userRoute);

// other routes
router.use('/*', (_, res: Response) => {
  res.status(400).json({ success: false, error: 'No api endpoint found!' });
});

export default router;

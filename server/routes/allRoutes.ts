import express, { Response } from 'express';
import authRoutes from './authRoutes';

const router = express.Router();

// auth routes
router.use('/auth', authRoutes);

// other routes
router.use('/*', (_, res: Response) => {
  res.json({ success: false, error: 'No api endpoint found!' });
});

export default router;

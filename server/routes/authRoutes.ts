import express, { Response } from 'express';
const router = express.Router();


router.get('/', (_, res: Response) => {
  res.send('Hello world');
});

export default router;

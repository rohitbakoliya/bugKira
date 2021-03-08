import express from 'express';
import { getUserFromUsername, getCurrentUser } from '../controllers/user.controller';
import { passportJWT } from '../middlewares/passportJWT';
const router = express.Router();
// const passportJWT = passport.authenticate('jwt', { session: false });

router.get('/me', passportJWT, getCurrentUser);

router.get('/:username', passportJWT, getUserFromUsername);

export default router;

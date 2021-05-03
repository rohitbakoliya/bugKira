import express from 'express';
import {
  getUserFromUsername,
  getCurrentUser,
  updateBio,
  updateName,
  getAllUsers,
} from '../controllers/user.controller';
import { passportJWT } from '../middlewares/passportJWT';
const router = express.Router();
// const passportJWT = passport.authenticate('jwt', { session: false });

router.get('/', passportJWT, getAllUsers);
router.get('/me', passportJWT, getCurrentUser);
router.patch('/me/bio', passportJWT, updateBio);
router.patch('/me/name', passportJWT, updateName);

router.get('/:username', passportJWT, getUserFromUsername);

export default router;

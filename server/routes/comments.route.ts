import { Router } from 'express';
import {
  createComment,
  deleteComment,
  getAllReactionsByCid,
  getComments,
  toggleReaction,
  updateComment,
} from '../controllers/comments.controller';

const router = Router();

router.get('/:bugId/comments', getComments);
router.patch('/:bugId/comments', createComment);
router.delete('/:bugId/comments/:cid', deleteComment);
router.patch('/:bugId/comments/:cid', updateComment);
router.patch('/:bugId/comments/:cid/reactions', toggleReaction);
router.get('/:bugId/comments/:cid/reactions', getAllReactionsByCid);

export default router;

import { Router } from 'express';
import {
  addLabels,
  addOrRemoveReaction,
  createBug,
  deleteLabel,
  getAllBugs,
  getBugById,
  getReactions,
  getSuggestions,
  toggleBugStatus,
  updateBug,
  updateLabels,
} from '../controllers/bugs.controller';

const router = Router();

router.get('/', getAllBugs);
router.post('/', createBug);

router.get('/suggestions', getSuggestions);

router.get('/:bugId', getBugById);
router.patch('/:bugId', updateBug);

// bug labels
router.patch('/:bugId/labels/new', addLabels);
router.patch('/:bugId/labels', updateLabels);
router.delete('/:bugId/lables/:name', deleteLabel);

// bug status update
router.patch('/:bugId/close', toggleBugStatus({ status: false }));
router.patch('/:bugId/open', toggleBugStatus({ status: true }));

// reactions
router.get('/:bugId/reactions', getReactions);
router.patch('/:bugId/reactions', addOrRemoveReaction);

export default router;

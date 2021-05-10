import { Router } from 'express';
import {
  addLabels,
  addOrRemoveReaction,
  addReferences,
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

router.patch('/:bugId/references', addReferences);

// bug labels
router.patch('/:bugId/labels', updateLabels);
router.patch('/:bugId/labels/:name', addLabels);
router.delete('/:bugId/labels/:name', deleteLabel);

// bug status update
router.patch('/:bugId/close', toggleBugStatus({ status: false }));
router.patch('/:bugId/open', toggleBugStatus({ status: true }));

// reactions
router.get('/:bugId/reactions', getReactions);
router.patch('/:bugId/reactions', addOrRemoveReaction);

export default router;

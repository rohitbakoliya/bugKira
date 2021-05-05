import { Router } from 'express';
import { getNotifications, mentionPeople } from '../controllers/notification.controller';

const router = Router();

router.get('/', getNotifications);

router.post('/mentions/:bugId', mentionPeople);

export default router;

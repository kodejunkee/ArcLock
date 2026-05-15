/**
 * ArcLock Backend — Log Routes
 */

import { Router } from 'express';
import * as logController from '../controllers/log.controller';
import { authGuard } from '../middleware/auth.middleware';

const router = Router();

// All log routes require authentication
router.use(authGuard);

router.get('/auth', logController.getAuthLogs);
router.get('/failures', logController.getFailures);

export default router;

/**
 * ArcLock Backend — User Routes
 */

import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authGuard } from '../middleware/auth.middleware';
import { validate } from '../middleware/validator';
import { updateProfileSchema } from '../validators/user.validator';

const router = Router();

// All user routes require authentication
router.use(authGuard);

router.get('/profile', userController.getProfile);
router.put('/profile', validate(updateProfileSchema), userController.updateProfile);
router.delete('/delete', userController.deleteAccount);

export default router;

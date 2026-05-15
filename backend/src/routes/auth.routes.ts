/**
 * ArcLock Backend — Auth Routes
 */

import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validate } from '../middleware/validator';
import { authLimiter } from '../middleware/rateLimiter';
import { registerSchema, verifyFaceSchema, refreshTokenSchema } from '../validators/auth.validator';

const router = Router();

// Apply strict rate limiting to all auth routes
router.use(authLimiter);

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(verifyFaceSchema), authController.login);
router.post('/verify-face', validate(verifyFaceSchema), authController.verifyFace);
router.post('/refresh-token', validate(refreshTokenSchema), authController.refreshToken);
router.post('/logout', authController.logout);

export default router;

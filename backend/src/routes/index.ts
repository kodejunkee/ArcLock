/**
 * ArcLock Backend — Route Aggregator
 */

import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import logRoutes from './log.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/logs', logRoutes);

export default router;

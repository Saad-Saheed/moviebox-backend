import express from 'express';
import { getProfile, updateProfile } from '../controllers/user.controller.js';
import authenticate from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/me', authenticate, getProfile);
router.put('/me', authenticate, updateProfile);

export default router;

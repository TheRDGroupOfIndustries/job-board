import express from 'express';
import { createSubscription, getSubscription, cancelSubscription } from '../controllers/subscription.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();


router.route('/create').post(authMiddleware, createSubscription);
router.route('/getAllSubscription').get(authMiddleware, getSubscription);
router.route('/cancel').post(authMiddleware, cancelSubscription);

export default router;
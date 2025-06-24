import express from 'express';
import {
    addReview,
    // updateReview,
    deleteReview
} from '../controllers/review.controller.js';
import authenticate from '../middlewares/auth.middleware.js';

const router = express.Router();

// Add or update a review
router.post('/', authenticate, addReview);
router.delete('/:reviewId', authenticate, deleteReview);

export default router;

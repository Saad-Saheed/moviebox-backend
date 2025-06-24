import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import {
  rateMovie,
  getRatings,
  deleteRating,
} from '../controllers/rating.controller.js';

const router = express.Router();;

router.get('/', authMiddleware, getRatings);
router.post('/', authMiddleware, rateMovie);
router.delete('/', authMiddleware, deleteRating);

export default router;

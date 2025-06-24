import express from 'express';
import {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  isInWatchlist
} from '../controllers/watchlist.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', authMiddleware, getWatchlist);
router.get('/:movieId', authMiddleware, isInWatchlist);
router.post('/', authMiddleware, addToWatchlist);
router.delete('/:movieId', authMiddleware, removeFromWatchlist);

export default router;

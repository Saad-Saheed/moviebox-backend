import express from 'express';
import {
  addFavorite,
  removeFavorite,
  getFavorites,
  isInFavorite
} from '../controllers/favorite.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', authMiddleware, addFavorite);
router.get('/:movieId', authMiddleware, isInFavorite);
router.delete('/:movieId', authMiddleware, removeFavorite);
router.get('/', authMiddleware, getFavorites);

export default router;

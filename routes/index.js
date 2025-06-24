import express from 'express';
import userRoutes from './user.routes.js';
import movieRoutes from './movie.routes.js';
import favoriteRoutes from './favorite.routes.js';
import watchlistRoutes from './watchlist.routes.js';
import ratingRoutes from './rating.routes.js';
import reviewRoutes from './review.routes.js';
import authRoutes from './auth.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/movies', movieRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/watchlist', watchlistRoutes);
router.use('/ratings', ratingRoutes);
router.use('/reviews', reviewRoutes);

export default router;
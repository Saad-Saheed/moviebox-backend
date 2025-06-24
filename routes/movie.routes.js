import express from 'express';
import {
  getDiscoverMovies,
  getTrendingMovies,
  getTopRatedMovies,
  getSimilarMovies,
  getDetails,
  search,
  getReviewsByMovie,
  getUserReviewByMovie,
  getAverageRating,
  getUserRatingByMovie
} from '../controllers/movie.controller.js';

const router = express.Router();

router.get('/discover', getDiscoverMovies);
router.get('/trending', getTrendingMovies);
router.get('/top-rated', getTopRatedMovies);
router.get('/search', search);
router.get('/:id', getDetails);
router.get('/:id/similar', getSimilarMovies);
router.get('/:movieId/reviews', getReviewsByMovie);
// user review for a movie
router.get('/:movieId/user/review/', getUserReviewByMovie);
// movie ratings average
router.get('/:movieId/ratings/average', getAverageRating);
// user rating for a movie
router.get('/:movieId/user/rating/', getUserRatingByMovie);



export default router;

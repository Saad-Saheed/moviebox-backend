import { searchMovies, getMovieById, fetchTrendingMovies, fetchTopRatedMovies, fetchFromTMDB } from '../utils/tmdb.js';
import CustomError from '../helpers/customError.js';
import prisma from '../libs/prisma.js';

export const search = async (req, res, next) => {
  const { query, page } = req.query;

  try {
    if (!query) throw new CustomError('Query is required', 400);
    const data = await searchMovies(query, page || 1);
    res.status(200).json({
      error: false,
      statusCode: 200,
      data: data,
      message: 'Movies fetched successfully',
    });
  } catch (err) {
    next(err);
  }
};

// This function retrieves movie details by ID
export const getDetails = async (req, res, next) => {
  const { id } = req.params;

  try {
    const movie = await getMovieById(id);
    res.status(200).json({
      error: false,
      statusCode: 200,
      data: movie,
      message: 'Movie fetched successfully',
    });
  } catch (err) {
    next(err);
  }
};

export const getSimilarMovies = async (req, res, next) => {
  const { id } = req.params;
  const { page } = req.query;

  try {
    const movies = await fetchFromTMDB(`/movie/${id}/similar`, { page });
    res.status(200).json({
      error: false,
      statusCode: 200,
      data: movies,
      message: 'Similar movies fetched successfully',
    });
  } catch (err) {
    next(err);
  }
};

export const getDiscoverMovies = async (req, res, next) => {
  try {
    const movies = await fetchFromTMDB('/discover/movie', req.query);

    res.status(200).json({
      error: false,
      statusCode: 200,
      data: movies,
      message: 'Discovered movies fetched successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getTrendingMovies = async (req, res, next) => {
  try {
    const movies = await fetchTrendingMovies('week', req.query);

    res.status(200).json({
      error: false,
      statusCode: 200,
      data: movies,
      message: 'Trending movies fetched successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getTopRatedMovies = async (req, res, next) => {
  try {
    const movies = await fetchTopRatedMovies(req.query);

    res.status(200).json({
      error: false,
      statusCode: 200,
      data: movies,
      message: 'Top rated movies fetched successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Get reviews for a movie
export const getReviewsByMovie = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const take = parseInt(limit, 10);

    const totalCount = await prisma.review.count({ where: { movieId: parseInt(movieId, 10) } });

    const reviews = await prisma.review.findMany({
      where: { movieId: parseInt(movieId, 10) },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });

    res.status(200).json({
      error: false,
      statusCode: 200,
      data: { page, limit, total_results: totalCount, total_pages: Math.ceil(totalCount / limit), reviews },
      message: 'Reviews fetched successfully',
    });
  } catch (error) {
    next(error);
  }
};

///get a movie review by user
export const getUserReviewByMovie = async (req, res, next) => {
  try {
    const { movieId } = req.params;

    const review = await prisma.review.findFirst({
      where: { userId: req.userId, movieId: parseInt(movieId) },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });

    if (!review) {
      throw new CustomError('Review not found', 404);
    }

    res.status(200).json({
      error: false,
      statusCode: 200,
      data: review,
      message: 'User review fetched successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Get average rating for a movie
export const getAverageRating = async (req, res, next) => {
  try {
    const { movieId } = req.params;

    const result = await prisma.rating.aggregate({
      _avg: { rating: true },
      where: { movieId: parseInt(movieId, 10) },
    });

    const average = result._avg.rating || 0;

    res.status(200).json({
      error: false,
      statusCode: 200,
      data: { averageRating: average },
      message: 'Average rating fetched successfully',
    });

  } catch (error) {
    next(error);
  }
};

// Get user rating for a movie
export const getUserRatingByMovie = async (req, res, next) => {
  try {
    const { movieId } = req.params;

    const rating = await prisma.rating.findFirst({
      where: { userId: req.userId, movieId: parseInt(movieId) },
    });

    if (!rating) {
      throw new CustomError('Rating not found', 404);
    }

    res.status(200).json({
      error: false,
      statusCode: 200,
      data: rating,
      message: 'User rating fetched successfully',
    });
  } catch (error) {
    next(error);
  }
};


import prisma from '../libs/prisma.js';
import Validator from 'validatorjs';
import CustomError from '../helpers/customError.js';
import { getMovieById } from '../utils/tmdb.js';

export const getWatchlist = async (req, res, next) => {
  try {
    const rules = {
      page: 'integer|min:1',
      limit: 'integer|min:1',
    };

    const validation = new Validator(req.query, rules);

    if (!validation.passes()) {
      throw new CustomError('Invalid pagination parameters', 422, validation.errors.errors);
    }

    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '10', 10);
    const skip = (page - 1) * limit;

    const totalCount = await prisma.watchlist.count({
      where: { userId: req.userId },
    });

    const watchlistItems = await prisma.watchlist.findMany({
      where: { userId: req.userId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    const enrichedItems = await Promise.all(
      watchlistItems.map(async (item) => {
        try {
          //   const { data } = await axios.get(`https://api.themoviedb.org/3/movie/${item.movieId}`, {
          //     params: { api_key: process.env.TMDB_API_KEY },
          //   });
          const data = await getMovieById(item.movieId);
          return { ...item, movie: data };
        } catch (err) {
          return { ...item, movie: null };
        }
      })
    );

    res.status(200).json({
      error: false,
      statusCode: 200,
      data: {
        page,
        limit,
        total_results: totalCount,
        total_pages: Math.ceil(totalCount / limit),
        watchlist: enrichedItems,
      },
      message: 'Watchlist fetched successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const isInWatchlist = async (req, res, next) => {
  const rules = {
    movieId: 'integer|required',
  };

  const { movieId } = req.params;
  const validation = new Validator(req.params, rules);

  if (!validation.passes()) {
    throw new CustomError('Invalid query parameters', 422, validation.errors.errors);
  }

  try {

    const exists = await prisma.watchlist.findFirst({
      where: {
        userId: req.userId,
        movieId: parseInt(movieId),
      },
    });

    if (!exists) {
      throw new CustomError('Movie not found in watchlist', 404, exists);
    }

    res.status(200).json({
      error: false,
      statusCode: 200,
      data: exists,
      message: 'Movie is in the watchlist',
    });
  } catch (error) {
    next(error);
  }
}

export const addToWatchlist = async (req, res, next) => {
  try {
    const rules = {
      movieId: 'required|integer',
    };

    const validation = new Validator(req.body, rules);

    if (!validation.passes()) {
      throw new CustomError('Validation failed', 422, validation.errors.errors);
    }

    const { movieId } = req.body;

    const exists = await prisma.watchlist.findFirst({
      where: {
        userId: req.userId,
        movieId: Number(movieId),
      },
    });

    if (exists) {
      throw new CustomError('Movie already in watchlist', 409);
    }

    const watchlist = await prisma.watchlist.create({
      data: {
        userId: req.userId,
        movieId: Number(movieId),
      },
    });

    res.status(201).json({
      error: false,
      statusCode: 201,
      data: watchlist,
      message: 'Movie added to watchlist successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const removeFromWatchlist = async (req, res, next) => {
  try {
    const rules = {
      movieId: 'required|integer',
    };

    const validation = new Validator(req.params, rules);

    if (!validation.passes()) {
      throw new CustomError('Validation failed', 422, validation.errors.errors);
    }

    const { movieId } = req.params;

    const removed = await prisma.watchlist.deleteMany({
      where: {
        userId: req.userId,
        movieId: Number(movieId),
      },
    });

    if (removed.count === 0) {
      throw new CustomError('Movie not found in watchlist', 404);
    }

    res.status(200).json({
      error: false,
      statusCode: 200,
      data: { movieId },
      message: 'Movie removed from watchlist successfully',
    });
  } catch (error) {
    next(error);
  }
};


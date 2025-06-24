import prisma from '../libs/prisma.js';
import Validator from 'validatorjs';
import CustomError from '../helpers/customError.js';
import { getMovieById } from '../utils/tmdb.js';

export const addFavorite = async (req, res, next) => {
  try {
    const { movieId } = req.body;

    const rules = {
      movieId: 'required|integer',
    };

    const validation = new Validator(req.body, rules);

    if (!validation.passes()) {
      throw new CustomError('Validation Failed', 422, validation.errors.errors);
    }

    const existing = await prisma.favorite.findFirst({
      where: {
        movieId: parseInt(movieId),
        userId: req.userId,
      },
    });

    if (existing) {
      throw new CustomError('Movie already in favorites', 409);
    }

    const favorite = await prisma.favorite.create({
      data: {
        movieId: parseInt(movieId),
        userId: req.userId,
      },
    });

    res.status(201).json({
      error: false,
      statusCode: 201,
      data: favorite,
      message: 'Movie added to favorites',
    });
  } catch (error) {
    next(error);
  }
};

export const isInFavorite = async (req, res, next) => {
  const rules = {
    movieId: 'required|integer',
  };

  const { movieId } = req.params;
  const validation = new Validator(req.params, rules);

  if (!validation.passes()) {
    throw new CustomError('Invalid query parameters', 422, validation.errors.errors);
  }

  try {
    const exists = await prisma.favorite.findFirst({
      where: {
        userId: req.userId,
        movieId: parseInt(movieId),
      },
    });

    if (!exists) {
      throw new CustomError('Movie not found in favorites', 404, exists);
    }

    res.status(200).json({
      error: false,
      statusCode: 200,
      data: exists,
      message: 'Movie is in the favorites list',
    });
  } catch (error) {
    next(error);
  }
}

export const removeFavorite = async (req, res, next) => {
  try {
    const rules = {
      movieId: 'required|integer',
    };

    const validation = new Validator(req.params, rules);

    if (!validation.passes()) {
      throw new CustomError('Validation failed', 422, validation.errors.errors);
    }

    const { movieId } = req.params;

    const favorite = await prisma.favorite.findFirst({
      where: { movieId: parseInt(movieId), userId: req.userId },
    });

    if (!favorite) {
      throw new CustomError('Favorite not found', 404);
    }

    await prisma.favorite.delete({ where: { id: favorite.id } });

    res.status(200).json({
      error: false,
      statusCode: 200,
      data: null,
      message: 'Movie removed from favorites',
    });
  } catch (error) {
    next(error);
  }
};

export const getFavorites = async (req, res, next) => {
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

    const totalCount = await prisma.favorite.count({
      where: { userId: req.userId },
    });

    const favorites = await prisma.favorite.findMany({
      where: { userId: req.userId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    // Fetch movie details from TMDB
    const enrichedFavorites = await Promise.all(
      favorites.map(async (fav) => {
        try {
          // const tmdbRes = await axios.get(
          //   `https://api.themoviedb.org/3/movie/${fav.movieId}`,
          //   { params: { api_key: process.env.TMDB_API_KEY } }
          // );
          const tmdbRes = await getMovieById(fav.movieId);

          return {
            ...fav,
            movie: tmdbRes,
          };
        } catch (err) {
          return {
            ...fav,
            movie: null,
          };
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
        favorites: enrichedFavorites,
      },
      message: 'Favorite movies fetched successfully',
    });
  } catch (error) {
    next(error);
  }
};

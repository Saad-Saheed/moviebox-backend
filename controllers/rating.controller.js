import prisma from '../libs/prisma.js';
import Validator from 'validatorjs';
import CustomError from '../helpers/customError.js';
// import fetchMovie from '../utils/fetchMovie.js'; // optional if verifying movie exists

export const rateMovie = async (req, res, next) => {
  try {
    const { movieId, rating } = req.body;

    const rules = {
      movieId: 'required|integer',
      rating: 'required|integer|min:0|max:10',
    };

    const validation = new Validator(req.body, rules);

    if (!validation.passes()) {
      throw new CustomError('Validation Failed', 422, validation.errors.errors);
    }

    const existingRating = await prisma.rating.findFirst({
      where: { userId: req.userId, movieId: parseInt(movieId) }
    });

    let ratingEntry;
    if (existingRating) {
      ratingEntry = await prisma.rating.update({
        where: { id: existingRating.id },
        data: { rating, updatedAt: new Date() },
      });
    } else {
      ratingEntry = await prisma.rating.create({
        data: { userId: req.userId, movieId: parseInt(movieId), rating },
      });
    }

    res.status(200).json({
      error: false,
      statusCode: 200,
      data: ratingEntry,
      message: existingRating ? 'Rating updated' : 'Rating added',
    });
  } catch (error) {
    next(error);
  }
};

export const getRatings = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const take = parseInt(limit, 10);

    const totalCount = await prisma.rating.count({
      where: { userId: req.userId },
    });

    const ratings = await prisma.rating.findMany({
      where: { userId: req.userId },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      error: false,
      statusCode: 200,
      data: { page, limit, total_results: totalCount, total_pages: Math.ceil(totalCount / limit), ratings },
      message: 'User ratings fetched successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteRating = async (req, res, next) => {
  try {
    const { movieId } = req.body;

    const rules = {
      movieId: 'required|integer',
    };

    const validation = new Validator(req.body, rules);

    if (!validation.passes()) {
      throw new CustomError('Validation Failed', 422, validation.errors.errors);
    }

    const deleted = await prisma.rating.deleteMany({
      where: { userId: req.userId, movieId },
    });

    res.status(200).json({
      error: false,
      statusCode: 200,
      data: deleted,
      message: 'Rating removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

import prisma from '../libs/prisma.js';
import CustomError from '../helpers/customError.js';
import Validator from 'validatorjs';

// Add a new review
export const addReview = async (req, res, next) => {
  try {
    const { movieId, review } = req.body;
    const rules = {
      movieId: 'required|integer',
      review: 'required|string|min:2',
    };

    const validation = new Validator(req.body, rules);

    if (!validation.passes()) {
      throw new CustomError('Validation Failed', 422, validation.errors.errors);
    }

    const existingReview = await prisma.review.findFirst({
      where: { userId: req.userId, movieId: parseInt(movieId) },
    });

    if (existingReview) {
      // Update the existing review
      const updatedReview = await prisma.review.update({
        where: { id: existingReview.id },
        data: { review },
      });

      return res.status(200).json({
        error: false,
        statusCode: 200,
        data: updatedReview,
        message: 'Review updated successfully',
      });
    }

    // Create a new review
    const reviewData = await prisma.review.create({
      data: {
        movieId: parseInt(movieId),
        review,
        user: { connect: { id: req.userId } },
      },
    });

    res.status(201).json({
      error: false,
      statusCode: 201,
      data: reviewData,
      message: 'Review added successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Delete a review
export const deleteReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review || review.userId !== req.userId) {
      throw new CustomError('Review not found or unauthorized', 404);
    }

    await prisma.review.delete({ where: { id: reviewId } });

    res.status(200).json({
      error: false,
      statusCode: 200,
      data: null,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
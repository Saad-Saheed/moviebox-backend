import Validator from 'validatorjs';
import CustomError from '../helpers/customError.js';
import prisma  from '../libs/prisma.js';

export const getProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) throw new CustomError('User not found', 404);

    res.status(200).json({
      error: false,
      statusCode: 200,
      data: user,
      message: 'User profile retrieved successfully',
    });
  } catch (err) {
    next(err)
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, phoneNumber } = req.body;
    const newUserData = {
      firstName,
      lastName,
      phoneNumber,
    }

    // validation rules
    const rules = {
      firstName: 'required|string',
      lastName: 'required|string',
      phoneNumber: 'required|regex:/(0)[0-9]{10}/|unique: user, phoneNumber,' + req.userId,
    }

    // validate request input
    const validation = new Validator(newUserData, rules);

    const validatorPromise = new Promise((resolve) => {
      validation.checkAsync(
        () => {
          resolve(true)
        },
        () => {
          resolve(false)
        },
      )
    });
    const result = await validatorPromise;

    if (!result) {
      throw new CustomError('Validation Failed', 422, validation.errors.errors);
    }

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: {
        ...newUserData,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        updatedAt: true
      }
    });

    res.status(200).json({
      error: false,
      statusCode: 200,
      data: user,
      message: 'User profile updated successfully',
    });
  } catch (err) {
    next(err)
  }
};
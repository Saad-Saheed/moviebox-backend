import jwt from 'jsonwebtoken';
import CustomError from '../helpers/customError.js';

/**
 * Middleware to authenticate requests using JWT.
 * It checks for the presence of a Bearer token in the Authorization header,
 * verifies the token, and attaches the decoded user information to the request object.
 * If the token is missing or invalid, it throws a CustomError.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new CustomError("Unauthorized", 401);
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    throw new CustomError("Invalid token", 403);
  }
};

export default authenticate;
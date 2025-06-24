import Validator from 'validatorjs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma  from '../libs/prisma.js';
import CustomError from '../helpers/customError.js';
import { exclude } from '../helpers/helper.js';

export const register = async (req, res, next) => {
    try {
        const { email, password, firstName, lastName, phoneNumber } = req.body;

        // validation rules
        const rules = {
            firstName: 'required|string',
            lastName: 'required|string',
            email: 'required|email|unique: user, email',
            phoneNumber: 'required|regex:/(0)[0-9]{10}/|unique: user, phoneNumber',
            password: 'required|string|min:8',
        }

        // validate request input
        const validation = new Validator(req.body, rules);

        const validatorPromise = new Promise((resolve) => {
            validation.checkAsync(
                () => {
                    resolve(true)
                },
                () => {
                    resolve(false)
                },
            )
        })
        const result = await validatorPromise;

        if (!result) {
            throw new CustomError(
                'Registration Failed',
                422,
                validation.errors.errors,
            );
        }

        const hashedPassword = await bcrypt.hash(password + process.env.BCRYPT_PASSWORD_SALT, parseInt(process.env.BCRYPT_SALT_ROUNDS, 10));
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                phoneNumber
            },
            select: { id: true, email: true, createdAt: true, firstName: true, lastName: true, phoneNumber: true },
        });
        const token = jwt.sign({ id: user.id, firstName: user.firstName, lastName: user.lastName }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION || '1d' });

        res.status(201).json({
            error: false,
            statusCode: 201,
            data: { token, ...user },
            message: 'User registered successfully',
        });

    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const rules = {
            email: 'required|string',
            password: 'required|string',
        }

        const validation = new Validator({ email, password }, rules);

        if (!validation.passes()) {
            throw new CustomError(
                'Login Failed',
                422,
                validation.errors.errors,
            )
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) throw new CustomError('Invalid credentials', 401);

        const isMatch = await bcrypt.compare(password + process.env.BCRYPT_PASSWORD_SALT, user.password);
        if (!isMatch) throw new CustomError('Invalid credentials', 401);

        const token = jwt.sign({ id: user.id, firstName: user.firstName, lastName: user.lastName }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION || '1d' });

        // Exclude password from the response
        const userWithoutPassword = exclude(user, ['password']);

        res.status(200).json({
            error: false,
            statusCode: 200,
            data: { token, ...userWithoutPassword },
            message: 'Login Successfully!'
        });

    } catch (error) {
        next(error);
    }
};
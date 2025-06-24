import express from 'express';
import errorHandler from './middlewares/errorHandler.js';
import CustomError from './helpers/customError.js';
// import { isPositiveInteger, isValidEmail, isValidNumber, isValidString } from "./helpers/validator.js";
import dotenv from 'dotenv';
import cors from 'cors';
import router from './routes/index.js';
// import pool from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = 'localhost';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.send('MovieBox!');
});


// app.get('/api/users/:id', async (req, res, next) => {
//     try {
//         const { id } = req.params;

//         // Validate the ID parameter
//         const userId = parseInt(id);
//         if (!isPositiveInteger(userId)) {
//             throw new CustomError("Invalid user ID", 400);
//         }

//         const conn = await pool.connect();
//         const user = await conn.query('SELECT * FROM users WHERE id = $1', [userId]);
//         conn.release();

//         if (!user.rows.length) {
//             throw new CustomError("User not found", 404);
//         }

//         res.status(200).json({
//             error: false,
//             statusCode: 200,
//             data: user.rows[0],
//             message: 'User fetched successfully',
//         });

//     } catch (error) {
//         next(error);
//     }
// });

// app.post('/api/users', async (req, res, next) => {
//     try {
//         const { name, email, age } = req.body;

//         // Validate the request body
//         if (!isValidString(name, 3)) {
//             throw new CustomError("Name must be a string with at least 3 characters", 400);
//         }
//         if (!isValidEmail(email)) {
//             throw new CustomError("Email must be a valid email address", 400);
//         }
//         if (!isValidNumber(age)) {
//             throw new CustomError("Age must be a positive number", 400);
//         }

//         const conn = await pool.connect();
//         const result = await conn.query(
//             'INSERT INTO users (name, email, age) VALUES ($1, $2, $3) RETURNING *',
//             [name, email, age]
//         );
//         conn.release();

//         const newUser = result.rows[0];
//         res.status(201).json({
//             error: false,
//             statusCode: 201,
//             data: newUser,
//             message: 'User created successfully',
//         });

//     } catch (error) {
//         next(error);
//     }
// });

// app.put('/api/users/:id', async (req, res, next) => {
//     try {
//         const { id } = req.params;

//         // Validate the ID parameter
//         const userId = parseInt(id);
//         if (!isPositiveInteger(userId)) {
//             throw new CustomError("Invalid user ID", 400);
//         }

//         const conn = await pool.connect();
//         const user = await conn.query('SELECT * FROM users WHERE id = $1', [userId]);

//         if (!user.rows.length) {
//             throw new CustomError("User not found", 404);
//         }

//         const { name, email, age } = req.body;

//         // Validate the request body
//         if (name !== undefined && !isValidString(name, 3)) {
//             throw new CustomError("Name must be a string with at least 3 characters", 400);
//         }
//         if (email !== undefined && !isValidEmail(email)) {
//             throw new CustomError("Email must be a valid email address", 400);
//         }
//         if (age !== undefined && !isValidNumber(age)) {
//             throw new CustomError("Age must be a positive number", 400);
//         }

//         // Update the user
//         const updatedUser = {
//             ...user.rows[0],
//             ...(name !== undefined && { name }),
//             ...(email !== undefined && { email }),
//             ...(age !== undefined && { age }),
//         };

//         await conn.query(
//             'UPDATE users SET name = $1, email = $2, age = $3 WHERE id = $4 RETURNING *',
//             [updatedUser.name, updatedUser.email, updatedUser.age, userId]
//         );

//         res.status(200).json({
//             error: false,
//             statusCode: 200,
//             data: updatedUser,
//             message: 'User updated successfully',
//         });

//     } catch (error) {
//         next(error);
//     }
// });

app.use('/api', router);

app.use((req, res) => {
    throw new CustomError(
        'Route not found',
        404,
    );
});

app.use(errorHandler);



app.listen(PORT, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});

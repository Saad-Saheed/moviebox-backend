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

const allowedOrigins = [
    'http://localhost:5173',                      // Local dev
    'https://moviebox-frontend-two.vercel.app',   // Your Vercel frontend
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true, // Optional if you're using cookies
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.send('MovieBox!');
});

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

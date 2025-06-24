import CustomError from '../helpers/customError.js'

function errorHandler(err, req, res, next) {
    if (err instanceof CustomError) {
        return res.status(err.statusCode).json({
            message: err.message,
            error: true,
            statusCode: err.statusCode,
            data: err.data,
        });
    }

    console.log(err);    

    return res.status(500).json({
        message: 'Internal server error',
        error: true,
        statusCode: 500,
    });
}

export default errorHandler;

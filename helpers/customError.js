class CustomError extends Error {
    constructor(message, statusCode, data = null) {
        super(message)
        this.statusCode = statusCode
        this.message = message
        this.data = data
        this.error = true
    }
}

export default CustomError;

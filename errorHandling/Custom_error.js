module.exports = ({ statusCode = 500, code, message }) => {
    const customError = new Error();
    customError.code = code;
    customError.status = statusCode;
    customError.message = message;
    return customError;
}
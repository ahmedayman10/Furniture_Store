
const userValidation = require('./userValidations');
const CustomError = require('../errorHandling/Custom_error');


module.exports = function() {

    return async function(req, res, next) {
        try {
            const validated = await userValidation.validateAsync(req.body)
            req.body = validated
            next()
        } catch (err) {
            if(err.isJoi) 
                return next(CustomError({
                    statusCode: 403,
                    message: err.message,
                    code: "VALIDATION-ERROR",
                }))
                next(CustomError({ code: "SERVER_ERROR", message: 'server error' }));
        }
    }
}
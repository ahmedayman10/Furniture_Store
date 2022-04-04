const Joi = require("joi");

const schema = Joi.object({
    orderItems: Joi.required(),
    shippingAddress1: Joi.string().required(),
    city: Joi.string().required(),
    zip: Joi.string().required(),
    country: Joi.string().required(),
    phone: Joi.number().required(),
    user:Joi.required(),
    status: Joi.required()
});

module.exports = schema;

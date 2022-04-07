const Joi = require("joi");

const schema = Joi.object({
    name: Joi.string().required(),
    description:Joi.string().required(),
    category: Joi.required(),
    price: Joi.number().required(),
    countInStock: Joi.number().required(),
    image: Joi.required(),
    brand: Joi.required()
});


module.exports = schema;
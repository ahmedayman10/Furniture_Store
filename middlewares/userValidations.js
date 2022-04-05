const Joi = require("joi");

const schema = Joi.object({
  name: Joi.string().min(3).max(15).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(5).max(15).required(),
  phone: Joi.string().min(11).required(),
  city: Joi.string().optional,
  street:Joi.string().optional,
  apartment:Joi.string().optional,
  zip: Joi.string().optional,
  country: Joi.string().optional,
  isAdmin: Joi.boolean(),
});

module.exports = schema;

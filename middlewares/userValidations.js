const Joi = require("joi");

const schema = Joi.object({
  name: Joi.string().min(3).max(15).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(5).max(15).required(),
  phone: Joi.string().min(11).required(),
  city: Joi.string(),
  street:Joi.string(),
  apartment:Joi.string(),
  zip: Joi.string(),
  country: Joi.string(),
  isAdmin: Joi.boolean(),
});

module.exports = schema;

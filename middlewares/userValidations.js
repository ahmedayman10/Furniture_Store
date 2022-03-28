const Joi = require('Joi');


const schema = Joi.object({
    username: Joi.string()
        .min(3)
        .max(15),
    email: Joi.string()
        .email()
        .required(),
    password: Joi.string()
        .min(5)
        .max(15)
        .required(),
    phone:Joi.number()
        .min(11)
        .required(),
    address:Joi.string().required(),
    isAdmin:Joi.boolean()
});

module.exports=schema
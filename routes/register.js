const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const customError = require("../errorHandling/Custom_error");
const userValidations = require('../middlewares/validateUserSchema')();


router.post("/", userValidations ,async (req, res, next) => {
  const email = await User.findOne({ email: req.body.email });
  if (email)
    return next(customError({
        statusCode: 500,
        message: "already registered",
        code: "VALIDATION-ERROR",
      }));
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
    city:req.body.city,
    apartment:req.body.apartment,
    country:req.body.country,
    zip:req.body.zip,
    street:req.body.street,
    isAdmin: req.body.isAdmin,
  });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    user = await user.save();
    res.status(200).send(user);

});

module.exports = router;

const express = require('express');
const router = express.Router();
const {User} = require('../models/user');
const bcrypt = require('bcrypt');


router.post('/',async(req,res,next)=>{
  const userEmail = await User.findOne({email: req.body.email});
    if(!userEmail)return res.status(404).send('wrong email or password');
    
    let userPass = await User.findOne({password: req.body.password});
    if(!userPass)return res.status(404).send('wrong email or password');
    console.log(userPass);
    

    const token = userEmail.generateAuthToken();
    res.status(200).json({token:token,userEmail: userEmail._id});
    
});

module.exports = router;

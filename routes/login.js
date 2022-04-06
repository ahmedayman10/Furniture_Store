const express = require('express');
const router = express.Router();
const {User} = require('../models/user');
const bcrypt = require('bcrypt');


router.post('/',async(req,res,next)=>{
  const user = await User.findOne({email: req.body.email});
    if(!user)return res.status(404).send('wrong email or password');

    
    const validatePass=await bcrypt.compare(req.body.password , user.password);
    if(!validatePass)return res.status(404).send('wrong password');

    const token = user.generateAuthToken();
    res.status(200).json({token:token,userEmail: user._id});
    
});

module.exports = router;

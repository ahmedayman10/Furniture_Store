const express = require('express');
const router = express.Router();
const {User} = require('../models/user');
const bcrypt = require('bcrypt');


router.post('/',async(req,res,next)=>{
    const userEmail = await User.findOne({email: req.body.email});
    if(!userEmail)return res.status(404).send('wrong email or password');

    
    const validatePass=await bcrypt.compare(req.body.password , userEmail.password);
    if(!validatePass)return res.status(404).send('wrong password');
// let newPass = req.body.password;
    // const salt = await bcrypt.genSalt(10);
    // newPass = await bcrypt.hash(newPass, salt);
    // console.log(newPass);
    // console.log(userEmail.password);
    
    // console.log(userEmail.password);
    // console.log(req.body.password);
    
    // let userPass = await User.findOne({password: req.body.password});
    // console.log(userPass);
    // if(!userPass)return res.status(404).send('wrong email or password');
    
    

    // const validatePass=await bcrypt.compare(req.body.password , user.password);
    // console.log(validatePass);
    // if(!validatePass)return res.status(400).send('wrong email or password');

    const token = userEmail.generateAuthToken();
    res.status(200).json({token:token,userEmail: userEmail._id});
    
});

module.exports = router;
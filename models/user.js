const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
    {
      username: { type: String},
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      phone: {type:Number, required: true},
      address: {type: String, required: true},
      isAdmin: {
        type: Boolean,
        default: false,
      },
      favouriteList:[
        {
          type: mongoose.Schema.Types.ObjectId,
          ref:'Product'
        
        }]
    },
    { timestamps: true }
  );

  userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id:this._id, name:this.name,isAdmin:this.isAdmin},process.env.JWT_SEC,{expiresIn:"10h"});
    return token
 }
  const User = mongoose.model('User',userSchema);

  module.exports.User = User;
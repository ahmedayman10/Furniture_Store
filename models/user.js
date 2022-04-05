const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },

    apartment: {
      type: String,
      default:""
    },
    city: {
      type: String,
      default:""
    },
    zip: {
      type: String,
      default:""
    },
    country: {
      type: String,
      default:""
    },
    street: {
      type: String,
      default:""
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    favouriteList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, name: this.name, isAdmin: this.isAdmin },
    process.env.JWT_SEC,
    { expiresIn: "10h" }
  );
  return token;
};
const User = mongoose.model("User", userSchema);

module.exports.User = User;


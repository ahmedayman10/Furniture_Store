const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: 'dy1wexkvp',
    api_key: '629722765516324',
    api_secret: 'f2CPYkJl44iBlbEuWxVpC4m3DGE'
});

module.exports = cloudinary;
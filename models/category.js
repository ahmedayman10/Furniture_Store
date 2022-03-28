const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    categoryName : {type: String,required:true},
    img: {type: String}
},
{timestamps: true}
);

const Category = mongoose.model('Category',categorySchema);

module.exports.Category = Category;
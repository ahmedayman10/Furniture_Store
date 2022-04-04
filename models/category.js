const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name : {type: String,required:true},
    image: {type: String, required:true},
    color: {type: String},
    icon: {type: String},
},
{timestamps: true}
);


const Category = mongoose.model('Category',categorySchema);

module.exports.Category = Category;

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String, required: true
    },
    description:{
        type: String, required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,ref:'Category'
    },
    price: {
        type: Number,required:true
    },
    countInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    isFeatured:{
        type:Boolean,
        default: false
    },
    image: {
        type: String,
        required:true
    },
    brand:{
        type:String
    }
},
{timestamps: true}
);



//to make virtual id not _id
// productSchema.virtual('id').get(function(){
//     return this._id.toHexString();
// });
// productSchema.set('toJSON',{
//     virtuals: true
// });

const Product = mongoose.model('Product',productSchema);

module.exports.Product = Product;

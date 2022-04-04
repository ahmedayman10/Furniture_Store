const {Category} = require('../models/category');
const express = require('express');
const router = express.Router();
const {User} = require('../models/user');
const cloudinary = require("../utils/cloudinaryConfig");
const multer = require("../utils/multer");


const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
  } = require("../middlewares/verifyToken");

router.post('/',verifyTokenAndAdmin,multer.single("image"),async(req, res)=>{
     const result = await cloudinary.uploader.upload(req.file.path); 
    try{
        let category = new Category({
        name: req.body.name,
        image: result.url,
        icon:req.body.icon,
        color:req.body.color
    })
    category = await category.save();
    res.status(200).send(category);
    // res.status(200).json({category:category});
    }catch(ex){
        res.send(ex);
    }
    
});

router.get('/',async (req, res, next)=>{
    const category =await Category.find();
    res.send(category);
});

router.get('/:id',verifyTokenAndAdmin,async(req,res,next)=>{
    // const {id} = req.params;
    // const product =await Product.findOne(req.params);
    try{
    const category = await Category.findById(req.params.id);
     res.status(200).send(category);
    }catch(err){
        res.status(404).send('category is not exists');     
    }
      
});

router.patch('/:id',verifyTokenAndAdmin,async(req, res)=>{
    const updatedCategory = await Category.findByIdAndUpdate(req.params.id,{
        $set: req.body
    },{new: true});
    if(!updatedCategory)return res.status(404).send('category doesnot exists');
    res.status(200).send(updatedCategory);
});

router.delete('/:id',verifyTokenAndAdmin,async(req, res)=>{
    const deletedCategory = await Category.findByIdAndRemove(req.params.id);
    if(!deletedCategory)return res.status(404).send('category doesnot exists');
    res.status(200).send(deletedCategory);
})

 module.exports = router;

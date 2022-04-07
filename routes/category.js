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

router.post('/',verifyTokenAndAdmin,multer.single("image"),async(req, res,next)=>{
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
    console.log(category);
    // res.status(200).json({category:category});
    }catch(ex){
        res.send(ex);
    }
    
});

router.get('/',async (req, res, next)=>{
    const category =await Category.find();
    res.send(category);
});

router.get('/:id',verifyTokenAndAdmin,async(req,res)=>{
    try{
    const category = await Category.findById(req.params.id);
     res.status(200).send(category);
    }catch(err){
        res.status(404).send('category is not exists');     
    }
      
});

router.patch('/:id',verifyTokenAndAdmin,multer.single("image"),async(req, res)=>{
    const category = await Category.findById(req.params.id);
    let imgURL = category.image;
    console.log(req.file);
    if(req.file){
      const result = await cloudinary.uploader.upload(req.file.path);
      imgURL = result.url;
      console.log(imgURL);
      console.log("asfafafas");
    }
   // console.log(imgURL);
    try{
        const updatedCategory = await Category.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        color:req.body.color,
        image: imgURL,
        icon: req.body.icon,
        });
        await updatedCategory.save();
        res.send(updatedCategory);
    }
        catch(err){
            res.status(404).json(err.message)
        }
});

// router.patch('/:id',verifyTokenAndAdmin,multer.single("image"),async(req, res)=>{
//     try{
//         const result = await cloudinary.uploader.upload(req.file.path);
//         const updatedCategory = await Category.findByIdAndUpdate(req.params.id,{
//         name: req.body.name,
//         image: result.url,
//         icon:req.body.icon,
//         color:req.body.color
//     });
//     console.log(updatedCategory);
//     await updatedCategory.save();
//     res.status(200).json({category:updatedCategory});
//     }catch(err){
//         res.send(err);
//     }
// })

router.delete('/:id',verifyTokenAndAdmin,async(req, res)=>{
    const deletedCategory = await Category.findByIdAndRemove(req.params.id);
    if(!deletedCategory)return res.status(404).send('category doesnot exists');
    res.status(200).send(deletedCategory);
})

 module.exports = router;
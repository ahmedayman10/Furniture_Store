const express = require("express");
const router = express.Router();
const { Product } = require("../models/product");
const { Category } = require("../models/category");
const cloudinary = require("../utils/cloudinaryConfig");
const multer = require("../utils/multer");
const customeError = require("../errorHandling/Custom_error");
const { User } = require("../models/user");
const mongoose = require("mongoose");

const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");
const res = require("express/lib/response");

router.post(
  "/",
  verifyTokenAndAdmin,
  multer.single("image"),
  async (req, res, next) => {
    try {
      const category = await Category.findById(req.body.category);
      if (!category) return res.status(400).send("invalid category");
      //console.log(req.file);
      const result = await cloudinary.uploader.upload(req.file.path);
      const product = new Product({
        name: req.body.name,
        description: req.body.description,
        category: category,
        price: req.body.price,
        countInStock: req.body.countInStock,
        isFeatured: req.body.isFeatured,
        image: result.url,
        brand: req.body.brand,
      });
      //res.json(result);
      await product.save();
      // res.status(200).json({product:product});
      res.send(product);
    } catch (err) {
      res.status(500).send(err);
    }
  }
);

router.post("/favourite", async (req, res) => {
  const {
    body: { productId, userId },
  } = req;
  const productDetails = await Product.findById(productId);
  let product = await User.updateOne(
    { _id: userId },
    { $push: { favouriteList: productId } }
  );

  res
    .status(200)
    .send(productDetails);
});

router.get('/favourite',async(req,res)=>{
  const {userId} = req.body;
  try{
    const favProduct = await Product.find({userId})
    res.status(200).send(favProduct);
  }catch(err){
    res.status(404).send(err.message);
  }
});

router.delete('/favourite',async(req,res)=>{
  try{
    const {userId, productId} = req.body;
    if(!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(productId)){
      return res.status(404).send('invalid id');
    }

    const user = await User.findById(userId);
    
    const product = await Product.findById(productId);
    
    const favList = user.favouriteList;
    
    const newFavList = favList.filter(item=> item != productId);
    const updatedUser = await User.findByIdAndUpdate(userId , {favouriteList:newFavList})
    res.status(200).send(updatedUser)
  }catch(err){
    res.status(500).send(err.message);
  }
});


router.get("/", async (req, res, next) => {
  let { page, limit, categoryId } = req.query;
  const size = await Product.count().exec();
  const skip = (page || 1 - 1) * (limit || 10);
  const pages = Math.ceil(+size / +(limit || 10));
  try {
    if (categoryId) {
      const myCategory = categoryId.split(",");
      const searchedProducts = await Product.find({ category: myCategory })
        .populate("category")
        .limit(limit)
        .skip(skip)
        .exec();
      res.send(searchedProducts);
    } else {
      const products = await Product.find()
        .populate("category")
        .limit(limit)
        .skip(skip)
        .exec();
      if (size == 0)
        return next(
          customeError({ status: 400, message: "Products not found" })
        );
      res.send(products);
    }
  } catch (err) {
    res.status(404).send(err.message);
  }
  //return res.status(200).json({ success: true, products, pages, size });
});

router.get("/:id", verifyTokenAndAdmin, async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    res.status(200).send(product);
  } catch (err) {
    res.status(404).send("product is not exists");
  }
});

router.get("/get/featured/:count", async (req, res) => {
  const { count } = req.params;
  console.log(count);
  const product = await Product.find({ isFeatured: true }).limit(count);
  res.send(product);
});

//get product count
router.get(`/get/count`, async (req, res) => {
  let productList = await Product.find();
  res.status(200).json({ success: true, productsCount: productList.length });
});




router.patch("/:id",verifyTokenAndAdmin, multer.single("image"), async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("invalid category");
  const product = await Product.findById(req.params.id);
  let imgURL = product.image;
  if(req.file){
    const result = await cloudinary.uploader.upload(req.file.path);
    imgURL = result.url;
    console.log(imgURL);
    console.log("asfafafas");
  }
  console.log(imgURL);
  try{
      const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      description: req.body.description,
      category: category,
      price: req.body.price,
      countInStock: req.body.countInStock,
      isFeatured: req.body.isFeatured,
      image: imgURL,
      brand: req.body.brand,
    });
    await updatedProduct.save();
    res.send(updatedProduct);
  }catch(err){
    res.send(err);
  }
});


router.delete("/:id", verifyTokenAndAdmin, async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedProduct = await Product.findByIdAndRemove(id);
    res.status(200).send(deletedProduct);
  } catch (err) {
    res.status(404).send("product is not exists");
  }
});

module.exports = router;

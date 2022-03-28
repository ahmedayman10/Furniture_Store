const express = require("express");
const router = express.Router();
const { Product } = require("../models/product");
const { Category } = require("../models/category");
const cloudinary = require("../utils/cloudinaryConfig");
const multer = require("../utils/multer");
const customeError = require('../errorHandling/Custom_error');
const {User} = require('../models/user');

const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");
const res = require("express/lib/response");


router.post("/",verifyTokenAndAdmin, multer.single("image"), async (req, res, next) => {
  try {
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send("invalid category");
    const result = await cloudinary.uploader.upload(req.file.path);

    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      category:category,
      price: req.body.price,
      countInStock: req.body.countInStock,
      isFeatured: req.body.isFeatured,
      img:result.url
    });
    //res.json(result);
    await product.save();
    res.status(200).json({product:product});
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.post('/favourite',async(req,res)=>{
  const {body:{productId, userId}} = req;
  let product = await User.updateOne({_id:userId}, {$push:{favouriteList: productId}});

  res.status(200).json({success: true, message:"Favourite list updated successfully"});

})

router.get("/", async (req, res) => 
{
  let { page, limit } = req.query;
  const size = await Product.count().exec();
  const skip = (page || 1 - 1) * (limit || 10);
  const pages = Math.ceil(+size / +(limit || 10));
  const products = await Product.find().populate('category').limit(limit).skip(skip).exec();

  if (size == 0) return next(customeError({ status: 400, message: "Products not found" }))
  return res.status(200).json({ success: true, products, pages, size });
});


router.get("/:id", verifyTokenAndAdmin, async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    res.status(200).send(product);
  } catch (err) {
    res.status(404).send("product is not exists");
  }
});

//get product count
router.get(`/get/count`, async (req, res) => {
  let productList = await Product.find();
  res.status(200).send({ count: productList.length });
});


router.patch("/:id", verifyTokenAndAdmin, async (req, res, next) => {
  const { id } = req.params;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json({order: updatedProduct});
  } catch (err) {
    res.status(404).send("product is not exists");
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
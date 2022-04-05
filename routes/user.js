const { User } = require("../models/user");
const bcrypt = require("bcrypt");

const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");
const req = require("express/lib/request");

const router = require("express").Router();

router.get("/", verifyTokenAndAdmin,async (req, res, next) => {
  const users = await User.find();
  res.status(200).send(users);
});

router.get('/:id',verifyTokenAndAuthorization,async(req,res)=>{
  const {id} = req.params;
  const user = await User.findOne({id});
  res.status(200).send(user);
})

router.delete("/:id",verifyTokenAndAuthorization,async(req, res,next)=>{
 const {id}  = req.params;
  const user = await User.findByIdAndRemove(id);
  res.status(200).json({user:user});
})

router.patch("/:id", verifyTokenAndAuthorization,async (req, res, next) => {
  const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(
      id ,
      {
        $set: req.body,
      },
      { new: true }
    );
    const salt = await bcrypt.genSalt(10);
    updatedUser.password = await bcrypt.hash(updatedUser.password, salt);

    res.status(200).send(updatedUser);
});

module.exports = router;

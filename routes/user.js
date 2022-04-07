const { User } = require("../models/user");
const bcrypt = require("bcrypt");

const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");
// const req = require("express/lib/request");

const router = require("express").Router();

router.get("/", verifyTokenAndAdmin, async (req, res, next) => {
  const users = await User.find();
  res.status(200).send(users);
});

router.get("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).send(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.delete("/:id", verifyTokenAndAuthorization, async (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  const user = await User.findByIdAndRemove(id);
  res.status(200).send(user);
});

router.patch("/:id", verifyTokenAndAuthorization, async (req, res, next) => {
  let { id } = req.params;
  const user = req.body;
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  const updatedUser = await User.findByIdAndUpdate(
    id,
    {
      $set: user,
    },
    { new: true }
  );
  console.log(updatedUser);
  res.status(200).send(updatedUser);
});

//get user count
router.get(`/get/count`, async (req, res) => {
  let userCount = await User.find();
  res.status(200).json({success:true, userCount:userCount.length});
});

module.exports = router;

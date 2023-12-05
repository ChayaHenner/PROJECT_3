const express = require("express");
const router = express.Router();
const { auth, authAdmin } = require("../middlewares/auth");
const { UserModel, validUser, validLogin, createToken } = require("../models/userModel")
const bcrypt = require("bcrypt");


router.get("/myInfo", auth, async (req, res) => {      
  try {
    let user = await UserModel.findOne({ _id: req.tokenData._id }, { password: 0 })
    // if (user.toys.length > 0) {
    //   await user.populate('toys');
    // }
    res.json(user);
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})

//!take away
router.get("/list", async (req, res) => {
  try {
    let data = await UserModel.find({}, { password: 0 });
    res.json(data)
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})

router.get("/usersList", authAdmin, async (req, res) => {
  try {
    let data = await UserModel.find({}, { password: 0 });
    res.json(data)
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})



router.post("/", async (req, res) => {
  let validBody = validUser(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let user = new UserModel(req.body);
    user.password = await bcrypt.hash(user.password, 10);

    await user.save();
    user.password = "hidden";
    res.status(201).json(user);
  }
  catch (err) {
    if (err.code == 11000) {
      return res.status(500).json({ msg: "Email already in system, try log in", code: 11000 })

    }
    console.log(err);
    res.status(500).json({ msg: "err", err })
  }
})

router.post("/login", async (req, res) => {
  let validBody = validLogin(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let user = await UserModel.findOne({ email: req.body.email })
    if (!user) {
      return res.status(401).json({ msg: " email is worng " })
    }
    let authPassword = await bcrypt.compare(req.body.password, user.password);
    if (!authPassword) {
      return res.status(401).json({ msg: "Password  is worng " });
    }
    let token = createToken(user._id, user.role);
    res.json({ token });
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})

router.delete("/:delId", auth, async (req, res) => {
  try {
    let delId = req.params.delId;
    let data;
    if (req.tokenData.role == "admin") {
      data = await UserModel.deleteOne({ _id: delId })
    }
    else {
      res.json({ msg: "not allowed to delete , not admin" })
    }
    if (data.deletedCount == 0)
      res.json({ msg: "not valid id " })
    else res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "wasnt able to delete", err })
  }
})



// router.put("/:editId",auth, async(req,res) => {
//   let validBody = validUser(req.body);
//   if(validBody.error){
//     return res.status(400).json(validBody.error.details);
//   }
//   try{
//     let editId = req.params.editId;
//     let data;
//     if(req.tokenData.role == "admin"){
//       data = await UserModel.updateOne({_id:editId},req.body)
//     }
//     else{
//        data = await UserModel.updateOne({_id:editId,user_id:req.tokenData._id},req.body)
//     }
//     res.json(data);
//   }
//   catch(err){
//     console.log(err);
//     res.status(500).json({msg:"server error",err})
//   }
// })









module.exports = router;
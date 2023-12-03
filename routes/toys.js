const express = require("express");
const router = express.Router();
const { auth, authAdmin } = require("../middlewares/auth");
const { ToyModel, validateToy } = require("../models/toyModel")
const bcrypt = require("bcrypt");
const { UserModel } = require("../models/userModel");



router.get("/", async (req, res) => {
  let perPage = 10// Math.min(req.query.perPage, 20) || 4;
  let page = req.query.page || 1;
  let max = req.query.max || 1000000;
  let min = req.query.min || 1;

  try {
    let data = await ToyModel
      .find({})
      .limit(perPage)
      .skip((page - 1) * perPage)
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }

})

router.get("/toysByUser", auth , async (req, res) => {
  let perPage = 10// Math.min(req.query.perPage, 20) || 4;
  let page = req.query.page || 1;
  try {
    let toys = await UserModel.findOne({_id:req.tokenData._id}).populate('toys')
    res.json(toys);
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }

})

router.get("/prices", async (req, res) => {
  let perPage = 10
  let page = req.query.page || 1;
  let max = req.query.max || 1000000;
  let min = req.query.min || 1;

  try {
    let data = await ToyModel
      .find({ price: { $gte: min, $lte: max } })
      .limit(perPage)
      .skip((page - 1) * perPage)

    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }

})
router.get("/single/:id", async (req, res) => {
  let id = req.params.id
  try {
    let data = await ToyModel
      .find({ _id:id })
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }

})
router.get("/category/:cat", async (req, res) => {
  let cat = req.params.cat
  cat = new RegExp(cat,"i")

  let perPage = 10
  let page = req.query.page || 1;

  try {
    let data = await ToyModel
      .find({ category: cat })
      .limit(perPage)
      .skip((page - 1) * perPage)

    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }

})

router.get("/search", async (req, res) => {
  let perPage = req.query.perPage || 10;
  let page = req.query.page || 1;
  try {
    let queryS = req.query.s;
    let searchReg = new RegExp(queryS, "i")
    let data = await ToyModel.find({ $or: [{ name: searchReg }, { info: searchReg }] })
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ _id: -1 })
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "server error .cant complete your search", err })
  }
})

router.post("/", auth, async (req, res) => {
  let validBody = validateToy(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let toy = new ToyModel(req.body);
    toy.user_id = req.tokenData._id
    // let user_id = req.tokenData._id
    let user = await UserModel.findOne({_id:req.tokenData._id})
    user.toys.push(toy._id)
    await user.save();
    await toy.save();
    res.status(201).json(toy);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "server error. was valid but did not create toy", err })
  }
})

router.delete("/:delId", auth, async (req, res) => {
  try {
    let delId = req.params.delId;
    let data;
    if (req.tokenData.role == "admin") {
      data = await ToyModel.deleteOne({ _id: delId })
    }
    else {
      data = await ToyModel.deleteOne({ _id: delId, user_id: req.tokenData._id })
    }
    if (data.deletedCount == 0)
      res.json({ msg: "not valid id or you are not allowed to erase. nothing was erased" })
    else res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "wasnt able to delete", err })
  }
})

router.put("/:editId",auth, async(req,res) => {
  let validBody = validateToy(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    let editId = req.params.editId;
    let data;
       data = await ToyModel.updateOne({_id:editId,user_id:req.tokenData._id},req.body)
       if (data.modifiedCount == 0)
       res.json({ msg: "not valid id or you are not allowed to edit. wasn't edited" })
     else res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(500).json({msg:"server error",err})
  }
})


module.exports = router;
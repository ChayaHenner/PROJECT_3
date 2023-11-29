const express= require("express");
const router = express.Router();
const {auth, authAdmin} = require("../middlewares/auth");
const {ToyModel,validateToy} = require("../models/toyModel")
const bcrypt = require("bcrypt");



router.get("/", async (req, res) => {
  let perPage = 10// Math.min(req.query.perPage, 20) || 4;
  let page = req.query.page || 1;
  let max = req.query.max || 1000000;
  let min = req.query.min || 1;
  // let sort = req.query.sort || "_id";
  // let reverse = req.query.reverse == "yes" ? -1 : 1;

  try {
    let data = await ToyModel
      .find({})
      .limit(perPage)
      .skip((page - 1) * perPage)
      // .sort({ [sort]: reverse })
    res.json(data);
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
      .find({})
      .limit(perPage)
      .skip((page - 1) * perPage)
      data=data.filter(item => item.price >= min && item.price <= max);

    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }

})

router.get("/search" , async(req,res)=> {
  let perPage = req.query.perPage || 10;
  let page = req.query.page || 1;
    try{
      let queryS = req.query.s;
      let searchReg = new RegExp(queryS,"i")
      let data = await ToyModel.find({$or:[{name:searchReg},{info:searchReg}]})
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({_id:-1})
      res.json(data);
    }
    catch(err){
      console.log(err);
      res.status(500).json({msg:"server error .cant complete your search",err})
    }
})

router.post("/", auth, async(req,res) => {
  let validBody = validateToy(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    let toy = new ToyModel(req.body);
    toy.user_id = req.tokenData._id
    await toy.save();
    res.status(201).json(toy);
  }
  catch(err){
    console.log(err);
    res.status(500).json({msg:"server error. was valid but did not create toy",err})
  }
})

module.exports = router;
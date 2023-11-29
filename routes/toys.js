const express= require("express");
const router = express.Router();
const {auth, authAdmin} = require("../middlewares/auth");
const {ToyModel,validateToy} = require("../models/toyModel")
const bcrypt = require("bcrypt");



router.get("/" , (req,res)=> {
  res.json({msg:"Rest api work !"})
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

router.post("/", async(req,res) => {
  let validBody = validateToy(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    let user = new ToyModel(req.body);
    await user.save();
    res.status(201).json(user);
  }
  catch(err){
    console.log(err);
    res.status(500).json({msg:"server error. was valid but did not create toy",err})
  }
})

module.exports = router;
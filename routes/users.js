const express= require("express");
const router = express.Router();
const {auth, authAdmin} = require("../middlewares/auth");

const { getUser } = require("../functions/userFunctions");

router.get("/" , async(req,res)=> {
  res.json({msg:"Users work"})
})

router.get("/myInfo",auth, async(req,res) => {
  try{
    let userInfo = await UserModel.findOne({_id:req.tokenData._id},{password:0});
    res.json(userInfo);
  }
  catch(err){
    console.log(err)
    res.status(500).json({msg:"err",err})
  }  
})

router.get("/list" ,async (req,res)=> {
  try {
    let data = await UserModel.find({}, { password: 0 });
    res.json(data)
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})













module.exports = router;
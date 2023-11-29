

// exports.getUser=()=>{
//     res.json({msg:"Rest api work !"})
// }

exports.getUser = async (req, res) => {
    try {
      let userInfo = await UserModel.findOne({ _id: req.tokenData._id }, { password: 0 });
      res.json(userInfo);
    }
    catch (err) {
      console.log(err)
      res.status(500).json({ msg: "err", err })
    }

  }
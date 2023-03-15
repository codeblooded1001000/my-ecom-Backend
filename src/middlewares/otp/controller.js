const otpModel = require("./models")
const {signToken} = require('../auth')
const userModel = require('../../signup/models')
var mongoose = require('mongoose'); 

const verifyOtp = async(req, res) => {
   try {
    const {otp} = req.body;
    let otp0 = await otpModel.find({where: {otp}});
    if(otp0.length == 1){
      await otp0[0].updateOne({$set: {flagForOtp: 1}})
      var id = mongoose.Types.ObjectId(otp0[0].userId);
      let user = await userModel.findById(id)
      let token = signToken(user)
      return res.status(200).json({
        success: true,
        status: 200,
        nessage: "Verified",
        token
      })
    }
   } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Something went wrong'
    })
   }
}

module.exports = {
  verifyOtp
}
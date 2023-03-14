const mongoose = require('mongoose')

const otpSchema = new mongoose.Schema({
  otp:{
    type: String
  },
  userId: {
    type: String
  },
  flagForOtp: {
    type: Number,
    default: 0
  }
}, {versionKey: false})

const otpModel = mongoose.model('otp', otpSchema)

module.exports = otpModel

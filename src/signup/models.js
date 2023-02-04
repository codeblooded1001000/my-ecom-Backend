const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const UserSchema = new Schema({
  name: {
    type: String,
  //  required: true,
  },
  age: {
    type: Number,
    default: 0,
  },
  email: {
    type: String,
   // required: false
  },
  username: {
    type: String,
   // required: false
  },
  mobile: {
    type: Number,
   // required: false
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  mobile: {
    type: String
  },
  verified: {
    type: Boolean,
    default: false
  },
  role:{
    type : String
  },
  github: {
    type: String
  },
  eseHi: {
    type: String
  }
},
{ versionKey: false });

const User = mongoose.model("User", UserSchema);

module.exports = User;
const jwt = require("jsonwebtoken");
require('dotenv').config();
const bcrypt = require("bcryptjs");
const verifyToken = require('../verifyToken');
const {Vonage} = require('@vonage/server-sdk')
const otpGenerator = require('otp-generator')
const userModel = require("./models");

const saltRounds = 10;
let otp7 = []
function otpGenerate() {
  const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
  console.log(otp);
  // if(otp7.length){
    // otp7 = []
    // otp7.push(otp)
  // }
  // else{
   // otp7=[]
    otp7.push(otp)
  // }
  return otp7;
}

function sendMsg(mobile, otp) {
  const vonage = new Vonage({
    apiKey: process.env.VONAGE_API_KEY,
    apiSecret: process.env.VONAGE_API_SECRET
  })
  const from = "Vonage APIs"
  const to = "91"+mobile
  const text = `Your OTP for E-mart is ${otp}`
  async function sendSMS() {
    await vonage.sms.send({to, from, text})
        .then(resp => { console.log('Message sent successfully'); console.log(resp); })
        .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
}
return sendSMS();
}

const signUp =async (req, res)=>{
  const existingUser = await userModel.findOne({email: req.body.email})
  if(existingUser){
    return res.status(400).json({
      status: 400,
      message: "Account Already exists"
    });
  }
  try {
  const newUser = new userModel(req.body);
  const hashedPwd = await bcrypt.hash(req.body.password, saltRounds);
  newUser.password = hashedPwd
  newUser.createdAt= new Date();
  //return new Date()
    // let otp = otpGenerate()
    // let mobile = req.body.mobile;
    // await sendMsg(mobile, otp)
    let token;
    token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      "secretkeyappearshere",
      { expiresIn: "1h" }
    );
    await newUser.save();
    return res
    .status(201)
    .json({
      success: true,
      data: { userId: newUser.id,
          email: newUser.email, token: token,
          createdAt:newUser.createdAt},
    });
  } catch (err) {
    return res.status(500).send(err)
  }
}

const login = async (req, res) => {
  let { email, password } = req.body; 
  let existingUser= await userModel.findOne({ email: email });; 
  if (!existingUser) {
    return res.status(404).json({
      status: 404,
      message: "Wrong email or password"
    });
  }
  if(!(req.body.email)||!(req.body.password)){
    return res.status(400).json({
      status: 400,
      message: "Please provide all details i.e. email and password"
    });
  }
  try {
  //let token;
  let token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      "secretkeyappearshere",
      { expiresIn: "1h" }
    );
  if (existingUser) {
    const cmp = await bcrypt.compare(password, existingUser.password);
    if (cmp) {
      return res
      .status(200)
      .json({
        success: true,
        data: {
          status: 200,
          message: "User login successful",
          userId: existingUser.id,
          email: existingUser.email,
          token: token,
        },
      });
    } else {
      return res.status(403).json({
        status: 403,
        message: "Wrong Password"
      });
    }
  }
 } catch (err) {
    return res.status(500).json({
      status: 500,
      message: "Error! Something went wrong"
    });
  }
}

const sendOtp = async(req, res)=>{
  try{
    otp7 = []
    const decodedToken = verifyToken(req, res);
    const otp = otpGenerate()
    let email = decodedToken.email
    let user =await userModel.find({email})
    console.log(user);
    if(user){
      let mobile = user[0].mobile
      console.log(mobile);
      await sendMsg(mobile, otp)
      return res.status(200).json({
        status: 200,
        message: "Message sent go to this link: /users/verifyOtp"
      })
    }
    else{
      return res.status(404).json({
        status: 404,
        message: "User not found"
      })
    }
  }catch(error){
   return res.status(500).send(error)
  }
}

const getAll = async(req, res)=>{
  const users = await userModel.find({});
  try{
   res.send(users)
  }
  catch(error){
   res.status(500).send(error)
  }
}

const verifyOtp = async(req, res)=>{
  // const secret1 = secret
// let otp1 = otpGenerate()
// console.log(otp1);
const userDeatils = verifyToken(req, res);
let email=userDeatils.email;
let existInDb = await userModel.findOne({email});
// const secret = speakeasy.generateSecret({length: 20});
// const token1 = speakeasy.totp({
//   secret: secret.base32,
//   encoding: 'base32',
// });
  //console.log(token1);
  // const vonage = new Vonage({
  //   apiKey: process.env.VONAGE_API_KEY,
  //   apiSecret: process.env.VONAGE_API_SECRET
  // })
  // const from = "Vonage APIs"
  // const to = "91"+existInDb.mobile
  // const text = `Your OTP for E-mart is ${token1}`
  
  // async function sendSMS() {
  //     await vonage.sms.send({to, from, text})
  //         .then(resp => { console.log('Message sent successfully'); console.log(resp); })
  //         .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
  // }
  // sendSMS();
  //res.send(existInDb)
 //let db = JSON.parse(existInDb)
  //res.send(db)
  console.log(email);
  if(!existInDb){
    return res.status(404).json({
      status: 404,
      message: "User not found"
    })
  }
try {
  const token = req.body.otp;
  console.log(token);
 // console.log(secret);
  // const verified = speakeasy.totp.verify({
  //   secret: secret1.base32,
  //   encoding: 'base32',
  //   token: token,
  //   window: 1, // The number of windows of time to check
  // });
  //console.log(verified);
  console.log(otp7[0]);
  if(token===otp7[0]){
    existInDb.verified=true,
    await existInDb.save();
    console.log('kya haal hai');
    otp7 = []
   return res.status(200).json({
      status: 200,
      message: "Verified"
    })
  }
  else{
    console.log('acha');
    return res.status(400).json({
      status:400,
      message: "Bad Request"
    })
  }
} catch (error) {
  res.status(500).send(error)
}
}

const updateUser = async(req, res)=>{
  const decodedToken = verifyToken(req, res)
  const email = decodedToken.email
   try {
    const user = await userModel.findOne({email})
    await user.update(req.body)
    return res.status(200).json({
      status:200,
      message: `Updated ${req.body}`
    })
   } catch (error) {
    
   }
}

module.exports = {signUp, login, sendOtp, getAll, verifyOtp, updateUser}
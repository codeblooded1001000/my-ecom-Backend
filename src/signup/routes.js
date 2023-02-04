const express = require("express");
const userModel = require("./models");
const router = express.Router();
const jwt = require("jsonwebtoken");
require('dotenv').config();
const bcrypt = require("bcryptjs");
const verifyToken = require('../verifyToken');
const {Vonage} = require('@vonage/server-sdk')
const otpGenerator = require('otp-generator')

//const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });

// const twilio = require('twilio');
// const accountSid = process.env.ACCOUNT_SID_TWILLIO;
// const authToken = process.env.AUTH_TOKEN_TWILLIO;
// const client = new twilio(accountSid, authToken);
// client.messages
// .create({
//   body: `Your OTP is ${token}`,
//   from: 'your_twilio_number',
//   to: req.body.mobile
// })
// .then(message => console.log(message.sid));
const speakeasy = require('speakeasy');

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

router.get('/sendOtp',async(req, res)=> {
  try{
    otp7 = []
    const decodedToken = verifyToken(req);
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
    res.send(error)
  }
})

router.post("/signUp", async (req, res) => {
  const newUser = new userModel(req.body);
  const hashedPwd = await bcrypt.hash(req.body.password, saltRounds);
  newUser.password = hashedPwd
  const existingUser = await userModel.findOne({email: newUser.email})
  newUser.createdAt= new Date();
  console.log(newUser.createdAt);
  //return new Date();
  if(existingUser){
    return res.status(400).json({
      status: 400,
      message: "Account Already exists"
    });
  }

  try {
    await newUser.save();
    let otp = otpGenerate()
    let mobile = req.body.mobile;
    await sendMsg(mobile, otp)
//  res.redirect('/verifyOtp')
   // let mobile =req.body.mobile
    //forSecret(mobile);
  } catch (error) {
    res.status(500).send(error);
  };
  let token;
  try {
    token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      "secretkeyappearshere",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new Error("Error! Something went wrong.");
    res.status(500).send(err)
  }
  res
    .status(201)
    .json({
      success: true,
      data: { userId: newUser.id,
          email: newUser.email, token: token,
          createdAt:newUser.createdAt},
    });
});

router.post("/login", async (req, res, next) => {
  let { email, password } = req.body; 
  let existingUser;
  try {
    existingUser = await userModel.findOne({ email: email });
  } catch {
    const error = new Error("User does not exist here");
    return next(error);
  }
  if (!existingUser) {
    return res.status(404).json({
      status: 404,
      message: "Wrong email"
    });
  }
  let token;
  try {
    //Creating jwt token
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      "secretkeyappearshere",
      { expiresIn: "1h" }
    );
  } catch (err) {
    res.status(403).json({
      status: 403,
      message: "Error! Something went wrong"
    });
  }
  if (existingUser) {
    const cmp = await bcrypt.compare(req.body.password, existingUser.password);
    if (cmp) {
      res
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
});

router.get("/getAll", async (req, res)=> {
  const users = await userModel.find({});
 try{
  res.send(users)
 }
 catch(error){
  res.status(500).send(error)
 }
});
//SignUp---> SendOtp---> VerifyOtp
//if(verified){
   //mark verified flag true
//}

// function verifyToken(req){
//   const token = req.headers.authorization.split(' ')[1];
//   //Authorization: 'Bearer TOKEN'
//   if(!token)
//   {
//     res.status(200).json({success:false, message: "Error!Token was not provided."});
//   }
//   const decodedToken = jwt.verify(token,"secretkeyappearshere" );
//   return decodedToken;
// }

// function forSecret(mobile){
// //  console.log(secret.base32); // secret key
 
// const secret = speakeasy.generateSecret({length: 20});
// const token1 = speakeasy.totp({
//   secret: secret.base32,
//   encoding: 'base32',
// });
//   console.log(token1);
//   const vonage = new Vonage({
//     apiKey: process.env.VONAGE_API_KEY,
//     apiSecret: process.env.VONAGE_API_SECRET
//   })
//   const from = "Vonage APIs"
//   const to = "91"+mobile
//   const text = `Your OTP for E-mart is ${token1}`
  
//   async function sendSMS() {
//       await vonage.sms.send({to, from, text})
//           .then(resp => { console.log('Message sent successfully'); console.log(resp); })
//           .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
//   }
//   sendSMS();
//   return secret;
// }
//let otp0 = otpGenerate()
router.post('/verifyOtp',async (req, res)=>{
// const secret1 = secret
let otp1 = otpGenerate()
console.log(otp1);
const userDeatils = verifyToken(req);
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
  console.log(otp1[0]);
  if(token===otp1[0]){
    existInDb.verified=true,
    await existInDb.save();
    console.log('kya haal hai');
    otp7 = []
   return res.status(201).json({
      status: 201,
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
})

router.get('/accessResource', (req, res)=>{   
  const decodedToken = verifyToken(req);
  res.status(200).json({success:true, data:{userId:decodedToken.userId, email:decodedToken.email}}); 
});

router.get('', async(req, res)=>{
  try
{  const role = req.query.find
  const email = req.query.email
  const user = await userModel.find({eseHi: role})
  console.log(user[0]);
  // res.send(user)
  res.status(200).json({
    userId: user[0]._id,
    name: user[0].name,
    role: user[0].role,
    email: user[0].email,
    contact: user[0].mobile,
    github: user[0].github
  })
} catch(err){
   res.status(404).json({
    status: 404,
    message: "not found"
   })
}
})

module.exports = router;
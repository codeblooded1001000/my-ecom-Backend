/***************************** HANDLED BUSINESS LOGIC IN THIS CONTROLLER FILE ***************************/
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const userModel = require("./models");
const { signToken } = require("../middlewares/auth");
const sendMail = require("../mail/sendMail");
// const {Vonage} = require('@vonage/server-sdk')
const otpGenerator = require("otp-generator");
const otpModel = require("../middlewares/otp/models");

/***************************** SIGNUP FUNCTION, IF THE USER IS NEW ***************************/
const signUp = async (req, res) => {
  // console.log(req.body);
  try {
    const existingUser = await userModel.findOne({ email: req.body.email }); // CHECKS FOR THE EXISTING USER IN OUR DATABASE
    if (existingUser) {
      return res.status(400).json({
        status: 400,
        message: "Account Already exists",
      });
    } else if (
      req.body.name.length === 0 ||
      req.body.age < 1 ||
      req.body.email.includes("@") === false
    ) {
      return res.status(400).json({
        status: 400,
        message: "incorrect credentials",
      });
    }
    const newUser = new userModel(req.body); // CRETATED NEW INSTANCE OF USER
    const hashedPwd = await bcrypt.hash(req.body.password, 10); // CONFIGURED BCRYPT HASH METHOD TO STORE PASSWORD IN DATABAS EAFTER ENCODING
    newUser.password = hashedPwd;
    newUser.createdAt = new Date();
    //return new Date()
    // let otp = otpGenerate()
    // let mobile = req.body.mobile;
    // await sendMsg(mobile, otp)
    let token = signToken(newUser); // CALLING SIGNTOKEN FUNCTION TO HAVE A JWT FOR THIS PARTICULAR USER
    await newUser.save(); // AFTER CREATING THE USER, SAVE THAT USER IN OUR DATABASE
    return res.status(201).json({
      success: true,
      data: {
        userId: newUser.id,
        email: newUser.email,
        token: token,
        createdAt: newUser.createdAt,
      },
    });
  } catch (err) {
    return res.status(500).send("Something Went wrong");
  }
};

/***************************** LOGIN FUNCTION, IF THE USER IS ALREADY PRESENT IN OUR DATABASE ***************************/
const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    let existingUser = await userModel.findOne({ email: email }); //CHECKS FOR THE EXISTING USER IN OUR DATABASE
    if (!existingUser) {
      return res.status(404).json({
        status: 404,
        message: "Wrong email or password",
      });
    }
    if (!email || !password) {
      return res.status(400).json({
        status: 400,
        message: "Please provide all details i.e. email and password",
      });
    }
    let token = signToken(existingUser); // CALLING SIGNTOKEN FUNCTION TO HAVE A JWT FOR THIS PARTICULAR USER
    if (existingUser) {
      const cmp = await bcrypt.compare(password, existingUser.password); // CHECKS FOR THE PASSWORD IS THAT IS CORRECT OR NOT BY USING BCRYPT COMPARE METHOD
      if (cmp) {
        return res.status(200).json({
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
          message: "Wrong Password",
        });
      }
    }
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: "Error! Something went wrong",
    });
  }
};

/********************** GET ALL FUNCTION, TO GET ALL THE USERS IN OUR DATABSE, ONLY ADMIN HAVE THE AUTHORITY TO CALL THIS FUNCTION***************************/
const getAll = async (req, res) => {
  try {
    const users = await userModel.find({}); // FETCHING ALL USER FORM THE DATABASE
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
};

/***************************** UPDATE FUNCTION, IF USER WANTS TO UPDATE HIS/HER ANY FIELD ***************************/
const updateUser = async (req, res) => {
  // const _id = decodedToken.userId
  try {
    const _id = req.params.id;
    const user = await userModel.findOne({ _id });
    user.updatedAt = new Date();
    await user.updateOne(req.body); // UPDATE METHOD SO THAT USER GETS SUCCESSFULLY UPDATED IN THE DATABSE
    let data = await userModel.findOne({ _id });
    return res.status(200).json({
      status: 200,
      message: "Successfully updated",
      data,
    });
  } catch (error) {
    return res.status(500).send("Something Went Wrong");
  }
};
/*************************************************************DELETE USER*****************************************************************/
const deleteUser = async (req, res) => {
  try {
    const _id = req.params.id;
    const user = await userModel.findOne({ _id });
    await user.delete();

    return res.status(200).json({
      status: 200,
      message: `User named ${user.name} Deleted Successfully`,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Something went wrong",
    });
  }
};
/*************************************************************DELETE USER by EMAIL*****************************************************************/
const deleteUserByEmail = async (req, res) => {
  try {
    let { email } = req.query;
    const user = await userModel.findOneAndDelete({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    await user.delete();

    return res.status(200).json({
      status: 200,
      message: `${user.name} deleted successfully`,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const otpInDb = await otpModel.find({ otp });
    if (otpInDb.length > 0) {
      while (otpInDb.length > 0) {
        otp = otpGenerator.generate(6, {
          upperCaseAlphabets: false,
          specialChars: false,
        });
        otpInDb = await otpModel.find({ otp });
      }
    }
    const { email } = req.body;
    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "User not found!",
      });
    }
    var id = existingUser._id;
    const otps = await otpModel.find({ userId: id });
    if (otps.length >= 1) {
      for (var i = 0; i < otps.length; i++) {
        await otps[i].delete();
      }
      await forgotPassword(req, res);
    } else {
      await sendMail(email, otp);
      const newOtp = new otpModel();
      newOtp.otp = otp;
      newOtp.userId = existingUser._id;
      await newOtp.save();
      return res.status(200).json({
        success: true,
        status: 200,
        message: "Mail sent, go to this link /otp/verifyOtp",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};

const updatePassword = async (req, res) => {
  try {
    let { userId } = req.user;
    let user = await userModel.findById(userId);
    let otp = await otpModel.findOne({ userId });
    user.password = await bcrypt.hash(req.body.password, 10);
    await user.save();
    await otp.delete();
    return res.status(200).json({
      success: true,
      status: 200,
      message: "Password Updated",
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};

//   if (isAdmin === false) {
//     return res.status(403).json({
//       status: 403,
//       message: "You are not allowed to perform this operation",
//     });
//   }
//   try {
//     // console.log("this is inside promise body");
//     const x = await userModel.deleteMany();
//     const y = await userModel.find();

//     if (y.length === 0) {
//       console.log(x, "after deletion");
//       return res.status(200).json({
//         status: 200,
//         message: "Users deleted successfully",
//         result: x,
//       });
//     } else {
//       console.log("Error in else block");
//       return res.status(500).json({
//         status: 500,
//         message: "Something went wrong!",
//       });
//     }
//   } catch (error) {
//     console.log("Error in catch block");

//     return res.status(500).json({
//       status: 500,
//       message: "Something went wrong!",
//       error: error.message,
//     });
//   }
// };
module.exports = {
  signUp,
  login,
  getAll,
  updateUser,
  deleteUser,
  deleteUserByEmail,
  forgotPassword,
  updatePassword,
  //   emptyUsersDB,
};

/*********** DEPRECATED OTP SYSTEM **********/

// const sendOtp = async(req, res)=>{
//   try{
//     otp7 = []
//     const decodedToken = verifyToken(req, res);
//     const otp = otpGenerate()
//     let email = decodedToken.email
//     let user =await userModel.find({email})
//     if(user){
//       let mobile = user[0].mobile
//       await sendMsg(mobile, otp)
//       return res.status(200).json({
//         status: 200,
//         message: "Message sent go to this link: /users/verifyOtp"
//       })
//     }
//     else{
//       return res.status(404).json({
//         status: 404,
//         message: "User not found"
//       })
//     }
//   }catch(error){
//    return res.status(500).send(error)
//   }
// }

// const verifyOtp = async(req, res)=>{
//   const userDeatils = verifyToken(req, res);
//   let email=userDeatils.email;
//   let existInDb = await userModel.findOne({email});
//     if(!existInDb){
//       return res.status(404).json({
//         status: 404,
//         message: "User not found"
//       })
//     }
//   try {
//     const token = req.body.otp;
//     if(token===otp7[0]){
//       existInDb.verified=true,
//       await existInDb.save();
//       otp7 = []
//      return res.status(200).json({
//         status: 200,
//         message: "Verified"
//       })
//     }
//     else{
//       return res.status(400).json({
//         status:400,
//         message: "Bad Request"
//       })
//     }
//   } catch (error) {
//     res.status(500).send(error)
//   }
//   }

// let otp7 = []
// function otpGenerate() {
//   const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
//   console.log(otp);
//   // if(otp7.length){
//     // otp7 = []
//     // otp7.push(otp)
//   // }
//   // else{
//    // otp7=[]
//     otp7.push(otp)
//   // }
//   return otp7;
// }

// function sendMsg(mobile, otp) {
//   const vonage = new Vonage({
//     apiKey: process.env.VONAGE_API_KEY,
//     apiSecret: process.env.VONAGE_API_SECRET
//   })
//   const from = "Vonage APIs"
//   const to = "91"+mobile
//   const text = `Your OTP for E-mart is ${otp}`
//   async function sendSMS() {
//     await vonage.sms.send({to, from, text})
//         .then(resp => { console.log('Message sent successfully'); console.log(resp); })
//         .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
// }
// return sendSMS();
// }

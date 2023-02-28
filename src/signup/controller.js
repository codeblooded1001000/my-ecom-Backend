/***************************** HANDLED BUSINESS LOGIC IN THIS CONTROLLER FILE ***************************/
const jwt = require("jsonwebtoken");
require('dotenv').config();
const bcrypt = require("bcryptjs");
const userModel = require("./models");
const { signToken, verifyToken } = require('../middlewares/auth')
    // const {Vonage} = require('@vonage/server-sdk')
    // const otpGenerator = require('otp-generator')

/***************************** SIGNUP FUNCTION, IF THE USER IS NEW ***************************/
const signUp = async(req, res) => {
    const existingUser = await userModel.findOne({ email: req.body.email }) // CHECKS FOR THE EXISTING USER IN OUR DATABASE
    if (existingUser) {
        return res.status(400).json({
            status: 400,
            message: "Account Already exists"
        });
    }
    try {
        const newUser = new userModel(req.body); // CRETATED NEW INSTANCE OF USER
        const hashedPwd = await bcrypt.hash(req.body.password, 10); // CONFIGURED BCRYPT HASH METHOD TO STORE PASSWORD IN DATABAS EAFTER ENCODING
        newUser.password = hashedPwd
        newUser.createdAt = new Date();
        //return new Date()
        // let otp = otpGenerate()
        // let mobile = req.body.mobile;
        // await sendMsg(mobile, otp)
        let token = signToken(newUser); // CALLING SIGNTOKEN FUNCTION TO HAVE A JWT FOR THIS PARTICULAR USER
        await newUser.save(); // AFTER CREATING THE USER, SAVE THAT USER IN OUR DATABASE
        return res
            .status(201)
            .json({
                success: true,
                data: {
                    userId: newUser.id,
                    email: newUser.email,
                    token: token,
                    createdAt: newUser.createdAt
                },
            });
    } catch (err) {
        return res.status(500).send("Something Went wrong")
    }
}

/***************************** LOGIN FUNCTION, IF THE USER IS ALREADY PRESENT IN OUR DATABASE ***************************/
const login = async(req, res) => {
    let { email, password } = req.body;
    let existingUser = await userModel.findOne({ email: email }); //CHECKS FOR THE EXISTING USER IN OUR DATABASE
    if (!existingUser) {
        return res.status(404).json({
            status: 404,
            message: "Wrong email or password"
        });
    }
    if (!(req.body.email) || !(req.body.password)) {
        return res.status(400).json({
            status: 400,
            message: "Please provide all details i.e. email and password"
        });
    }
    try {
        let token = signToken(existingUser); // CALLING SIGNTOKEN FUNCTION TO HAVE A JWT FOR THIS PARTICULAR USER
        if (existingUser) {
            const cmp = await bcrypt.compare(password, existingUser.password); // CHECKS FOR THE PASSWORD IS THAT IS CORRECT OR NOT BY USING BCRYPT COMPARE METHOD
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


const checkAdmin = async(token, res) => {
    let email = token.email
    let user = await userModel.findOne({ email })
    let flag = false
    return (user.role == 'ADMIN') ? flag = true : flag
}

/********************** GET ALL FUNCTION, TO GET ALL THE USERS IN OUR DATABSE, ONLY ADMIN HAVE THE AUTHORITY TO CALL THIS FUNCTION***************************/
const getAll = async(req, res) => {
    const decodedToken = verifyToken(req, res)
    let flag = await checkAdmin(decodedToken, res); // CALLING FUNCTION TO CHECK FOR ADMIN
    if (!flag) {
        return res.status(403).json({
            status: 403,
            message: "You are not allowed to perform this operation"
        })
    }
    try {
        const users = await userModel.find({}); // FETCHING ALL USER FORM THE DATABAS
        res.send(users)
    } catch (error) {
        res.status(500).send(error)
    }
}


/***************************** UPDATE FUNCTION, IF USER WANTS TO UPDATE HIS/HER ANY FIELD ***************************/
const updateUser = async(req, res) => {
        // const _id = decodedToken.userId
        try {
            const _id = req.params.id
            const user = await userModel.findOne({ _id })
            user.updatedAt = new Date()
            let data = await user.updateOne(req.body) // UPDATE METHOD SO THAT USER GETS SUCCESSFULLY UPDATED IN THE DATABSE
            return res.status(200).json({
                status: 200,
                message: "Successfully updated",
                data: user
            })
        } catch (error) {
            return res.status(500).send("Something Went Wrong")
        }
    }
    /*************************************************************DELETE USER*****************************************************************/
const deleteUser = async(req, res) => {

        const decodedToken = verifyToken(req, res)

        let isAdmin = await checkAdmin(decodedToken, res)

        try {

            if (isAdmin) {
                const _id = req.params.id
                const user = await userModel.findOne({ _id })
                console.log(user);
                await user.delete()

                return res.status(200).json({
                    status: 200,
                    message: `${user.name} bhadwa ab nahi raha`,
                    data: user
                })
            } else {
                return res.status(403).json({
                    status: 403,
                    message: "Aukaat me reh bhadwe"
                })
            }

        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: "AUGHHHHHH!!!!!!!"
            })
        }

    }
    /*************************************************************DELETE USER by EMAIL*****************************************************************/
const deleteUserByEmail = async(req, res) => {

    const decodedToken = verifyToken(req, res)
    const givenEmail = req.query.email
    const email = decodedToken.email

    //let isAdmin = await checkAdmin(decodedToken, res)

    try {

        // const _id = req.params.email
        const user = await userModel.findOne({ email: givenEmail })
        console.log(user);
        if (givenEmail === email) {
            await user.delete()

            return res.status(200).json({
                status: 200,
                message: `${user.name} bhadwa ab nahi raha`,
                data: user
            })
        } else {
            return res.status(400).json({
                status: 400,
                message: "Teri maa ki chut lawde jaa re gaand ke"
            })
        }



    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "AUGHHHHHH!!!!!!!"
        })
    }

}
module.exports = { signUp, login, getAll, updateUser, deleteUser, deleteUserByEmail }



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
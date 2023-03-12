const jwt = require('jsonwebtoken')
require('dotenv').config()
const userModel = require('../signup/models')

/***************************** WITH THE SIGNTOKEN TOKEN FUNCTION WE CAN CREATE A JWT TOKEN ***************************/
function signToken(user){
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  )
}

/***************************** WITH THIS VERIFY TOKEN FUNCTION WE CAN VERIFY IF THAT USER IS VALID OR NOT ***************************/
function verifyToken(req, res, next){
  try {
    if(!(req.headers.authorization)){
      return res.status(404).json({
        success:false, 
        message: "Error! Token was not provided."
      })
    }
    const token = req.headers.authorization.split(' ')[1];
    //Authorization: 'Bearer TOKEN'
    const decodedToken = jwt.verify(token,process.env.JWT_SECRET);
    req.user = decodedToken
    next(); 
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized, check JWT"
    })
  }
}

const checkAdmin = async(req, res, next)=>{
  try {
    let user = await userModel.findById(req.user.userId);
    if(!(user.role=='ADMIN')){
      return res.status(401).json({
        success: false,
        message: "You are not authorized to perform this operation"
      })
    }
    else{
      next();
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong"
    })
  }
}


module.exports = {verifyToken, signToken, checkAdmin}
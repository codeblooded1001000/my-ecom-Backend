/***************************** HANDLED BUSINESS LOGIC IN THIS CONTROLLER FILE ***************************/
const productModel = require('./models')
const verifyToken = require('../middlewares/auth');
const userModel = require('../signup/models')

const checkAdmin = async(token, res)=>{
  let email = token.email
  let user = await userModel.findOne({email})
  let flag =false
  return (user.role=='ADMIN') ? flag = true: flag
}

/***************************** ADD PRODUCTS FUNCTION, ONLY ADMIN IS AUTHORIZED TO PERFORM THIS OPERATION ***************************/
const addProducts = async(req, res)=>{
  const decodedToken = verifyToken(req, res)
  let flag = await checkAdmin(decodedToken, res);// CHECKS FOR THE ADMIN
  if(!flag){
    return res.status(403).json({
      status: 403,
      message : "You are not allowed to perform this operation"
    })
  }
  try {
    const newProduct = new productModel(req.body) // CREATED NEW INSTANCE OF PRODUCT, AND GOT DATA FOR PRODUCTS FROM BODY
    await newProduct.save() // SAVE METHOD TO SAVE PRODUCT IN DATABASE
    return res.send(newProduct)
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Something went wrong!"
    })
  }
}

module.exports = addProducts
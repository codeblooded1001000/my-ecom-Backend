const productModel = require('./models')
const verifyToken = require('../verifyToken');
const userModel = require('../signup/models')

const checkAdmin = async(token, res)=>{
  let email = token.email
  let user = await userModel.findOne({email})
 // console.log(user);
  let flag =false
  return (user.role=='ADMIN') ? flag = true: flag
}

const addProducts = async(req, res)=>{
  const decodedToken = verifyToken(req)
  let flag = await checkAdmin(decodedToken, res);
  console.log(flag);
  if(!flag){
    return res.status(403).json({
      status: 403,
      message : "You are not allowed to perform this operation"
    })
  }
  try {
    const newProduct = new productModel(req.body)
    await newProduct.save()
    return res.send(newProduct)
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Something went wrong!"
    })
  }
}

module.exports = addProducts
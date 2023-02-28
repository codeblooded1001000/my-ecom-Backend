/***************************** HANDLED BUSINESS LOGIC IN THIS CONTROLLER FILE ***************************/
const productModel = require('./models')
const {verifyToken} = require('../middlewares/auth');
const userModel = require('../signup/models')

const checkAdmin = async(token, res)=>{
  let email = token.email
  let user = await userModel.findOne({email})
  let flag
  (user.role=='ADMIN') ? flag = true : flag = false
  if(!flag){
    return res.status(403).json({
      status: 403,
      message : "You are not allowed to perform this operation"
    })
  }
}

/***************************** ADD PRODUCTS FUNCTION, ONLY ADMIN IS AUTHORIZED TO PERFORM THIS OPERATION ***************************/
const addProducts = async(req, res)=>{
  const decodedToken = await verifyToken(req, res)
  await checkAdmin(decodedToken, res);// CHECKS FOR THE ADMIN
  try {
    const newProduct = new productModel(req.body) // CREATED NEW INSTANCE OF PRODUCT, AND GOT DATA FOR PRODUCTS FROM BODY
    const createdBy = decodedToken.email;
    const userDetails = await userModel.find({email: createdBy});
    newProduct.createdBy = userDetails[0].name
    await newProduct.save() // SAVE METHOD TO SAVE PRODUCT IN DATABASE
    return res.send(newProduct)
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Something went wrong!"
    })
  }
}

const updateProductById = async (req, res)=>{
  const decodedToken = verifyToken(req, res)
  let flag = await checkAdmin(decodedToken, res);// CHECKS FOR THE ADMIN
  if(!flag){
    return res.status(403).json({
      status: 403,
      message : "You are not allowed to perform this operation"
    })
  }
  try {
    const productId = req.params.id;
    const product = await productModel.find({_id: productId});
    const updatedBy = decodedToken.email;
    const userDetails = await userModel.find({email: updatedBy});
    product[0].updatedBy = userDetails[0].name
    await product[0].updateOne(req.body)
    return res.status(200).json({
      status: 200,
      message: "Product Detail updated",
      updatedBy
    })
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Something went wrong!"
    })
  }
}

module.exports = {addProducts, updateProductById}
/***************************** HANDLED BUSINESS LOGIC IN THIS CONTROLLER FILE ***************************/
const {verifyToken} = require('../middlewares/auth')
const cartModel = require('./models')
const productModel = require('../products/models')

const addItemToCart = async(req, res)=>{
  try {
   const cartAlreadyExist = await cartModel.findById(req.user.userId) // CHECKS IF CART IS ALREADY ESISTED OR NOT IN THE DTABASE
   if(!cartAlreadyExist){ //IF NOT PRESENT THEN CREATES A NEW CART
     const newCart = new cartModel()// GET THE PRODUCTID FROM THE QUERY OF THE URL
     const productInDb = await productModel.findById(req.query.productId) // FETCH THAT PRODUCT
     if(!productInDb){
      return res.status(404).json({
        status: 404,
        message: "Product not found"
      })
     }
     const items = newCart.items
     items.push(productInDb) // PUSHES THAT ITEM IN CART
     newCart.userId = req.user.userId
     await newCart.save() // SAVES THE CART AFTER CREATING THAT
     return res.status(200).json({
      success: true,
      status: 201, 
      data: newCart
    })
   }
   else{
       const productInDb = await productModel.findById(req.query.productId)
       if(!productInDb){
        return res.status(404).json({
          status: 404,
          message: "Product not found"
        })
       }
       const items = cartAlreadyExist.items
       items.push(productInDb)
       await cartAlreadyExist.save()
       return res.status(200).send(cartAlreadyExist)
   }
  } catch (error) {
   return res.status(500).json({
     status: 500,
     Message: "Internal Server Error"
   })
  }
}

module.exports = addItemToCart
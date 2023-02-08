/***************************** HANDLED BUSINESS LOGIC IN THIS CONTROLLER FILE ***************************/
const {verifyToken} = require('../middlewares/auth')
const cartModel = require('./models')
const productModel = require('../products/models')

const addItemToCart = async(req, res)=>{
  const decodedToken = verifyToken(req, res) // CALLING VERIFYTOKEN FUNCTION TO VERIFY IF THE USER IS VALID OR NOT
  try {
   const userId = decodedToken.userId
   const cartAlreadyExist = await cartModel.find({userId}) // CHECKS IF CART IS ALREADY ESISTED OR NOT IN THE DTABASE
   if(!(cartAlreadyExist.length)){ //IF NOT PRESENT THEN CREATES A NEW CART
     const newCart = new cartModel()
     const product = req.query.productId // GET THE PRODUCTID FROM THE QUERY OF THE URL
     const productInDb = await productModel.find({_id: product}) // FETCH THAT PRODUCT
     if(!(productInDb.length)){
      return res.status(404).json({
        status: 404,
        message: "Product not found"
      })
     }
     const items = newCart.items
     items.push(productInDb[0]) // PUSHES THAT ITEM IN CART
     newCart.userId = userId
     await newCart.save() // SAVES THE CART AFTER CREATING THAT
     return res.status(200).send(newCart)
   }
   else{
     const product = req.query.productId
       const productInDb = await productModel.find({_id: product})
       if(productInDb.length==0){
        return res.status(404).json({
          status: 404,
          message: "Product not found"
        })
       }
       const items = cartAlreadyExist[0].items
       items.push(productInDb[0])
       await cartAlreadyExist[0].save()
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
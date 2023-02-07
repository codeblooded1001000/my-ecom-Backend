const verifyToken = require('../middlewares/auth')
const cartModel = require('./models')
const productModel = require('../products/models')

const addItemToCart = async(req, res)=>{
  const decodedToken = verifyToken(req, res)
  try {
   const userId = decodedToken.userId
   const cartAlreadyExist = await cartModel.find({userId})
   if(!(cartAlreadyExist.length)){
     const newCart = new cartModel()
     const product = req.query.productId
     const productInDb = await productModel.find({_id: product})
     if(!(productInDb.length)){
      return res.status(404).json({
        status: 404,
        message: "Product not found"
      })
     }
     const items = newCart.items
     items.push(productInDb[0])
     newCart.userId = userId
     await newCart.save()
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
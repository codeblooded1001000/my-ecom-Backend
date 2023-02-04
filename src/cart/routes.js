const express = require("express");
const router = express.Router();
const cartModel = require('./models')
const verifyToken = require('../verifyToken')
const productModel = require('../products/models')

router.post('/addItemToCart', async(req, res)=>{
 try {
  const decodedToken = verifyToken(req)
  const userId = decodedToken.userId
  console.log(userId);
  const cartAlreadyExist = await cartModel.find({userId})
  console.log(cartAlreadyExist);
  if(!(cartAlreadyExist.length)){
    const newCart = new cartModel()
    const product = req.query.productId
    const productInDb = await productModel.find({_id: product})
    console.log(productInDb);
    const items = newCart.items
    items.push(productInDb[0])
    console.log(items);
    newCart.userId = userId
    newCart.items[0].quantity = 1;
    await newCart.save()
    res.status(200).send(newCart)
  }
  else{
    const product = req.query.productId
    console.log(product);
    const productAlreadyExist = await cartModel.find({items: {$elemMatch: {_id: product}}})
    console.log(productAlreadyExist);
    if(productAlreadyExist.length>0){
      const quantity = cartAlreadyExist[0].items.quantity
      quantity++;
      await cartAlreadyExist[0].save()
      res.status(200).send(cartAlreadyExist)
    }
    else{
      const productInDb = await productModel.find({_id: product})
      console.log(productInDb);
      const items = cartAlreadyExist[0].items
      console.log(cartAlreadyExist);
      items.push(productInDb[0])
      await cartAlreadyExist[0].save()
      res.status(200).send(cartAlreadyExist)
    }
  }
 } catch (error) {
  res.status(500).json({
    status: 500,
    Message: "Internal Server Error"
  })
 }
})

module.exports = router
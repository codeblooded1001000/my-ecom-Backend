const express = require("express");
const router = express.Router();
const productModel = require('./models')

router.post('/addProducts', async(req, res)=>{
  try {
    const newProduct = new productModel(req.body)
    await newProduct.save()
    res.send(newProduct)
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal Server Error"
    })
  }
})

module.exports = router;
const cartModel =  require('../models');
const verifyToken = require('../../verifyToken');
const purchaseDetailsModel = require('./models')
const userModel = require('../../signup/models')

const discounts = {
  NEWBIE: 10
}

function getDiscount(totalPrice, discountCode) {
  return discounts[discountCode] ? (totalPrice * discounts[discountCode])/100 : 0;
}

const getPurchaseDetails = async(req, res)=>{
  const decodedToken =verifyToken(req)
  try {
    const newPurchaseDetail = new purchaseDetailsModel()
    let userId = decodedToken.userId;
    let user = await userModel.findOne({_id: userId})
    let email = user.email
    let contact = user.mobile
    let userName = user.name
    let cartDetails = await cartModel.find({userId});
    let items = cartDetails[0].items;
    let totalPrice = 0;
    for(var i =0; i<items.length; i++){
      totalPrice += items[i].price;
    }
    console.log(totalPrice);
    newPurchaseDetail.itemDetails = cartDetails[0].items
    newPurchaseDetail.userId = userId
    newPurchaseDetail.userContact.email = email
    newPurchaseDetail.userContact.mobile = contact
    newPurchaseDetail.userName = userName
    let discountCode = req.body.code
    let discountedPrice = getDiscount(totalPrice, discountCode)
    newPurchaseDetail.discountedAmount = discountedPrice
    let priceAfterDiscount = totalPrice-discountedPrice
    newPurchaseDetail.totalAmount = priceAfterDiscount
    newPurchaseDetail.deliveryAddress = req.body.deliveryAddress
    await newPurchaseDetail.save()
    return res.status(200).json({
      status: 200,
      message: 'Your Purchase Details',
      data: newPurchaseDetail,
      discountDetails: (discountedPrice==0) ? "Invalid Discount Code" : `Yaayy! You get a discount of Rs. ${discountedPrice}.`
    }) 
  } catch (error) {
    return res.status(500).send(error)
  }
}

const buy =async(req, res)=>{
  const decodedToken =verifyToken(req)
  const userId = decodedToken.userId
  try {
    const cartDetails = await cartModel.findOne({userId})
    return res.status(200).send(cartDetails)
  } catch (error) {
    
  }
}

module.exports = {getPurchaseDetails, buy}
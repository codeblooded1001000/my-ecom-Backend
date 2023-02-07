const cartModel =  require('../models');
const purchaseDetailsModel = require('./models')
const userModel = require('../../signup/models')
const verifyToken = require('../../middlewares/auth');
const discountModel =  require('../../admin/models')
const sendMail = require('../../mail/sendMail')

function getDiscount(totalPrice, discountCode, req) {
   return (req.body.code==discountCode) ? totalPrice * 0.1 : 0
}

const getPurchaseDetails = async(req, res)=>{
  const decodedToken =verifyToken(req, res)
  try {
    const newPurchaseDetail = new purchaseDetailsModel()
    let userId = decodedToken.userId;
    let user = await userModel.findOne({_id: userId})
    let email = user.email
    let contact = user.mobile
    let userName = user.name
    let cartDetails = await cartModel.find({userId});
    if(cartDetails.length==0){
      return res.status(404).json({
        status: 404,
        message: "Cart Not found"
      })
    }
    let getPurchaseDetail = await purchaseDetailsModel.find({userId});
    let flag = false
    let coupon;
    if((getPurchaseDetail.length)%10==9 || getPurchaseDetail.length==9){
      flag = true
      let discountDetails = await discountModel.find({orderNumber: 10})
      coupon = discountDetails[0].discountCoupon
    }
    let items = cartDetails[0].items;
    let totalPrice = 0;
    for(var i =0; i<items.length; i++){
      totalPrice += items[i].price;
    }
    newPurchaseDetail.itemDetails = cartDetails[0].items
    newPurchaseDetail.userId = userId
    newPurchaseDetail.userContact.email = email
    newPurchaseDetail.userContact.mobile = contact
    newPurchaseDetail.userName = userName
    let discountCode
    let discountedPrice = 0
    let flag1 = false
    let discountDetails
    if((getPurchaseDetail.length)%10==0 && (getPurchaseDetail.length)>=10 && req.body.code){
      flag1=true
      discountDetails = await discountModel.findOne({orderNumber: 10})
      discountCode = discountDetails.discountCoupon
      discountedPrice = getDiscount(totalPrice, discountCode, req)
      newPurchaseDetail.discountCouponUsed = discountCode
      if(discountedPrice==0) return res.status(400).json({
        status: 400,
        message: "Invalid Coupon Code"
      })
      await discountDetails.delete()
    }
    //let discountedPrice = getDiscount(totalPrice, discountCode)
    newPurchaseDetail.discountedAmount = discountedPrice
    let priceAfterDiscount = totalPrice-discountedPrice
    newPurchaseDetail.totalAmount = priceAfterDiscount
    newPurchaseDetail.deliveryAddress = req.body.deliveryAddress
    await sendMail(email)
    await newPurchaseDetail.save()
    await cartDetails[0].delete()
    return res.status(200).json({
      status: 200,
      message: "Your purchase details",
      data: newPurchaseDetail,
      discountDetails: flag ? `You get a discount of 10%, your discount coupon is ${coupon}, you can avail this in your next order, You can only use this code only in the next order` : (flag1 ? `Yaayy! You get a discount of Rs.${discountedPrice}` : "No Discount")
    }) 
  } catch (error) {
    return res.status(500).send(error)
  }
}

module.exports = {getPurchaseDetails}
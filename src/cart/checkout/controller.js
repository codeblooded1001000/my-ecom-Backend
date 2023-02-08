/***************************** HANDLED BUSINESS LOGIC IN THIS CONTROLLER FILE ***************************/
const cartModel =  require('../models');
const purchaseDetailsModel = require('./models')
const userModel = require('../../signup/models')
const {verifyToken} = require('../../middlewares/auth');
const discountModel =  require('../../admin/models')
const sendMail = require('../../mail/sendMail')

/***************************** GET DISCOUNT FUNCTION ***************************/
const getDiscount = (totalPrice, discountCode, req)=> {
   return (req.body.code==discountCode) ? totalPrice * 0.1 : 0
}

/***************************** FUNCTION TO CHECKOUT AND GET THE PURCHASE DETAILS ***************************/
const getPurchaseDetails = async(req, res)=>{
  const decodedToken =verifyToken(req, res)
  try {
    const newPurchaseDetail = new purchaseDetailsModel() // CREATS A NEW PURCHASE DETAIL
    let userId = decodedToken.userId;
    let user = await userModel.findOne({_id: userId}) // FETCH THE USER DETAILS SO THAT AFTER CHECKING OUT WE HAVE PURCHASE DETAILS MAPPED WITH THAT PARTICULAR USER IN DATABASE
    let email = user.email
    let contact = user.mobile
    let userName = user.name
    let cartDetails = await cartModel.find({userId}); // CHECKS FOR THE CART, IF THAT PARTICULAR USER HAVE ITEMS IN HIS/HER CART
    if(cartDetails.length==0){
      return res.status(404).json({
        status: 404,
        message: "Cart Not found"
      })
    }
    let getPurchaseDetail = await purchaseDetailsModel.find({userId}); //FETCH PURCHASE DETAILS SO THAT WE CAN TRACK THE ORDER NUMBER OF THAT USER AND PROVIDE DISCOUNT AT THE nth ORDER WHICH IS HANDLED BY THE ADMIN
    let flag = false
    let coupon;
    if((getPurchaseDetail.length)%10==9 || getPurchaseDetail.length==9){ // CHECKS IF USER IS SATISFYING THE DISCOUNT ELIGIBILITY, SO THAT HE/SHE CAN AVAIL THAT COUPON IN HES HER NEXT PURCHASE
      flag = true
      let discountDetails = await discountModel.find({orderNumber: 10}) // FETCHES THE DISCOUNT COUPON
      coupon = discountDetails[0].discountCoupon
    }
    let items = cartDetails[0].items;
    let totalPrice = 0;
    for(var i =0; i<items.length; i++){ // ADDING THE PRICE OF THE ITEMS IN CART
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
    if((getPurchaseDetail.length)%10==0 && (getPurchaseDetail.length)>=10 && req.body.code){ // IF THE ORDER NUMBER IS n+1 THEN HE/SHE CAN CONSUME THAT COUPON
      flag1=true
      discountDetails = await discountModel.findOne({orderNumber: 10})
      discountCode = discountDetails.discountCoupon
      discountedPrice = getDiscount(totalPrice, discountCode, req) // CALLING GET DISCOUNT FUNCTION SO THAT HE/SHE CAN HAVE VALID DISCOUNT
      newPurchaseDetail.discountCouponUsed = discountCode
      if(discountedPrice==0) return res.status(400).json({ // CHECKS IF COUPON IS VALID OR NOT
        status: 400,
        message: "Invalid Coupon Code"
      })
      await discountDetails.delete() // AFTER USING THAT COUPON DELETE THAT FROM DATABASE
    }
    newPurchaseDetail.discountedAmount = discountedPrice
    let priceAfterDiscount = totalPrice-discountedPrice
    newPurchaseDetail.totalAmount = priceAfterDiscount
    newPurchaseDetail.deliveryAddress = req.body.deliveryAddress // PROVIDE DELIVERY ADDRESS IN THE BODY
    await sendMail(email) // SENDS EMAIL TO THAT USER'S EMAIL ID AFTER CHECKOUT
    await newPurchaseDetail.save()
    await cartDetails[0].delete() // DELETE THAT PARTICULAR CART AFTER PURCHASE
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
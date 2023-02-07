const verifyToken = require('../verifyToken')
const discountModel = require('./models')
const userModel = require('../signup/models')
const PurchaseDetails = require('../cart/checkout/models')
const productModel = require('../products/models')

const checkAdmin = async(token)=>{
  let email = token.email
  let user = await userModel.findOne({email})
 // console.log(user);
  let flag =false
  return (user.role=='ADMIN') ? flag = true: flag
}

const generateDiscountCode = async(req, res)=>{
  const decodedToken = verifyToken(req, res)
  let flag = await checkAdmin(decodedToken);
  console.log(flag);
  if(!flag){
    return res.status(403).json({
      status: 403,
      message : "You are not allowed to perform this operation"
    })
  }
  try {
    const newDiscountCode = new discountModel()
    newDiscountCode.orderNumber = req.body.orderNumber
    newDiscountCode.discountPercentage = req.body.discountPercentage
    const couponCode = Math.random().toString(36).toUpperCase().substring(2, 15)
    newDiscountCode.discountCoupon = couponCode
    await newDiscountCode.save()
    return res.status(200).json({
      status: 200,
      data: newDiscountCode
    })
  } catch (error) {
    return res.status(500).send("Something Went Wrong")
  }
}

const getTotalPurchaseDetails = async(req, res)=>{
  const decodedToken = verifyToken(req, res)
  let flag = await checkAdmin(decodedToken);
  console.log(flag);
  if(!flag){
    return res.status(403).json({
      status: 403,
      message : "You are not allowed to perform this operation"
    })
  }
  try {
    const purchaseDetails = await PurchaseDetails.find({})

    let totalAmount = 0;
    let discountAmount = 0;
    let countOfItemsPurchased = 0;
    for(var i = 0; i<purchaseDetails.length; i++){
      totalAmount += purchaseDetails[i].totalAmount;
      discountAmount += purchaseDetails[i].discountedAmount;
      countOfItemsPurchased += purchaseDetails[i].itemDetails.length
    }
    res.status(200).json({
      sttatus: 200,
      message: "Total Purchase details",
      totalAmount,
      discountAmount,
      countOfItemsPurchased
    })
  } catch (error) {
    return res.status(500).send("Something Went Wrong")
  }
}

module.exports = {generateDiscountCode, getTotalPurchaseDetails}
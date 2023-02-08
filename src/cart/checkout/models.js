/***************************** DEFINED SCHEMAS, IN MODELS FILE FOR THE PARTICULAR FILE WITH THE SUITABLE CONDITIONS ***************************/

const mongoose = require('mongoose')

const purchaseSchema = new mongoose.Schema({
  itemDetails:{
    type: Array
  },
  totalAmount: {
    type: Number
  },
  userId:{
    type: String
  },
  discountedAmount:{
    type: Number
  },
  userName: {
    type: String
  },
  userContact: {
    email: String,
    mobile: Number
  },
  deliveryAddress:{
    type: String
  },
  discountCouponUsed:{
    type: String
  }
}, {versionKey: false})

const PurchaseDetails = mongoose.model("PurchaseDetails", purchaseSchema)
module.exports = PurchaseDetails
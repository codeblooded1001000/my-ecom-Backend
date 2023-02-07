const mongoose = require('mongoose')

const discountSchema = new mongoose.Schema({
   discountCoupon:{
    type: String
   },
   discountPercentage:{
    type: Number
   },
   orderNumber:{
    type: Number
   }
}, {versionKey: false})

const Discount = mongoose.model('Discount', discountSchema)
module.exports = Discount
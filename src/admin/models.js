/***************************** DEFINED SCHEMAS, IN MODELS FILE FOR THE PARTICULAR FILE WITH THE SUITABLE CONDITIONS ***************************/

const mongoose = require('mongoose')

const discountSchema = new mongoose.Schema({
   discountCoupon:{
    type: String
   },
   discountPercentage:{
    type: Number,
    required: true,
   },
   orderNumber:{
    type: Number,
    required: true
   }
}, {versionKey: false})

const Discount = mongoose.model('Discount', discountSchema)
module.exports = Discount
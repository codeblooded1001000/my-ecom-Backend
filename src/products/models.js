/***************************** DEFINED SCHEMAS, IN MODELS FILE FOR THE PARTICULAR FILE WITH THE SUITABLE CONDITIONS ***************************/

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price:{
    type: Number,
    required: true,
  },
  image: {
    type: String
  },
  color: {
    type: String,
    required: true,
  },
  currency:{
    type: String,
    required: true,
  },
  category: {
    type: String
  },
  createdBy: {
    type: String
  },
  updatedBy: {
    type: String
  }
},
{versionKey: false})

const Products = mongoose.model("Products", productSchema);
module.exports = Products
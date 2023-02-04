const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String
  },
  price:{
    type: Number
  },
  image: {
    type: String
  },
  color: {
    type: String
  },
  currency:{
    type: String
  }
},
{versionKey: false})

const Products = mongoose.model("Products", productSchema);
module.exports = Products
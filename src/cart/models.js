const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: {
    type: String
  },
  items: {
    type: Array,
    quantity:{
      type: Number,
      default: 1
    }
  },
},
{versionKey: false})

const Carts = mongoose.model("Carts", cartSchema);
module.exports = Carts
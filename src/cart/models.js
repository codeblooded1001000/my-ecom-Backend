/***************************** DEFINED SCHEMAS, IN MODELS FILE FOR THE PARTICULAR FILE WITH THE SUITABLE CONDITIONS ***************************/

const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: {
    type: String
  },
  items: {
    type: Array,
  },
},
{versionKey: false})

const Carts = mongoose.model("Carts", cartSchema);
module.exports = Carts
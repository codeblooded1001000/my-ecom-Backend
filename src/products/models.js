/***************************** DEFINED SCHEMAS, IN MODELS FILE FOR THE PARTICULAR FILE WITH THE SUITABLE CONDITIONS ***************************/

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    images: {
      type: Array,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
    },
    rating: {
      type: Number,
      required: true,
    },
    variants: {
      type: Array,
    },
    specifications: {
      type: Array,
      required: true,
    },
    similarProducts: {
      type: Array,
      required: true,
    },
    FAQ: {
      type: Array,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    reviews: {
      type: Array,
      required: true,
    },
    createdBy: {
      type: String,
    },
    updatedBy: {
      type: String,
    },
  },
  { versionKey: false }
);

const Products = mongoose.model("Products", productSchema);
module.exports = Products;

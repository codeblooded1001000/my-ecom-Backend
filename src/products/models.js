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
    currency: {
      type: String,
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
      type: [Number],
    },
    specifications: {
      type: Array,
      required: true,
    },
    similarProducts: {
      type: [mongoose.Types.ObjectId],
      required: true,
    },
    FAQ: {
      type: [
        {
          question: String,
          answer: String,
        },
      ],
      required: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    reviews: {
      type: [
        {
          reviewer: mongoose.Types.ObjectId,
          title: {
            type: String,
            required: false,
          },
          comment: {
            type: String,
            required: false,
          },
          rating: {
            type: Number,
            required: true,
          },
          date: {
            type: Date,
            default: Date.now,
          },
        },
      ],
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

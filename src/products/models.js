/***************************** DEFINED SCHEMAS, IN MODELS FILE FOR THE PARTICULAR FILE WITH THE SUITABLE CONDITIONS ***************************/

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    images: {
        type: Array
    },
    specifications: {
        type: Array,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    color: {
        type: String,
    },
    currency: {
        type: String,
        required: true,
    },
    createdBy: {
        type: String
    },
    updatedBy: {
        type: String
    },
    reviews: {
        type: Array
    }
}, { versionKey: false })

const Products = mongoose.model("Products", productSchema);
module.exports = Products
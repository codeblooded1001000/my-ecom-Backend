const mongoose = require("mongoose");

const productCategoriesSchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
    },
    products: {
      type: [mongoose.Types.ObjectId],
    },
  },
  { versionKey: false }
);

const Categories = mongoose.model("Categories", productCategoriesSchema);

module.exports = Categories;

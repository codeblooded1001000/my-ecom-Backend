const express = require("express");
const router = express.Router();
const {
  addProducts,
  addMultipleProducts,
  updateProductById,
  getAll,
  //   emptyProductsDB,
} = require("./controller");

/********************************************* HANDLED REQUEST IN ROUTES FILE ******************************************/

// DEFINED ROUTES AND CALLBACKS WITH THE APPROPRIATE METHOD
router.get("/getAll", getAll);
router.post("/addProducts", addProducts);
router.post("/addMultipleProducts", addMultipleProducts);
router.patch("/updateProductById/:id", updateProductById);
// router.post("/emptyProductsDB", emptyProductsDB);   //DELETES WHOLE DATABASE

module.exports = router;

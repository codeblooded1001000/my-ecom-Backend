const express = require("express");
const router = express.Router();
const {
  addProducts,
  addMultipleProducts,
  updateProductById,
  getAll,
  //   emptyProductsDB,
} = require("./controller");
const { verifyToken, checkAdmin } = require("../middlewares/auth");

/********************************************* HANDLED REQUEST IN ROUTES FILE ******************************************/

// DEFINED ROUTES AND CALLBACKS WITH THE APPROPRIATE METHOD
router.get(
  "/getAll",
  // , verifyToken
  // , checkAdmin
  getAll
);
router.post("/addProducts", verifyToken, checkAdmin, addProducts);
router.post(
  "/addMultipleProducts",
  verifyToken,
  checkAdmin,
  addMultipleProducts
);
router.patch(
  "/updateProductById/:id",
  verifyToken,
  checkAdmin,
  updateProductById
);
// router.post("/emptyProductsDB", emptyProductsDB);   //DELETES WHOLE DATABASE

module.exports = router;

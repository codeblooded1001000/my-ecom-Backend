const express = require("express");
const { verifyToken, checkAdmin } = require("../middlewares/auth");
const router = express.Router();
const {generateDiscountCode, getTotalPurchaseDetails} = require('./controller')

/********************************************* HANDLED REQUEST IN ROUTES FILE ******************************************/

 // DEFINED ROUTES AND CALLBACKS WITH THE APPROPRIATE METHOD
router.post('/generateDiscountCode', verifyToken, checkAdmin ,generateDiscountCode)
router.get('/getTotalPurchaseDetails', verifyToken, checkAdmin ,getTotalPurchaseDetails)

module.exports = router
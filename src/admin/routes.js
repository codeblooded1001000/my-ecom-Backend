const express = require("express");
const router = express.Router();
const {generateDiscountCode, getTotalPurchaseDetails} = require('./controller')

/********************************************* HANDLED REQUEST IN ROUTES FILE ******************************************/

 // DEFINED ROUTES AND CALLBACKS WITH THE APPROPRIATE METHOD
router.get('/generateDiscountCode', generateDiscountCode)
router.get('/getTotalPurchaseDetails', getTotalPurchaseDetails)

module.exports = router
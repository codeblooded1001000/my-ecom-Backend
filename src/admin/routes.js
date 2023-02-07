const express = require("express");
const router = express.Router();
const {generateDiscountCode, getTotalPurchaseDetails} = require('./controller')

router.get('/generateDiscountCode', generateDiscountCode)
router.get('/getTotalPurchaseDetails', getTotalPurchaseDetails)

module.exports = router
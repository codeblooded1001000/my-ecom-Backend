const express = require("express");
const router = express.Router();
const {getPurchaseDetails, buy} = require('./controller')


router.post('/getPurchaseDetails', getPurchaseDetails)
router.get('/buy', buy)

module.exports = router
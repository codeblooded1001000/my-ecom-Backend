const express = require("express");
const router = express.Router();
const {getPurchaseDetails} = require('./controller')

router.post('/getPurchaseDetails', getPurchaseDetails)

module.exports = router
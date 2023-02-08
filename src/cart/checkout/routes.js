const express = require("express");
const router = express.Router();
const {getPurchaseDetails} = require('./controller')

/********************************************* HANDLED REQUEST IN ROUTES FILE ******************************************/

 // DEFINED ROUTES AND CALLBACKS WITH THE APPROPRIATE METHOD
router.post('/getPurchaseDetails', getPurchaseDetails)

module.exports = router
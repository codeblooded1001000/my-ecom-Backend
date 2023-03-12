const express = require("express");
const { verifyToken } = require("../../middlewares/auth");
const router = express.Router();
const {getPurchaseDetails} = require('./controller')

/********************************************* HANDLED REQUEST IN ROUTES FILE ******************************************/

 // DEFINED ROUTES AND CALLBACKS WITH THE APPROPRIATE METHOD
router.post('/getPurchaseDetails', verifyToken,getPurchaseDetails)

module.exports = router